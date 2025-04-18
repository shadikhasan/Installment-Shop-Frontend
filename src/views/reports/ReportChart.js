import React from 'react'
import { CCard, CCardBody, CCardHeader, CContainer, CRow, CCol } from '@coreui/react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const ReportChart = ({ data }) => {
  console.log('report data: ', data)

  const chartData = {
    labels: data.map((item) => item.username),
    datasets: [
      {
        label: 'Total Paid Amount',
        data: data.map((item) => item.total_paid_amount),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Total Due Amount',
        data: data.map((item) => item.total_due_amount),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Customer Payment Overview',
        font: {
          size: 18,
        },
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Customer Username',
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
        },
        min: 0,
      },
    },
  }

  return (
    <CContainer fluid className="px-3 py-3">
      <CRow>
        <CCol xs={12}>
          <CCard className="shadow-sm border-0" style={{ height: '100%' }}>
            <CCardHeader className="bg-white">
              <h4 className="fw-bold mb-0">📊 Payment Report</h4> {/* Increased size */}
            </CCardHeader>
            <CCardBody style={{ height: '400px', padding: '0.5rem' }}>
              <div style={{ width: '100%', height: '100%' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ReportChart
