import React, { useEffect, useState } from 'react'
import { authAxios } from '../axiosConfig'
import {
  FaShoppingCart,
  FaMoneyCheckAlt,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaHourglassHalf,
  FaBoxOpen,
} from 'react-icons/fa'

const UserSummary = () => {
  const [summary, setSummary] = useState(null)
  const [totalProducts, setTotalProducts] = useState(null)

  // Fetch user summary data
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await authAxios.get('/user/summary/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        setSummary(response.data)
      } catch (error) {
        console.error('Error fetching user summary:', error)
      }
    }

    // Fetch total products data
    const fetchTotalProducts = async () => {
      try {
        const response = await authAxios.get('/public/global-summary/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        setTotalProducts(response.data.total_products)
      } catch (error) {
        console.error('Error fetching total products:', error)
      }
    }

    fetchSummary()
    fetchTotalProducts()
  }, [])

  const cardData = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: <FaBoxOpen className="text-custom-product-bg" />,
      bg: 'primary',
    },
    {
      label: 'Total Purchase',
      value: summary?.total_purchase,
      icon: <FaShoppingCart className="text-primary" />,
      bg: 'primary',
    },
    {
      label: 'Total Paid',
      value: `৳ ${summary?.total_paid?.toFixed(2)}`,
      icon: <FaMoneyCheckAlt className="text-success" />,
      bg: 'success',
    },
    {
      label: 'Total Due',
      value: `৳ ${summary?.total_due?.toFixed(2)}`,
      icon: <FaFileInvoiceDollar className="text-danger" />,
      bg: 'danger',
    },
    {
      label: 'Installments Paid',
      value: summary?.installment_paid,
      icon: <FaCheckCircle className="text-info" />,
      bg: 'info',
    },
    {
      label: 'Installments Left',
      value: summary?.installment_left,
      icon: <FaHourglassHalf className="text-warning" />,
      bg: 'warning',
    },
  ]

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📊 Summary</h2>
      <div className="row g-4">
        {summary ? (
          cardData.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <div className={`card border-${item.bg} shadow-sm hover-card ${item.bg}`}>
                <div className="card-body text-center">
                  <div className="mb-3 display-5">{item.icon}</div>
                  <h5 className="card-title">{item.label}</h5>
                  <h3 className={`text-${item.bg}`}>{item.value}</h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Loading summary...</p>
          </div>
        )}
      </div>

      {/* Add custom color styles for 'Total Products' card */}
      <style>{`
        .custom-product-bg {
          bg:rgb(48, 44, 117); /* Custom color for background */
        }
        .text-custom-product-bg {
          color: #4b2b91; /* Custom color for the icon */
        }
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}

export default UserSummary
