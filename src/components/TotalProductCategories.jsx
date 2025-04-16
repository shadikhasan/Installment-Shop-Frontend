import React from 'react'
import { FaLaptop } from 'react-icons/fa'
import { useSpring, animated } from '@react-spring/web'

const TotalProductCategories = () => {
  const totalCategories = 4

  const { number } = useSpring({
    from: { number: 0 },
    to: { number: totalCategories },
    config: { duration: 1000 },
  })

  return (
    <div className="mt-4">
      <div>
        <div>
          <div className="card text-center border-success shadow-sm hover-card">
            <div className="card-body">
              <FaLaptop className="display-4 text-success mb-3" />
              <h5 className="card-title">Total Categories</h5>
              <h2 className="text-success">
                <animated.span>
                  {number.to((n) => Math.floor(n))}
                </animated.span>
              </h2>
            </div>
          </div>
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

export default TotalProductCategories
