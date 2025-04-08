import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to parse currency string to number
function parseCurrencyToNumber(currencyStr) {
  if (!currencyStr) return 0;
  return parseFloat(currencyStr.replace(/[$,]/g, ''));
}

// Helper function to parse "Month-Year" strings correctly
function parseMonthYear(monthYearStr) {
  if (!monthYearStr) return new Date(0);
  const [month, year] = monthYearStr.split('-');
  const monthIndex = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  return new Date(parseInt('20' + year), monthIndex[month], 1);
}

export default function VolumeChart({ data }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  // Format the chart data
  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No volume data available");
      return;
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      parseMonthYear(a['Month Year']) - parseMonthYear(b['Month Year'])
    );

    // Create labels from "Month Year" for each data point
    const labels = sortedData.map(item => item['Month Year']);

    // Ensure all data is parsed to numbers for the chart
    const activeVolumeData = sortedData.map(item => parseCurrencyToNumber(item['Active Volume']));
    const newVolumeData = sortedData.map(item => parseCurrencyToNumber(item['New Volume']));
    const soldVolumeData = sortedData.map(item => parseCurrencyToNumber(item['Sold Volume (Sale)']));

    // Set the state with our charts data
    setChartData({
      labels,
      datasets: [
        {
          label: 'Active Volume',
          data: activeVolumeData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.1
        },
        {
          label: 'New Volume',
          data: newVolumeData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.1
        },
        {
          label: 'Sold Volume',
          data: soldVolumeData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.1
        }
      ]
    });
  }, [data]);
  
  // Format large numbers for display
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return '$' + (value / 1000).toFixed(0) + 'K';
    }
    return '$' + value;
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Volume ($)',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const value = context.parsed.y;
              // Format the value as currency
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: formatYAxis
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
} 