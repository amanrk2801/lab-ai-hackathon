-- Library Management System Database Schema

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'librarian',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books table
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
);

-- Racks table
CREATE TABLE IF NOT EXISTS racks (
    rack_id INT AUTO_INCREMENT PRIMARY KEY,
    rack_number VARCHAR(10) UNIQUE NOT NULL,
    location VARCHAR(255),
    capacity INT DEFAULT 100,
    shelves INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Book copies table
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
);

-- Members table
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
);

-- Issues table (book loans)
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
);

-- Payments table
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
);

-- Insert default admin user (required for system access)
INSERT IGNORE INTO users (email, password, role) VALUES 
('librarian@library.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'librarian');

