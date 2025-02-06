// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // usuário
  host: 'localhost',
  database: 'pizzaria',        
  password: 'user',       // senha
  port: 5432,                  // porta padrão do PostgreSQL
});

pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL.');
});

pool.on('error', (err) => {
  console.error('Erro no banco de dados', err);
});

module.exports = pool;