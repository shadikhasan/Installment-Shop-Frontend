import React, { useState, useEffect } from 'react'
import { authAxios } from '../../axiosConfig'
import { Spinner, Alert, Table, Container, Row, Col, Card } from 'react-bootstrap'
import { FaClock } from 'react-icons/fa'

const NextDueInstallment = () => {
  const [nextInstallment, setNextInstallment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    authAxios
      .get('/installments/next-due/')
      .then((response) => {
        setNextInstallment(response.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load next due installment.')
        setLoading(false)
      })
  }, [])

  const formatCurrency = (amount) => `৳${parseFloat(amount).toFixed(2)}`

  // Function to format date to a readable string (e.g., "April 15, 2025")
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en-US', options)
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm rounded-4">
            <Card.Header className="bg-warning text-dark d-flex align-items-center justify-content-between">
              <h5 className="mb-0">
                <FaClock className="me-2" />
                Next Due Installment
              </h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-2">Loading next due installment...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : !nextInstallment ? (
                <Alert variant="info">No due installments found.</Alert>
              ) : (
                <Table bordered responsive className="text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Product Name</th>
                      <th>Installment No.</th>
                      <th>Due Amount</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{nextInstallment.product_name}</td>
                      <td>{nextInstallment.installment_number + 1}</td>
                      <td>{formatCurrency(nextInstallment.due_amount)}</td>
                      <td>{formatDate(nextInstallment.due_date)}</td> {/* Formatted date */}
                    </tr>
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default NextDueInstallment
