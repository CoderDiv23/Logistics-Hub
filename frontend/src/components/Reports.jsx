import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const Reports = () => {
  const [reportType, setReportType] = useState('shipment')
  const [timeRange, setTimeRange] = useState('monthly')
  const [chartData, setChartData] = useState([])

  // Mock data for charts
  const mockShipmentData = {
    monthly: [
      { month: 'Jan', shipments: 40, delivered: 35, inTransit: 5 },
      { month: 'Feb', shipments: 30, delivered: 28, inTransit: 2 },
      { month: 'Mar', shipments: 50, delivered: 45, inTransit: 5 },
      { month: 'Apr', shipments: 45, delivered: 40, inTransit: 5 },
      { month: 'May', shipments: 60, delivered: 55, inTransit: 5 },
      { month: 'Jun', shipments: 55, delivered: 50, inTransit: 5 },
    ],
    quarterly: [
      { quarter: 'Q1', shipments: 120, delivered: 108, inTransit: 12 },
      { quarter: 'Q2', shipments: 160, delivered: 145, inTransit: 15 },
    ]
  }

  const mockCargoData = {
    monthly: [
      { month: 'Jan', cargo: 1200, delivered: 1100, pending: 100 },
      { month: 'Feb', cargo: 900, delivered: 850, pending: 50 },
      { month: 'Mar', cargo: 1500, delivered: 1400, pending: 100 },
      { month: 'Apr', cargo: 1300, delivered: 1200, pending: 100 },
      { month: 'May', cargo: 1800, delivered: 1700, pending: 100 },
      { month: 'Jun', cargo: 1600, delivered: 1500, pending: 100 },
    ],
    quarterly: [
      { quarter: 'Q1', cargo: 3600, delivered: 3350, pending: 250 },
      { quarter: 'Q2', cargo: 4700, delivered: 4400, pending: 300 },
    ]
  }

  useEffect(() => {
    // Simulate API call to fetch chart data based on report type and time range
    if (reportType === 'shipment') {
      setChartData(mockShipmentData[timeRange])
    } else if (reportType === 'cargo') {
      setChartData(mockCargoData[timeRange])
    }
  }, [reportType, timeRange])

  const renderChart = () => {
    if (chartData.length === 0) return null

    // Find the maximum value for scaling
    const maxValue = Math.max(...chartData.map(item => 
      reportType === 'shipment' ? item.shipments : item.cargo
    ))

    return (
      <div className="border rounded p-4" style={{ height: '400px' }}>
        <div className="d-flex align-items-end h-100">
          {chartData.map((item, index) => {
            const label = reportType === 'shipment' ? item.month || item.quarter : item.month || item.quarter
            const totalValue = reportType === 'shipment' ? item.shipments : item.cargo
            const deliveredValue = reportType === 'shipment' ? item.delivered : item.delivered
            const pendingValue = reportType === 'shipment' ? item.inTransit : item.pending
            
            const totalHeight = (totalValue / maxValue) * 100
            const deliveredHeight = (deliveredValue / maxValue) * 100
            const pendingHeight = (pendingValue / maxValue) * 100
            
            return (
              <div key={index} className="me-4 text-center" style={{ width: '60px' }}>
                <div className="d-flex flex-column justify-content-end h-100">
                  <div 
                    className="bg-success mx-auto" 
                    style={{ 
                      width: '40px', 
                      height: `${deliveredHeight}%`,
                      minHeight: '2px'
                    }}
                  ></div>
                  <div 
                    className="bg-warning mx-auto" 
                    style={{ 
                      width: '40px', 
                      height: `${pendingHeight}%`,
                      minHeight: '2px'
                    }}
                  ></div>
                </div>
                <div className="mt-2">
                  <small>{label}</small>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Reports & Analytics</h1>
          <p>Comprehensive reporting and data visualization for your logistics operations.</p>
        </div>
      </div>

      {/* Report Controls */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <label htmlFor="reportType" className="form-label me-2">Report Type:</label>
            <select 
              id="reportType"
              className="form-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="shipment">Shipment Reports</option>
              <option value="cargo">Cargo Reports</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <label htmlFor="timeRange" className="form-label me-2">Time Range:</label>
            <select 
              id="timeRange"
              className="form-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>
                {reportType === 'shipment' ? 'Shipment Analytics' : 'Cargo Analytics'} - 
                {timeRange === 'monthly' ? ' Monthly View' : ' Quarterly View'}
              </h3>
            </div>
            <div className="card-body">
              {renderChart()}
              <div className="d-flex justify-content-center mt-3">
                <div className="me-4">
                  <span className="badge bg-success me-2">Delivered</span>
                </div>
                <div>
                  <span className="badge bg-warning me-2">Pending/In Transit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Shipments</h5>
              <p className="card-text display-4">124</p>
              <p className="card-text">+12% from last period</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">On-Time Delivery</h5>
              <p className="card-text display-4">94%</p>
              <p className="card-text">+3% from last period</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Cargo Volume</h5>
              <p className="card-text display-4">4,850</p>
              <p className="card-text">+8% from last period</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Avg. Delivery Time</h5>
              <p className="card-text display-4">2.1</p>
              <p className="card-text">Days (-0.3 from last period)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Detailed Report</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      {reportType === 'shipment' ? (
                        <>
                          <th>Period</th>
                          <th>Total Shipments</th>
                          <th>Delivered</th>
                          <th>In Transit</th>
                          <th>Delivery Rate</th>
                        </>
                      ) : (
                        <>
                          <th>Period</th>
                          <th>Total Cargo (kg)</th>
                          <th>Delivered (kg)</th>
                          <th>Pending (kg)</th>
                          <th>Utilization</th>
                        </>
                      )}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => (
                      <tr key={index}>
                        <td>{reportType === 'shipment' ? item.month || item.quarter : item.month || item.quarter}</td>
                        <td>{reportType === 'shipment' ? item.shipments : item.cargo}</td>
                        <td>{reportType === 'shipment' ? item.delivered : item.delivered}</td>
                        <td>{reportType === 'shipment' ? item.inTransit : item.pending}</td>
                        <td>
                          {reportType === 'shipment' ? 
                            `${Math.round((item.delivered / item.shipments) * 100)}%` : 
                            `${Math.round((item.delivered / item.cargo) * 100)}%`}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">View Details</button>
                          <button className="btn btn-sm btn-outline-secondary">Export</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports