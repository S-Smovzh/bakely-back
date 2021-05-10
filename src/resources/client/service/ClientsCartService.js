import { createRequire } from 'module';
import db from '../../../config/database.config';
import { defineName } from '../../../utils/lang';

const require = createRequire(import.meta.url);
const format = require('pg-format');

async function addToCart(req) {
  const pool = db.pool;
  const data = req.body;
  const cartId = req.client.cartId;
  const sql = 'INSERT INTO clients_cart_items (product_id, quantity, cart_id, added_at) VALUES ($1, $2, $3, $4);';

  if (!data) {
    console.log('Empty request body in ClientsCartService.addToCart()!');
    return { success: false, errors: { code: 10 } };
  }

  try {
    await pool.query(sql, [data.productId, data.quantity, cartId, Date.now()]);
    return { status: 200, success: true, message: null };
  } catch (e) {
    console.log('Querying failure in ClientsCartService.addToCart()  \n\n' + e.stack);
    return { success: false, errors: { code: 500 } };
  }
}

async function removeFromCart(req) {
  const pool = db.pool;
  const data = req.body;
  const cartId = req.client.cartId;
  const sqlProductCheck = 'SELECT EXISTS(SELECT 1 FROM clients_cart_items WHERE cart_id = $1 AND product_id = $2) AS "exists";';
  const sqlDeleteFromCart = 'DELETE FROM clients_cart_items WHERE cart_id = $1 AND product_id = $2;';

  if (!data) {
    console.log('Empty request body in ClientsCartService.removeFromCart()!');
    return { success: false, errors: { code: 10 } };
  }

  try {
    const { rows } = await pool.query(sqlProductCheck, [cartId, data.productId]);
    if (rows[0].exists) {
      await pool.query(sqlDeleteFromCart, [cartId, data.productId]);
      return { success: true, errors: null };
    } else {
      return { success: false, errors: { code: 10 } };
    }
  } catch (e) {
    console.log('Querying failure in ClientsCartService.removeFromCart()  \n\n' + e.stack);
    return { success: false, errors: { code: 500 } };
  }
}

async function getAllCartItems(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const cartId = req.client.cartId;
  const name = await defineName(lang, 'name');
  const description = await defineName(lang, 'description');

  if (!lang) {
    console.log('Empty lang param in ClientsCartService.getAllCartItems()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (name && description) {
    const sql = format('SELECT p.%I AS "name", p.price, p.%I AS "description", quantity FROM clients_cart_items INNER JOIN products p ON product_id = p.id WHERE cart_id = $1 ORDER BY added_at;', name, description);

    try {
      const { rows } = await pool.query(sql, [cartId]);
      return { data: rows, success: true, message: null };
    } catch (e) {
      console.log('Querying failure in ClientsCartService.getAllCartItems()  \n\n' + e.stack);
      return { data: null, success: false, message: 'Querying failure in ClientsCartService.getAllCartItems()!' };
    }
  } else {
    console.log('Querying failure in ClientsCartService.getAllCartItems()  \n\n' + e.stack);
    return { data: null, success: false, errors: { code: 500 } };
  }
}

export default {
  addToCart,
  removeFromCart,
  getAllCartItems
};
