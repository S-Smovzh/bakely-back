import {createRequire} from 'module';
import db from '../../../config/database.config';
import {defineName} from '../../../utils/lang';

const require = createRequire(import.meta.url);
const format = require('pg-format');

async function addToCart(req) {
  const pool = db.pool;
  const data = req.body;
  const cartId = req.user.cartId;
  const sqlCheck = 'SELECT EXISTS(SELECT 1 FROM users_cart_items WHERE cart_id = $1 AND product_id = $2) AS "exists" ;';
  const sqlAdd = 'INSERT INTO users_cart_items (product_id, quantity, cart_id, added_at) VALUES ($1, $2, $3, $4);';
  const sqlUpdate = 'UPDATE users_cart_items SET quantity = $1 AND added_at = $2 WHERE cart_id = $3 AND product_id = $4;';

  if (!data) {
    console.log('Empty request body in UsersCartService.addToCart()!');
    return {success: false, errors: {code: 10}};
  }

  try {
    const {rows} = await pool.query(sqlCheck, [data.id]);
    if (rows) {
      await pool.query(sqlUpdate, [Date.now(), data.quantity, data.id, cartId]);
    } else {
      await pool.query(sqlAdd, [data.id, data.quantity, cartId, Date.now()]);
    }
    return {success: true, errors: null};
  } catch (e) {
    console.log('Querying failure in UsersCartService.addToCart()  \n\n' + e.stack);
    return {success: false, errors: {code: 500}};
  }
}

async function removeFromCart(req) {
  const pool = db.pool;
  const data = req.body;
  const cartId = req.user.cartId;
  const sqlProductCheck = 'SELECT EXISTS(SELECT 1 FROM users_cart_items WHERE cart_id = $1 AND product_id = $2) AS "exists";';
  const sqlDeleteFromCart = 'DELETE FROM users_cart_items WHERE cart_id = $1 AND product_id = $2;';

  if (!data) {
    console.log('Empty request body in UsersCartService.removeFromCart()!');
    return {success: false, errors: {code: 10}};
  }

  try {
    const {rows} = await pool.query(sqlProductCheck, [cartId, data.id]);
    if (rows[0].exists) {
      await pool.query(sqlDeleteFromCart, [cartId, data.id]);
      return {success: true, errors: null};
    } else {
      return {success: false, errors: {code: 10}};
    }
  } catch (e) {
    console.log('Querying failure in UsersCartService.removeFromCart()  \n\n' + e.stack);
    return {success: false, errors: {code: 500}};
  }
}

async function getAllCartItems(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const cartId = req.user.cartId;
  const name = await defineName(lang, 'name');
  const description = await defineName(lang, 'description');

  if (!lang) {
    console.log('Empty lang param in UsersCartService.getAllCartItems()!');
    return {data: null, success: false, errors: {code: 10}};
  }

  if (name && description) {
    const sql = format('SELECT p.%I AS "name", p.price, p.%I AS "description", quantity FROM users_cart_items INNER JOIN products p ON product_id = p.id WHERE cart_id = $1 ORDER BY added_at;', name, description);

    try {
      const {rows} = await pool.query(sql, [cartId]);
      return {data: rows, success: true, errors: null};
    } catch (e) {
      console.log('Querying failure in UsersCartService.getAllCartItems()  \n\n' + e.stack);
      return {data: null, success: false, errors: {code: 500}};
    }
  } else {
    console.log('Empty dynamic query values in UsersCartService.getAllCartItems()!');
    return {
      data: null,
      success: false,
      errors: {code: 500}
    };
  }
}

export default {
  addToCart,
  removeFromCart,
  getAllCartItems
};
