const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Check root location first
const dbPath = path.join(__dirname, '..', 'New Bern Data.db');
const localDbPath = path.join(__dirname, 'New Bern Data.db');

let db;
try {
  if (fs.existsSync(dbPath)) {
    console.log('Using database at:', dbPath);
    db = new Database(dbPath, { readonly: true });
  } else if (fs.existsSync(localDbPath)) {
    console.log('Using database at:', localDbPath);
    db = new Database(localDbPath, { readonly: true });
  } else {
    console.error('Database not found!');
    process.exit(1);
  }
} catch (err) {
  console.error('Error opening database:', err);
  process.exit(1);
}

// List all tables
console.log('\n=== Tables in database ===');
let tables = [];
try {
  tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  if (tables.length === 0) {
    console.log('No tables found in the database!');
  } else {
    tables.forEach(table => {
      console.log(`- ${table.name}`);
    });
  }
} catch (error) {
  console.error('Error listing tables:', error.message);
}

// Look at Listings table specifically
const listingsTableName = tables.find(t => t.name === 'Listings' || t.name === 'Listings ')?.name;

if (listingsTableName) {
  // Get schema info
  console.log(`\n=== Schema for ${listingsTableName} ===`);
  try {
    const schema = db.prepare(`PRAGMA table_info([${listingsTableName}])`).all();
    schema.forEach(column => {
      console.log(`- ${column.name} (${column.type})`);
    });
  } catch (error) {
    console.error(`Error fetching schema for ${listingsTableName}:`, error.message);
  }

  // Try to count rows
  try {
    console.log(`\n=== Count data in ${listingsTableName} ===`);
    const count = db.prepare(`SELECT COUNT(*) as count FROM [${listingsTableName}]`).get();
    console.log(`Total rows: ${count.count}`);
  } catch (error) {
    console.error(`Error counting rows in ${listingsTableName}:`, error.message);
  }

  // Try to get sample data
  try {
    console.log(`\n=== Sample data from ${listingsTableName} ===`);
    const samples = db.prepare(`SELECT * FROM [${listingsTableName}] LIMIT 3`).all();
    console.log(samples);
  } catch (error) {
    console.error(`Error getting sample data from ${listingsTableName}:`, error.message);
  }

  // Try with different brackets
  try {
    console.log(`\n=== Another query attempt ===`);
    const sql = `SELECT * FROM "${listingsTableName}" LIMIT 3`;
    console.log(`Trying SQL: ${sql}`);
    const altSamples = db.prepare(sql).all();
    console.log(altSamples);
  } catch (error) {
    console.error(`Error with alternative query:`, error.message);
  }

  // Try with no brackets
  try {
    console.log(`\n=== Third query attempt ===`);
    const sql = `SELECT * FROM ${listingsTableName} LIMIT 3`;
    console.log(`Trying SQL: ${sql}`);
    const noQuotesSamples = db.prepare(sql).all();
    console.log(noQuotesSamples);
  } catch (error) {
    console.error(`Error with third query:`, error.message);
  }
} else {
  console.log('\nListings table not found in the database!');
}

// Close database
db.close(); 