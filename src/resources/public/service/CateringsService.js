import { createRequire } from 'module';
import db from '../../../config/database.config.js';
import { defineName } from '../../../utils/lang.js';

const require = createRequire(import.meta.url);
const format = require('pg-format');

async function getAll(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const name = await defineName(lang, 'name');
  const imgDescription = await defineName(lang, 'img_description');

  if (!lang) {
    console.log('Empty lang param in CateringsService.getAll()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (name && imgDescription) {
    const sql = format('SELECT id, %I AS "name", %I AS "imgDescription", date, img_src AS "imgSrc", guests_quantity AS "guestsQuantity", type FROM catering_event ORDER BY id', name, imgDescription);
    try {
      const { rows } = await pool.query(sql);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in CateringsService.getAll()  \n\n' + e.stack);
      return { data: null, success: false, errors: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in CateringsService.getAll()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function getOne(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const id = req.params.id;
  const name = await defineName(lang, 'name');
  const imgDescription = await defineName(lang, 'img_description');

  if (!lang || !id) {
    console.log('Empty lang or id param in CateringsService.getOne()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (name && imgDescription) {
    const sql = format('SELECT id, %I AS "name", %I AS "imgDescription", date, img_src AS "imgSrc", guests_quantity AS "guestsQuantity", type FROM catering_event WHERE event_id = $1 ORDER BY id', name, imgDescription);
    try {
      const { rows } = await pool.query(sql, [id]);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in CateringsService.getOne()  \n\n' + e.stack);
      return { data: null, success: false, errors: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in CateringsService.getOne()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function getByType(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const type = req.params.type;
  const name = await defineName(lang, 'name');
  const imgDescription = await defineName(lang, 'img_description');

  if (!lang || !type) {
    console.log('Empty lang or type param in CateringsService.getByType()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (name && imgDescription) {
    const sql = format('SELECT id, %I AS "name", %I AS "imgDescription", guests_quantity AS "guests", date, img_src AS "imgSrc", type FROM catering_event WHERE type = $1 ORDER BY id;', name, imgDescription);
    try {
      const { rows } = await pool.query(sql, [type]);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in CateringsService.getByType()  \n\n' + e.stack);
      return { data: null, success: false, errors: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in CateringsService.getByType()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function search(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const keyword = req.params.keyword;
  const name = await defineName(lang, 'name');
  const imgDescription = await defineName(lang, 'img_description');

  if (!lang || !keyword) {
    console.log('Empty lang or keyword param in CateringsService.search()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (name && imgDescription) {
    const sql = format('SELECT id, %I AS "name", %I AS "imgDescription", date, img_src AS "imgSrc", guests_quantity AS "guestsQuantity", type FROM catering_event WHERE %I LIKE $1 OR %I LIKE $1 OR type LIKE $1 ORDER BY id', name, imgDescription, name, imgDescription);
    try {
      const { rows } = await pool.query(sql, ['%' + keyword + '%']);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in CateringsService.search()  \n\n' + e.stack);
      return { data: null, success: false, errors: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in CateringsService.search()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

async function getFeedbacksForOneEvent(req) {
  const pool = db.pool;
  const lang = req.params.lang;
  const eventId = req.params.id;
  const firstName = await defineName(lang, 'first_name');
  const lastName = await defineName(lang, 'last_name');
  const role = await defineName(lang, 'role');
  const feedback = await defineName(lang, 'feedback');

  if (!lang || !eventId) {
    console.log('Empty lang or eventId param in CateringsService.getFeedbacksForOneEvent()!');
    return { data: null, success: false, errors: { code: 10 } };
  }

  if (firstName && lastName && role && feedback) {
    const sql = format('SELECT cf.id, event_id AS "eventId", cf.%I AS "firstName", cf.%I AS "lastName", cf.%I AS "role", cf.%I AS "text" FROM catering_event_feedbacks INNER JOIN catering_feedbacks cf on feedback_id = cf.id INNER JOIN catering_event ce on event_id = ce.id WHERE event_id = $1 ORDER BY cf.id', firstName, lastName, role, feedback);
    try {
      const { rows } = await pool.query(sql, [eventId]);
      return { data: rows, success: true, errors: null };
    } catch (e) {
      console.log('Querying failure in CateringsService.getFeedbacksForOneEvent()  \n\n' + e.stack);
      return { data: null, success: false, errors: { code: 500 } };
    }
  } else {
    console.log('Querying formatting failure in CateringsService.getFeedbacksForOneEvent()');
    return { data: null, success: false, errors: { code: 500 } };
  }
}

export default {
  getOne,
  getByType,
  getAll,
  search,
  getFeedbacksForOneEvent
};
