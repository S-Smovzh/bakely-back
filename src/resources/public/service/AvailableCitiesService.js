import {createRequire} from 'module';
import db from '../../../config/database.config';
import {defineName} from '../../../utils/lang';

const require = createRequire(import.meta.url);
const format = require('pg-format');

async function getAll(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const city = await defineName(lang, 'city');

  if (!lang) {
    console.log('Empty lang param in AvailableCitiesService.getAll()!');
    return {data: null, success: false, errors: {code: 10}};
  }

  if (city) {
    const sql = format('SELECT %I AS "city" FROM available_cities ORDER BY id', city);
    try {
      const {rows} = await pool.query(sql);
      return {data: rows, success: true, errors: null};
    } catch (e) {
      console.log('Querying failure in CateringsService.getAll()  \n\n' + e.stack);
      return {data: null, success: false, errors: {code: 500}};
    }
  } else {
    console.log('Querying formatting failure in CateringsService.getAll()');
    return {data: null, success: false, errors: {code: 500}};
  }
}

export default {
  getAll
};
