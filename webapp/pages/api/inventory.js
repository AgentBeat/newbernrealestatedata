const { getMonthsOfInventory } = require('../../lib/db');

export default function handler(req, res) {
  try {
    const inventory = getMonthsOfInventory();
    res.status(200).json(inventory);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch months of inventory data' });
  }
} 