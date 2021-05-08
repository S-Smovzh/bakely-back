import argon2 from 'argon2';
import * as validator from '../../../security/validation/validation.config.js';
import * as crypto from 'crypto';
import db from '../../../config/database.config.js';
import * as token from '../../../security/jwt/TokenService.js';
import {errorCodes} from "../../../utils/errorCodes.js";
import validateEmail from "../../../security/validation/emailValidation.js";
import redisClient from '../../../config/redis.config.js';
import {
  MAX_WRONG_ATTEMPTS_BY_IP_PER_DAY,
  MAX_CONSECUTIVE_FAILS_BY_EMAIL_AND_IP,
  limiterByIP,
  limiterEmailAndIP,
  getEmailIpKey
} from '../../../security/bruteProtection.js'

const MAX_STORED_DELIVERY_ADDRESSES = 3;

async function register(req) {
  const pool = db.pool;
  let data = req.body;
  const sqlReg = 'INSERT INTO users (f_name, l_name, email, tel_num, password, user_id) VALUES ($1, $2, $3, $4, $5, $6);';
  const sqlVault = 'INSERT INTO vault (user_id, salt) VALUES ($1, $2);';
  const sqlCreateCart = 'INSERT INTO users_carts (user_id, created_at, cart_id) VALUES ($1, $2, $3);';
  const validation = await validator.default.validateRegistration(data);

  if (!data) {
    console.log('Empty request body in UsersService.register()!');
    return {success: false, errors: {code: 10}};
  }

  if (validation.isValid) {
    const salt = crypto.randomBytes(10).toString('hex');
    data.password = await _generatePassword(data.password, salt);
    const userId = crypto.randomBytes(10).toString('hex');
    const cartId = crypto.randomBytes(10).toString('hex');

    try {
      await pool.query(sqlReg, [data.firstName, data.lastName, data.email, data.telNum, data.password, userId]);
      await pool.query(sqlVault, [userId, salt]);
      await pool.query(sqlCreateCart, [userId, Date.now(), cartId]);
      await validateEmail(data.email);
      return {success: true, code: null};
    } catch (e) {
      console.log('Querying failure in UsersService.register()\n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  } else {
    console.log('Validation failure in UsersService.register()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

async function validateEmailAddress(req) {
  const pool = db.pool;
  let data = req.body;
  const sqlActivateUser = 'UPDATE users SET active = true WHERE users.email = $1;';

  if (!data || data.email === '' && data.verificationCode === '') {
    console.log('Empty request body in UsersService.validateEmailAddress()!');
    return {success: false, errors: {code: 10}};
  }

  try {
    const email = data.email.toString('utf-8');
    const validated = String(await redisClient.get(email).catch((err) => console.error(err)), 'utf-8') === data.verificationCode;
    if (validated) {
      await pool.query(sqlActivateUser, [data.email]);
      return {success: true, errors: null};
    }
  } catch (e) {
    console.log('Querying failure in UsersService.login()\n\n' + e.stack);
    return {success: false, errors: {code: 500}};
  }
}

async function login(req, res) {
  const ip = req.connection.remoteAddress;
  const emailIpKey = getEmailIpKey(req.body.email, ip);
  const [limitedByEmailAndIp, limitedByIp] = await Promise.all([
    limiterEmailAndIP.get(emailIpKey), // if ip and email is already blocked
    limiterByIP.get(ip), // if ip is already blocked
  ]);
  let retryAfter = 0;

  const pool = db.pool;
  let data = req.body;
  const sqlGetUserData = 'SELECT u.user_id AS "userId", u.email, u.password, u.active, v.salt FROM users u INNER JOIN vault v on u.user_id = v.user_id WHERE u.email = $1';
  const sqlCartId = 'SELECT cart_id AS "cartId" FROM users_carts WHERE user_id = $1';

  if (!data || data.email === '' && data.password === '') {
    console.log('Empty request body in UsersService.login()!');
    return {success: false, errors: {code: 10}};
  }

  data.ip = ip;
  data.userAgent = req.headers['user-agent'];

  // Check if IP or email + IP is already blocked
  if (limitedByIp !== null && limitedByIp.consumedPoints > MAX_WRONG_ATTEMPTS_BY_IP_PER_DAY) {
    retryAfter = Math.round(limitedByIp.msBeforeNext / 1000) || 1;
  } else if (limitedByEmailAndIp !== null && limitedByEmailAndIp.consumedPoints > MAX_CONSECUTIVE_FAILS_BY_EMAIL_AND_IP) {
    retryAfter = Math.round(limitedByEmailAndIp.msBeforeNext / 1000) || 1;
  }

  if (retryAfter > 0) {
    res.set({'Retry-After': retryAfter});
    return {success: false, errors: {code: errorCodes.TOO_MANY_LOGIN_TRIES}};
  } else {
    try {
      const emailValidation = await validator.default.validateLoginEmail(data);
      if (emailValidation.isValid) {
        const {rows} = await pool.query(sqlGetUserData, [data.email]);
        if (rows[0].active) {
          data.password = rows[0].salt + data.password;
          const passwordValidation = await validator.default.validateLoginPassword(data, rows[0]);
          if (passwordValidation.isValid) {
            const cartId = await pool.query(sqlCartId, [rows[0].userId]);
            const userData = rows[0];
            userData.cartId = cartId.rows[0].cartId;
            if (limitedByEmailAndIp !== null && limitedByEmailAndIp.consumedPoints > 0) {
              // Reset on successful authorisation
              await limiterEmailAndIP.delete(emailIpKey);
            }
            return token.default.generateJWT(res, userData, data);
          } else {
            const promises = [await limiterByIP.consume(ip)];
            // Count failed attempts by email + IP only for registered users
            promises.push(await limiterEmailAndIP.consume(emailIpKey));
            await Promise.all(promises);
            console.log('Password validation failure in UsersService.login()');
            return {
              success: false,
              errors: passwordValidation.errors
            };
          }
        } else {
          console.log('Not verified account failure in UsersService.login()');
          return {
            success: false,
            errors: {code: errorCodes.ACCOUNT_IS_NOT_ACTIVATED }
          };
        }
      } else {
        console.log('Email validation failure in UsersService.login()');
        return {
          success: false,
          errors: emailValidation.errors
        };
      }
    } catch (e) {
      console.log('Querying failure in UsersService.login()\n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  }
}

async function changePassword(req) {
  const pool = db.pool;
  const user = req.user;
  const data = req.body;
  const sqlMain = 'UPDATE users SET password = $1 WHERE user_id = $2;';
  const sqlPassword = 'SELECT u.password, v.salt FROM vault v INNER JOIN users u on u.user_id = v.user_id WHERE v.user_id = $1;';
  const sqlVault = 'UPDATE vault SET salt = $1 WHERE user_id = $2';

  if (!data) {
    console.log('Empty request body in UsersService.changePassword()!');
    return {success: false, errors: {code: 10}};
  }

  const {rows} = await pool.query(sqlPassword, [user.userId]);
  let result = rows[0];
  data.oldPassword = result.salt + data.oldPassword;
  const validation = await validator.default.validatePasswordChange(data, result.password);

  if (validation.isValid) {
    const salt = crypto.randomBytes(10).toString('hex');
    data.newPassword = await _generatePassword(data.newPassword, salt);
    try {
      await pool.query(sqlMain, [data.newPassword, user.userId]);
      await pool.query(sqlVault, [salt, user.userId]);
      return {success: true, errors: null};
    } catch (e) {
      console.log('Vault update failure in UsersService.changePassword()  \n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  } else {
    console.log('Validation failure in UsersService.changePassword()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

async function changeEmail(req) {
  const pool = db.pool;
  const user = req.user;
  let data = req.body;
  const sqlEmail = 'SELECT email FROM users WHERE user_id = $1';
  const sqlMain = 'UPDATE users SET email = $1 WHERE user_id = $2 AND email = $3';

  if (!data) {
    console.log('Empty request body in UsersService.changeEmail()!');
    return {success: false, errors: {code: 10}};
  }

  const {rows} = await pool.query(sqlEmail, [user.userId]);
  const validation = await validator.default.validateEmailChange(data, rows[0].email);
  if (validation.isValid) {
    try {
      await pool.query(sqlMain, [data.newEmail, user.userId, data.oldEmail]);
      return {success: true, errors: null};
    } catch (e) {
      console.log('Email update failure in UsersService.changeEmail()  \n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  } else {
    console.log('Validation failure in UsersService.changeEmail()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

async function changeTelNum(req) {
  const pool = db.pool;
  const user = req.user;
  let data = req.body;
  const sqlTelNum = 'SELECT tel_num AS "telNum" FROM users WHERE user_id = $1;';
  const sqlMain = 'UPDATE users SET tel_num = $1 WHERE user_id = $2;';

  if (!data) {
    console.log('Empty request body in UsersService.changeTelNum()!');
    return {success: false, errors: {code: 10}};
  }

  const {rows} = await pool.query(sqlTelNum, [user.userId]);
  const validation = await validator.default.validateTelNumChange(data, rows[0].telNum);
  if (validation.isValid) {
    try {
      await pool.query(sqlMain, [data.newTelNum, user.userId]);
      return {success: true, errors: null};
    } catch (e) {
      console.log('Tel. num. update failure in UsersService.changeTelNum()  \n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  } else {
    console.log('Validation failure in UsersService.changeTelNum()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

async function addDeliveryAddress(req) {
  const pool = db.pool;
  const userId = req.user.userId;
  const data = req.body;
  const sql = 'INSERT INTO users_delivery_addresses (user_id, city, street, house, flat_num, created_at) VALUES ($1, $2, $3, $4, $5, $6)';
  const validation = await validator.default.validateDeliveryAddress(data);

  if (!data) {
    console.log('Empty request body in UsersService.addDeliveryAddress()!');
    return {success: false, errors: {code: 10}};
  }

  async function addRecord() {
    try {
      await pool.query(sql, [userId, data.city, data.street, data.houseNum, data.flatNum, Date.now()]);
      return {success: true, errors: null};
    } catch (e) {
      console.log('Address adding failure in UsersService.addDeliveryAddress().addRecord()  \n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  }

  if (validation.isValid) {
    const isValid = await _isValidAddressesCount(userId);
    if (isValid) {
      return await addRecord();
    } else if (!isValid) {
      await _wipeAllExtraUserDeliveryAddresses(userId);
      return await addRecord();
    } else if (typeof isValid === 'string') {
      console.log('Internal failure in UsersService.addDeliveryAddress()._isValidAddressesCount()');
      return {
        success: false,
        errors: {code: 500}
      };
    }
  } else {
    console.log('Validation failure in UsersService.addDeliveryAddress()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

async function getAllDeliveryAddresses(req) {
  const pool = db.pool;
  const user = req.user;
  const sql = 'SELECT id, city, street, house AS "houseNum", flat_num AS "flatNum" FROM users_delivery_addresses WHERE user_id = $1 ORDER BY created_at DESC;';
  try {
    const {rows} = await pool.query(sql, [user.userId]);
    return {data: rows, success: true, errors: null};
  } catch (e) {
    console.log('Internal failure in UsersService.getAllDeliveryAddresses()  \n\n' + e.stack);
    return {data: null, success: false, errors: {code: 500}};
  }
}

async function getTheLatestDeliveryAddress(req) {
  const pool = db.pool;
  const user = req.user;
  const sql = 'SELECT city, street, house, flat_num AS "flatNum" FROM users_delivery_addresses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1';
  try {
    const {rows} = await pool.query(sql, [user.userId]);
    return {data: rows, success: true, errors: null};
  } catch (e) {
    console.log('Internal failure in UsersService.getTheLatestDeliveryAddress()  \n\n' + e.stack);
    return {data: null, success: false, errors: {code: 500}};
  }
}

async function changeDeliveryAddress(req) {
  const pool = db.pool;
  const user = req.user;
  const data = req.body;
  const sql = 'UPDATE users_delivery_addresses SET city = $1, street = $2, house= $3, flat_num = $4, created_at = $5 WHERE user_id = $6 AND created_at = (SELECT created_at from users_delivery_addresses ORDER BY created_at LIMIT 1);';

  if (!data) {
    console.log('Empty request body in UsersService.changeDeliveryAddress()!');
    return {success: false, errors: {code: 10}};
  }

  const validation = await validator.default.validateDeliveryAddress(data);
  if (validation.isValid) {
    try {
      await pool.query(sql, [data.city, data.street, data.houseNum, data.flatNum, Date.now(), user.userId]);
      return {success: true, errors: null};
    } catch (e) {
      console.log('Address update failure in UsersService.changeDeliveryAddress()  \n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  } else {
    console.log('Validation failure in UsersService.changeDeliveryAddress()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

async function deleteDeliveryAddress(req) {
  const pool = db.pool;
  const userId = req.user.userId;
  const addressId = req.params.id
  const sql = 'DELETE FROM users_delivery_addresses WHERE user_id = $1 AND id = $2;';

  try {
    await pool.query(sql, [userId, addressId]);
    return {success: true, errors: null};
  } catch (e) {
    console.log('Address adding failure in UsersService.deleteDeliveryAddress()  \n\n' + e.stack);
    return {success: false, errors: {code: 500}};
  }
}

async function contactForm(req) {
  const pool = db.pool;
  const id = req.user.userId;
  const data = req.body;
  const sql = 'INSERT INTO contact_form (user_id, first_name, last_name, email, subject, message) VALUES ($1, $2, $3, $4, $5, $6)';
  const validation = await validator.default.validateContactForm(data);

  if (!data) {
    console.log('Empty request body in ClientsService.contactForm()!');
    return {success: false, errors: {code: 10}};
  }

  if (validation.isValid) {
    try {
      await pool.query(sql, [id, data.firstName, data.lastName, data.email, data.subject, data.message]);
      return {success: true, errors: null};
    } catch (e) {
      console.log('Address adding failure in ClientsService.contactForm()  \n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }

  } else {
    console.log('Validation failure in ClientsService.contactForm()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

// проверка лимита возможных активных сессий
async function _isValidAddressesCount(userId) {
  const pool = db.pool;
  const sql = 'SELECT COUNT(*) FROM users_delivery_addresses WHERE user_id = $1;';

  try {
    const {rows} = await pool.query(sql, [userId]);
    return rows[0] < MAX_STORED_DELIVERY_ADDRESSES;
  } catch (e) {
    console.log('Internal failure in TokenService._isValidSessionsCount()  \n\n' + e.stack);
    return 'Error';
  }
}

// удаление всех сессий по id пользователя
async function _wipeAllExtraUserDeliveryAddresses(userId) {
  const pool = db.pool;
  const sql = 'DELETE FROM users_delivery_addresses WHERE created_at NOT IN ( SELECT created_at FROM users_delivery_addresses GROUP BY created_at ORDER BY created_at DESC LIMIT 2) AND user_id = $1';
  try {
    await pool.query(sql, [userId]);
    return true;
  } catch (e) {
    console.log('Internal failure in UsersService._wipeAllExtraUserDeliveryAddresses()  \n\n' + e.stack);
    return false;
  }
}

async function _generatePassword(password, salt) {
  password = salt + password;

  return await argon2.hash(password, {
    hashLength: 40,
    memoryCost: 81920,
    timeCost: 4,
    type: argon2.argon2id
  });
}

export default {
  register,
  validateEmailAddress,
  login,
  changePassword,
  changeEmail,
  changeTelNum,
  addDeliveryAddress,
  getAllDeliveryAddresses,
  getTheLatestDeliveryAddress,
  changeDeliveryAddress,
  deleteDeliveryAddress,
  contactForm
};
