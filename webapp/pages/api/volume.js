const { getVolume } = require('../../lib/db');

export default function handler(req, res) {
  try {
    const volume = getVolume();
    res.status(200).json(volume);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch volume data' });
  }
} 