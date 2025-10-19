import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const Reports = () => {
  const [reportType, setReportType] = useState('shipment')
  const [timeRange, setTimeRange] = useState('monthly')
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [exportFormat, setExportFormat] = useState('pdf')

  // Mock data for charts
  const mockShipmentData = {
    monthly: [
      { month: 'Jan', shipments: 40, delivered: 35, inTransit: 3, delayed: 2, revenue: 12000 },
      { month: 'Feb', shipments: 30, delivered: 28, inTransit: 1, delayed: 1, revenue: 9500 },
      { month: 'Mar', shipments: 50, delivered: 45, inTransit: 3, delayed: 2, revenue: 15000 },
      { month: 'Apr', shipments: 45, delivered: 40, inTransit: 3, delayed: 2, revenue: 13500 },
      { month: 'May', shipments: 60, delivered: 55, inTransit: 3, delayed: 2, revenue: 18000 },
      { month: 'Jun', shipments: 55, delivered: 50, inTransit: 3, delayed: 2, revenue: 16500 },
      { month: 'Jul', shipments: 65, delivered: 60, inTransit: 3, delayed: 2, revenue: 19500 },
      { month: 'Aug', shipments: 70, delivered: 65, inTransit: 3, delayed: 2, revenue: 21000 },
      { month: 'Sep', shipments: 60, delivered: 55, inTransit: 3, delayed: 2, revenue: 18000 },
      { month: 'Oct', shipments: 75, delivered: 70, inTransit: 3, delayed: 2, revenue: 22500 },
      { month: 'Nov', shipments: 80, delivered: 75, inTransit: 3, delayed: 2, revenue: 24000 },
      { month: 'Dec', shipments: 85, delivered: 80, inTransit: 3, delayed: 2, revenue: 25500 }
    ],
    quarterly: [
      { quarter: 'Q1', shipments: 120, delivered: 108, inTransit: 7, delayed: 5, revenue: 36500 },
      { quarter: 'Q2', shipments: 160, delivered: 145, inTransit: 9, delayed: 6, revenue: 48000 },
      { quarter: 'Q3', shipments: 195, delivered: 180, inTransit: 9, delayed: 6, revenue: 58500 },
      { quarter: 'Q4', shipments: 240, delivered: 225, inTransit: 9, delayed: 6, revenue: 72000 }
    ]
  }

  const mockCargoData = {
    monthly: [
      { month: 'Jan', cargo: 1200, delivered: 1100, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'Feb', cargo: 900, delivered: 850, pending: 25, inTransit: 25, weight: 'kg' },
      { month: 'Mar', cargo: 1500, delivered: 1400, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'Apr', cargo: 1300, delivered: 1200, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'May', cargo: 1800, delivered: 1700, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'Jun', cargo: 1600, delivered: 1500, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'Jul', cargo: 1900, delivered: 1800, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'Aug', cargo: 2100, delivered: 2000, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'Sep', cargo: 1800, delivered: 1700, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'Oct', cargo: 2200, delivered: 2100, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'Nov', cargo: 2400, delivered: 2300, pending: 50, inTransit: 50, weight: 'kg' },
      { month: 'Dec', cargo: 2500, delivered: 2400, pending: 50, inTransit: 50, weight: 'kg' }
    ],
    quarterly: [
      { quarter: 'Q1', cargo: 3600, delivered: 3350, pending: 125, inTransit: 125, weight: 'kg' },
      { quarter: 'Q2', cargo: 4700, delivered: 4400, pending: 150, inTransit: 150, weight: 'kg' },
      { quarter: 'Q3', cargo: 5800, delivered: 5500, pending: 150, inTransit: 150, weight: 'kg' },
      { quarter: 'Q4', cargo: 7100, delivered: 6800, pending: 150, inTransit: 150, weight: 'kg' }
    ]
  }

  const mockPerformanceData = {
    monthly: [
      { month: 'Jan', onTime: 92, efficiency: 88, customerSatisfaction: 4.2 },
      { month: 'Feb', onTime: 94, efficiency: 90, customerSatisfaction: 4.3 },
      { month: 'Mar', onTime: 90, efficiency: 85, customerSatisfaction: 4.1 },
      { month: 'Apr', onTime: 95, efficiency: 92, customerSatisfaction: 4.4 },
      { month: 'May', onTime: 93, efficiency: 89, customerSatisfaction: 4.3 },
      { month: 'Jun', onTime: 96, efficiency: 93, customerSatisfaction: 4.5 },
      { month: 'Jul', onTime: 94, efficiency: 91, customerSatisfaction: 4.4 },
      { month: 'Aug', onTime: 97, efficiency: 94, customerSatisfaction: 4.6 },
      { month: 'Sep', onTime: 95, efficiency: 92, customerSatisfaction: 4.5 },
      { month: 'Oct', onTime: 98, efficiency: 95, customerSatisfaction: 4.7 },
      { month: 'Nov', onTime: 96, efficiency: 93, customerSatisfaction: 4.6 },
      { month: 'Dec', onTime: 99, efficiency: 96, customerSatisfaction: 4.8 }
    ],
    quarterly: [
      { quarter: 'Q1', onTime: 92, efficiency: 88, customerSatisfaction: 4.2 },
      { quarter: 'Q2', onTime: 94.7, efficiency: 91.7, customerSatisfaction: 4.4 },
      { quarter: 'Q3', onTime: 95.3, efficiency: 92.3, customerSatisfaction: 4.5 },
      { quarter: 'Q4', onTime: 97.7, efficiency: 95, customerSatisfaction: 4.7 }
    ]
  }

  useEffect(() => {
    // Simulate API call to fetch chart data based on report type and time range
    setLoading(true)
    setTimeout(() => {
      if (reportType === 'shipment') {
        setChartData(mockShipmentData[timeRange])
      } else if (reportType === 'cargo') {
        setChartData(mockCargoData[timeRange])
      } else if (reportType === 'performance') {
        setChartData(mockPerformanceData[timeRange])
      }
      setLoading(false)
    }, 500)
  }, [reportType, timeRange])

  const renderChart = () => {
    if (chartData.length === 0 || loading) return null

    // Find the maximum value for scaling
    let maxValue = 0
    if (reportType === 'shipment') {
      maxValue = Math.max(...chartData.map(item => item.shipments))
    } else if (reportType === 'cargo') {
      maxValue = Math.max(...chartData.map(item => item.cargo))
    } else if (reportType === 'performance') {
      maxValue = 100 // For percentages
    }

    return (
      <div className="border rounded p-4" style={{ height: '400px' }}>
        <div className="d-flex align-items-end h-100">
          {chartData.map((item, index) => {
            const label = reportType === 'shipment' ? item.month || item.quarter : 
                         reportType === 'cargo' ? item.month || item.quarter : 
                         item.month || item.quarter
                         
            let bars = []
            if (reportType === 'shipment') {
              const totalHeight = (item.shipments / maxValue) * 100
              const deliveredHeight = (item.delivered / maxValue) * 100
              const inTransitHeight = (item.inTransit / maxValue) * 100
              const delayedHeight = (item.delayed / maxValue) * 100
              
              bars = [
                { height: deliveredHeight, color: 'bg-success', label: 'Delivered' },
                { height: inTransitHeight, color: 'bg-warning', label: 'In Transit' },
                { height: delayedHeight, color: 'bg-danger', label: 'Delayed' }
              ]
            } else if (reportType === 'cargo') {
              const totalHeight = (item.cargo / maxValue) * 100
              const deliveredHeight = (item.delivered / maxValue) * 100
              const inTransitHeight = (item.inTransit / maxValue) * 100
              const pendingHeight = (item.pending / maxValue) * 100
              
              bars = [
                { height: deliveredHeight, color: 'bg-success', label: 'Delivered' },
                { height: inTransitHeight, color: 'bg-info', label: 'In Transit' },
                { height: pendingHeight, color: 'bg-warning', label: 'Pending' }
              ]
            } else if (reportType === 'performance') {
              const onTimeHeight = item.onTime
              const efficiencyHeight = item.efficiency
              
              bars = [
                { height: onTimeHeight, color: 'bg-success', label: 'On-Time' },
                { height: efficiencyHeight, color: 'bg-primary', label: 'Efficiency' }
              ]
            }
            
            return (
              <div 
                key={index} 
                className={`me-3 text-center ${selectedPeriod === label ? 'bg-light rounded p-2' : ''}`}
                style={{ width: '60px', cursor: 'pointer' }}
                onClick={() => setSelectedPeriod(selectedPeriod === label ? null : label)}
              >
                <div className="d-flex flex-column justify-content-end h-100">
                  {bars.map((bar, barIndex) => (
                    <div 
                      key={barIndex}
                      className={`${bar.color} mx-auto`} 
                      style={{ 
                        width: '40px', 
                        height: `${bar.height}%`,
                        minHeight: '2px'
                      }}
                    ></div>
                  ))}
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

  const exportReport = () => {
    alert(`Report exported as ${exportFormat.toUpperCase()} successfully!`)
  }

  const renderLegend = () => {
    if (reportType === 'shipment') {
      return (
        <div className="d-flex flex-wrap justify-content-center mt-3">
          <div className="me-3 mb-2">
            <span className="badge bg-success me-1">Delivered</span>
          </div>
          <div className="me-3 mb-2">
            <span className="badge bg-warning me-1">In Transit</span>
          </div>
          <div className="mb-2">
            <span className="badge bg-danger me-1">Delayed</span>
          </div>
        </div>
      )
    } else if (reportType === 'cargo') {
      return (
        <div className="d-flex flex-wrap justify-content-center mt-3">
          <div className="me-3 mb-2">
            <span className="badge bg-success me-1">Delivered</span>
          </div>
          <div className="me-3 mb-2">
            <span className="badge bg-info me-1">In Transit</span>
          </div>
          <div className="mb-2">
            <span className="badge bg-warning me-1">Pending</span>
          </div>
        </div>
      )
    } else if (reportType === 'performance') {
      return (
        <div className="d-flex flex-wrap justify-content-center mt-3">
          <div className="me-3 mb-2">
            <span className="badge bg-success me-1">On-Time</span>
          </div>
          <div className="mb-2">
            <span className="badge bg-primary me-1">Efficiency</span>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <h1 className="mb-0">Reports & Analytics</h1>
              <p className="lead mb-0">Comprehensive reporting and data visualization for your logistics operations.</p>
            </div>
            <div className="mt-3 mt-md-0">
              <Link to="/tracking" className="btn btn-outline-primary me-2">
                <i className="bi bi-geo-alt me-1"></i>Tracking
              </Link>
              <button className="btn btn-primary" onClick={exportReport}>
                <i className="bi bi-download me-1"></i>Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="col-12 text-center mb-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Report Controls */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-file-earmark-bar-graph me-2"></i>Report Type
              </h5>
              <select 
                id="reportType"
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="shipment">Shipment Reports</option>
                <option value="cargo">Cargo Reports</option>
                <option value="performance">Performance Reports</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-calendar-range me-2"></i>Time Range
              </h5>
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
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-download me-2"></i>Export Format
              </h5>
              <div className="d-flex">
                <select 
                  className="form-select me-2"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
                <button className="btn btn-outline-primary" onClick={exportReport}>
                  <i className="bi bi-download"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="row mb-4 g-3">
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-start border-4 border-primary shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Shipments</h6>
                  <h3 className="mb-0">1,240</h3>
                </div>
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-box-seam text-primary fs-5"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success">
                  <i className="bi bi-arrow-up me-1"></i>12% from last period
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-start border-4 border-success shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">On-Time Delivery</h6>
                  <h3 className="mb-0">94%</h3>
                </div>
                <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-check-circle text-success fs-5"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success">
                  <i className="bi bi-arrow-up me-1"></i>3% from last period
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-start border-4 border-info shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Cargo Volume</h6>
                  <h3 className="mb-0">48,500 kg</h3>
                </div>
                <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-boxes text-info fs-5"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success">
                  <i className="bi bi-arrow-up me-1"></i>8% from last period
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-start border-4 border-warning shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Avg. Delivery Time</h6>
                  <h3 className="mb-0">2.1 days</h3>
                </div>
                <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-clock-history text-warning fs-5"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success">
                  <i className="bi bi-arrow-down me-1"></i>0.3 days improvement
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">
                <i className="bi bi-bar-chart me-2"></i>
                {reportType === 'shipment' ? 'Shipment Analytics' : 
                 reportType === 'cargo' ? 'Cargo Analytics' : 
                 'Performance Analytics'} - 
                {timeRange === 'monthly' ? ' Monthly View' : ' Quarterly View'}
              </h3>
              {selectedPeriod && (
                <span className="badge bg-primary">Selected: {selectedPeriod}</span>
              )}
            </div>
            <div className="card-body">
              {renderChart()}
              {renderLegend()}
              {selectedPeriod && (
                <div className="mt-3 p-3 bg-light rounded">
                  <h5>Details for {selectedPeriod}</h5>
                  <p>Additional information about the selected period would be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">
                <i className="bi bi-table me-2"></i>Detailed Report
              </h3>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-primary">View All</button>
                <button className="btn btn-sm btn-outline-secondary">Filter</button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      {reportType === 'shipment' ? (
                        <>
                          <th>Period</th>
                          <th>Total Shipments</th>
                          <th>Delivered</th>
                          <th>In Transit</th>
                          <th>Delayed</th>
                          <th>Delivery Rate</th>
                          <th>Revenue</th>
                        </>
                      ) : reportType === 'cargo' ? (
                        <>
                          <th>Period</th>
                          <th>Total Cargo (kg)</th>
                          <th>Delivered (kg)</th>
                          <th>In Transit (kg)</th>
                          <th>Pending (kg)</th>
                          <th>Utilization</th>
                        </>
                      ) : (
                        <>
                          <th>Period</th>
                          <th>On-Time (%)</th>
                          <th>Efficiency (%)</th>
                          <th>Customer Satisfaction</th>
                        </>
                      )}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => (
                      <tr key={index} className={selectedPeriod === (item.month || item.quarter) ? 'table-primary' : ''}>
                        <td>{item.month || item.quarter}</td>
                        {reportType === 'shipment' ? (
                          <>
                            <td>{item.shipments}</td>
                            <td>{item.delivered}</td>
                            <td>{item.inTransit}</td>
                            <td>{item.delayed}</td>
                            <td>{Math.round((item.delivered / item.shipments) * 100)}%</td>
                            <td>${item.revenue.toLocaleString()}</td>
                          </>
                        ) : reportType === 'cargo' ? (
                          <>
                            <td>{item.cargo}</td>
                            <td>{item.delivered}</td>
                            <td>{item.inTransit}</td>
                            <td>{item.pending}</td>
                            <td>{Math.round((item.delivered / item.cargo) * 100)}%</td>
                          </>
                        ) : (
                          <>
                            <td>{item.onTime}%</td>
                            <td>{item.efficiency}%</td>
                            <td>{item.customerSatisfaction}/5</td>
                          </>
                        )}
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button 
                              className="btn btn-outline-primary" 
                              onClick={() => setSelectedPeriod(item.month || item.quarter)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-outline-secondary">
                              <i className="bi bi-download"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {chartData.length === 0 && !loading && (
                <div className="text-center py-5">
                  <i className="bi bi-bar-chart fs-1 text-muted mb-3"></i>
                  <h4>No data available</h4>
                  <p>Try changing the report type or time range</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports