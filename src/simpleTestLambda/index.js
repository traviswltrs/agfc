const { Client } = require('pg');

exports.handler = async (event) => {
  // Replace with your database connection details or use environment variables
  const client = new Client({
    host: process.env.PG_HOST, // e.g., 'your-db-instance.amazonaws.com'
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: {
      rejectUnauthorized: false, // Use true if you validate the certificate
    },
  });

  try {
    // Connect to the database
    await client.connect();

    // Run a simple query to test connectivity
    const res = await client.query('SELECT 1 AS result');
    console.log('Query result:', res.rows);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Connection successful',
        queryResult: res.rows,
      }),
    };
  } catch (err) {
    console.error('Database connection error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Database connection failed',
        error: err.message,
      }),
    };
  } finally {
    // Close the database connection
    await client.end();
  }
};
