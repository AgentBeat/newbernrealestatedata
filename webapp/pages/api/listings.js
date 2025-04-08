const { getListings } = require('../../lib/db');

export default function handler(req, res) {
  try {
    const listings = getListings();
    res.status(200).json(listings);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch listings data' });
  }
} 