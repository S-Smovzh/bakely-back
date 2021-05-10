import db from '../../../config/database.config';

async function getStockOfProduct(req) {
  const pool = db.pool;
  const bakeryId = req.body.bakeryId;
  const productId = req.body.productId;
  const sql = 'SELECT available_quantity AS "availableQuantity" FROM bakeries_products WHERE bakery_id = $1 AND product_id = $2';

  if (!bakeryId || !productId) {
    console.log('Empty request body in BakeriesProductsService.getStockOfProduct()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  try {
    const { rows } = await pool.query(sql, [bakeryId, productId]);
    return { data: rows, success: true, errors: null };
  } catch (e) {
    console.log('Querying failure in BakeriesProductsService.getStockOfProduct()  \n\n' + e.stack);
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function decreaseQuantity(req) {
  const pool = db.pool;
  const bakeryId = req.body.bakeryId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const prevQuantitySql = 'SELECT available_quantity AS "prevQuantity" FROM bakeries_products WHERE bakery_id = $1 AND product_id = $2';
  const sqlUpdateQuantity = 'UPDATE bakeries_products SET available_quantity = $1 WHERE bakery_id = $2 AND product_id = $3';

  if (!bakeryId || !productId || !quantity) {
    console.log('Empty request body in BakeriesProductsService.decreaseQuantity()!');
    return { success: false, errors: { code: 10 } };
  }

  try {
    const result = await pool.query(prevQuantitySql, [bakeryId, productId]);
    await pool.query(sqlUpdateQuantity, [result.rows[0].prevQuantity - quantity, bakeryId, productId]);
    return { success: true, errors: null };
  } catch (e) {
    console.log('Querying failure in BakeriesProductsService.decreaseQuantity()  \n\n' + e.stack);
    return { success: false, errors: { code: 500 } };
  }
}

export default {
  getStockOfProduct,
  decreaseQuantity
};
