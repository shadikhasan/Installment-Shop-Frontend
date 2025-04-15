import React, { useState, useEffect } from 'react';
import AllInstallments from './AllInstallments';
import PayInstallment from './PayInstallment';
import { authAxios } from '../../axiosConfig';

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { FaMoneyBillWave } from 'react-icons/fa';

const InstallmentsPage = () => {
  const [nextInstallment, setNextInstallment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    authAxios
      .get('/installments/next-due/')
      .then((res) => {
        setNextInstallment(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load next due installment.');
        setLoading(false);
      });
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Your Installments</h1>

      <Row className="mt-4">
        <Col lg={12}>
          <Card className="shadow-sm rounded-4">
            <Card.Header className="bg-warning d-flex justify-content-between align-items-center">
              <strong>Next Due Installment</strong>
              {nextInstallment && (
                <Button variant="success" onClick={handleOpenModal}>
                  <FaMoneyBillWave className="me-1" />
                  Pay Now
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : nextInstallment ? (
                <table className="table table-bordered text-center">
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
                      <td>{nextInstallment.installment_number}</td>
                      <td>৳{parseFloat(nextInstallment.due_amount).toFixed(2)}</td>
                      <td>{new Date(nextInstallment.due_date).toLocaleDateString()}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <Alert variant="info">No due installments found.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <AllInstallments />
        </Col>
      </Row>


      {/* Modal for PayInstallment */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Pay Installment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            {nextInstallment && (
              <PayInstallment installmentId={nextInstallment.id} />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default InstallmentsPage;
