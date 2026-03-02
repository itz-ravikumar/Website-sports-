import express from 'express';
import db from '../db';

const router = express.Router();

// Get all requests
router.get('/', (req, res) => {
  const requests = db.prepare('SELECT * FROM requests').all();
  res.json(requests);
});

// Create new request
router.post('/', (req, res) => {
  const { studentName, rollNumber, branch, program, year, itemName, requestDate } = req.body;
  const insert = db.prepare('INSERT INTO requests (studentName, rollNumber, branch, program, year, itemName, requestDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const info = insert.run(studentName, rollNumber, branch, program, year, itemName, requestDate, 'Pending');
  res.json({ id: info.lastInsertRowid, studentName, rollNumber, branch, program, year, itemName, requestDate, status: 'Pending' });
});

// Approve request
router.put('/:id/approve', (req, res) => {
  const { id } = req.params;
  const update = db.prepare('UPDATE requests SET status = ? WHERE id = ?');
  update.run('Approved', id);
  res.json({ success: true });
});

// Reject request
router.put('/:id/reject', (req, res) => {
  const { id } = req.params;
  const update = db.prepare('UPDATE requests SET status = ? WHERE id = ?');
  update.run('Rejected', id);
  res.json({ success: true });
});

export default router;
