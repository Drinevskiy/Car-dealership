import pg from 'pg';
import config from 'config';

const POSTGRES_USER = config.get('POSTGRES_USER');
const POSTGRES_HOST = config.get('POSTGRES_HOST');
const POSTGRES_DATABASE = config.get('POSTGRES_DATABASE');
const POSTGRES_PASSWORD = config.get('POSTGRES_PASSWORD');
const POSTGRES_PORT = config.get('POSTGRES_PORT');

const { Pool } = pg;

const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT
  });
  
export default pool;