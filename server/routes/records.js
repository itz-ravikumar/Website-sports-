import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all records
router.get('/', (req, res) => {
  const records = db.prepare('SELECT * FROM records').all();
  res.json(records);
});

// Create new record
router.post('/', (req, res) => {
  const { studentName, rollNumber, branch, program, year, itemName, category, issueDate, expectedReturnDate, status } = req.body;
  const insert = db.prepare('INSERT INTO records (studentName, rollNumber, branch, program, year, itemName, category, issueDate, expectedReturnDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const info = insert.run(studentName, rollNumber, branch, program, year, itemName, category, issueDate, expectedReturnDate, status);
  res.json({ id: info.lastInsertRowid, studentName, rollNumber, branch, program, year, itemName, category, issueDate, expectedReturnDate, status });
});

// Update record status
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const update = db.prepare('UPDATE records SET status = ? WHERE id = ?');
  update.run(status, id);
  res.json({ success: true });
});

export default router;
