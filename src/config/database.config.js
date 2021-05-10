import dotenv from 'dotenv';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const pg = require('pg');

dotenv.config({path: './.env'});

const pool = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASS,
  port: process.env.PGPORT,
  ssl: true
}).on('error', (err) => console.error('ERR:POSTGRESQL: ', err));

export default {
  pool: pool
};
