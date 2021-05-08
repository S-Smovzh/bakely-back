import db from '../../../config/database.config.js';
import { defineName } from '../../../utils/lang.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const format = require('pg-format');

async function getAll(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const title = await defineName(lang, 'title');
  const mainText = await defineName(lang, 'main_text');
  const imgDescription = await defineName(lang, 'img_description');

  if (!lang) {
    console.log('Empty lang param in PressReleasesService.getAll()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (title && mainText && imgDescription) {
    const sql = format('SELECT id, %I AS "title", %I AS "mainText", date, img, %I AS "imgDescription" FROM press_releases ORDER BY id', title, mainText, imgDescription);
    try {
      const { rows } = await pool.query(sql);
      return { data: rows, success: true, message: null };
    } catch (e) {
      console.log('Querying failure in PressReleasesService.getAll()  \n\n' + e.stack);
      return { data: null, success: false, message: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in PressReleasesService.getAll()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function getOne(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const id = req.params.id;
  const title = await defineName(lang, 'title');
  const mainText = await defineName(lang, 'main_text');

  if (!lang || !id) {
    console.log('Empty lang or id param in PressReleasesService.getOne()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (title && mainText) {
    const sql = format('SELECT %I AS "title", %I AS "mainText", date, img FROM press_releases WHERE id = $1 ORDER BY id', title, mainText);
    try {
      const { rows } = await pool.query(sql, [id]);
      return { data: rows, success: true, message: null };
    } catch (e) {
      console.log('Querying failure in PressReleasesService.getOne()  \n\n' + e.stack);
      return { data: null, success: false, message: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in PressReleasesService.getOne()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function search(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const keyword = req.params.keyword;
  const title = await defineName(lang, 'title');
  const mainText = await defineName(lang, 'main_text');

  if (!lang || !keyword) {
    console.log('Empty lang or keyword param in PressReleasesService.search()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (title && mainText) {
    const sql = format('SELECT %I AS "title", %I AS "mainText", date, img FROM press_releases WHERE %I LIKE $1 OR %I LIKE $1 ORDER BY id', title, mainText, title, mainText);
    try {
      const { rows } = await pool.query(sql, ['%' + keyword + '%']);
      return { data: rows, success: true, message: null };
    } catch (e) {
      console.log('Querying failure in PressReleasesService.search()  \n\n' + e.stack);
      return { data: null, success: false, message: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in PressReleasesService.search()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

export default {
  getOne,
  getAll,
  search
};
