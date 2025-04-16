import React, { useState, useEffect } from 'react';
import { authAxios } from '../../axiosConfig';
import {
  Spinner,
  Alert,
  Table,
  Container,
  Row,
  Col,
  Form,
  Button
} from 'react-bootstrap';

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of purchases per page

  useEffect(() => {
    authAxios
      .get('/purchases/my/')
      .then((response) => {
        setPurchases(response.data);
        setFilteredPurchases(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load purchases.');
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

    // Filter purchases based on search query
    const filtered = purchases.filter(
      (purchase) =>
        purchase.product_name.toLowerCase().includes(query) ||
        purchase.status.toLowerCase().includes(query)
    );
    setFilteredPurchases(filtered);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const currentPurchases = filteredPurchases.slice(
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
          <h2 className="text-center">My Purchase History</h2>
        </Col>
      </Row>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading purchases...</p>
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
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>First Installment</th>
                <th>Installments</th>
                <th>Purchase Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPurchases.map((purchase, index) => (
                <tr key={purchase.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Serial Number */}
                  <td>{purchase.product}</td>
                  <td>{purchase.product_name}</td>
                  <td>{purchase.quantity}</td>
                  <td>৳{purchase.total_price}</td>
                  <td>৳{purchase.first_installment_amount}</td>
                  <td>{purchase.installment_count}</td>
                  <td>{formatDate(purchase.purchase_date)}</td>
                  <td>
                    <span
                      className={`badge ${
                        purchase.status === 'paid'
                          ? 'bg-success'
                          : 'bg-danger'
                      }`}
                    >
                      {purchase.status === 'paid' ? 'Paid' : 'Due'}
                    </span>
                  </td>
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

export default PurchaseHistory;
