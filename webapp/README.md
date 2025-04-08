# New Bern Real Estate Market Data

An interactive web application for visualizing real estate market trends in New Bern, North Carolina.

## Features

- Interactive charts for different market metrics
- Tabbed navigation between different data visualizations
- Mobile-responsive design
- Real-time data from SQLite database

## Data Visualizations

- Number of Listings (Active, New, Pending, Sold)
- Price Trends
- Sale/List Price Ratios
- Days On Market
- Months of Inventory
- Volume

## Technologies Used

- Next.js for the frontend and API routes
- Chart.js for data visualization
- SQLite for database (using better-sqlite3)
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
```
npm install
```

### Running the Development Server

```
npm run dev
```

The application will be available at http://localhost:3000

### Building for Production

```
npm run build
npm start
```

## Project Structure

- `/components` - React components for charts and UI
- `/lib` - Database utilities
- `/pages` - Next.js pages and API routes
- `/public` - Static assets
- `/styles` - CSS styles (including Tailwind)

## Database Structure

The application uses an SQLite database with the following tables:

- Listings - Number of active, new, pending, and sold listings by month
- Price Trends - Average and median prices for different listing statuses
- List Price Ratio - Ratio of sale price to list price
- DOM - Days on market statistics
- Months of Inventory - Monthly inventory levels
- Volume - Transaction volume data

## Notes

This project reads data from a parent directory SQLite database file. Make sure the database is properly located before running the application. 