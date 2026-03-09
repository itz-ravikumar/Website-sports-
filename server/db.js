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
const userCount = db.prepare('SELECT count(*) as count FROM users').get();
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
  insertUser.run('admin', 'admin', 'admin'); // Default admin
}

const userCount = db.prepare('SELECT count(*) as count FROM users').get();
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
  insertUser.run('admin', 'admin', 'admin'); // Default admin
}

const inventoryCount = db.prepare('SELECT count(*) as count FROM inventory').get();
if (inventoryCount.count === 0) {
  const insertItem = db.prepare('INSERT INTO inventory (name, totalQuantity, availableQuantity, condition) VALUES (?, ?, ?, ?)');
  insertItem.run('Football', 10, 8, 'Good');
  insertItem.run('Cricket Bat', 5, 5, 'Good');
  insertItem.run('Volleyball', 8, 8, 'Good');
  insertItem.run('Badminton Racket', 12, 10, 'Good');
}

// Helper functions for dashboard analytics
export const getDashboardStats = () => {
  const activeLoan = db.prepare('SELECT COUNT(*) as count FROM records WHERE status = ?').get('Active');
  const overdueItems = db.prepare('SELECT COUNT(*) as count FROM records WHERE status = ? AND expectedReturnDate < ?').get('Active', new Date().toISOString().split('T')[0]);
  const lowStockItems = db.prepare('SELECT COUNT(*) as count FROM inventory WHERE availableQuantity < 3');
  
  return {
    activeLoan: activeLoan?.count || 0,
    overdueItems: overdueItems?.count || 0,
    lowStock: lowStockItems?.count || 0,
    totalInventory: db.prepare('SELECT COUNT(*) as count FROM inventory').get()?.count || 0,
  };
};

export const getPopularItems = (limit = 5) => {
  return db.prepare(`
    SELECT itemName, COUNT(*) as requestCount
    FROM records
    WHERE status IN ('Active', 'Returned')
    GROUP BY itemName
    ORDER BY requestCount DESC
    LIMIT ?
  `).all(limit);
};

export const getInventoryStatus = () => {
  return db.prepare(`
    SELECT name, totalQuantity, availableQuantity, 
    ROUND((availableQuantity * 100.0) / totalQuantity, 2) as usagePercent
    FROM inventory
    ORDER BY usagePercent DESC
  `).all();
};

export default db;
