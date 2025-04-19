import React from 'react'

const About = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          backgroundColor: '#fff',
        }}
      >
        <h2 style={{ color: '#007bff', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
          📄 Project Submission Details
        </h2>

        <section style={{ marginBottom: '1.5rem' }}>
          <h4>🔐 Admin Credentials</h4>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>
              <strong>Email:</strong> <code>admin@example.com</code>
            </li>
            <li>
              <strong>Password:</strong> <code>admin</code>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h4>🌐 Live URL</h4>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>
              <strong>Frontend:</strong>{' '}
              <a
                href="https://installment-shop-frontend.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                https://installment-shop-frontend.vercel.app/
              </a>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h4>📁 GitHub Repositories</h4>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>
              <a
                href="https://github.com/shadikhasan/installment-shop-backend"
                target="_blank"
                rel="noreferrer"
              >
                Backend Repo
              </a>
              <p style={{ marginLeft: '1.5rem', fontSize: '0.95rem', color: '#555' }}>
                This repository contains the backend of the Installment Shop project. It is built with Django and uses JWT authentication for secure user login and registration. The backend also provides an API for managing products, users, orders, and more.
              </p>
            </li>
            <li>
              <a
                href="https://github.com/shadikhasan/Installment-Shop-Frontend"
                target="_blank"
                rel="noreferrer"
              >
                Frontend Repo
              </a>
              <p style={{ marginLeft: '1.5rem', fontSize: '0.95rem', color: '#555' }}>
                The frontend is built with React, using React Router for navigation, and Bootstrap for styling. It communicates with the backend via API endpoints for handling user authentication and product management.
              </p>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h4>📌 Documentation & Downloads</h4>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>
              📄{' '}
              <a href="/erd.pdf" download>
                Download ERD (PDF)
              </a>
            </li>
            <li>
              📦{' '}
              <a href="/postman-collection.json" download>
                Download Postman Collection
              </a>
            </li>
            <li>
              📘{' '}
              <a
                href="https://documenter.getpostman.com/view/32760727/2sB2cd5dhS"
                target="_blank"
                rel="noreferrer"
              >
                View Postman API Documentation
              </a>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h4>🚀 Key Features</h4>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>OTP and Gmail-based user registration with email verification</li>
            <li>Comprehensive input validation and informative toast notifications</li>
            <li>User-friendly admin panel with searchable, paginated DataTables</li>
            <li>Real-time payment tracking with due/paid installment breakdown</li>
            <li>Weekly and monthly payment summary charts for admin reports</li>
            <li>Prevention of duplicate registrations and email reminders for due payments</li>
            <li>Many more features to enhance the user and admin experience</li>
          </ul>
        </section>

        <section>
          <h4>📬 Contact Info</h4>
          <p style={{ lineHeight: '1.6', paddingLeft: '1.5rem' }}>
            1. WhatsApp: <strong>+8801786120267</strong>
            <br />
            2. Email: <strong>shadik.sk420@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
