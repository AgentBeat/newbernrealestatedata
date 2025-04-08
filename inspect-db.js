const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./New Bern Data.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// Get all tables
db.all(`SELECT name FROM sqlite_master WHERE type='table'`, [], (err, tables) => {
  if (err) {
    console.error('Error getting tables:', err.message);
    closeDb();
    return;
  }
  
  console.log('Tables in database:');
  let tableProcessed = 0;

  tables.forEach(table => {
    console.log(`- ${table.name}`);
    
    // Get table schema - use quotes around table names to handle spaces
    db.all(`PRAGMA table_info("${table.name}")`, [], (err, columns) => {
      if (err) {
        console.error(`Error getting schema for table ${table.name}:`, err.message);
        tableProcessed++;
        if (tableProcessed === tables.length) {
          closeDb();
        }
        return;
      }
      
      console.log(`  Columns in ${table.name}:`);
      columns.forEach(col => {
        console.log(`    - ${col.name} (${col.type})`);
      });
      
      // Get sample data - use quotes around table names to handle spaces
      db.all(`SELECT * FROM "${table.name}" LIMIT 3`, [], (err, rows) => {
        if (err) {
          console.error(`Error getting sample data for table ${table.name}:`, err.message);
        } else {
          console.log(`  Sample data from ${table.name}:`);
          console.log(rows);
        }
        
        tableProcessed++;
        if (tableProcessed === tables.length) {
          closeDb();
        }
      });
    });
  });
});

function closeDb() {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
} 