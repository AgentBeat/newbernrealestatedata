const { getListPriceRatio } = require('../../lib/db');

export default function handler(req, res) {
  try {
    const ratio = getListPriceRatio();
    res.status(200).json(ratio);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch list price ratio data' });
  }
} 