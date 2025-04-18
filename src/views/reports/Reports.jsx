import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Spinner,
  Alert,
  Table,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  InputGroup,
  FormControl,
  Pagination,
  Form,
} from 'react-bootstrap'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { authAxios } from '../../axiosConfig'
import ReportChart from './ReportChart' // Import the new chart component


const Reports = () => {
  const [reportType, setReportType] = useState('weekly') // "weekly" or "monthly"
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10) // Number of items per page

  useEffect(() => {
    setLoading(true)
    setError('')
    authAxios
      .get(`/reports/payment-summary/${reportType}/`) // Dynamically call API
      .then((response) => {
        setReportData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        if (error.response) {
          setError(`Error ${error.response.status}: ${error.response.data.message || 'Failed to load report.'}`)
        } else {
          setError('Network error, please try again later.')
        }
        setLoading(false)
      })
  }, [reportType])

  useEffect(() => {
    const filtered = reportData.filter(
      (row) =>
        (row.username?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (row.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page on new search
  }, [searchQuery, reportData])

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert('No data available to export.')
      return
    }

    const dataToExport = filteredData.map((row) => ({
      'Customer Id': row.id,
      'Customer Username': row.username,
      'Customer Email': row.email,
      'Total Paid Amount': row.total_paid_amount.toFixed(2),
      'Total Due Amount': row.total_due_amount.toFixed(2),
      'Total Purchase Count': row.total_purchase_count,
      'Total Product Quantity': row.total_product_quantity,
      'Total Installment Count': row.total_installment_count,
      'Fully Paid Purchases': row.fully_paid_purchases,
      'Due Purchases': row.due_purchases,
      Status: row.overall_status,
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, `${reportType} Report`)
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(data, `${reportType}_Report.xlsx`)
  }

  const exportToPDF = () => {
    if (filteredData.length === 0) {
      alert('No data available to export.')
      return
    }

    const doc = new jsPDF()
    doc.text(`${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Report`, 14, 15)

    const tableData = filteredData.map((row) => [
      row.id,
      row.username,
      row.email,
      row.total_paid_amount.toFixed(2),
      row.total_due_amount.toFixed(2),
      row.total_purchase_count,
      row.total_product_quantity,
      row.total_installment_count,
      row.fully_paid_purchases,
      row.due_purchases,
      row.overall_status,
    ])

    autoTable(doc, {
      head: [
        [
          'Customer ID',
          'Customer Username',
          'Customer Email',
          'Total Paid Amount',
          'Total Due Amount',
          'Total Purchase Count',
          'Total Product Quantity',
          'Total Installment Count',
          'Fully Paid Purchases',
          'Due Purchases',
          'Status',
        ],
      ],
      body: tableData,
      startY: 20,
    })

    doc.save(`${reportType}_Report.pdf`)
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(1) // Reset to first page
  }

  return (
    <Container className="mt-5">
      <ReportChart data={currentData} /> {/* Add the chart here */}
      <Row className="mb-4 mt-4">
        <Col className="text-center">
          <h2>{reportType === 'weekly' ? 'Weekly' : 'Monthly'} Report</h2>
        </Col>
      </Row>

      <Row className="mb-3 justify-content-between">
        <Col xs="auto">
          <ButtonGroup>
            <Button
              variant={reportType === 'weekly' ? 'primary' : 'outline-primary'}
              onClick={() => setReportType('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={reportType === 'monthly' ? 'primary' : 'outline-primary'}
              onClick={() => setReportType('monthly')}
            >
              Monthly
            </Button>
          </ButtonGroup>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={exportToExcel} className="me-2">
            Export to Excel
          </Button>
          <Button variant="danger" onClick={exportToPDF}>
            Export to PDF
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <InputGroup>
            <FormControl
              placeholder="Search by username or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shadow-sm"
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs="auto">
          <Form.Control as="select" value={itemsPerPage} onChange={handleItemsPerPageChange}>
            {[5, 10, 25, 50].map((number) => (
              <option key={number} value={number}>
                {number} per page
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading {reportType} report...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && filteredData.length > 0 && (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Serial No.</th>
                <th>Customer ID</th>
                <th>Customer Username</th>
                <th>Customer Email</th>
                <th>Total Paid Amount</th>
                <th>Total Due Amount</th>
                <th>Total Purchase Count</th>
                <th>Total Product Quantity</th>
                <th>Total Installment Count</th>
                <th>Fully Paid Purchases</th>
                <th>Due Purchases</th>
                <th>Overall Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{row.id}</td>
                  <td>{row.username}</td>
                  <td>{row.email}</td>
                  <td>{row.total_paid_amount.toFixed(2)}</td>
                  <td>{row.total_due_amount.toFixed(2)}</td>
                  <td>{row.total_purchase_count}</td>
                  <td>{row.total_product_quantity}</td>
                  <td>{row.total_installment_count}</td>
                  <td>{row.fully_paid_purchases}</td>
                  <td>{row.due_purchases}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.overall_status === 'paid'
                          ? 'bg-success'
                          : row.overall_status === 'due'
                          ? 'bg-warning text-dark'
                          : 'bg-danger'
                      }`}
                    >
                      {row.overall_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <Alert variant="warning">No data found matching your search criteria.</Alert>
      )}
    </Container>
  )
}

export default Reports
