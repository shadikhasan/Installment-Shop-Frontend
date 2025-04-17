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
} from 'react-bootstrap'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { authAxios } from '../../axiosConfig'

const Reports = () => {
  const [reportType, setReportType] = useState('weekly') // "weekly" or "monthly"
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Number of items per page

  useEffect(() => {
    setLoading(true)
    setError('')
    authAxios
      .get(`/reports/${reportType}/`) // Dynamically call API
      .then((response) => {
        setReportData(response.data)
        setLoading(false)
      })
      .catch(() => {
        setError(`Failed to load the ${reportType} report.`)
        setLoading(false)
      })
  }, [reportType])

  useEffect(() => {
    const filtered = reportData.filter(
      (row) =>
        row.customer_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.customer_email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page on new search
  }, [searchQuery, reportData])

  const exportToExcel = () => {
    const dataToExport = filteredData.map((row) => ({
      'Customer Id': row.customer_id,
      'Customer Username': row.customer_username,
      'Customer Email': row.customer_email,
      'Total Purchases': row.purchase_data.total_purchases,
      'Total Items': row.purchase_data.total_items,
      'Total Paid': row.installment_data.total_paid,
      'Total Due': row.installment_data.total_due,
      'Installment No.': row.installment_number,
      'Paid Amount': row.paid_amount,
      'Due Amount': row.due_amount,
      Status: row.status,
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, `${reportType} Report`)
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(data, `${reportType}_Report.xlsx`)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text(`${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Report`, 14, 15)

    const tableData = filteredData.map((row) => [
      row.customer_id,
      row.customer_username,
      row.customer_email,
      row.purchase_data.total_purchases.toFixed(2),
      row.purchase_data.total_items,
      row.installment_data.total_paid.toFixed(2),
      row.installment_data.total_due.toFixed(2),
      row.installment_number,
      row.paid_amount.toFixed(2),
      row.due_amount.toFixed(2),
      row.status,
    ])

    autoTable(doc, {
      head: [
        [
          'Customer ID',
          'Customer Username',
          'Customer Email',
          'Total Purchases',
          'Total Items',
          'Total Paid',
          'Total Due',
          'Installment No.',
          'Paid Amount',
          'Due Amount',
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

  return (
    <Container className="mt-5">
      
      <Row className="mb-4">
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
              {currentData.map((row, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Serial Number */}
                  <td>{row.customer_id}</td>
                  <td>{row.customer_username}</td>
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

          {/* Pagination Controls */}
          {filteredData.length > itemsPerPage && (
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={currentPage === index + 1}
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
            </div>
          )}
        </>
      )}
    </Container>
  )
}

export default Reports
