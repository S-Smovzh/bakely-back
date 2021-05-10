import { createRequire } from 'module';
import crypto from 'crypto';
import db from '../../../config/database.config.js';
import { defineName } from '../../../utils/lang.js';

const require = createRequire(import.meta.url);
const format = require('pg-format');

async function getAllOrders(req) {
  const pool = db.pool;
  const userId = req.user.userId;
  const lang = req.params.lang;
  const name = await defineName(lang, 'name');

  if (!lang) {
    console.log('Empty lang param in UsersOrderService.getAllOrders()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (name) {
    const sql = format('SELECT id, price, comment, created_at as "date", delivered, ARRAY(SELECT p.%I FROM users_orders_products o INNER JOIN products p on o.product_id = p.id WHERE o.product_id = p.id AND o.order_id = users_orders.order_id ORDER BY p.id) AS "products" FROM users_orders WHERE user_id = $1 ORDER BY created_at;', name);

    try {
      const { rows } = await pool.query(sql, [userId]);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in UserOrderService.getAllOrders()  \n\n' + e.stack);
      return { data: null, success: false, errors: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in UsersOrderService.getAllOrders()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function searchOrders(req) {
  const pool = db.pool;
  const userId = req.user.userId;
  const keyword = req.params.keyword;
  const sql = 'SELECT price, comment, created_at as "orderTime", delivered, ARRAY(SELECT p.name_en FROM users_orders_products o INNER JOIN products p on o.product_id = p.id ORDER BY p.id) AS products FROM users_orders WHERE user_id = $1 AND CAST(price AS TEXT) LIKE $2 OR comment LIKE $2 OR CAST(created_at AS TEXT) LIKE $2 OR CAST(delivered AS TEXT) LIKE $2 ORDER BY created_at;';

  if (!keyword) {
    console.log('Empty keyword param in UsersOrderService.searchOrders()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  try {
    const { rows } = await pool.query(sql, [userId, '%' + keyword + '%']);
    return { data: rows, success: true, errors: null };
  } catch (e) {
    console.log('Querying failure in UserOrderService.searchOrders()  \n\n' + e.stack);
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function proceedOrder(req) {
  const pool = db.pool;
  let data = req.body;
  let user = req.user;
  const sqlAddressCheck = 'SELECT EXISTS(SELECT 1 FROM users_delivery_addresses WHERE user_id = $1) AS "exists"';
  const sqlUserCheck = 'SELECT EXISTS(SELECT 1 FROM users WHERE user_id = $1) AS "exists";';
  // const sqlGetProductsFromCart = 'SELECT product_id AS "prodId", quantity, p.price FROM users_cart_items INNER JOIN products p on p.id = users_cart_items.product_id WHERE cart_id = $1;';
  const sqlCreateOrder = 'INSERT INTO users_orders (user_id, price, comment, created_at, delivered, order_id) VALUES ($1, $2, $3, $4, $5, $6)';
  // const sqlDeleteProductsFromCart = 'DELETE FROM users_cart_items WHERE cart_id = $1;';
  const sqlUniteProductsWithOrder = 'INSERT INTO users_orders_products (product_id, order_id, quantity, total) VALUES ($1, $2, $3, $4)';

  console.log(data)

  if (!data) {
    console.log('Empty request body in UsersOrderService.proceedOrder()!');
    return { success: false, errors: { code: 10 } };
  }

  try {
    const addressExist = await pool.query(sqlAddressCheck, [user.userId]);
    const contactsExist = await pool.query(sqlUserCheck, [user.userId]);
    // const { rows } = await pool.query(sqlGetProductsFromCart, [user.cartId]);

    const orderId = crypto.randomBytes(10).toString('hex');

    if (addressExist.rows[0] && contactsExist.rows[0]) {
      await pool.query(sqlCreateOrder, [user.userId, data.total, data.comment, Date.now(), false, orderId]);
      // await pool.query(sqlDeleteProductsFromCart, [user.cartId]);

      for (const product of data.products) {
        // let total = product.quantity * product.price;
        await pool.query(sqlUniteProductsWithOrder, [product.productId, orderId, product.quantity, product.total]);
      }
    }
    return { success: true, errors: null };
  } catch (e) {
    console.log('Querying failure in UsersOrderService.proceedOrder()  \n\n' + e.stack);
    return { success: false, errors: { code: 500 } };
  }
}

async function getAllNonDeliveredOrders(req) {
  const pool = db.pool;
  const userId = req.user.userId;
  const sql = 'SELECT price, comment, created_at as "orderTime", delivered, ARRAY(SELECT p.name_en FROM users_orders_products o INNER JOIN products p on o.product_id = p.id WHERE o.product_id = p.id ORDER BY p.id) AS "products" FROM users_orders WHERE user_id = $1 AND delivered = false ORDER BY created_at;';

  try {
    const { rows } = await pool.query(sql, [userId]);
    return { data: rows, success: true, errors: null };
  } catch (e) {
    console.log('Querying failure in UserOrderService.addToCart()  \n\n' + e.stack);
    return { data: null, success: false, errors: { code: 500 } };
  }
}

export default {
  getAllOrders,
  searchOrders,
  proceedOrder,
  getAllNonDeliveredOrders
};
