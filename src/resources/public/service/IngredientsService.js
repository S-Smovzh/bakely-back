import { createRequire } from 'module';
import db from '../../../config/database.config.js';
import { defineName } from '../../../utils/lang.js';

const require = createRequire(import.meta.url);
const format = require('pg-format');

async function getAll(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const name = await defineName(lang, 'name');

  if (!lang) {
    console.log('Empty lang param in IngredientsService.getAll()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (name) {
    const sql = format('SELECT i.%I AS "name" FROM products_ingredients INNER JOIN ingredients i on products_ingredients.ingr_id = i.id ORDER BY prod_id', name);
    try {
      const { rows } = await pool.query(sql);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in IngredientsService.getAll()  \n\n' + e.stack);
      return { data: null, success: false, errors: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in IngredientsService.getAll()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function getIngredientsForOneProduct(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const prodId = req.params.id;
  const name = await defineName(lang, 'name');

  if (!lang || !prodId) {
    console.log('Empty lang or prodId param in IngredientsService.getIngredientsForOneProduct()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (name) {
    const sql = format('SELECT i.%I AS "name" FROM products_ingredients INNER JOIN ingredients i on products_ingredients.ingr_id = i.id WHERE prod_id = $1 ORDER BY prod_id', name);
    try {
      const { rows } = await pool.query(sql, [prodId]);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in IngredientsService.getIngredientsForOneProduct()  \n\n' + e.stack);
      return { data: null, success: false, errors: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in IngredientsService.getIngredientsForOneProduct()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function search(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const keyword = req.params.keyword;
  const name = await defineName(lang, 'name');

  if (!lang || !keyword) {
    console.log('Empty lang or keyword param in IngredientsService.search()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (name) {
    const sql = format('SELECT i.%I AS "name", prod_id AS "prodId" FROM products_ingredients INNER JOIN ingredients i on products_ingredients.ingr_id = i.id WHERE CAST(%I AS TEXT) LIKE $1 ORDER BY prod_id', name, name);
    try {
      const { rows } = await pool.query(sql, ['%' + keyword + '%']);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in IngredientsService.search()  \n\n' + e.stack);
      return { data: null, success: false, errors: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in IngredientsService.search()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

export default {
  getIngredientsForOneProduct,
  getAll,
  search
};
