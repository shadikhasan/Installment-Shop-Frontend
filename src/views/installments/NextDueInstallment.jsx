import React, { useState, useEffect } from 'react';
import { authAxios } from '../../axiosConfig';
import {
  Spinner,
  Alert,
  Table,
  Card,
  Button,
  Modal,
  Badge,
} from 'react-bootstrap';
import { FaClock, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import PayInstallment from './PayInstallment';

const NextDueInstallment = ({ refreshTrigger }) => {
  const [nextInstallment, setNextInstallment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    authAxios
      .get('/installments/next-due/')
      .then((response) => {
        if (response.data?.detail === 'No due installments found.') {
          setError('You have no due installments at the moment.');
          setNextInstallment(null);
        } else {
          setNextInstallment(response.data);
          setError('');
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('No next due installments found.');
        } else {
          setError('Failed to load next due installment');
        }
        setNextInstallment(null);
      })
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  const formatCurrency = (amount) => `৳${parseFloat(amount).toFixed(2)}`;
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderDaysLeftBadge = (dueDate) => {
    const daysLeft = getDaysLeft(dueDate);
    if (daysLeft > 5) {
      return <Badge bg="success">{daysLeft} days left</Badge>;
    } else if (daysLeft >= 1) {
      return <Badge bg="warning" text="dark">{daysLeft} days left</Badge>;
    } else if (daysLeft === 0) {
      return <Badge bg="danger">Due today!</Badge>;
    } else {
      return <Badge bg="danger">Overdue</Badge>;
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Card className="shadow-sm rounded-4">
        <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaClock className="me-2" />
            Next Due Installment
          </h5>
          {nextInstallment && (
            <Button variant="success" size="sm" onClick={handleOpenModal}>
              <FaMoneyBillWave className="me-1" />
              Pay Now
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="warning" />
              <p className="mt-2">Loading next due installment...</p>
            </div>
          ) : error ? (
            <Alert variant="info">{error}</Alert>
          ) : (
            nextInstallment && (
              <Table bordered responsive className="text-center">
                <thead className="table-light">
                  <tr>
                    <th>Product Name</th>
                    <th>Installment No.</th>
                    <th>Due Amount</th>
                    <th>Due Date</th>
                    <th>Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{nextInstallment.product_name}</td>
                    <td>
                      <Badge bg="primary">
                        {nextInstallment.installment_number + 1}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="info" text="dark">
                        {formatCurrency(nextInstallment.due_amount)}
                      </Badge>
                    </td>
                    <td>{formatDate(nextInstallment.due_date)}</td>
                    <td>{renderDaysLeftBadge(nextInstallment.due_date)}</td>
                  </tr>
                </tbody>
              </Table>
            )
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered size="md">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            Pay Installment <FaCreditCard />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {nextInstallment && (
            <div className="d-flex justify-content-center">
              <PayInstallment
                installmentId={nextInstallment.id}
                payAmount={nextInstallment.due_amount}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NextDueInstallment;
