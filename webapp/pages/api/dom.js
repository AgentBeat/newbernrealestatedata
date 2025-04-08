const { getDaysOnMarket } = require('../../lib/db');

export default function handler(req, res) {
  try {
    const dom = getDaysOnMarket();
    res.status(200).json(dom);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch days on market data' });
  }
} 