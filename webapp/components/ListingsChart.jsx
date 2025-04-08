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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ListingsChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No listings data available");
      return;
    }

    // Log the data to help with debugging
    console.log("ListingsChart received data:", {
      count: data.length,
      firstItem: data[0]['Month Year'],
      lastItem: data[data.length-1]['Month Year']
    });

    // Process data to ensure chronological order
    const processedData = [...data].map(item => ({
      ...item,
      sortDate: parseMonthYear(item['Month Year'])
    }));

    // Sort by date (chronological order)
    processedData.sort((a, b) => a.sortDate - b.sortDate);
    
    const labels = processedData.map(item => item['Month Year']);
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Active Listings',
          data: processedData.map(item => parseInt(item['Active Listings'] || 0)),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
        },
        {
          label: 'New Listings',
          data: processedData.map(item => parseInt(item['New Listings'] || 0)),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.3,
        },
        {
          label: 'Pending Listings',
          data: processedData.map(item => parseInt(item['Pending Listings'] || 0)),
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.3,
        },
        {
          label: 'Sold Listings',
          data: processedData.map(item => parseInt(item['Sold Listings'] || 0)),
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
        text: 'Number Of Listings',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          drawBorder: false,
        },
        ticks: {
          precision: 0,
        },
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

export default ListingsChart; 