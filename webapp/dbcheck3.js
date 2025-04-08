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

// List all tables with exact representation of characters
console.log('\n=== Tables in database (with character representation) ===');
let tables = [];
try {
  tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  if (tables.length === 0) {
    console.log('No tables found in the database!');
  } else {
    tables.forEach(table => {
      const name = table.name;
      // Show exact representation with characters and ASCII codes
      let charCodes = '';
      for (let i = 0; i < name.length; i++) {
        charCodes += name.charCodeAt(i) + ' ';
      }
      console.log(`- "${name}" (length: ${name.length}, char codes: ${charCodes})`);
    });
  }
} catch (error) {
  console.error('Error listing tables:', error.message);
}

// Try a simple query for each table to verify we can access it
console.log('\n=== Testing queries for each table ===');
for (const table of tables) {
  const tableName = table.name;
  console.log(`\nTesting table: "${tableName}"`);
  
  try {
    // Try with double quotes
    const doubleQuotesQuery = `SELECT COUNT(*) as count FROM "${tableName}"`;
    console.log(`Query with double quotes: ${doubleQuotesQuery}`);
    const doubleQuotesResult = db.prepare(doubleQuotesQuery).get();
    console.log(`  Success! Count: ${doubleQuotesResult.count}`);
  } catch (error) {
    console.error(`  Error with double quotes: ${error.message}`);
  }
  
  try {
    // Try with brackets
    const bracketsQuery = `SELECT COUNT(*) as count FROM [${tableName}]`;
    console.log(`Query with brackets: ${bracketsQuery}`);
    const bracketsResult = db.prepare(bracketsQuery).get();
    console.log(`  Success! Count: ${bracketsResult.count}`);
  } catch (error) {
    console.error(`  Error with brackets: ${error.message}`);
  }
}

// Close database
db.close(); 