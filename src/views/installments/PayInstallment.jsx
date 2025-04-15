import React, { useState } from 'react';
import { authAxios } from '../../axiosConfig';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col
} from 'react-bootstrap';
import { FaCreditCard } from 'react-icons/fa';

const PayInstallment = ({ installmentId }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      setMessage('');
      return;
    }

    authAxios
      .post(`/installments/pay/${installmentId}/`, { amount })
      .then(() => {
        setMessage('✅ Payment successful!');
        setError('');
        setAmount('');
      })
      .catch(() => {
        setError('❌ Payment failed. Please try again.');
        setMessage('');
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        {/* Increase column size for wider view */}
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-lg rounded-4">
            <Card.Header className="bg-success text-white d-flex align-items-center">
              <FaCreditCard className="me-2" />
              <h5 className="mb-0">Pay Installment</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="amount">
                  <Form.Label>Amount (৳)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter payment amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  Pay Now
                </Button>
              </Form>

              {message && <Alert variant="success" className="mt-3">{message}</Alert>}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PayInstallment;
