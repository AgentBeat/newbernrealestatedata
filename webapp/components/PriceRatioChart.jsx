import React, { useEffect, useState, useRef } from 'react';
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

const PriceRatioChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  
  // Create a mutable ref for the chart options that can be updated
  const chartOptions = useRef({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Sale/List Price Ratio',
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
              label += context.parsed.y.toFixed(1) + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 90,
        max: 104,
        ticks: {
          stepSize: 2,
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No price ratio data available");
      return;
    }

    console.log("Price ratio data:", data.length, "items");

    try {
      // Make a deep copy of the data to avoid mutation issues
      const dataCopy = JSON.parse(JSON.stringify(data));
      
      // Process data to ensure chronological order
      const processedData = dataCopy.map(item => ({
        ...item,
        sortDate: parseMonthYear(item['Month Year'])
      }));

      // Sort by date
      processedData.sort((a, b) => a.sortDate - b.sortDate);
      
      const labels = processedData.map(item => item['Month Year']);
      
      // No longer calculating dynamic y-axis range
      // Using fixed range from 90% to 104% with 2% increments
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Sale/List Price Ratio',
            data: processedData.map(item => parseFloat(item['Sale List Price %'] || 0)),
            borderColor: 'rgb(220, 38, 38)',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            tension: 0.3,
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error processing price ratio data:", error);
    }
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

  return (
    <div className="h-[400px]">
      {data && data.length > 0 ? (
        <Line data={chartData} options={chartOptions.current} />
      ) : (
        <div className="flex justify-center items-center h-full text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default PriceRatioChart; 