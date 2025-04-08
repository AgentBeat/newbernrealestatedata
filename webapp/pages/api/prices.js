const { getPriceTrends } = require('../../lib/db');

export default function handler(req, res) {
  try {
    const prices = getPriceTrends();
    res.status(200).json(prices);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch price trends data' });
  }
} 