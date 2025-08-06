const express = require('express');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all members
router.get('/', async (req, res) => {
  try {
    const { search, status, membership_type, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT m.*,
             COUNT(CASE WHEN i.status = 'issued' THEN 1 END) as books_issued,
             COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as books_overdue,
             COALESCE(SUM(CASE WHEN i.status IN ('issued', 'overdue') THEN i.fine_amount ELSE 0 END), 0) as total_fines
      FROM members m
      LEFT JOIN issues i ON m.member_id = i.member_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (search) {
      conditions.push('(m.first_name LIKE ? OR m.last_name LIKE ? OR m.email LIKE ? OR m.phone LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (status) {
      conditions.push('m.status = ?');
      params.push(status);
    }
    
    if (membership_type) {
      conditions.push('m.membership_type = ?');
      params.push(membership_type);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY m.member_id ORDER BY m.last_name, m.first_name';
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    
    const members = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM members m';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const countResult = await db.query(countQuery, params.slice(0, conditions.length));
    const total = countResult[0].total;
    
    res.json({
      members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const members = await db.query(`
      SELECT m.*,
             COUNT(CASE WHEN i.status = 'issued' THEN 1 END) as books_issued,
             COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as books_overdue,
             COALESCE(SUM(CASE WHEN i.status IN ('issued', 'overdue') THEN i.fine_amount ELSE 0 END), 0) as total_fines
      FROM members m
      LEFT JOIN issues i ON m.member_id = i.member_id
      WHERE m.member_id = ?
      GROUP BY m.member_id
    `, [id]);
    
    if (members.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    // Get member's issue history
    const issues = await db.query(`
      SELECT i.*, b.title, b.author, bc.rack_number, bc.shelf_number
      FROM issues i
      JOIN book_copies bc ON i.copy_id = bc.copy_id
      JOIN books b ON bc.book_id = b.book_id
      WHERE i.member_id = ?
      ORDER BY i.issue_date DESC
    `, [id]);
    
    // Get member's payment history
    const payments = await db.query(`
      SELECT * FROM payments
      WHERE member_id = ?
      ORDER BY payment_date DESC
    `, [id]);
    
    res.json({
      member: members[0],
      issues,
      payments
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new member
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      first_name, last_name, email, phone, address, city, state, zip_code,
      date_of_birth, membership_type, emergency_contact_name, emergency_contact_phone, notes
    } = req.body;
    
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }
    
    // Check if email already exists
    const existingMembers = await db.query('SELECT member_id FROM members WHERE email = ?', [email]);
    if (existingMembers.length > 0) {
      return res.status(409).json({ error: 'Member with this email already exists' });
    }
    
    const result = await db.query(`
      INSERT INTO members (
        first_name, last_name, email, phone, address, city, state, zip_code,
        date_of_birth, membership_type, emergency_contact_name, emergency_contact_phone, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      first_name, last_name, email, phone, address, city, state, zip_code,
      date_of_birth, membership_type, emergency_contact_name, emergency_contact_phone, notes
    ]);
    
    res.status(201).json({
      message: 'Member added successfully',
      memberId: result.insertId
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update member
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name, last_name, email, phone, address, city, state, zip_code,
      date_of_birth, membership_type, emergency_contact_name, emergency_contact_phone, notes, status
    } = req.body;
    
    // Check if member exists
    const existingMembers = await db.query('SELECT member_id FROM members WHERE member_id = ?', [id]);
    if (existingMembers.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    // Check if email is being changed and if it conflicts
    if (email) {
      const conflictingMembers = await db.query('SELECT member_id FROM members WHERE email = ? AND member_id != ?', [email, id]);
      if (conflictingMembers.length > 0) {
        return res.status(409).json({ error: 'Another member with this email already exists' });
      }
    }
    
    await db.query(`
      UPDATE members 
      SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip_code = ?,
          date_of_birth = ?, membership_type = ?, emergency_contact_name = ?, emergency_contact_phone = ?, notes = ?, status = ?
      WHERE member_id = ?
    `, [
      first_name, last_name, email, phone, address, city, state, zip_code,
      date_of_birth, membership_type, emergency_contact_name, emergency_contact_phone, notes, status, id
    ]);
    
    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete member
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if member has any active issues
    const activeIssues = await db.query(`
      SELECT COUNT(*) as count 
      FROM issues 
      WHERE member_id = ? AND status = 'issued'
    `, [id]);
    
    if (activeIssues[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete member with active book issues' });
    }
    
    const result = await db.query('DELETE FROM members WHERE member_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get member statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_members,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_members,
        COUNT(CASE WHEN status = 'Suspended' THEN 1 END) as suspended_members,
        COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_members
      FROM members
    `);
    
    const fineStats = await db.query(`
      SELECT COALESCE(SUM(i.fine_amount), 0) as total_fines
      FROM issues i
      WHERE i.status IN ('issued', 'overdue')
    `);
    
    res.json({
      ...stats[0],
      total_fines: fineStats[0].total_fines
    });
  } catch (error) {
    console.error('Get member stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

