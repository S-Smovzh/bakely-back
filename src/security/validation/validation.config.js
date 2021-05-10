import validator from 'validator';
import argon2 from 'argon2';
import _ from 'lodash';
import {validationRules as rules} from '../../utils/validationRules.js';
import {contactSubjects} from '../../utils/contactSubjects.js';
import {errorCodes} from '../../utils/errorCodes.js';
import db from '../../config/database.config.js';
import isEmpty from './isEmpty.js';

async function validateRegistration(data) {
  let errors = {};

  try {
    if (isEmpty(data.firstName)) {
      errors.firstName = errorCodes.EMPTY_ERROR;
    } else if (!_isNameOrSurname(data.firstName)) {
      errors.firstName = errorCodes.INVALID_FIRST_NAME;
    }

    if (isEmpty(data.lastName)) {
      errors.lastName = errorCodes.EMPTY_ERROR;
    } else if (!_isNameOrSurname(data.lastName)) {
      errors.lastName = errorCodes.INVALID_LAST_NAME;
    }

    if (isEmpty(data.email)) {
      errors.email = errorCodes.EMPTY_ERROR;
    } else if (!validator.default.isEmail(data.email)) {
      errors.email = errorCodes.INVALID_EMAIL;
    } else if (!_validateEmailLength(data.email)) {
      errors.email = errorCodes.INVALID_EMAIL_LENGTH;
    } else if (await _isEmailUnique(data.email)) {
      errors.email = errorCodes.EMAIL_ALREADY_EXISTS;
    }

    if (isEmpty(data.telNum)) {
      errors.telNum = errorCodes.EMPTY_ERROR;
    } else if (await _isTelNumUnique(data.telNum)) {
      errors.telNum = errorCodes.TEL_NUM_ALREADY_EXISTS;
    } else if (!validator.default.isLength(data.telNum, {
      min: rules.TEL_NUM_MIN_LENGTH,
      max: rules.TEL_NUM_MAX_LENGTH
    })) {
      errors.telNum = errorCodes.INVALID_TEL_NUM_LENGTH;
    } else if (data.telNum.includes('+38') && !validator.default.isMobilePhone(data.telNum.replaceAll(' ', '').replaceAll('-', ''), 'uk-UA')) {
      errors.telNum = errorCodes.INVALID_TEL_NUM;
    } else if ((data.telNum.includes('+7') || data.telNum.includes('+8')) && !validator.default.isMobilePhone(data.telNum.replaceAll(' ', '').replaceAll('-', ''), 'ru-RU')) {
      errors.telNum = errorCodes.INVALID_TEL_NUM;
    } else if (data.telNum.includes('+1') && !validator.default.isMobilePhone(data.telNum.replaceAll(' ', '').replaceAll('-', ''), 'en-US')) {
      errors.telNum = errorCodes.INVALID_TEL_NUM;
    }
    if (isEmpty(data.password)) {
      errors.password = errorCodes.EMPTY_ERROR;
    } else if (await _isPasswordUnique(data.password)) {
      errors.password = errorCodes.PASSWORD_ALREADY_EXISTS;
    } else if (!validator.default.isLength(data.password, {
      min: rules.PASSWORD_MIN_LENGTH,
      max: rules.PASSWORD_MAX_LENGTH
    })) {
      errors.password = errorCodes.INVALID_PASSWORD_LENGTH;
    } else if (!validator.default.isStrongPassword(data.password)) {
      errors.password = errorCodes.INVALID_PASSWORD;
    } else if (_isContainingOnlyWhitelistSymbols(data.password)) {
      errors.password = errorCodes.PASSWORD_NOT_ALLOWED_SYMBOLS_ERROR;
    }

    if (isEmpty(data.passwordVerification)) {
      errors.passwordVerification = errorCodes.EMPTY_ERROR;
    } else if (!validator.default.equals(data.password, data.passwordVerification)) {
      errors.passwordVerification = errorCodes.PASSWORDS_ARE_NOT_EQUAL;
    }
  } catch (err) {
    errors.internalFailure = err;
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}

async function validateClientsContactData(data) {
  let errors = {};

  try {
    if (isEmpty(data.firstName)) {
      errors.firstName = errorCodes.EMPTY_ERROR;
    } else if (!_isNameOrSurname(data.firstName)) {
      errors.firstName = errorCodes.INVALID_FIRST_NAME;
    }

    if (isEmpty(data.lastName)) {
      errors.lastName = errorCodes.EMPTY_ERROR;
    } else if (!_isNameOrSurname(data.lastName)) {
      errors.lastName = errorCodes.INVALID_LAST_NAME;
    }

    if (!isEmpty(data.email) && isEmpty(data.telNum)) {
      if (!validator.default.isEmail(data.email)) {
        errors.email = errorCodes.INVALID_EMAIL;
      } else if (!_validateEmailLength(data.email)) {
        errors.email = errorCodes.INVALID_EMAIL_LENGTH;
      }
    } else if (isEmpty(data.email) && !isEmpty(data.telNum)) {
      if (!validator.default.isLength(data.password, {min: rules.TEL_NUM_MIN_LENGTH, max: rules.TEL_NUM_MAX_LENGTH})) {
        errors.telNum = errorCodes.INVALID_TEL_NUM_LENGTH;
      } else if (data.telNum.includes('+38') && !validator.default.isMobilePhone(data.telNum.replaceAll(' ', '').replaceAll('-', ''), 'uk-UA')) {
        errors.telNum = errorCodes.INVALID_TEL_NUM;
      } else if ((data.telNum.includes('+7') || data.telNum.includes('+8')) && !validator.default.isMobilePhone(data.telNum.replaceAll(' ', '').replaceAll('-', ''), 'ru-RU')) {
        errors.telNum = errorCodes.INVALID_TEL_NUM;
      } else if (data.telNum.includes('+1') && !validator.default.isMobilePhone(data.telNum.replaceAll(' ', '').replaceAll('-', ''), 'en-US')) {
        errors.telNum = errorCodes.INVALID_TEL_NUM;
      }
    } else if (isEmpty(data.email) && isEmpty(data.telNum)) {
      errors.telNum = errorCodes.EMAIL_OR_TEL_NUM_IS_REQUIRED;
      errors.email = errorCodes.EMAIL_OR_TEL_NUM_IS_REQUIRED;
    } else {
      if (!validator.default.isEmail(data.email)) {
        errors.email = errorCodes.INVALID_EMAIL;
      } else if (!_validateEmailLength(data.email)) {
        errors.email = errorCodes.INVALID_EMAIL_LENGTH;
      }

      if (!validator.default.isLength(data.password, {min: rules.TEL_NUM_MIN_LENGTH, max: rules.TEL_NUM_MAX_LENGTH})) {
        errors.telNum = errorCodes.INVALID_TEL_NUM_LENGTH;
      } else if (data.telNum.includes('+38') && !validator.default.isMobilePhone(data.telNum.replaceAll(' ', '').replaceAll('-', ''), 'uk-UA')) {
        errors.telNum = errorCodes.INVALID_TEL_NUM;
      } else if ((data.telNum.includes('+7') || data.telNum.includes('+8')) && !validator.default.isMobilePhone(data.telNum.replaceAll(' ', '').replaceAll('-', ''), 'ru-RU')) {
        errors.telNum = errorCodes.INVALID_TEL_NUM;
      } else if (data.telNum.includes('+1') && !validator.default.isMobilePhone(data.telNum.replaceAll(' ', '').replaceAll('-', ''), 'en-US')) {
        errors.telNum = errorCodes.INVALID_TEL_NUM;
      }
    }
  } catch (err) {
    errors.internalFailure = err;
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}

async function validateContactForm(data) {
  let errors = {};

  try {
    if (isEmpty(data.firstName)) {
      errors.firstName = errorCodes.EMPTY_ERROR;
    } else if (!_isNameOrSurname(data.firstName)) {
      errors.firstName = errorCodes.INVALID_FIRST_NAME;
    }

    if (isEmpty(data.lastName)) {
      errors.lastName = errorCodes.EMPTY_ERROR;
    } else if (!_isNameOrSurname(data.lastName)) {
      errors.lastName = errorCodes.INVALID_LAST_NAME;
    }

    if (isEmpty(data.email)) {
      errors.email = errorCodes.EMPTY_ERROR;
    } else if (!validator.default.isEmail(data.email)) {
      errors.email = errorCodes.INVALID_EMAIL;
    } else if (!_validateEmailLength(data.email)) {
      errors.email = errorCodes.INVALID_EMAIL_LENGTH;
    }

    if (isEmpty(data.subject)) {
      errors.subject = errorCodes.EMPTY_ERROR;
    } else if (!contactSubjects.includes(data.subject)) {
      errors.subject = errorCodes.INVALID_SUBJECT;
    }

    if (isEmpty(data.message)) {
      errors.message = errorCodes.EMPTY_ERROR;
    }

  } catch (err) {
    errors.internalFailure = err;
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}

async function validateLoginEmail(inputData) {
  let errors = {};
  const pool = db.pool;
  const sqlGetUserData = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) AS "exists";';
  try {
    const {rows} = await pool.query(sqlGetUserData, [inputData.email]);
    if (isEmpty(inputData.email)) {
      errors.email = errorCodes.EMPTY_ERROR;
    } else if (!rows[0].exists) {
      errors.email = errorCodes.EMAIL_DOES_NOT_EXIST;
    }
  } catch (err) {
    errors.internalFailure = err;
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}

async function validateLoginPassword(inputData, databaseData) {
  let errors = {};

  try {
    if (isEmpty(inputData.password)) {
      errors.password = errorCodes.EMPTY_ERROR;
    } else if (!await argon2.verify(databaseData.password, inputData.password)) {
      errors.password = errorCodes.PASSWORD_DOES_NOT_EXIST;
    }
  } catch (err) {
    errors.internalFailure = err;
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}

async function validateDeliveryAddress(inputData) {
  let errors = {};

  try {
    if (isEmpty(inputData.city)) {
      errors.city = errorCodes.EMPTY_ERROR;
    } else if (!_isWord(inputData.city)) {
      errors.city = errorCodes.INVALID_CITY_NAME;
    } else if (!await _isCityServed(inputData.city)) {
      errors.city = errorCodes.CITY_IS_NOT_SERVED;
    }

    if (isEmpty(inputData.street)) {
      errors.street = errorCodes.EMPTY_ERROR;
    } else if (!_isWord(inputData.street)) {
      errors.street = errorCodes.INVALID_STREET_NAME;
    }

    if (isEmpty(inputData.houseNum)) {
      errors.houseNum = errorCodes.EMPTY_ERROR;
    } else if (!_.isNumber(inputData.houseNum)) {
      errors.houseNum = errorCodes.INVALID_HOUSE_NUMBER;
    } else if (inputData.houseNum < 1) {
      errors.houseNum = errorCodes.NEGATIVE_NUMBER;
    }

    if (isEmpty(inputData.flatNum)) {
      errors.flatNum = errorCodes.EMPTY_ERROR;
    } else if (!_.isNumber(inputData.flatNum)) {
      errors.flatNum = errorCodes.INVALID_FLAT_NUMBER;
    } else if (inputData.flatNum < 1) {
      errors.flatNum = errorCodes.NEGATIVE_NUMBER;
    }
  } catch (err) {
    errors.internalFailure = err;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

async function validateEmailChange(inputData, databaseData) {
  let errors = {};

  try {
    if (isEmpty(inputData.oldEmail)) {
      errors.oldEmail = errorCodes.EMPTY_ERROR;
    } else if (!validator.default.equals(inputData.oldEmail, databaseData)) {
      errors.oldEmail = errorCodes.OLD_EMAIL_DOES_NOT_MATCH;
    }

    if (isEmpty(inputData.newEmail)) {
      errors.newEmail = errorCodes.EMPTY_ERROR;
    } else if (!validator.default.isEmail(inputData.newEmail)) {
      errors.newEmail = errorCodes.INVALID_EMAIL;
    } else if (!_validateEmailLength(inputData.newEmail)) {
      errors.newEmail = errorCodes.INVALID_EMAIL_LENGTH;
    } else if (await _isEmailUnique(inputData.newEmail)) {
      errors.newEmail = errorCodes.EMAIL_ALREADY_EXISTS;
    }
  } catch (err) {
    errors.internalFailure = err;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

async function validatePasswordChange(inputData, databaseData) {
  let errors = {};

  try {
    if (isEmpty(inputData.oldPassword)) {
      errors.oldPassword = errorCodes.EMPTY_ERROR;
    } else if (!await argon2.verify(databaseData, inputData.oldPassword)) {
      errors.oldPassword = errorCodes.OLD_PASSWORD_DOES_NOT_MATCH;
    }

    if (isEmpty(inputData.newPassword)) {
      errors.newPassword = errorCodes.EMPTY_ERROR;
    } else if (await _isPasswordUnique(inputData.newPassword)) {
      errors.newPassword = errorCodes.PASSWORD_ALREADY_EXISTS;
    } else if (!validator.default.isLength(inputData.newPassword, {
      min: rules.PASSWORD_MIN_LENGTH,
      max: rules.PASSWORD_MAX_LENGTH
    })) {
      errors.newPassword = errorCodes.INVALID_PASSWORD_LENGTH;
    } else if (!validator.default.isStrongPassword(inputData.newPassword)) {
      errors.newPassword = errorCodes.INVALID_PASSWORD;
    } else if (_isContainingOnlyWhitelistSymbols(inputData.newPassword)) {
      errors.newPassword = errorCodes.PASSWORD_NOT_ALLOWED_SYMBOLS_ERROR;
    }
  } catch (err) {
    errors.internalFailure = err;
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}

async function validateTelNumChange(inputData, oldTelNum) {
  let errors = {};

  try {
    console.log(inputData.oldTelNum + '    ' + oldTelNum)
    if (isEmpty(inputData.oldTelNum)) {
      errors.oldTelNum = errorCodes.EMPTY_ERROR;
    } else if (!validator.default.equals(inputData.oldTelNum, oldTelNum)) {
      errors.oldTelNum = errorCodes.OLD_TEL_NUM_DOES_NOT_MATCH;
    }

    if (isEmpty(inputData.newTelNum)) {
      errors.newTelNum = errorCodes.EMPTY_ERROR;
    } else if (await _isTelNumUnique(inputData.newTelNum)) {
      errors.newTelNum = errorCodes.OLD_TEL_NUM_DOES_NOT_MATCH;
    } else if (!validator.default.isLength(inputData.newTelNum, {
      min: rules.TEL_NUM_MIN_LENGTH,
      max: rules.TEL_NUM_MAX_LENGTH
    })) {
      errors.newTelNum = errorCodes.INVALID_TEL_NUM_LENGTH;
    } else if (inputData.newTelNum.includes('+38') && !validator.default.isMobilePhone(inputData.newTelNum.replaceAll(' ', '').replaceAll('-', ''), 'uk-UA')) {
      errors.newTelNum = errorCodes.INVALID_TEL_NUM;
    } else if ((inputData.newTelNum.includes('+7') || inputData.newTelNum.includes('+8')) && !validator.default.isMobilePhone(inputData.newTelNum.replaceAll(' ', '').replaceAll('-', ''), 'ru-RU')) {
      errors.newTelNum = errorCodes.INVALID_TEL_NUM;
    } else if (inputData.newTelNum.includes('+1') && !validator.default.isMobilePhone(inputData.newTelNum.replaceAll(' ', '').replaceAll('-', ''), 'en-US')) {
      errors.newTelNum = errorCodes.INVALID_TEL_NUM;
    }
  } catch (err) {
    errors.internalFailure = err;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

async function validateEmail(data) {
  let errors = {};
  try {
    if (isEmpty(data.email)) {
      errors.email = errorCodes.EMPTY_ERROR;
    } else if (await _isEmailUnique(data.email)) {
      errors.email = errorCodes.EMAIL_ALREADY_EXISTS;
    } else if (!validator.default.isEmail(data.email)) {
      errors.email = errorCodes.INVALID_EMAIL;
    } else if (!_validateEmailLength(data.email)) {
      errors.email = errorCodes.INVALID_EMAIL_LENGTH;
    }
  } catch (err) {
    errors.internalFailure = err;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

function _isNameOrSurname(str) {
  return !!str.match(rules.FIRST_AND_LAST_NAME_WHITELIST_SYMBOLS);
}

function _isWord(str) {
  return !!str.match(rules.WORD_VALIDATION);
}

function _validateEmailLength(str) {
  let splits = str.split('@');
  if (splits[0] && splits[1]) {
    return splits[0].length < (rules.EMAIL_LOCAL_PART_MAX_LENGTH + 1) && splits[0].length > (rules.EMAIL_LOCAL_OR_DOMAIN_PART_MIN_LENGTH - 1)
      && splits[1].length < (rules.EMAIL_DOMAIN_PART_MAX_LENGTH + 1) && splits[0].length > (rules.EMAIL_LOCAL_OR_DOMAIN_PART_MIN_LENGTH - 1);
  } else {
    return false;
  }
}

function _isContainingOnlyWhitelistSymbols(str) {
  return !!str.match(rules.PASSWORD_WHITELIST_SYMBOLS);
}

async function _isCityServed(city) {
  const sql = 'SELECT city_en AS "cityEn", city_ru AS "cityRu", city_ua as "cityUa" FROM available_cities ORDER BY id';
  const pool = db.pool;
  try {
    const {rows} = await pool.query(sql);
    city = city.toLowerCase();
    if (city === 'kiev') {
      city = 'kyiv';
    }
    return rows.some(
      item => item.cityEn.toLowerCase() === city || item.cityRu.toLowerCase() === city || item.cityUa.toLowerCase() === city
    );
  } catch (e) {
    console.log('Querying failure in validation.config._isCityServed()' + e.stack);
    return {success: false, message: {errors: 500}};
  }
}

async function _isEmailUnique(email) {
  const pool = db.pool;
  const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) AS "exists";';

  try {
    const {rows} = await pool.query(sql, [email]);
    return rows[0].exists;
  } catch (e) {
    console.log('Querying failure in validation.config._isEmailUnique()' + e.stack);
    return {success: false, message: {errors: 500}};
  }
}

async function _isPasswordUnique(password) {
  const pool = db.pool;
  const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE password = $1) AS "exists";';

  try {
    const {rows} = await pool.query(sql, [password]);
    return rows[0].exists;
  } catch (e) {
    console.log('Querying failure in validation.config._isPasswordUnique()' + e.stack);
    return {success: false, message: {errors: 500}};
  }
}

async function _isTelNumUnique(telNum) {
  const pool = db.pool;
  const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE tel_num = $1) AS "exists";';

  try {
    const {rows} = await pool.query(sql, [telNum]);
    return rows[0].exists;
  } catch (e) {
    console.log('Querying failure in validation.config._isTelNumUnique()' + e.stack);
    return {success: false, message: {errors: 500}};
  }
}

export default {
  validateRegistration,
  validateLoginEmail,
  validateLoginPassword,
  validateTelNumChange,
  validateDeliveryAddress,
  validatePasswordChange,
  validateEmailChange,
  validateClientsContactData,
  validateEmail,
  validateContactForm
};
