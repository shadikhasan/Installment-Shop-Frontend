import React, { useState, useEffect } from 'react';
import AllInstallments from './AllInstallments';
import NextDueInstallment from './NextDueInstallment';
import { Container, Row, Col } from 'react-bootstrap';

const InstallmentsPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">My Next Due</h1>

      <Row className="mb-4">
        <Col>
          <NextDueInstallment refreshTrigger={refreshTrigger} />
        </Col>
      </Row>

      <Row>
        <Col>
          <AllInstallments refreshTrigger={refreshTrigger} />
        </Col>
      </Row>
    </Container>
  );
};

export default InstallmentsPage;
