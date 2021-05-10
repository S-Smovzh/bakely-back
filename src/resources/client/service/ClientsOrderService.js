import crypto from 'crypto';
import db from '../../../config/database.config';

async function proceedOrder(req) {
  const pool = db.pool;
  let data = req.body;
  let client = req.client;
  const sqlAddressCheck = 'SELECT EXISTS(SELECT 1 FROM clients_delivery_addresses WHERE client_id = $1) AS "exists";';
  const sqlContactDetailsCheck = 'SELECT EXISTS(SELECT 1 FROM clients_contacts WHERE clients_id = $1) AS "exists";';
  // const sqlGetProductsFromCart = 'SELECT product_id AS "prodId", quantity, p.price FROM clients_cart_items INNER JOIN products p on p.id = clients_cart_items.product_id WHERE cart_id = $1;';
  const sqlCreateOrder = 'INSERT INTO clients_orders (client_id, price, comment, created_at, order_id) VALUES ($1, $2, $3, $4, $5)';
  // const sqlDeleteProductsFromCart = 'DELETE FROM clients_cart_items WHERE cart_id = $1;';
  const sqlUniteProductsWithOrder = 'INSERT INTO clients_orders_products (product_id, order_id, quantity, total) VALUES ($1, $2, $3, $4)';

  if (!data) {
    console.log('Empty request body in ClientsOrderService.proceedOrder()!');
    return { success: false, errors: { code: 10 } };
  }

  try {
    const addressExist = await pool.query(sqlAddressCheck, [client.clientId]);
    const contactsExist = await pool.query(sqlContactDetailsCheck, [client.clientId]);
    // const { rows } = await pool.query(sqlGetProductsFromCart, [client.cartId]);

    const orderId = crypto.randomBytes(10).toString('hex');

    if (addressExist.rows[0] && contactsExist.rows[0]) {
      await pool.query(sqlCreateOrder, [client.clientId, data.total, data.comment, Date.now(), orderId]);
      // await pool.query(sqlDeleteProductsFromCart, [client.cartId]);

      for (const product of data.products) {
        await pool.query(sqlUniteProductsWithOrder, [product.productId, orderId, product.quantity, product.total]);
      }
    }
    return { success: true, errors: null };
  } catch (e) {
    console.log('Querying failure in ClientsOrderService.proceedOrder()  \n\n' + e.stack);
    return { success: false, errors: { code: 500 } };
  }
}

export default {
  proceedOrder
};
