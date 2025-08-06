const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      // Connect directly to the database (assumes it already exists)
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'library_management'
      });

      console.log('Connected to library_management database');
    } catch (error) {
      console.error('Database connection error:', error);
      console.log('\n💡 Tip: Run "node setup-database.js" first to set up the database');
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      // Handle transaction commands that don't support prepared statements
      const transactionCommands = ['START TRANSACTION', 'COMMIT', 'ROLLBACK', 'BEGIN'];
      const isTransactionCommand = transactionCommands.some(cmd => 
        sql.trim().toUpperCase().startsWith(cmd)
      );
      
      if (isTransactionCommand) {
        const [results] = await this.connection.query(sql);
        return results;
      } else {
        const [results] = await this.connection.execute(sql, params);
        return results;
      }
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}

module.exports = new Database();

