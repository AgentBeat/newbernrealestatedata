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

const MonthsOfInventoryChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No months of inventory data available");
      return;
    }

    console.log("Months of inventory data:", data);

    // Process data to ensure chronological order
    // Parse Month-Year format (e.g., "Mar-25" to a sortable date)
    const processedData = [...data].map(item => ({
      ...item,
      sortDate: parseMonthYear(item['Month Year'])
    }));

    // Sort by date
    processedData.sort((a, b) => a.sortDate - b.sortDate);
    
    const labels = processedData.map(item => item['Month Year']);
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Months of Inventory',
          data: processedData.map(item => parseFloat(item['Months Inventory'] || 0)),
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.3,
          fill: true,
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
        text: 'Months Of Inventory',
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
              label += context.parsed.y.toFixed(2) + ' months';
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
          callback: function(value) {
            return value.toFixed(1);
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

export default MonthsOfInventoryChart; 