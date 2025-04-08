import React from 'react';

const DateRangeSelector = ({ startMonth, startYear, endMonth, endYear, onStartMonthChange, onStartYearChange, onEndMonthChange, onEndYearChange, onFilterChange }) => {
  // Available options for dropdowns
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Generate year options (from 2020 to current year + 1)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2020; year <= currentYear + 1; year++) {
    years.push({ value: year.toString(), label: year.toString() });
  }

  // Styles to match the image
  const selectStyle = "border border-gray-300 rounded py-1 px-2 text-sm bg-white";
  const buttonStyle = "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium";
  
  return (
    <div className="flex items-center justify-center space-x-2 mb-4 text-gray-700 text-sm">
      <div className="flex items-center">
        <select
          value={startMonth}
          onChange={(e) => onStartMonthChange(e.target.value)}
          className={selectStyle}
        >
          {months.map((month) => (
            <option key={`start-${month.value}`} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center">
        <select
          value={startYear}
          onChange={(e) => onStartYearChange(e.target.value)}
          className={selectStyle}
        >
          {years.map((year) => (
            <option key={`start-${year.value}`} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
      </div>

      <span className="text-gray-500 mx-1">thru</span>

      <div className="flex items-center">
        <select
          value={endMonth}
          onChange={(e) => onEndMonthChange(e.target.value)}
          className={selectStyle}
        >
          {months.map((month) => (
            <option key={`end-${month.value}`} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center">
        <select
          value={endYear}
          onChange={(e) => onEndYearChange(e.target.value)}
          className={selectStyle}
        >
          {years.map((year) => (
            <option key={`end-${year.value}`} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onFilterChange}
        className={buttonStyle}
      >
        Go
      </button>
    </div>
  );
};

export default DateRangeSelector; 