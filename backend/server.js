// Load environment variables first
require('dotenv').config();

const express = require('express');
const sql = require('mssql/msnodesqlv8');

const app = express();
const port = process.env.PORT || 3000;

// SQL Server configuration using Windows Authentication
const dbConfig = {
  server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',  // fallback if env not loaded
  database: process.env.DB_NAME || 'logistics_hub',
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

// Create a persistent connection pool
let poolPromise = null;

async function initializeDb() {
  try {
    console.log('Connecting to SQL Server...');
    poolPromise = await sql.connect(dbConfig);
    console.log('✅ Connected to SQL Express!');
  } catch (err) {
    console.error('❌ DB Connection Failed:');
    console.error(err);
    process.exit(1); // Stop server if DB connection fails
  }
}

// Example route to test DB query
app.get('/test-query', async (req, res) => {
  try {
    if (!poolPromise) {
      return res.status(500).send('Database not initialized');
    }
    const result = await poolPromise.request()
      .query('SELECT TOP 5 * FROM Users'); // replace with your actual table
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});


app.get('/shipment', async (req, res) => {
  try {
    if (!poolPromise) {
      return res.status(500).send('Database not initialized');
    }
    const result = await poolPromise.request()
      .query('SELECT * FROM Shipments'); // replace with your actual table
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});





// Start server after DB initialized
initializeDb().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});
