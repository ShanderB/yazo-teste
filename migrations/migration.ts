const fs = require('fs');
const path = require('path');
import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!) //passando o "!" para dizer que a variável não é nula nunca.
  });
  

async function initializeDatabase() {
  const initScript = fs.readFileSync(path.join(__dirname, 'item.sql'), 'utf8');
  await pool.query(initScript);
}

initializeDatabase().catch(err => console.error(err));