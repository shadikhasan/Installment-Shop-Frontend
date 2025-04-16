import React, { useState, useEffect } from 'react';
import { authAxios } from '../../axiosConfig';
import { Spinner, Alert, Table, Container, Row, Col, Form, Button } from 'react-bootstrap';

const AllInstallments = () => {
  const [installments, setInstallments] = useState([]);
  const [filteredInstallments, setFilteredInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of installments per page

  useEffect(() => {
    authAxios
      .get('/installments/')
      .then((response) => {
        setInstallments(response.data);
        setFilteredInstallments(response.data);
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

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter installments based on search query
    const filtered = installments.filter(
      (installment) =>
        installment.product_name.toLowerCase().includes(query) ||
        installment.status.toLowerCase().includes(query)
    );
    setFilteredInstallments(filtered);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredInstallments.length / itemsPerPage);
  const currentInstallments = filteredInstallments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search by product name or status"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>

      {!loading && !error && (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Serial No.</th>
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
              {currentInstallments.map((installment, index) => (
                <tr key={installment.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Serial Number */}
                  <td>{installment.product_name}</td>
                  <td>{installment.installment_number + 1}</td>
                  <td>{installment.paid_amount}</td>
                  <td>{installment.due_amount}</td>
                  <td>{formatDate(installment.due_date)}</td>
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
                  <td>{installment.payment_date ? formatDate(installment.payment_date) : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-4 mb-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? 'primary' : 'secondary'}
                onClick={() => handlePageChange(index + 1)}
                className="mx-1"
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default AllInstallments;
