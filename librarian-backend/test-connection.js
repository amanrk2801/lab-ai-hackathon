const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'library_management'
    });

    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = ?', [process.env.DB_NAME]);
    console.log(`📊 Database contains ${rows[0].table_count} tables`);
    
    // List tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tables:', tables.map(row => Object.values(row)[0]).join(', '));
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
