import crypto from 'crypto';
import * as validator from '../../../security/validation/validation.config.js';
import * as token from '../../../security/jwt/TokenService.js';
import db from '../../../config/database.config.js';

async function createSession(req, res) {
  const pool = db.pool;
  const data = {};
  const sqlCreateSession = 'INSERT INTO clients_session (client_id, ip, user_agent) VALUES ($1, $2, $3)';
  const sqlCreateCart = 'INSERT INTO clients_carts (client_id, created_at, cart_id) VALUES ($1, $2, $3)';

  const clientId = crypto.randomBytes(10).toString('hex');
  const cartId = crypto.randomBytes(10).toString('hex');
  data.clientId = clientId;
  data.cartId = cartId;

  try {
    await pool.query(sqlCreateSession, [clientId, req.connection.remoteAddress, req.headers['user-agent']]);
    await pool.query(sqlCreateCart, [clientId, Date.now(), cartId]);
    return token.default.generateClientsJWT(res, data);
  } catch (e) {
    console.log('Querying failure in ClientsService.createSession()' + e.stack);
    return {success: false, errors: {code: 500}};
  }
}

async function addDeliveryAddress(req) {
  const pool = db.pool;
  const clientId = req.client.clientId;
  const data = req.body;
  const sql = 'INSERT INTO clients_delivery_addresses (client_id, city, street, house, flat_num, created_at) VALUES ($1, $2, $3, $4, $5, $6)';
  const validation = await validator.default.validateDeliveryAddress(data);

  if (!data) {
    console.log('Empty request body in ClientsService.addDeliveryAddress()!');
    return {success: false, errors: {code: 10}};
  }

  async function addRecord() {
    try {
      await pool.query(sql, [clientId, data.city, data.street, data.houseNum, data.flatNum, Date.now()]);
      return {success: true, errors: null};
    } catch (e) {
      console.log('Address adding failure in ClientsService.addDeliveryAddress().addRecord()  \n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  }

  if (validation.isValid) {
    return await addRecord();
  } else {
    console.log('Validation failure in ClientsService.addDeliveryAddress()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

async function addContactData(req) {
  const pool = db.pool;
  const clientId = req.client.clientId;
  const data = req.body;
  const sql = 'INSERT INTO clients_contacts (f_name, l_name, tel_num, email, clients_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)';
  const validation = await validator.default.validateClientsContactData(data);

  if (!data) {
    console.log('Empty request body in ClientsService.addContactData()!');
    return {success: false, errors: {code: 10}};
  }

  async function addRecord() {
    try {
      await pool.query(sql, [data.firstName, data.lastName, data.telNum, data.email, clientId, Date.now()]);
      return {success: true, errors: null};
    } catch (e) {
      console.log('Address adding failure in ClientsService.addContactData().addRecord()  \n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  }

  if (validation.isValid) {
    return await addRecord();
  } else {
    console.log('Validation failure in ClientsService.addContactData()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

async function contactForm(req) {
  const pool = db.pool;
  const id = req.client.clientId;
  const data = req.body;
  const sql = 'INSERT INTO contact_form (client_id, first_name, last_name, email, subject, message) VALUES ($1, $2, $3, $4, $5, $6)';
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

async function addSubscription(req) {
  const pool = db.pool;
  const clientId = req.client.clientId;
  const data = req.body;
  const sql = 'INSERT INTO subscription (client_id, email) VALUES ($1, $2);';
  const validation = await validator.default.validateEmail(data);

  if (!data.email) {
    console.log('Empty request body in ClientsService.addSubscription()!');
    return {success: false, errors: {code: 10}};
  }
  if (validation.isValid) {
    try {
      await pool.query(sql, [clientId, data.email]);
      return {success: true, errors: null};
    } catch (e) {
      console.log('Subscribing failure in ClientsService.addSubscription()  \n\n' + e.stack);
      return {success: false, errors: {code: 500}};
    }
  } else {
    console.log('Validation failure in ClientsService.addSubscription()');
    return {
      success: false,
      errors: validation.errors
    };
  }
}

export default {
  createSession,
  addDeliveryAddress,
  addContactData,
  addSubscription,
  contactForm
};
