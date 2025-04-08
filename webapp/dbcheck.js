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
try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
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

// Check each table for schema
tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(table => {
  console.log(`\n=== Schema for ${table.name} ===`);
  try {
    const schema = db.prepare(`PRAGMA table_info([${table.name}])`).all();
    schema.forEach(column => {
      console.log(`- ${column.name} (${column.type})`);
    });
  } catch (error) {
    console.error(`Error fetching schema for ${table.name}:`, error.message);
  }
});

// Check Listings table content if it exists
try {
  console.log('\n=== Listings table data ===');
  const listingsTable = tables.find(t => t.name === 'Listings');
  
  if (listingsTable) {
    const listingsCount = db.prepare("SELECT COUNT(*) as count FROM [Listings]").get();
    console.log(`Total rows: ${listingsCount.count}`);
    
    if (listingsCount.count > 0) {
      const recentListings = db.prepare("SELECT * FROM [Listings] ORDER BY [Month Year] DESC LIMIT 3").all();
      console.log('Recent listings:');
      recentListings.forEach(listing => {
        console.log(listing);
      });
      
      const oldestListings = db.prepare("SELECT * FROM [Listings] ORDER BY [Month Year] ASC LIMIT 3").all();
      console.log('\nOldest listings:');
      oldestListings.forEach(listing => {
        console.log(listing);
      });
    } else {
      console.log('No data found in the Listings table!');
    }
  } else {
    console.log('Listings table does not exist!');
  }
} catch (error) {
  console.error('Error querying Listings table:', error.message);
}

// Close database
db.close(); 