import express from 'express';
import db from '../db';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  
  if (user) {
    const u = user as any;
    res.json({ success: true, user: { username: u.username, role: u.role } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

export default router;
