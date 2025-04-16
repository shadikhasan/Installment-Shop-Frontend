import React, { useEffect, useState, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { authAxios } from '../axiosConfig';
import { Card, CardBody, CardTitle, CardSubtitle, Spinner } from 'reactstrap'; // Added Spinner for loading

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const UserStatsChart = () => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get('/user-stats/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError('Failed to load user statistics.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // Prepare data for the chart
  const chartData = {
    labels: ['Total Users', 'Verified Users', 'Not Verified Users'],
    datasets: [
      {
        label: 'User Statistics',
        data: [
          userStats?.total_users || 0,
          userStats?.verified_users || 0,
          userStats?.not_verified_users || 0,
        ],
        backgroundColor: ['#2979ff', '#4caf50', '#ff9800'], // More vibrant and accessible colors
        borderColor: ['#1e88e5', '#388e3c', '#f57c00'],
        borderWidth: 1,
        barPercentage: 0.6, // Slightly wider bars
        categoryPercentage: 0.7, // Adjust spacing between bar groups
        hoverBackgroundColor: ['#64b5f6', '#81c784', '#ffb74d'],
        animation: {
          duration: 1200,
          easing: 'easeInOutCubic', // Smoother animation
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to resize based on its container
    plugins: {
      legend: {
        display: false, // Hide the legend as the labels are clear
      },
      title: {
        display: false, // Title is in the CardTitle
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 0.5,
        callbacks: {
          label: (tooltipItem) => {
            const total = userStats?.total_users || 1; // Avoid division by zero
            const percentage = (tooltipItem.raw / total) * 100;
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} (${percentage.toFixed(1)}%)`;
          },
          title: (tooltipItem) => tooltipItem[0].label,
        },
        animation: {
          duration: 300,
          easing: 'easeOutQuad',
        },
      },
      datalabels: {
        color: 'rgba(4, 15, 62, 0.8)',
        font: {
          size: 14,
        },
        formatter: (value) => {
          const total = userStats?.total_users || 1;
          const percentage = (value / total) * 100;
          return `${percentage.toFixed(0)}%`; // Display whole percentage
        },
        anchor: 'end',
        align: 'top',
        offset: 5,
        textAlign: 'center',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: Math.ceil((userStats?.total_users || 10) / 5), // Dynamic step size
          color: '#666',
        },
        grid: {
          borderColor: '#e0e0e0',
          borderDash: [2, 2],
          color: '#f5f5f5',
        },
      },
      x: {
        ticks: {
          color: '#666',
        },
        grid: {
          display: false,
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="chart-container mt-4 mb-4">
      <Card className="shadow-sm rounded-md border" style={{ backgroundColor: '#fff' }}>
        <CardBody className="p-3">
          <CardTitle tag="h6" className="text-center font-semibold text-gray-800 mb-2">
            User Statistics
          </CardTitle>
          <CardSubtitle className="text-center mb-3 text-gray-600">
            Breakdown of Total, Verified, and Unverified Users
          </CardSubtitle>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : userStats ? (
            <div style={{ height: '300px' }}> {/* Set a fixed height for better layout */}
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-center text-muted">No user statistics data available.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default UserStatsChart;