const express = require('express');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
  try {
    const { member_id, payment_type, date_from, date_to, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT p.*, m.first_name, m.last_name, m.email
      FROM payments p
      JOIN members m ON p.member_id = m.member_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (member_id) {
      conditions.push('p.member_id = ?');
      params.push(member_id);
    }
    
    if (payment_type) {
      conditions.push('p.payment_type = ?');
      params.push(payment_type);
    }
    
    if (date_from) {
      conditions.push('p.payment_date >= ?');
      params.push(date_from);
    }
    
    if (date_to) {
      conditions.push('p.payment_date <= ?');
      params.push(date_to);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY p.payment_date DESC';
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    
    const payments = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM payments p
      JOIN members m ON p.member_id = m.member_id
    `;
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const countResult = await db.query(countQuery, params.slice(0, conditions.length));
    const total = countResult[0].total;
    
    res.json({
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const payments = await db.query(`
      SELECT p.*, m.first_name, m.last_name, m.email, m.phone
      FROM payments p
      JOIN members m ON p.member_id = m.member_id
      WHERE p.payment_id = ?
    `, [id]);
    
    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(payments[0]);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Record new payment
router.post('/', async (req, res) => {
  try {
    const { member_id, amount, payment_type, payment_method, notes } = req.body;
    
    if (!member_id || !amount || !payment_type || !payment_method) {
      return res.status(400).json({ error: 'Member ID, amount, payment type, and payment method are required' });
    }
    
    // Check if member exists
    const members = await db.query('SELECT member_id FROM members WHERE member_id = ?', [member_id]);
    if (members.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    const result = await db.query(`
      INSERT INTO payments (member_id, amount, payment_date, payment_type, payment_method, notes)
      VALUES (?, ?, CURDATE(), ?, ?, ?)
    `, [member_id, amount, payment_type, payment_method, notes]);
    
    // Update member last activity
    await db.query('UPDATE members SET last_activity = CURDATE() WHERE member_id = ?', [member_id]);
    
    res.status(201).json({
      message: 'Payment recorded successfully',
      paymentId: result.insertId
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update payment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_type, payment_method, notes } = req.body;
    
    // Check if payment exists
    const existingPayments = await db.query('SELECT payment_id FROM payments WHERE payment_id = ?', [id]);
    if (existingPayments.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    await db.query(`
      UPDATE payments 
      SET amount = ?, payment_type = ?, payment_method = ?, notes = ?
      WHERE payment_id = ?
    `, [amount, payment_type, payment_method, notes, id]);
    
    res.json({ message: 'Payment updated successfully' });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete payment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM payments WHERE payment_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment reports
router.get('/reports', async (req, res) => {
  try {
    const { date_range = 'month' } = req.query;
    
    let dateCondition = '';
    switch (date_range) {
      case 'today':
        dateCondition = 'WHERE payment_date = CURDATE()';
        break;
      case 'week':
        dateCondition = 'WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)';
        break;
      case 'month':
        dateCondition = 'WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
        break;
      case 'quarter':
        dateCondition = 'WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)';
        break;
      case 'year':
        dateCondition = 'WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
        break;
    }
    
    // Total revenue and transaction count
    const summary = await db.query(`
      SELECT 
        COALESCE(SUM(amount), 0) as total_revenue,
        COUNT(*) as total_transactions,
        COALESCE(AVG(amount), 0) as avg_transaction
      FROM payments
      ${dateCondition}
    `);
    
    // Revenue breakdown by payment type
    const typeBreakdown = await db.query(`
      SELECT 
        payment_type,
        COALESCE(SUM(amount), 0) as amount,
        COUNT(*) as count
      FROM payments
      ${dateCondition}
      GROUP BY payment_type
      ORDER BY amount DESC
    `);
    
    // Revenue breakdown by payment method
    const methodBreakdown = await db.query(`
      SELECT 
        payment_method,
        COALESCE(SUM(amount), 0) as amount,
        COUNT(*) as count
      FROM payments
      ${dateCondition}
      GROUP BY payment_method
      ORDER BY amount DESC
    `);
    
    // Monthly trends (last 6 months)
    const monthlyTrends = await db.query(`
      SELECT 
        DATE_FORMAT(payment_date, '%Y-%m') as month,
        COALESCE(SUM(amount), 0) as revenue,
        COUNT(*) as transactions,
        COALESCE(AVG(amount), 0) as avg_transaction
      FROM payments
      WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
      ORDER BY month DESC
    `);
    
    // Recent transactions
    const recentTransactions = await db.query(`
      SELECT p.*, m.first_name, m.last_name
      FROM payments p
      JOIN members m ON p.member_id = m.member_id
      ORDER BY p.payment_date DESC, p.payment_id DESC
      LIMIT 10
    `);
    
    res.json({
      summary: summary[0],
      breakdown: {
        by_type: typeBreakdown,
        by_method: methodBreakdown
      },
      trends: monthlyTrends,
      recent_transactions: recentTransactions
    });
  } catch (error) {
    console.error('Get payment reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get member payment status
router.get('/member/:member_id/status', async (req, res) => {
  try {
    const { member_id } = req.params;
    
    // Check if member exists
    const members = await db.query('SELECT * FROM members WHERE member_id = ?', [member_id]);
    if (members.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    // Get payment history
    const payments = await db.query(`
      SELECT * FROM payments
      WHERE member_id = ?
      ORDER BY payment_date DESC
    `, [member_id]);
    
    // Get outstanding fines
    const fines = await db.query(`
      SELECT COALESCE(SUM(fine_amount), 0) as total_fines
      FROM issues
      WHERE member_id = ? AND status IN ('issued', 'overdue')
    `, [member_id]);
    
    // Calculate total paid
    const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    
    res.json({
      member: members[0],
      payment_history: payments,
      total_paid: totalPaid,
      outstanding_fines: fines[0].total_fines,
      last_payment: payments.length > 0 ? payments[0] : null
    });
  } catch (error) {
    console.error('Get member payment status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

