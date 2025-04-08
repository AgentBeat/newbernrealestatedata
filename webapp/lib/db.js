const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Try multiple locations for the database file
const possiblePaths = [
  // Root of project
  path.join(__dirname, '..', 'New Bern Data.db'),
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

// Create a mock database with sample data if real database not found
let db;
let usingMockData = false;

try {
  if (dbPath) {
    db = new Database(dbPath, { readonly: true });
    console.log('Connected to SQLite database successfully at:', foundPath);
  } else {
    // If database not found, use mock data
    console.log('Using mock data for development');
    usingMockData = true;
    
    // Mock database functions will return sample data instead
    db = null;
  }
} catch (error) {
  console.error('Database connection error:', error.message);
  usingMockData = true;
}

// Sample data for development if database isn't available
const mockData = {
  listings: [
    { 'Month Year': 'Mar-25', 'Active Listings': '349', 'New Listings': '158', 'Pending Listings': '152', 'Sold Listings': '105' },
    { 'Month Year': 'Feb-25', 'Active Listings': '307', 'New Listings': '149', 'Pending Listings': '111', 'Sold Listings': '86' },
    { 'Month Year': 'Jan-25', 'Active Listings': '277', 'New Listings': '114', 'Pending Listings': '111', 'Sold Listings': '88' },
    { 'Month Year': 'Dec-24', 'Active Listings': '282', 'New Listings': '86', 'Pending Listings': '86', 'Sold Listings': '99' },
    { 'Month Year': 'Nov-24', 'Active Listings': '264', 'New Listings': '118', 'Pending Listings': '82', 'Sold Listings': '111' },
    { 'Month Year': 'Oct-24', 'Active Listings': '258', 'New Listings': '122', 'Pending Listings': '91', 'Sold Listings': '108' },
    { 'Month Year': 'Sep-24', 'Active Listings': '251', 'New Listings': '115', 'Pending Listings': '89', 'Sold Listings': '102' },
    { 'Month Year': 'Aug-24', 'Active Listings': '245', 'New Listings': '110', 'Pending Listings': '95', 'Sold Listings': '115' },
    { 'Month Year': 'Jul-24', 'Active Listings': '240', 'New Listings': '105', 'Pending Listings': '98', 'Sold Listings': '118' },
    { 'Month Year': 'Jun-24', 'Active Listings': '238', 'New Listings': '120', 'Pending Listings': '105', 'Sold Listings': '122' },
    { 'Month Year': 'May-24', 'Active Listings': '235', 'New Listings': '125', 'Pending Listings': '112', 'Sold Listings': '128' },
    { 'Month Year': 'Apr-24', 'Active Listings': '230', 'New Listings': '130', 'Pending Listings': '115', 'Sold Listings': '130' }
  ],
  priceTrends: [
    { 'Month Year': 'Mar-25', 'Active Average List': '$373,332', 'Active Median List': '$337,800', 'Sold Average Sale': '$367,956', 'Sold Median Sale': '$336,310' },
    { 'Month Year': 'Feb-25', 'Active Average List': '$381,726', 'Active Median List': '$340,000', 'Sold Average Sale': '$338,735', 'Sold Median Sale': '$312,675' },
    { 'Month Year': 'Jan-25', 'Active Average List': '$371,262', 'Active Median List': '$338,000', 'Sold Average Sale': '$330,466', 'Sold Median Sale': '$327,875' },
    { 'Month Year': 'Dec-24', 'Active Average List': '$375,128', 'Active Median List': '$335,000', 'Sold Average Sale': '$342,557', 'Sold Median Sale': '$325,000' },
    { 'Month Year': 'Nov-24', 'Active Average List': '$374,558', 'Active Median List': '$334,950', 'Sold Average Sale': '$335,876', 'Sold Median Sale': '$315,000' }
  ],
  priceRatio: [
    { 'Month Year': 'Mar-25', 'Sale List Price %': '96.7' },
    { 'Month Year': 'Feb-25', 'Sale List Price %': '97.0' },
    { 'Month Year': 'Jan-25', 'Sale List Price %': '95.8' },
    { 'Month Year': 'Dec-24', 'Sale List Price %': '96.2' },
    { 'Month Year': 'Nov-24', 'Sale List Price %': '96.8' }
  ],
  dom: [
    { 'Month Year': 'Mar-25', 'Average ADOM': '60', 'Median ADOM': '29', 'Average CDOM': '60', 'Median CDOM': '29' },
    { 'Month Year': 'Feb-25', 'Average ADOM': '65', 'Median ADOM': '48', 'Average CDOM': '70', 'Median CDOM': '48' },
    { 'Month Year': 'Jan-25', 'Average ADOM': '52', 'Median ADOM': '30', 'Average CDOM': '55', 'Median CDOM': '30' },
    { 'Month Year': 'Dec-24', 'Average ADOM': '68', 'Median ADOM': '41', 'Average CDOM': '71', 'Median CDOM': '41' },
    { 'Month Year': 'Nov-24', 'Average ADOM': '59', 'Median ADOM': '34', 'Average CDOM': '62', 'Median CDOM': '34' }
  ],
  inventory: [
    { 'Month Year': 'Mar-25', 'Months Inventory': '3.32' },
    { 'Month Year': 'Feb-25', 'Months Inventory': '3.57' },
    { 'Month Year': 'Jan-25', 'Months Inventory': '3.15' },
    { 'Month Year': 'Dec-24', 'Months Inventory': '2.85' },
    { 'Month Year': 'Nov-24', 'Months Inventory': '2.38' }
  ],
  volume: [
    { 'Month Year': 'Mar-25', 'Active Volume': '$130,292,874', 'New Volume': '$57,815,275', 'Sold Volume (Sale)': '$38,635,374' },
    { 'Month Year': 'Feb-25', 'Active Volume': '$117,189,767', 'New Volume': '$51,549,377', 'Sold Volume (Sale)': '$29,131,231' },
    { 'Month Year': 'Jan-25', 'Active Volume': '$102,839,641', 'New Volume': '$44,686,029', 'Sold Volume (Sale)': '$29,081,048' },
    { 'Month Year': 'Dec-24', 'Active Volume': '$105,786,165', 'New Volume': '$31,307,984', 'Sold Volume (Sale)': '$33,913,164' },
    { 'Month Year': 'Nov-24', 'Active Volume': '$98,883,251', 'New Volume': '$44,153,924', 'Sold Volume (Sale)': '$37,282,262' }
  ]
};

function getListings() {
  try {
    if (usingMockData) {
      console.log('Using mock listings data');
      return mockData.listings;
    }
    
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    
    // Note: The table name has a trailing space
    return db.prepare('SELECT * FROM "Listings " ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    // Fall back to mock data on error
    console.log('Using mock listings data due to error');
    return mockData.listings;
  }
}

function getPriceTrends() {
  try {
    if (usingMockData) {
      return mockData.priceTrends;
    }
    
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "Price Trends" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching price trends:', error.message);
    return mockData.priceTrends; // Fallback to mock data on error
  }
}

function getListPriceRatio() {
  try {
    if (usingMockData) {
      return mockData.priceRatio;
    }
    
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "List Price Ratio" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching list price ratio:', error.message);
    return mockData.priceRatio; // Fallback to mock data on error
  }
}

function getDaysOnMarket() {
  try {
    if (usingMockData) {
      return mockData.dom;
    }
    
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "DOM" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching days on market:', error.message);
    return mockData.dom; // Fallback to mock data on error
  }
}

function getMonthsOfInventory() {
  try {
    if (usingMockData) {
      return mockData.inventory;
    }
    
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "Months of Inventory" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching months of inventory:', error.message);
    return mockData.inventory; // Fallback to mock data on error
  }
}

function getVolume() {
  try {
    if (usingMockData) {
      return mockData.volume;
    }
    
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    return db.prepare('SELECT * FROM "Volume" ORDER BY "Month Year" DESC').all();
  } catch (error) {
    console.error('Error fetching volume:', error.message);
    return mockData.volume; // Fallback to mock data on error
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