const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'employeedb',
  password: '123',
  port: 5432,
});

async function setupDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Creating employees table and inserting sample data...');
    await client.query(schema);
    console.log('Database setup completed successfully!');

    // Verify the setup
    const result = await client.query('SELECT COUNT(*) FROM employees');
    console.log(`Total employees in database: ${result.rows[0].count}`);

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

module.exports  = setupDatabase; 