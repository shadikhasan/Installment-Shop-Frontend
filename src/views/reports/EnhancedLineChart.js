import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Filler } from 'chart.js'; // Import the Filler plugin

// Register the Filler plugin
Chart.register(Filler);

// Register the other necessary components
Chart.register(...registerables);

// Register components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

const EnhancedLineChart = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>; // Show a fallback message if no data is provided
  }

  const totalPaid = data.reduce((acc, row) => acc + (row.installment_data?.total_paid || 0), 0);
  const totalDue = data.reduce((acc, row) => acc + (row.installment_data?.total_due || 0), 0);

  const chartData = {
    labels: data.map((row) => row.customer_username), // Customer usernames as x-axis labels
    datasets: [
      {
        label: 'Total Paid (৳)',
        data: data.map((row) => row.installment_data?.total_paid || 0),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)', // Hover effect
        hoverBorderColor: 'rgba(75, 192, 192, 1)', // Hover effect
      },
      {
        label: 'Total Due (৳)',
        data: data.map((row) => row.installment_data?.total_due || 0),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)', // Hover effect
        hoverBorderColor: 'rgba(255, 99, 132, 1)', // Hover effect
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Customer Payment Overview',
        font: { size: 18, weight: 'bold' },
        padding: { top: 10, bottom: 20 },
        color: '#222',
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ccc',
        borderWidth: 1,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          title: (context) => {
            return `Customer: ${context[0].label}`;
          },
          label: (context) => {
            const datasetLabel = context.dataset.label;
            const value = context.raw;

            if (datasetLabel === 'Total Paid (৳)') {
              const totalDue = data[context.dataIndex].installment_data?.total_due || 0;
              return `${datasetLabel}: ৳${parseFloat(value).toFixed(2)} | Total Due: ৳${parseFloat(totalDue).toFixed(2)}`;
            } else if (datasetLabel === 'Total Due (৳)') {
              const totalPaid = data[context.dataIndex].installment_data?.total_paid || 0;
              return `${datasetLabel}: ৳${parseFloat(value).toFixed(2)} | Total Paid: ৳${parseFloat(totalPaid).toFixed(2)}`;
            }
            return `${datasetLabel}: ৳${parseFloat(value).toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Customer Username',
          font: { size: 14 },
          color: '#666',
        },
        ticks: { color: '#444' },
        grid: { display: true, color: '#ddd' }, // Improved grid styling
      },
      y: {
        title: {
          display: true,
          text: 'Amount (৳)',
          font: { size: 14 },
          color: '#666',
        },
        ticks: { color: '#444' },
        grid: { color: '#f0f0f0' },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 1500, // Smooth transition for chart rendering
      easing: 'easeInOutQuad',
    },
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 mb-5" style={{ maxWidth: '700px', height: '350px' }}>
      <div className="top-info mb-4">
        <h5>Total Paid: ৳{totalPaid.toFixed(2)}</h5>
        <h5>Total Due: ৳{totalDue.toFixed(2)}</h5>
        <h6>Number of Customers: {data.length}</h6>
      </div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default EnhancedLineChart;
