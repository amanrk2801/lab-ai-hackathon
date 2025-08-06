const express = require('express');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all issues
router.get('/', async (req, res) => {
  try {
    const { status, member_id, overdue_only, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT i.*, 
             m.first_name, m.last_name, m.email, m.phone,
             b.title, b.author, b.isbn,
             bc.rack_number, bc.shelf_number
      FROM issues i
      JOIN members m ON i.member_id = m.member_id
      JOIN book_copies bc ON i.copy_id = bc.copy_id
      JOIN books b ON bc.book_id = b.book_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (status) {
      conditions.push('i.status = ?');
      params.push(status);
    }
    
    if (member_id) {
      conditions.push('i.member_id = ?');
      params.push(member_id);
    }
    
    if (overdue_only === 'true') {
      conditions.push('i.due_date < CURDATE() AND i.status = "issued"');
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY i.issue_date DESC';
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    
    const issues = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM issues i
      JOIN members m ON i.member_id = m.member_id
      JOIN book_copies bc ON i.copy_id = bc.copy_id
      JOIN books b ON bc.book_id = b.book_id
    `;
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const countResult = await db.query(countQuery, params.slice(0, conditions.length));
    const total = countResult[0].total;
    
    res.json({
      issues,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get overdue books (must come before /:id route)
router.get('/overdue', async (req, res) => {
  try {
    const overdueIssues = await db.query(`
      SELECT i.*, 
             m.first_name, m.last_name, m.email, m.phone,
             b.title, b.author, b.isbn,
             bc.rack_number, bc.shelf_number,
             DATEDIFF(CURDATE(), i.due_date) as days_overdue
      FROM issues i
      JOIN members m ON i.member_id = m.member_id
      JOIN book_copies bc ON i.copy_id = bc.copy_id
      JOIN books b ON bc.book_id = b.book_id
      WHERE i.due_date < CURDATE() AND i.status = 'issued'
      ORDER BY i.due_date ASC
    `);
    
    res.json(overdueIssues);
  } catch (error) {
    console.error('Get overdue books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get issue statistics (must come before /:id route)
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_issues,
        COUNT(CASE WHEN status = 'issued' THEN 1 END) as active_issues,
        COUNT(CASE WHEN status = 'returned' THEN 1 END) as returned_issues,
        COUNT(CASE WHEN status = 'overdue' OR (due_date < CURDATE() AND status = 'issued') THEN 1 END) as overdue_issues,
        COALESCE(SUM(fine_amount), 0) as total_fines
      FROM issues
    `);
    
    const todayStats = await db.query(`
      SELECT 
        COUNT(CASE WHEN issue_date = CURDATE() THEN 1 END) as issued_today,
        COUNT(CASE WHEN return_date = CURDATE() THEN 1 END) as returned_today
      FROM issues
    `);
    
    res.json({
      ...stats[0],
      ...todayStats[0]
    });
  } catch (error) {
    console.error('Get issue stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get issue by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const issues = await db.query(`
      SELECT i.*, 
             m.first_name, m.last_name, m.email, m.phone,
             b.title, b.author, b.isbn,
             bc.rack_number, bc.shelf_number
      FROM issues i
      JOIN members m ON i.member_id = m.member_id
      JOIN book_copies bc ON i.copy_id = bc.copy_id
      JOIN books b ON bc.book_id = b.book_id
      WHERE i.issue_id = ?
    `, [id]);
    
    if (issues.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(issues[0]);
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Issue a book (create new issue)
router.post('/', async (req, res) => {
  try {
    const { copy_id, member_id, due_date, notes } = req.body;
    
    if (!copy_id || !member_id || !due_date) {
      return res.status(400).json({ error: 'Copy ID, member ID, and due date are required' });
    }
    
    // Check if copy is available
    const copies = await db.query('SELECT status FROM book_copies WHERE copy_id = ?', [copy_id]);
    if (copies.length === 0) {
      return res.status(404).json({ error: 'Book copy not found' });
    }
    
    if (copies[0].status !== 'available') {
      return res.status(400).json({ error: 'Book copy is not available' });
    }
    
    // Check if member exists and is active
    const members = await db.query('SELECT status FROM members WHERE member_id = ?', [member_id]);
    if (members.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    if (members[0].status !== 'Active') {
      return res.status(400).json({ error: 'Member is not active' });
    }
    
    // Create the issue
    const result = await db.query(`
      INSERT INTO issues (copy_id, member_id, issue_date, due_date, notes)
      VALUES (?, ?, CURDATE(), ?, ?)
    `, [copy_id, member_id, due_date, notes]);
    
    // Update book copy status
    await db.query('UPDATE book_copies SET status = "issued" WHERE copy_id = ?', [copy_id]);
    
    // Update member last activity
    await db.query('UPDATE members SET last_activity = CURDATE() WHERE member_id = ?', [member_id]);
    
    res.status(201).json({
      message: 'Book issued successfully',
      issueId: result.insertId
    });
  } catch (error) {
    console.error('Issue book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Return a book (update issue)
router.put('/:id/return', async (req, res) => {
  try {
    const { id } = req.params;
    const { fine_amount = 0, notes } = req.body;
    
    // Check if issue exists and is active
    const issues = await db.query(`
      SELECT i.*, bc.copy_id 
      FROM issues i
      JOIN book_copies bc ON i.copy_id = bc.copy_id
      WHERE i.issue_id = ? AND i.status = 'issued'
    `, [id]);
    
    if (issues.length === 0) {
      return res.status(404).json({ error: 'Active issue not found' });
    }
    
    const issue = issues[0];
    
    // Update issue
    await db.query(`
      UPDATE issues 
      SET return_date = CURDATE(), status = 'returned', fine_amount = ?, notes = ?
      WHERE issue_id = ?
    `, [fine_amount, notes, id]);
    
    // Update book copy status
    await db.query('UPDATE book_copies SET status = "available" WHERE copy_id = ?', [issue.copy_id]);
    
    // Update member last activity
    await db.query('UPDATE members SET last_activity = CURDATE() WHERE member_id = ?', [issue.member_id]);
    
    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update issue (for fines, notes, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fine_amount, notes, status } = req.body;
    
    // Check if issue exists
    const existingIssues = await db.query('SELECT issue_id FROM issues WHERE issue_id = ?', [id]);
    if (existingIssues.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    const updates = [];
    const params = [];
    
    if (fine_amount !== undefined) {
      updates.push('fine_amount = ?');
      params.push(fine_amount);
    }
    
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }
    
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(id);
    
    await db.query(`UPDATE issues SET ${updates.join(', ')} WHERE issue_id = ?`, params);
    
    res.json({ message: 'Issue updated successfully' });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

