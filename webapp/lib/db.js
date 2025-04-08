const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Try multiple locations for the database file
const possiblePaths = [
  // Local path in the same directory (for deployment)
  path.join(__dirname, '..', 'New Bern Data.db'),
  // Root of project
  path.join(__dirname, '..', '..', 'New Bern Data.db'),
  // Parent directory 
  path.join(__dirname, '..', '..', 'New Bern Data.db'),
  // Current directory
  path.join(__dirname, 'New Bern Data.db'),
  // Absolute path 
  'C:/Users/ray/OneDrive/Documents/Dev/newbernrealestatedata/New Bern Data.db'
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
  console.error('Database file not found in any of the expected locations:', possiblePaths);
}

// Initialize database connection
let db;

try {
  if (dbPath) {
    db = new Database(dbPath, { readonly: true });
    console.log('Connected to SQLite database successfully at:', foundPath);
  } else {
    console.error('Database file not found');
    db = null;
  }
} catch (error) {
  console.error('Database connection error:', error.message);
  db = null;
}

function getListings() {
  try {
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    
    // Note: The table name has a trailing space
    return db.prepare('SELECT * FROM "Listings " ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    return [];
  }
}

function getPriceTrends() {
  try {
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "Price Trends" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching price trends:', error.message);
    return [];
  }
}

function getListPriceRatio() {
  try {
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "List Price Ratio" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching list price ratio:', error.message);
    return [];
  }
}

function getDaysOnMarket() {
  try {
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "DOM" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching days on market:', error.message);
    return [];
  }
}

function getMonthsOfInventory() {
  try {
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "Months of Inventory" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching months of inventory:', error.message);
    return [];
  }
}

function getVolume() {
  try {
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "Volume" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching volume:', error.message);
    return [];
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