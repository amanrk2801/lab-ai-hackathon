const express = require('express');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all book copies
router.get('/', async (req, res) => {
  try {
    const { book_id, status, rack_number, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT bc.*, b.title, b.author, b.isbn, r.location as rack_location
      FROM book_copies bc
      JOIN books b ON bc.book_id = b.book_id
      LEFT JOIN racks r ON bc.rack_number = r.rack_number
    `;
    
    const conditions = [];
    const params = [];
    
    if (book_id) {
      conditions.push('bc.book_id = ?');
      params.push(book_id);
    }
    
    if (status) {
      conditions.push('bc.status = ?');
      params.push(status);
    }
    
    if (rack_number) {
      conditions.push('bc.rack_number = ?');
      params.push(rack_number);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY b.title, bc.rack_number, bc.shelf_number';
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    
    const copies = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM book_copies bc
      JOIN books b ON bc.book_id = b.book_id
    `;
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const countResult = await db.query(countQuery, params.slice(0, conditions.length));
    const total = countResult[0].total;
    
    res.json({
      copies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get copies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get copy by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const copies = await db.query(`
      SELECT bc.*, b.title, b.author, b.isbn, r.location as rack_location
      FROM book_copies bc
      JOIN books b ON bc.book_id = b.book_id
      LEFT JOIN racks r ON bc.rack_number = r.rack_number
      WHERE bc.copy_id = ?
    `, [id]);
    
    if (copies.length === 0) {
      return res.status(404).json({ error: 'Book copy not found' });
    }
    
    // Get current issue if any
    const currentIssue = await db.query(`
      SELECT i.*, m.first_name, m.last_name, m.email
      FROM issues i
      JOIN members m ON i.member_id = m.member_id
      WHERE i.copy_id = ? AND i.status = 'issued'
    `, [id]);
    
    res.json({
      copy: copies[0],
      current_issue: currentIssue.length > 0 ? currentIssue[0] : null
    });
  } catch (error) {
    console.error('Get copy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new book copy
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { book_id, rack_number, shelf_number, status = 'available' } = req.body;
    
    if (!book_id) {
      return res.status(400).json({ error: 'Book ID is required' });
    }
    
    // Check if book exists
    const books = await db.query('SELECT book_id FROM books WHERE book_id = ?', [book_id]);
    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Check if rack exists (if provided)
    if (rack_number) {
      const racks = await db.query('SELECT rack_number FROM racks WHERE rack_number = ?', [rack_number]);
      if (racks.length === 0) {
        return res.status(404).json({ error: 'Rack not found' });
      }
    }
    
    const result = await db.query(`
      INSERT INTO book_copies (book_id, rack_number, shelf_number, status)
      VALUES (?, ?, ?, ?)
    `, [book_id, rack_number, shelf_number, status]);
    
    res.status(201).json({
      message: 'Book copy added successfully',
      copyId: result.insertId
    });
  } catch (error) {
    console.error('Add copy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update book copy
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rack_number, shelf_number, status } = req.body;
    
    // Check if copy exists
    const existingCopies = await db.query('SELECT copy_id FROM book_copies WHERE copy_id = ?', [id]);
    if (existingCopies.length === 0) {
      return res.status(404).json({ error: 'Book copy not found' });
    }
    
    // Check if rack exists (if provided)
    if (rack_number) {
      const racks = await db.query('SELECT rack_number FROM racks WHERE rack_number = ?', [rack_number]);
      if (racks.length === 0) {
        return res.status(404).json({ error: 'Rack not found' });
      }
    }
    
    // If changing status to something other than 'issued', check if copy is currently issued
    if (status && status !== 'issued') {
      const activeIssues = await db.query(`
        SELECT COUNT(*) as count 
        FROM issues 
        WHERE copy_id = ? AND status = 'issued'
      `, [id]);
      
      if (activeIssues[0].count > 0) {
        return res.status(400).json({ error: 'Cannot change status of currently issued book copy' });
      }
    }
    
    await db.query(`
      UPDATE book_copies 
      SET rack_number = ?, shelf_number = ?, status = ?
      WHERE copy_id = ?
    `, [rack_number, shelf_number, status, id]);
    
    res.json({ message: 'Book copy updated successfully' });
  } catch (error) {
    console.error('Update copy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete book copy
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if copy is currently issued
    const activeIssues = await db.query(`
      SELECT COUNT(*) as count 
      FROM issues 
      WHERE copy_id = ? AND status = 'issued'
    `, [id]);
    
    if (activeIssues[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete currently issued book copy' });
    }
    
    const result = await db.query('DELETE FROM book_copies WHERE copy_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book copy not found' });
    }
    
    res.json({ message: 'Book copy deleted successfully' });
  } catch (error) {
    console.error('Delete copy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available copies for a book
router.get('/book/:book_id/available', async (req, res) => {
  try {
    const { book_id } = req.params;
    
    const availableCopies = await db.query(`
      SELECT bc.*, r.location as rack_location
      FROM book_copies bc
      LEFT JOIN racks r ON bc.rack_number = r.rack_number
      WHERE bc.book_id = ? AND bc.status = 'available'
      ORDER BY bc.rack_number, bc.shelf_number
    `, [book_id]);
    
    res.json(availableCopies);
  } catch (error) {
    console.error('Get available copies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

