const express = require('express');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all racks
router.get('/', async (req, res) => {
  try {
    const racks = await db.query(`
      SELECT r.*,
             COUNT(bc.copy_id) as total_books,
             COUNT(CASE WHEN bc.status = 'available' THEN 1 END) as available_books,
             COUNT(CASE WHEN bc.status = 'issued' THEN 1 END) as issued_books
      FROM racks r
      LEFT JOIN book_copies bc ON r.rack_number = bc.rack_number
      GROUP BY r.rack_id
      ORDER BY r.rack_number
    `);
    
    res.json(racks);
  } catch (error) {
    console.error('Get racks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get rack by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const racks = await db.query(`
      SELECT r.*,
             COUNT(bc.copy_id) as total_books,
             COUNT(CASE WHEN bc.status = 'available' THEN 1 END) as available_books,
             COUNT(CASE WHEN bc.status = 'issued' THEN 1 END) as issued_books
      FROM racks r
      LEFT JOIN book_copies bc ON r.rack_number = bc.rack_number
      WHERE r.rack_id = ?
      GROUP BY r.rack_id
    `, [id]);
    
    if (racks.length === 0) {
      return res.status(404).json({ error: 'Rack not found' });
    }
    
    // Get books in this rack
    const books = await db.query(`
      SELECT bc.*, b.title, b.author, b.isbn
      FROM book_copies bc
      JOIN books b ON bc.book_id = b.book_id
      WHERE bc.rack_number = ?
      ORDER BY bc.shelf_number, b.title
    `, [racks[0].rack_number]);
    
    res.json({
      rack: racks[0],
      books
    });
  } catch (error) {
    console.error('Get rack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new rack
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { rack_number, location, capacity, shelves } = req.body;
    
    if (!rack_number) {
      return res.status(400).json({ error: 'Rack number is required' });
    }
    
    // Check if rack number already exists
    const existingRacks = await db.query('SELECT rack_id FROM racks WHERE rack_number = ?', [rack_number]);
    if (existingRacks.length > 0) {
      return res.status(409).json({ error: 'Rack with this number already exists' });
    }
    
    const result = await db.query(`
      INSERT INTO racks (rack_number, location, capacity, shelves)
      VALUES (?, ?, ?, ?)
    `, [rack_number, location, capacity || 100, shelves || 5]);
    
    res.status(201).json({
      message: 'Rack added successfully',
      rackId: result.insertId
    });
  } catch (error) {
    console.error('Add rack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update rack
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rack_number, location, capacity, shelves } = req.body;
    
    // Check if rack exists
    const existingRacks = await db.query('SELECT rack_id, rack_number FROM racks WHERE rack_id = ?', [id]);
    if (existingRacks.length === 0) {
      return res.status(404).json({ error: 'Rack not found' });
    }
    
    // Check if rack number is being changed and if it conflicts
    if (rack_number && rack_number !== existingRacks[0].rack_number) {
      const conflictingRacks = await db.query('SELECT rack_id FROM racks WHERE rack_number = ? AND rack_id != ?', [rack_number, id]);
      if (conflictingRacks.length > 0) {
        return res.status(409).json({ error: 'Another rack with this number already exists' });
      }
    }
    
    await db.query(`
      UPDATE racks 
      SET rack_number = ?, location = ?, capacity = ?, shelves = ?
      WHERE rack_id = ?
    `, [rack_number, location, capacity, shelves, id]);
    
    res.json({ message: 'Rack updated successfully' });
  } catch (error) {
    console.error('Update rack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete rack
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if rack has any books
    const rackBooks = await db.query(`
      SELECT COUNT(*) as count 
      FROM book_copies bc
      JOIN racks r ON bc.rack_number = r.rack_number
      WHERE r.rack_id = ?
    `, [id]);
    
    if (rackBooks[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete rack that contains books' });
    }
    
    const result = await db.query('DELETE FROM racks WHERE rack_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rack not found' });
    }
    
    res.json({ message: 'Rack deleted successfully' });
  } catch (error) {
    console.error('Delete rack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get rack utilization statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        r.rack_number,
        r.location,
        r.capacity,
        COUNT(bc.copy_id) as current_books,
        ROUND((COUNT(bc.copy_id) / r.capacity) * 100, 2) as utilization_percentage,
        COUNT(CASE WHEN bc.status = 'available' THEN 1 END) as available_books,
        COUNT(CASE WHEN bc.status = 'issued' THEN 1 END) as issued_books
      FROM racks r
      LEFT JOIN book_copies bc ON r.rack_number = bc.rack_number
      GROUP BY r.rack_id, r.rack_number, r.location, r.capacity
      ORDER BY utilization_percentage DESC
    `);
    
    res.json(stats);
  } catch (error) {
    console.error('Get rack utilization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get books by rack and shelf
router.get('/rack/:rack_number/shelf/:shelf_number/books', async (req, res) => {
  try {
    const { rack_number, shelf_number } = req.params;
    
    const books = await db.query(`
      SELECT bc.*, b.title, b.author, b.isbn, b.category
      FROM book_copies bc
      JOIN books b ON bc.book_id = b.book_id
      WHERE bc.rack_number = ? AND bc.shelf_number = ?
      ORDER BY b.title
    `, [rack_number, shelf_number]);
    
    res.json(books);
  } catch (error) {
    console.error('Get books by location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

