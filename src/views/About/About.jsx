import React from 'react'

const About = () => {
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: '960px' }}>
        <div className="mb-5 text-center">
          <h2 className="text-primary fw-bold">📄 Project Submission Details</h2>
          <p className="text-muted fs-5">All key information about your project in one place</p>
        </div>

        {/* Admin Credentials */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">🔐 Admin Credentials</h5>
            <ul className="ps-3 mb-0">
              <li><strong>Email:</strong> <code>admin@example.com</code></li>
              <li><strong>Password:</strong> <code>admin</code></li>
            </ul>
          </div>
        </div>

        {/* Live URL */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">🌐 Live URL</h5>
            <ul className="ps-3 mb-0">
              <li>
                <strong>Frontend:</strong>{' '}
                <a href="https://installment-shop-frontend.vercel.app/" target="_blank" rel="noreferrer">
                  https://installment-shop-frontend.vercel.app/
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* GitHub Repos */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">📁 GitHub Repositories</h5>
            <ul className="ps-3 mb-0">
              <li className="mb-3">
                <a href="https://github.com/shadikhasan/installment-shop-backend" target="_blank" rel="noreferrer" className="fw-semibold">
                  Backend Repositories
                </a>
                <p className="text-muted small ps-3 mb-0">
                  Django backend with JWT authentication. Manages users, products, orders, and secure login.
                </p>
              </li>
              <li>
                <a href="https://github.com/shadikhasan/Installment-Shop-Frontend" target="_blank" rel="noreferrer" className="fw-semibold">
                  Frontend Repositories
                </a>
                <p className="text-muted small ps-3 mb-0">
                  React app with React Router and Bootstrap, fully integrated with backend APIs.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Documentation */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">📌 Documentation & Downloads</h5>
            <ul className="ps-3 mb-0">
              <li>📄 <a href="/erd.pdf" download>Download ERD (PDF)</a></li>
              <li>📦 <a href="/postman-collection.json" download>Download Postman Collection</a></li>
              <li>📘 <a href="https://documenter.getpostman.com/view/32760727/2sB2cd5dhS" target="_blank" rel="noreferrer">View Postman API Documentation</a></li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">🚀 Key Features</h5>
            <ul className="ps-3 mb-0">
              <li>OTP and Gmail-based user registration with email verification</li>
              <li>Comprehensive input validation with toast notifications</li>
              <li>Admin panel with searchable, paginated DataTables</li>
              <li>Real-time payment tracking with due/paid breakdown</li>
              <li>Visual weekly/monthly payment summaries</li>
              <li>Duplicate registration prevention and reminder emails</li>
              <li>And many more user-friendly enhancements</li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">📬 Contact Info</h5>
            <p className="ps-2 mb-0">
              1. WhatsApp: <strong>+8801786120267</strong><br />
              2. Email: <strong>shadik.sk420@gmail.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
