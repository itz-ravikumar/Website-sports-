import express from 'express';
import { getDashboardStats, getPopularItems, getInventoryStatus } from '../db.js';

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics including active loans, overdue items, and low stock counts
 */
router.get('/stats', (req, res) => {
  try {
    const stats = getDashboardStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/dashboard/popular-items
 * Returns the most frequently requested/issued items
 */
router.get('/popular-items', (req, res) => {
  try {
    const items = getPopularItems(req.query.limit || 5);
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/dashboard/inventory-status
 * Returns inventory status and usage percentages
 */
router.get('/inventory-status', (req, res) => {
  try {
    const inventory = getInventoryStatus();
    res.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
