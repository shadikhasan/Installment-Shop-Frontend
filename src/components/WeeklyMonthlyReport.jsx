import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Alert, Table, Container, Row, Col } from 'react-bootstrap';

const WeeklyMonthlyReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data using axios
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/reports/weekly/') // Replace with the actual URL if needed
      .then((response) => {
        setReportData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load the report data.');
        setLoading(false);
      });
  }, []);

  // Function to format date to a readable string (e.g., "April 15, 2025")
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Weekly & Monthly Report</h2>
        </Col>
      </Row>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading report...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Customer Email</th>
              <th>Total Purchases</th>
              <th>Total Items</th>
              <th>Total Paid</th>
              <th>Total Due</th>
              <th>Installment Number</th>
              <th>Paid Amount</th>
              <th>Due Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index}>
                <td>{row.customer_email}</td>
                <td>{row.purchase_data.total_purchases.toFixed(2)}</td>
                <td>{row.purchase_data.total_items}</td>
                <td>{row.installment_data.total_paid.toFixed(2)}</td>
                <td>{row.installment_data.total_due.toFixed(2)}</td>
                <td>{row.installment_number}</td>
                <td>{row.paid_amount.toFixed(2)}</td>
                <td>{row.due_amount.toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${
                      row.status === 'paid'
                        ? 'bg-success'
                        : row.status === 'due'
                        ? 'bg-warning text-dark'
                        : 'bg-danger'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default WeeklyMonthlyReport;
