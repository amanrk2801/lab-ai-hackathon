const express = require('express');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all books with their copies count
router.get('/', async (req, res) => {
  try {
    const { search, category, language, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT b.*, 
             COUNT(bc.copy_id) as total_copies,
             COUNT(CASE WHEN bc.status = 'available' THEN 1 END) as available_copies
      FROM books b
      LEFT JOIN book_copies bc ON b.book_id = bc.book_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (search) {
      conditions.push('(b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (category) {
      conditions.push('b.category = ?');
      params.push(category);
    }
    
    if (language) {
      conditions.push('b.language = ?');
      params.push(language);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY b.book_id ORDER BY b.title';
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    
    const books = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(DISTINCT b.book_id) as total FROM books b';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const countResult = await db.query(countQuery, params.slice(0, conditions.length));
    const total = countResult[0].total;
    
    res.json({
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const books = await db.query(`
      SELECT b.*, 
             COUNT(bc.copy_id) as total_copies,
             COUNT(CASE WHEN bc.status = 'available' THEN 1 END) as available_copies
      FROM books b
      LEFT JOIN book_copies bc ON b.book_id = bc.book_id
      WHERE b.book_id = ?
      GROUP BY b.book_id
    `, [id]);
    
    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Get book copies
    const copies = await db.query(`
      SELECT bc.*, r.location as rack_location
      FROM book_copies bc
      LEFT JOIN racks r ON bc.rack_number = r.rack_number
      WHERE bc.book_id = ?
      ORDER BY bc.rack_number, bc.shelf_number
    `, [id]);
    
    res.json({
      book: books[0],
      copies
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new book
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title, author, isbn, publisher, publication_year,
      category, language, description, rackNumber, shelfNumber, copies
    } = req.body;
    
    if (!title || !author || !isbn) {
      return res.status(400).json({ error: 'Title, author, and ISBN are required' });
    }
    
    // Check if ISBN already exists
    const existingBooks = await db.query('SELECT book_id FROM books WHERE isbn = ?', [isbn]);
    if (existingBooks.length > 0) {
      return res.status(409).json({ error: 'Book with this ISBN already exists' });
    }

    // Start transaction for book and copies
    await db.query('START TRANSACTION');

    try {
      // Insert book
      const result = await db.query(`
        INSERT INTO books (title, author, isbn, publisher, publication_year, category, language, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [title, author, isbn, publisher, publication_year, category, language, description]);

      const bookId = result.insertId;
      const numberOfCopies = parseInt(copies) || 1;

      // Create book copies
      for (let i = 0; i < numberOfCopies; i++) {
        await db.query(`
          INSERT INTO book_copies (book_id, rack_number, shelf_number, status)
          VALUES (?, ?, ?, 'available')
        `, [bookId, rackNumber || null, shelfNumber || null]);
      }

      await db.query('COMMIT');

      res.status(201).json({
        message: 'Book added successfully with copies',
        bookId: bookId,
        copiesCreated: numberOfCopies
      });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, author, isbn, publisher, publication_year,
      category, language, description
    } = req.body;
    
    // Check if book exists
    const existingBooks = await db.query('SELECT book_id FROM books WHERE book_id = ?', [id]);
    if (existingBooks.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Check if ISBN is being changed and if it conflicts
    if (isbn) {
      const conflictingBooks = await db.query('SELECT book_id FROM books WHERE isbn = ? AND book_id != ?', [isbn, id]);
      if (conflictingBooks.length > 0) {
        return res.status(409).json({ error: 'Another book with this ISBN already exists' });
      }
    }
    
    await db.query(`
      UPDATE books 
      SET title = ?, author = ?, isbn = ?, publisher = ?, publication_year = ?,
          category = ?, language = ?, description = ?
      WHERE book_id = ?
    `, [title, author, isbn, publisher, publication_year, category, language, description, id]);
    
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete book
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if book has any issued copies
    const issuedCopies = await db.query(`
      SELECT COUNT(*) as count 
      FROM issues i 
      JOIN book_copies bc ON i.copy_id = bc.copy_id 
      WHERE bc.book_id = ? AND i.status = 'issued'
    `, [id]);
    
    if (issuedCopies[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete book with issued copies' });
    }
    
    const result = await db.query('DELETE FROM books WHERE book_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get book categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.query('SELECT DISTINCT category FROM books WHERE category IS NOT NULL ORDER BY category');
    res.json(categories.map(row => row.category));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get book languages
router.get('/languages', async (req, res) => {
  try {
    const languages = await db.query('SELECT DISTINCT language FROM books WHERE language IS NOT NULL ORDER BY language');
    res.json(languages.map(row => row.language));
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

