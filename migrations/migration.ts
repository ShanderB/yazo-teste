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


async function initializeDatabase(): Promise<void> {
  const sqlFiles: string[] = fs.readdirSync(__dirname).filter((file: string) => file.endsWith('.sql'));

  for (const file of sqlFiles) {
    const initScript = fs.readFileSync(path.join(__dirname, file), 'utf8');
    await pool.query(initScript);
  }
}

initializeDatabase().then(() => {
    console.log('Database inicializado com sucesso!')
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });