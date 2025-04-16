import React, { useEffect, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import axios from 'axios'
import { publicAxios } from '../axiosConfig'

const GlobalSummary = () => {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await publicAxios.get('/public/global-summary/')
        setSummary(response.data)
      } catch (error) {
        console.error('Error fetching global summary:', error)
      }
    }

    fetchSummary()
  }, [])

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">🌐 Global Summary</h3>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card text-center border-secondary shadow-sm hover-card">
            <div className="card-body">
              <FaBoxOpen className="display-4 text-secondary mb-3" />
              <h5 className="card-title">Total Products</h5>
              <h2 className="text-secondary">{summary?.total_products ?? '—'}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Add hover effect styles */}
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}

export default GlobalSummary
