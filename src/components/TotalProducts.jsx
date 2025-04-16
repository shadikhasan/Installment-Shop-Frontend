import React, { useEffect, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import { useSpring, animated } from '@react-spring/web'
import { publicAxios } from '../axiosConfig'

const TotalProducts = () => {
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await publicAxios.get('/public/global-summary/')
        setTotalProducts(response.data.total_products || 0)
      } catch (error) {
        console.error('Error fetching global summary:', error)
      }
    }

    fetchSummary()
  }, [])

  const { number } = useSpring({
    from: { number: 0 },
    to: { number: totalProducts },
    config: { duration: 1000 }, // 1 second animation
  })

  return (
    <div className="mt-2">
      <div className="card text-center border-primary shadow-sm hover-card">
        <div className="card-body">
          <FaBoxOpen className="display-4 text-primary mb-3" />
          <h5 className="card-title">Total Products</h5>
          <h2 className="text-primary">
            <animated.span>
              {number.to((n) => Math.floor(n))}
            </animated.span>
          </h2>
        </div>
      </div>

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

export default TotalProducts
