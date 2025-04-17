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

const PayInstallment = ({ installmentId, payAmount }) => {
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
    <Container className="m-4">
      <h2>Amount to Pay: ৳{payAmount}</h2>
      <Row className="justify-content-center">
        {/* Increase column size for wider view */}
        <Col>
          <div className="">
            
            <>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="amount">
                  
                  <Form.Control
                    type="number"
                    placeholder="Enter payment amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.00"
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
            </>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PayInstallment;
