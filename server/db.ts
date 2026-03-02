import Database from 'better-sqlite3';

const db = new Database('sports.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'student'
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    totalQuantity INTEGER DEFAULT 0,
    availableQuantity INTEGER DEFAULT 0,
    condition TEXT DEFAULT 'Good'
  );

  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentName TEXT,
    rollNumber TEXT,
    branch TEXT,
    program TEXT,
    year TEXT,
    itemName TEXT,
    requestDate TEXT,
    status TEXT DEFAULT 'Pending'
  );

  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentName TEXT,
    rollNumber TEXT,
    branch TEXT,
    program TEXT,
    year TEXT,
    itemName TEXT,
    category TEXT,
    issueDate TEXT,
    expectedReturnDate TEXT,
    status TEXT DEFAULT 'Active'
  );
`);

// Seed initial data if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
  insertUser.run('admin', 'admin', 'admin'); // Default admin
}

const inventoryCount = db.prepare('SELECT count(*) as count FROM inventory').get() as { count: number };
if (inventoryCount.count === 0) {
  const insertItem = db.prepare('INSERT INTO inventory (name, totalQuantity, availableQuantity, condition) VALUES (?, ?, ?, ?)');
  insertItem.run('Football', 10, 8, 'Good');
  insertItem.run('Cricket Bat', 5, 5, 'Good');
  insertItem.run('Volleyball', 8, 8, 'Good');
  insertItem.run('Badminton Racket', 12, 10, 'Good');
}

export default db;
