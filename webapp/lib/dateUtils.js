/**
 * Utility functions for working with dates in "Month-Year" format
 */

// Map for converting month names to numbers
const MONTH_TO_NUMBER = {
  'Jan': 1,
  'Feb': 2,
  'Mar': 3,
  'Apr': 4,
  'May': 5,
  'Jun': 6,
  'Jul': 7,
  'Aug': 8,
  'Sep': 9,
  'Oct': 10,
  'Nov': 11,
  'Dec': 12
};

// Map for converting numbers to month names
const NUMBER_TO_MONTH = {
  '1': 'Jan',
  '2': 'Feb',
  '3': 'Mar',
  '4': 'Apr',
  '5': 'May',
  '6': 'Jun',
  '7': 'Jul',
  '8': 'Aug',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec'
};

/**
 * Parse a Month-Year string (e.g. "Mar-25") into a Date object
 * @param {string} monthYearStr - Month-Year in format "MMM-YY"
 * @returns {Date} Corresponding Date object
 */
function parseMonthYear(monthYearStr) {
  if (!monthYearStr) return null;
  
  try {
    const [month, yearStr] = monthYearStr.split('-');
    const year = 2000 + parseInt(yearStr); // Assuming "25" means 2025
    
    // Month is 0-indexed in JS Date
    return new Date(year, MONTH_TO_NUMBER[month] - 1, 1);
  } catch (error) {
    console.error("Error parsing date:", monthYearStr, error);
    return null;
  }
}

/**
 * Format numeric month and year to Month-Year string (e.g. "Mar-25")
 * @param {number|string} month - Month (1-12)
 * @param {number|string} year - Full year (e.g. 2025)
 * @returns {string} Formatted Month-Year string
 */
function formatMonthYear(month, year) {
  // Handle two-digit year and ensure parameters are treated as numbers
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  const shortYear = yearNum % 100; // Get last two digits
  
  if (!NUMBER_TO_MONTH[monthNum]) {
    console.error(`Invalid month: ${month}`);
    return '';
  }
  
  return `${NUMBER_TO_MONTH[monthNum]}-${shortYear.toString().padStart(2, '0')}`;
}

/**
 * Filter data by date range
 * @param {Array} data - Array of objects with 'Month Year' property
 * @param {string} startMonth - Start month (1-12)
 * @param {string} startYear - Start year (e.g. 2024)
 * @param {string} endMonth - End month (1-12)
 * @param {string} endYear - End year (e.g. 2025)
 * @param {string} dataType - Optional type of data for debugging
 * @returns {Array} Filtered data within the date range
 */
function filterDataByDateRange(data, startMonth, startYear, endMonth, endYear, dataType = '') {
  if (!data || !data.length) {
    console.log(`No data to filter${dataType ? ` for ${dataType}` : ''}`);
    return [];
  }
  
  // Create a deep copy of the data to avoid reference issues
  const dataCopy = JSON.parse(JSON.stringify(data));
  
  // Convert inputs to numbers
  const startMonthNum = parseInt(startMonth);
  const startYearNum = parseInt(startYear);
  const endMonthNum = parseInt(endMonth);
  const endYearNum = parseInt(endYear);

  // Create Date objects for comparison
  const startDate = new Date(startYearNum, startMonthNum - 1, 1);
  const endDate = new Date(endYearNum, endMonthNum - 1, 1);
  
  console.log(`Filtering ${dataType} data from ${formatMonthYear(startMonth, startYear)} to ${formatMonthYear(endMonth, endYear)}`);
  console.log(`Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
  console.log(`Data before filtering: ${dataCopy.length} items`);
  
  // Filter data based on date range
  const filteredData = dataCopy.filter(item => {
    const itemDate = parseMonthYear(item['Month Year']);
    if (!itemDate) {
      console.warn(`Unable to parse date: ${item['Month Year']}`);
      return false;
    }
    
    const isInRange = itemDate >= startDate && itemDate <= endDate;
    return isInRange;
  });
  
  console.log(`Data after filtering: ${filteredData.length} items for ${dataType}`);
  
  // Sort the filtered data by date (chronological order)
  filteredData.sort((a, b) => {
    const dateA = parseMonthYear(a['Month Year']);
    const dateB = parseMonthYear(b['Month Year']);
    if (!dateA || !dateB) return 0;
    return dateA - dateB;
  });
  
  // If filtering returned no results, return the original data sorted chronologically
  if (filteredData.length === 0 && dataCopy.length > 0) {
    console.warn(`Filtering returned no results for ${dataType}. Using all available data sorted chronologically.`);
    
    // Sort the original data by date
    const sortedOriginalData = [...dataCopy].sort((a, b) => {
      const dateA = parseMonthYear(a['Month Year']);
      const dateB = parseMonthYear(b['Month Year']);
      if (!dateA || !dateB) return 0;
      return dateA - dateB;
    });
    
    return sortedOriginalData;
  }
  
  return filteredData;
}

/**
 * Get all unique Month-Year values from the data in chronological order
 * @param {Array} data - Array of objects with 'Month Year' property 
 * @returns {Array} Array of unique Month-Year values in chronological order
 */
function getUniqueMonthsYears(data) {
  if (!data || !data.length) return [];
  
  // Extract all unique Month-Year values
  const uniqueValues = new Set();
  data.forEach(item => {
    if (item['Month Year']) {
      uniqueValues.add(item['Month Year']);
    }
  });
  
  // Convert to array and sort
  return Array.from(uniqueValues)
    .map(val => ({ value: val, date: parseMonthYear(val) }))
    .sort((a, b) => a.date - b.date)
    .map(item => item.value);
}

/**
 * Get the current month and year values
 * @returns {Object} Object with current month (1-12) and year
 */
function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth() + 1, // JavaScript months are 0-indexed
    year: now.getFullYear()
  };
}

/**
 * Gets a default date range from one year before the most recent data point
 * @param {Array} data - Optional data array to determine the most recent date
 * @returns {Object} Object with start and end month/year
 */
function getDefaultDateRange(data = null) {
  // If data is provided, find the most recent date in the data
  if (data && data.length > 0) {
    // Find the most recent date in the data
    let mostRecentDate = null;
    
    for (const item of data) {
      const itemDate = parseMonthYear(item['Month Year']);
      if (itemDate && (!mostRecentDate || itemDate > mostRecentDate)) {
        mostRecentDate = itemDate;
      }
    }
    
    if (mostRecentDate) {
      // Calculate one year earlier
      const oneYearBefore = new Date(mostRecentDate);
      oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1);
      
      const result = {
        startMonth: (oneYearBefore.getMonth() + 1).toString(),
        startYear: oneYearBefore.getFullYear().toString(),
        endMonth: (mostRecentDate.getMonth() + 1).toString(),
        endYear: mostRecentDate.getFullYear().toString()
      };
      
      console.log("Default date range based on data:", result);
      return result;
    }
  }
  
  // Fallback to current date if no data or no valid dates found
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  const result = {
    startMonth: (oneYearAgo.getMonth() + 1).toString(),
    startYear: oneYearAgo.getFullYear().toString(),
    endMonth: (now.getMonth() + 1).toString(),
    endYear: now.getFullYear().toString()
  };
  
  console.log("Default date range (fallback):", result);
  return result;
}

module.exports = {
  parseMonthYear,
  formatMonthYear,
  filterDataByDateRange,
  getUniqueMonthsYears,
  getCurrentMonthYear,
  getDefaultDateRange
}; 