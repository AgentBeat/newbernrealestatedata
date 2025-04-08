const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Try multiple locations for the database file, prioritizing the data directory
const possiblePaths = [
  // Data directory (for Railway deployment)
  path.join(__dirname, '..', 'data', 'New Bern Data.db'),
  // Root of project
  path.join(__dirname, '..', 'New Bern Data.db'),
  // Parent directory 
  path.join(__dirname, '..', '..', 'New Bern Data.db'),
  // Current directory
  path.join(__dirname, 'New Bern Data.db')
];

let dbPath = null;
let foundPath = '';

// Try each path
for (const p of possiblePaths) {
  console.log('Checking for database at:', p);
  if (fs.existsSync(p)) {
    dbPath = p;
    foundPath = p;
    console.log('Found database at:', p);
    break;
  }
}

if (!dbPath) {
  const errMsg = 'Database file not found in any of the expected locations: ' + possiblePaths.join(', ');
  console.error(errMsg);
  throw new Error(errMsg);
}

// Initialize database connection
let db;
try {
  db = new Database(dbPath, { readonly: true });
  console.log('Connected to SQLite database successfully at:', foundPath);
} catch (error) {
  const errMsg = `Database connection error: ${error.message}`;
  console.error(errMsg);
  throw new Error(errMsg);
}

function getListings() {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    // Note: The table name has a trailing space
    return db.prepare('SELECT * FROM "Listings " ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    throw error;
  }
}

function getPriceTrends() {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    return db.prepare('SELECT * FROM "Price Trends" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching price trends:', error.message);
    throw error;
  }
}

function getListPriceRatio() {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    return db.prepare('SELECT * FROM "List Price Ratio" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching list price ratio:', error.message);
    throw error;
  }
}

function getDaysOnMarket() {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    return db.prepare('SELECT * FROM "DOM" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching days on market:', error.message);
    throw error;
  }
}

function getMonthsOfInventory() {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    return db.prepare('SELECT * FROM "Months of Inventory" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching months of inventory:', error.message);
    throw error;
  }
}

function getVolume() {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    return db.prepare('SELECT * FROM "Volume" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching volume:', error.message);
    throw error;
  }
}

module.exports = {
  getListings,
  getPriceTrends,
  getListPriceRatio,
  getDaysOnMarket,
  getMonthsOfInventory,
  getVolume,
  db
}; 