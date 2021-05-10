import {createRequire} from 'module';
import db from '../../../config/database.config';
import {defineName} from '../../../utils/lang';

const require = createRequire(import.meta.url);
const format = require('pg-format');

async function getAll(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const name = await defineName(lang, 'name');
  const description = await defineName(lang, 'description');
  const imgDescription = await defineName(lang, 'img_description');
  const option = await defineName(lang, 'option');

  if (!lang) {
    console.log('Empty lang param in ProductsService.getAll()!');
    return {data: null, success: false, errors: {code: 10}};
  }

  if (name && description && imgDescription && option) {
    const sql = format('SELECT p.id, p.%I AS "name", p.%I AS "description", p.%I AS "imgDescription", price, discount, weight, type, img_src AS "imgSrc", ARRAY(SELECT po.%I FROM products_options po WHERE po.prod_id = p.id ORDER BY po.%I) AS options FROM products p ORDER BY p.type;', name, description, imgDescription, option, option);
    try {
      const {rows} = await pool.query(sql);
      return {data: rows, success: true, message: null};
    } catch (e) {
      console.log('Querying failure in ProductsService.getAll()  \n\n' + e.stack);
      return {data: null, success: false, message: {code: 500}};
    }
  } else {
    console.log('Querying formatting failure in ProductsService.getAll()');
    return {data: null, success: false, errors: {code: 500}};
  }
}

async function getOne(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const id = req.params.id;
  const name = await defineName(lang, 'name');
  const description = await defineName(lang, 'description');
  const imgDescription = await defineName(lang, 'img_description');
  const option = await defineName(lang, 'option');

  if (!lang || !id) {
    console.log('Empty lang or keyword param in ProductsService.getOne()!');
    return {data: null, success: false, errors: {code: 10}};
  }

  if (name && description && imgDescription && option) {
    const sql = format('SELECT p.id, p.%I AS "name", p.%I AS "description", p.%I AS "imgDescription", price, discount, weight, type, img_src AS "imgSrc", ARRAY(SELECT po.%I FROM products_options po WHERE po.prod_id = p.id ORDER BY po.%I) AS options, ARRAY(SELECT po.max_per_order FROM products_options po WHERE po.prod_id = p.id ORDER BY po.%I) AS "maxPerOrder" FROM products p WHERE p.id = $1 ORDER BY p.type;', name, description, imgDescription, option, option, option);
    try {
      const {rows} = await pool.query(sql, [id]);
      return {data: rows, success: true, message: null};
    } catch (e) {
      console.log('Querying failure in ProductsService.getOne()  \n\n' + e.stack);
      return {data: null, success: false, message: {code: 500}};
    }
  } else {
    console.log('Querying formatting failure in ProductsService.getOne()');
    return {data: null, success: false, errors: {code: 500}};
  }
}

async function getAllByType(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const type = req.params.type;
  const name = await defineName(lang, 'name');
  const imgDescription = await defineName(lang, 'img_description');

  if (!lang || !type) {
    console.log('Empty lang or keyword param in ProductsService.getAllByType()!');
    return {data: null, success: false, errors: {code: 10}};
  }

  if (name && imgDescription) {
    const sql = format('SELECT p.id, p.%I AS "name", p.%I AS "imgDescription", price, discount, img_src AS "imgSrc" FROM products p WHERE p.type = $1 ORDER BY p.id;', name, imgDescription);
    try {
      const {rows} = await pool.query(sql, [type]);
      return {data: rows, success: true, message: null};
    } catch (e) {
      console.log('Querying failure in ProductsService.getAllByType()  \n\n' + e.stack);
      return {data: null, success: false, message: {code: 500}};
    }
  } else {
    console.log('Querying formatting failure in ProductsService.getAllByType()');
    return {data: null, success: false, errors: {code: 500}};
  }
}

async function getRandomFour(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const type = req.params.type;
  const id = req.params.id;
  const name = await defineName(lang, 'name');
  const imgDescription = await defineName(lang, 'img_description');

  if (!lang || !type || !id) {
    console.log('Empty lang or keyword param in ProductsService.getRandomFour()!');
    return {data: null, success: false, errors: {code: 10}};
  }

  if (imgDescription && name) {
    const sql = format('SELECT p.id, p.%I AS "name", p.%I AS "imgDescription", price, discount, img_src AS "imgSrc" FROM products p WHERE p.type = $1 AND p.id != $2 ORDER BY random() LIMIT 4;', name, imgDescription);
    try {
      const {rows} = await pool.query(sql, [type, id]);
      return {data: rows, success: true, message: null};
    } catch (e) {
      console.log('Querying аailure in ProductsService.getRandomFour()  \n\n' + e.stack);
      return {data: null, success: false, message: {code: 500}};
    }
  } else {
    console.log('Querying formatting failure in ProductsService.getRandomFour()');
    return {data: null, success: false, errors: {code: 500}};
  }
}

async function search(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const keyword = req.params.keyword;
  const name = await defineName(lang, 'name');
  const description = await defineName(lang, 'description');
  const imgDescription = await defineName(lang, 'img_description');
  const option = await defineName(lang, 'option');

  if (!keyword || !lang) {
    console.log('Empty lang or keyword param in ProductsService.search()!');
    return {data: null, success: false, errors: {code: 10}};
  }

  if (name && description && imgDescription && option) {
    const sql = format('SELECT p.id, p.%I AS "name", p.%I AS "description", p.%I AS "imgDescription", price, discount, weight, type, img_src AS "imgSrc", ARRAY(SELECT po.%I FROM products_options po WHERE po.prod_id = p.id ORDER BY po.%I) AS options FROM products p WHERE p.%I LIKE CAST($1 AS TEXT) OR p.%I LIKE CAST($1 AS TEXT) OR CAST(p.price AS TEXT) LIKE $1 OR CAST(p.discount AS TEXT) LIKE $1 OR CAST(p.weight AS TEXT) LIKE $1 OR p.type LIKE CAST($1 AS TEXT) ORDER BY p.type;', name, description, imgDescription, option, option, name, description);
    try {
      const {rows} = await pool.query(sql, ['%' + keyword + '%']);
      return {data: rows, success: true, message: null};
    } catch (e) {
      console.log('Querying failure in ProductsService.search()  \n\n' + e.stack);
      return {data: null, success: false, message: {code: 500}};
    }
  } else {
    console.log('Querying formatting failure in ProductsService.search()');
    return {data: null, success: false, errors: {code: 500}};
  }
}

async function getCategories(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const name = await defineName(lang, 'name');
  const imgDescription = await defineName(lang, 'img_descr');

  if (!lang) {
    console.log('Empty lang or keyword param in ProductsService.getCategories()!');
    return {data: null, success: false, errors: {code: 10}};
  }

  if (name && imgDescription) {
    const sql = format('SELECT %I AS "name", %I AS "imgDescription", type, img_src AS "imgSrc" FROM products_categories ORDER BY id;', name, imgDescription);
    try {
      const {rows} = await pool.query(sql);
      return {data: rows, success: true, message: null};
    } catch (e) {
      console.log('Querying failure in ProductsService.getCategories()  \n\n' + e.stack);
      return {data: null, success: false, message: {code: 500}};
    }
  } else {
    console.log('Querying formatting failure in ProductsService.getCategories()');
    return {data: null, success: false, errors: {code: 500}};
  }
}

export default {
  getOne,
  getAll,
  getAllByType,
  getCategories,
  getRandomFour,
  search
};
