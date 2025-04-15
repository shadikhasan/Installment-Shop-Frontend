import React, { useState, useEffect } from 'react';
import { authAxios } from '../../axiosConfig';
import { Spinner, Alert, Table, Container, Row, Col } from 'react-bootstrap';

const AllInstallments = () => {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    authAxios
      .get('/installments/')
      .then((response) => {
        setInstallments(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load installments.');
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
          <h2 className="text-center">All Installments</h2>
        </Col>
      </Row>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading installments...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Product Name</th>
              <th>Installment No.</th>
              <th>Paid Amount</th>
              <th>Due Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((installment) => (
              <tr key={installment.id}>
                <td>{installment.product_name}</td>
                <td>{installment.installment_number + 1}</td>
                <td>{installment.paid_amount}</td>
                <td>{installment.due_amount}</td>
                <td>{formatDate(installment.due_date)}</td> {/* Formatting due date */}
                <td>
                  <span
                    className={`badge ${
                      installment.status === 'paid'
                        ? 'bg-success'
                        : installment.status === 'due'
                        ? 'bg-warning text-dark'
                        : 'bg-danger'
                    }`}
                  >
                    {installment.status}
                  </span>
                </td>
                <td>{installment.payment_date ? formatDate(installment.payment_date) : 'N/A'}</td> {/* Formatting payment date */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AllInstallments;
