const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Try multiple locations for the database file
const possiblePaths = [
  // Local path in the same directory
  path.join(__dirname, '..', 'New Bern Data.db'),
  // Root of project
  path.join(__dirname, '..', '..', 'New Bern Data.db'),
  // Current directory
  path.join(__dirname, 'New Bern Data.db'),
  // Absolute path (for local development)
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
  process.exit(1);
}

// Initialize database connection
let db;

try {
  db = new Database(dbPath, { readonly: true });
  console.log('Connected to SQLite database successfully at:', foundPath);
} catch (error) {
  console.error('Database connection error:', error.message);
  process.exit(1);
}

// Export functions
const exportData = () => {
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Export all tables to JSON files
  exportTable('listings', 'Listings ');
  exportTable('prices', 'Price Trends');
  exportTable('ratio', 'List Price Ratio');
  exportTable('dom', 'DOM');
  exportTable('inventory', 'Months of Inventory');
  exportTable('volume', 'Volume');

  console.log('All data exported successfully!');
  db.close();
};

// Function to export a specific table
function exportTable(filename, tableName) {
  try {
    const data = db.prepare(`SELECT * FROM "${tableName}" ORDER BY "Month Year" DESC`).all();
    
    // Write to file
    const filepath = path.join(__dirname, '..', 'public', 'data', `${filename}.json`);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    
    console.log(`Exported ${data.length} records from '${tableName}' to ${filepath}`);
  } catch (error) {
    console.error(`Error exporting '${tableName}':`, error.message);
  }
}

// Run the export
exportData(); 