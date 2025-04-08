import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceTrendsChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No price trends data available");
      return;
    }

    console.log("Price trends data:", data);

    // Process data to ensure chronological order
    // Parse Month-Year format (e.g., "Mar-25" to a sortable date)
    const processedData = [...data].map(item => ({
      ...item,
      sortDate: parseMonthYear(item['Month Year'])
    }));

    // Sort by date
    processedData.sort((a, b) => a.sortDate - b.sortDate);
    
    const labels = processedData.map(item => item['Month Year']);
    
    // Helper function to parse currency strings
    const parseCurrency = (value) => {
      if (!value) return null;
      return parseFloat(value.replace(/[$,\s]/g, ''));
    };

    setChartData({
      labels,
      datasets: [
        {
          label: 'Active Median List',
          data: processedData.map(item => parseCurrency(item['Active Median List'])),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
        },
        {
          label: 'Sold Median List',
          data: processedData.map(item => parseCurrency(item['Sold Median List'])),
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.3,
        },
        {
          label: 'Sold Median Sale',
          data: processedData.map(item => parseCurrency(item['Sold Median Sale'])),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
        },
      ],
    });
  }, [data]);

  // Helper function to parse Month-Year format
  const parseMonthYear = (monthYearStr) => {
    if (!monthYearStr) return new Date(0);
    
    const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    try {
      const [month, yearStr] = monthYearStr.split('-');
      const year = 2000 + parseInt(yearStr); // Assuming "25" means 2025
      return new Date(year, months[month], 1);
    } catch (error) {
      console.error("Error parsing date:", monthYearStr, error);
      return new Date(0);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Price Trends',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-[400px]">
      {data && data.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex justify-center items-center h-full text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default PriceTrendsChart; 