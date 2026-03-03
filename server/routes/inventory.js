import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all inventory items
router.get('/', (req, res) => {
  const items = db.prepare('SELECT * FROM inventory').all();
  res.json(items);
});

// Add new item
router.post('/', (req, res) => {
  const { name, totalQuantity, availableQuantity, condition } = req.body;
  const insert = db.prepare('INSERT INTO inventory (name, totalQuantity, availableQuantity, condition) VALUES (?, ?, ?, ?)');
  const info = insert.run(name, totalQuantity, availableQuantity, condition);
  res.json({ id: info.lastInsertRowid, name, totalQuantity, availableQuantity, condition });
});

// Update item quantity
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { availableQuantity } = req.body;
  const update = db.prepare('UPDATE inventory SET availableQuantity = ? WHERE id = ?');
  update.run(availableQuantity, id);
  res.json({ success: true });
});

// Delete item
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const del = db.prepare('DELETE FROM inventory WHERE id = ?');
  del.run(id);
  res.json({ success: true });
});

export default router;
