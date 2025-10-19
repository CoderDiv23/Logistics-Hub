// test-db.js
require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const dbConfig = {
  server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
  database: process.env.DB_NAME || 'Logistics_hub',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

async function testConnection() {
  try {
    console.log('Connecting to SQL Server...');
    const pool = await sql.connect(dbConfig);
    console.log('✅ Connected to SQL Server!');
    await pool.close();
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

testConnection();
