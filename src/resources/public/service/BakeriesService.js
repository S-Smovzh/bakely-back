import { createRequire } from 'module';
import db from '../../../config/database.config.js';
import { defineName } from '../../../utils/lang.js';

const require = createRequire(import.meta.url);
const format = require('pg-format');

async function getAll(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const name = await defineName(lang, 'name');
  const city = await defineName(lang, 'city');
  const street = await defineName(lang, 'street');

  if (!lang) {
    console.log('Empty lang param in BakeriesService.getAll()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (city && street && name) {
    const sql = format('SELECT %I AS "name", %I AS "city", %I AS "street", working_hours AS "workingHours", tel_num AS "telNum", img, latitude, longitude FROM bakeries ORDER BY id', name, city, street);
    try {
      const { rows } = await pool.query(sql);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in BakeriesService.getAll()  \n\n' + e.stack);
      return { data: null, success: false, message: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in BakeriesService.getAll()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function getOne(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const id = req.params.id;
  const city = await defineName(lang, 'city');
  const street = await defineName(lang, 'street');

  if (!lang || !id) {
    console.log('Empty lang or id param in BakeriesService.getOne()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (city && street) {
    const sql = format('SELECT %I AS "city", %I AS "street", working_hours AS "workingHours", tel_num AS "telNum", img, latitude, longitude FROM bakeries WHERE id = $1 ORDER BY id', city, street);
    try {
      const { rows } = await pool.query(sql, [id]);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in BakeriesService.getOne()  \n\n' + e.stack);
      return { data: null, success: false, message: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in BakeriesService.getOne()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function search(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const keyword = req.params.keyword;
  const city = await defineName(lang, 'city');
  const street = await defineName(lang, 'street');

  if (!lang || !keyword) {
    console.log('Empty lang or keyword param in BakeriesService.search()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (city && street) {
    const sql = format('SELECT %I AS "city", %I AS "street", working_hours AS "workingHours", tel_num AS "telNum", img, latitude, longitude FROM bakeries WHERE CAST(%I AS TEXT) LIKE $1 OR CAST(%I AS TEXT) LIKE $1 OR CAST(working_hours AS TEXT) LIKE $1 OR CAST(tel_num AS TEXT) LIKE $1 OR CAST(latitude AS TEXT) LIKE $1 OR CAST(longitude AS TEXT) LIKE $1 ORDER BY id;', city, street, city, street);
    try {
      const { rows } = await pool.query(sql, ['%' + keyword + '%']);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in BakeriesService.search()  \n\n' + e.stack);
      return { data: null, success: false, message: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in BakeriesService.search()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

export default {
  getOne,
  getAll,
  search
};
