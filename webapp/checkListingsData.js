const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Check root location first
const dbPath = path.join(__dirname, '..', 'New Bern Data.db');
let db;

try {
  if (fs.existsSync(dbPath)) {
    console.log('Using database at:', dbPath);
    db = new Database(dbPath, { readonly: true });
  } else {
    console.error('Database not found!');
    process.exit(1);
  }
} catch (err) {
  console.error('Error opening database:', err);
  process.exit(1);
}

// Get all listings data sorted by date
console.log('=== All Listings Data (sorted by date) ===');
try {
  // Get the data ordered by Month Year
  const listingsData = db.prepare(`
    SELECT * FROM "Listings " 
    ORDER BY 
      CASE 
        WHEN substr("Month Year", 1, 3) = 'Jan' THEN '01-' 
        WHEN substr("Month Year", 1, 3) = 'Feb' THEN '02-' 
        WHEN substr("Month Year", 1, 3) = 'Mar' THEN '03-' 
        WHEN substr("Month Year", 1, 3) = 'Apr' THEN '04-' 
        WHEN substr("Month Year", 1, 3) = 'May' THEN '05-' 
        WHEN substr("Month Year", 1, 3) = 'Jun' THEN '06-' 
        WHEN substr("Month Year", 1, 3) = 'Jul' THEN '07-' 
        WHEN substr("Month Year", 1, 3) = 'Aug' THEN '08-' 
        WHEN substr("Month Year", 1, 3) = 'Sep' THEN '09-' 
        WHEN substr("Month Year", 1, 3) = 'Oct' THEN '10-' 
        WHEN substr("Month Year", 1, 3) = 'Nov' THEN '11-'
        WHEN substr("Month Year", 1, 3) = 'Dec' THEN '12-'
      END || substr("Month Year", 5)
  `).all();
  
  console.log(`Total listings: ${listingsData.length}`);
  
  // Show oldest and newest data points
  const oldest = listingsData[0];
  const newest = listingsData[listingsData.length - 1];
  
  console.log('\nOldest data point:', oldest['Month Year']);
  console.log('Data for oldest month:');
  console.log(oldest);
  
  console.log('\nNewest data point:', newest['Month Year']);
  console.log('Data for newest month:');
  console.log(newest);
  
  // Print a compact list of all months in database
  console.log('\nAll months in database:');
  listingsData.forEach((row, index) => {
    console.log(`${index + 1}. ${row['Month Year']} - Active: ${row['Active Listings']}, New: ${row['New Listings']}, Pending: ${row['Pending Listings']}, Sold: ${row['Sold Listings']}`);
  });
  
} catch (error) {
  console.error('Error querying listings data:', error.message);
}

// Close database
db.close(); 