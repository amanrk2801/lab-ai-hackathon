const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('Setting up Library Management Database...');
  
  try {
    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connected to MySQL server');

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS library_management');
    console.log('✅ Database "library_management" created/verified');

    // Close connection and reconnect to the specific database
    await connection.end();
    
    // Connect to the specific database
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'library_management',
      multipleStatements: true
    });
    
    console.log('✅ Connected to library_management database');

    // Create tables
    console.log('Creating tables...');

    // Users table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'librarian',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Books table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS books (
        book_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(20) UNIQUE NOT NULL,
        publisher VARCHAR(255),
        publication_year INT,
        category VARCHAR(100),
        language VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Books table created');

    // Racks table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS racks (
        rack_id INT AUTO_INCREMENT PRIMARY KEY,
        rack_number VARCHAR(10) UNIQUE NOT NULL,
        location VARCHAR(255),
        capacity INT DEFAULT 100,
        shelves INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Racks table created');

    // Book copies table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS book_copies (
        copy_id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT NOT NULL,
        rack_number VARCHAR(10),
        shelf_number VARCHAR(10),
        status ENUM('available', 'issued', 'damaged', 'lost') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
        FOREIGN KEY (rack_number) REFERENCES racks(rack_number) ON DELETE SET NULL
      )
    `);
    console.log('✅ Book copies table created');

    // Members table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS members (
        member_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(10),
        date_of_birth DATE,
        membership_type ENUM('standard', 'premium', 'student', 'senior') DEFAULT 'standard',
        emergency_contact_name VARCHAR(255),
        emergency_contact_phone VARCHAR(20),
        notes TEXT,
        status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
        join_date DATE DEFAULT (CURRENT_DATE),
        last_activity DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Members table created');

    // Issues table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS issues (
        issue_id INT AUTO_INCREMENT PRIMARY KEY,
        copy_id INT NOT NULL,
        member_id INT NOT NULL,
        issue_date DATE NOT NULL,
        due_date DATE NOT NULL,
        return_date DATE,
        status ENUM('issued', 'returned', 'overdue', 'lost') DEFAULT 'issued',
        fine_amount DECIMAL(10, 2) DEFAULT 0.00,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (copy_id) REFERENCES book_copies(copy_id) ON DELETE CASCADE,
        FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Issues table created');

    // Payments table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_type ENUM('fine', 'membership', 'other') NOT NULL,
        payment_method ENUM('cash', 'card', 'online', 'check') NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Payments table created');

    // Insert essential data
    console.log('Inserting essential data...');

    // Default admin user (required for system access)
    await dbConnection.execute(`
      INSERT IGNORE INTO users (email, password, role) VALUES 
      ('librarian@library.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'librarian')
    `);

    console.log('✅ Essential data inserted');

    await dbConnection.end();
    console.log('\n🎉 Database setup completed successfully!');
    console.log('You can now start the backend server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
