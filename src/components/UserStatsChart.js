import React, { useEffect, useState, useCallback } from 'react'
import FusionCharts from 'fusioncharts'
import Charts from 'fusioncharts/fusioncharts.charts'
import ReactFusioncharts from 'react-fusioncharts'
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.candy'

import { authAxios } from '../axiosConfig'
import { Card, CardBody, CardTitle, CardSubtitle, Spinner } from 'reactstrap'

// Resolve chart dependencies
Charts(FusionCharts)
FusionTheme(FusionCharts)

const UserStatsChart = () => {
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUserStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAxios.get('/user-stats/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      setUserStats(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching user stats:', err)
      setError('Failed to load user statistics.')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserStats()
  }, [fetchUserStats])

  const totalUsers = userStats?.total_users || 0
  const verifiedUsers = userStats?.verified_users || 0
  const unverifiedUsers = userStats?.not_verified_users || 0

  const getPercent = (value) => (totalUsers > 0 ? ((value / totalUsers) * 100).toFixed(1) : '0.0')

  const dataSource = {
    chart: {
      caption: 'User Statistics',
      subcaption: 'Current system status',
      yaxisname: 'Number of Users',
      theme: 'candy',
      showvalues: '1',
      use3DLighting: '1',
      rotatevalues: '0',
      animation: '1', // Enables animation
      animationDuration: '2', // 2-second entry animation
      tooltipbgcolor: '#333',
      tooltipbordercolor: '#888',
      tooltipborderthickness: '5',
      tooltippadding: '10',
    },
    data: [
      {
        label: 'Total Users',
        value: totalUsers,
        color: '#2979ff',
        labelFontColor: '#2979ff',
        tooltext: `<b>Total Users</b><br>Value: ${totalUsers}<br>Percentage: 100%`,
      },
      {
        label: 'Verified Users',
        value: verifiedUsers,
        color: '#4caf50',
        labelFontColor: '#4caf50',
        tooltext: `<b>Verified Users</b><br>Value: ${verifiedUsers}<br>Percentage: ${getPercent(
          verifiedUsers,
        )}% of Total`,
      },
      {
        label: 'Not Verified Users',
        value: unverifiedUsers,
        color: '#ff9800',
        labelFontColor: '#ff9800',
        tooltext: `<b>Not Verified Users</b><br>Value: ${unverifiedUsers}<br>Percentage: ${getPercent(
          unverifiedUsers,
        )}% of Total`,
      },
    ],
  }

  return (
    <div className="chart-container mt-4 mb-4 mx-3">
      <Card className="  border" style={{ backgroundColor: '#262A33' }}>
        <CardBody className="p-3">
          <CardTitle tag="h6" className="text-center font-semibold text-primary mb-2">
            User Statistics (3D)
          </CardTitle>

          <CardSubtitle className="text-center mb-3" style={{ fontSize: '0.95rem', color: '#555' }}>
            A quick overview of <span style={{ color: '#2979ff', fontWeight: 600 }}>Total</span>,{' '}
            <span style={{ color: '#4caf50', fontWeight: 600 }}>Verified</span>, and{' '}
            <span style={{ color: '#ff9800', fontWeight: 600 }}>Not Verified</span> users.
          </CardSubtitle>

          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : userStats ? (
            <ReactFusioncharts
              type="column3d"
              width="100%"
              height="400"
              dataFormat="JSON"
              dataSource={dataSource}
            />
          ) : (
            <p className="text-center text-muted">No user statistics data available.</p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default UserStatsChart
