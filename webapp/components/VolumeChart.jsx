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

const VolumeChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No volume data available");
      return;
    }

    console.log("Volume data:", data);

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
          label: 'Active Volume',
          data: processedData.map(item => parseCurrency(item['Active Volume'])),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
        },
        {
          label: 'New Volume',
          data: processedData.map(item => parseCurrency(item['New Volume'])),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.3,
        },
        {
          label: 'Sold Volume (Sale)',
          data: processedData.map(item => parseCurrency(item['Sold Volume (Sale)'])),
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
        text: 'Volume',
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
                minimumFractionDigits: 0,
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
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (value >= 1000000) {
              return '$' + (value / 1000000).toFixed(1) + 'M';
            }
            return '$' + (value / 1000).toFixed(0) + 'K';
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

export default VolumeChart; 