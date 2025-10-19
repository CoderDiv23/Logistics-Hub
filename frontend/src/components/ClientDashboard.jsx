import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

// Mock API service
const mockApiService = {
  getShipments: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, trackingNumber: 'SH001', status: 'In Transit', origin: 'New York', destination: 'London', estimatedDelivery: '2025-10-25', progress: 65 },
          { id: 2, trackingNumber: 'SH002', status: 'Delivered', origin: 'Los Angeles', destination: 'Tokyo', estimatedDelivery: '2025-10-15', progress: 100 },
          { id: 3, trackingNumber: 'SH003', status: 'Pending', origin: 'Chicago', destination: 'Berlin', estimatedDelivery: '2025-10-30', progress: 10 },
          { id: 4, trackingNumber: 'SH004', status: 'In Transit', origin: 'Miami', destination: 'São Paulo', estimatedDelivery: '2025-10-22', progress: 40 },
          { id: 5, trackingNumber: 'SH005', status: 'Pending', origin: 'Seattle', destination: 'Sydney', estimatedDelivery: '2025-11-05', progress: 5 }
        ])
      }, 500)
    })
  },

  getCargo: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, shipmentId: 1, description: 'Electronics', weight: '500kg', status: 'Loaded', location: 'Port of New York' },
          { id: 2, shipmentId: 1, description: 'Clothing', weight: '200kg', status: 'In Transit', location: 'Atlantic Ocean' },
          { id: 3, shipmentId: 2, description: 'Automotive Parts', weight: '1200kg', status: 'Delivered', location: 'Tokyo Warehouse' },
          { id: 4, shipmentId: 3, description: 'Machinery', weight: '3000kg', status: 'Pending', location: 'Chicago Warehouse' },
          { id: 5, shipmentId: 4, description: 'Pharmaceuticals', weight: '150kg', status: 'In Transit', location: 'Caribbean Sea' }
        ])
      }, 500)
    })
  },

  getNotifications: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, message: 'Your shipment SH001 has departed from New York port', time: '2 hours ago', read: false, type: 'info' },
          { id: 2, message: 'New shipment quote available for your request', time: '1 day ago', read: true, type: 'success' },
          { id: 3, message: 'Shipment SH004 delayed due to weather conditions', time: '3 hours ago', read: false, type: 'warning' },
          { id: 4, message: 'Your shipment SH002 has been delivered successfully', time: '1 day ago', read: true, type: 'success' }
        ])
      }, 500)
    })
  },

  getAnalytics: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          monthlyShipments: [12, 19, 3, 5, 2, 3, 15, 18, 10, 8, 14, 22],
          shipmentStatus: {
            delivered: 42,
            inTransit: 18,
            pending: 12,
            delayed: 5
          },
          topDestinations: [
            { country: 'United States', count: 24 },
            { country: 'Germany', count: 18 },
            { country: 'Japan', count: 15 },
            { country: 'United Kingdom', count: 12 },
            { country: 'Brazil', count: 9 }
          ]
        })
      }, 500)
    })
  }
}

const ClientDashboard = ({ user }) => {
  const [shipments, setShipments] = useState([])
  const [cargo, setCargo] = useState([])
  const [notifications, setNotifications] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Fetch data from mock APIs
    const fetchData = async () => {
      setLoading(true)
      try {
        const [shipmentsData, cargoData, notificationsData, analyticsData] = await Promise.all([
          mockApiService.getShipments(),
          mockApiService.getCargo(),
          mockApiService.getNotifications(),
          mockApiService.getAnalytics()
        ])
        
        setShipments(shipmentsData)
        setCargo(cargoData)
        setNotifications(notificationsData)
        setAnalytics(analyticsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const unreadNotifications = notifications.filter(notification => !notification.read).length
  
  // Filter shipments based on search term
  const filteredShipments = shipments.filter(shipment => 
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-success'
      case 'in transit': return 'bg-warning'
      case 'pending': return 'bg-info'
      case 'delayed': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  // Render progress bar
  const renderProgressBar = (progress) => {
    let variant = 'bg-success'
    if (progress < 30) variant = 'bg-info'
    else if (progress < 70) variant = 'bg-warning'
    else if (progress < 100) variant = 'bg-primary'
    
    return (
      <div className="progress" style={{height: '8px'}}>
        <div 
          className={`progress-bar ${variant}`} 
          role="progressbar" 
          style={{width: `${progress}%`}}
          aria-valuenow={progress} 
          aria-valuemin="0" 
          aria-valuemax="100"
        ></div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <h1 className="mb-0">Client Dashboard</h1>
              <p className="text-muted mb-0">Welcome back, {user?.name}!</p>
            </div>
            <div className="mt-3 mt-md-0">
              <button className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>New Shipment
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

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 border-start border-4 border-primary shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Shipments</h6>
                  <h3 className="mb-0">{shipments.length}</h3>
                </div>
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-box-seam text-primary fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 border-start border-4 border-success shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Delivered</h6>
                  <h3 className="mb-0">{shipments.filter(s => s.status === 'Delivered').length}</h3>
                </div>
                <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-check-circle text-success fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 border-start border-4 border-warning shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">In Transit</h6>
                  <h3 className="mb-0">{shipments.filter(s => s.status === 'In Transit').length}</h3>
                </div>
                <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-truck text-warning fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 border-start border-4 border-info shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Notifications</h6>
                  <h3 className="mb-0">{unreadNotifications}</h3>
                </div>
                <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-bell text-info fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2 me-2"></i>Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'shipments' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipments')}
              >
                <i className="bi bi-box-seam me-2"></i>Shipments
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'cargo' ? 'active' : ''}`}
                onClick={() => setActiveTab('cargo')}
              >
                <i className="bi bi-boxes me-2"></i>Cargo
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="bi bi-bar-chart me-2"></i>Analytics
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row mb-4">
        <div className="col-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="row">
              {/* Recent Shipments */}
              <div className="col-lg-8 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Shipments</h5>
                    <Link to="/tracking" className="btn btn-sm btn-outline-primary">View All</Link>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Tracking Number</th>
                            <th>Status</th>
                            <th>Origin</th>
                            <th>Destination</th>
                            <th>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shipments.slice(0, 5).map(shipment => (
                            <tr key={shipment.id}>
                              <td>
                                <Link to={`/tracking/${shipment.id}`} className="text-decoration-none">
                                  {shipment.trackingNumber}
                                </Link>
                              </td>
                              <td>
                                <span className={`badge ${getStatusClass(shipment.status)}`}>
                                  {shipment.status}
                                </span>
                              </td>
                              <td>{shipment.origin}</td>
                              <td>{shipment.destination}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="flex-grow-1 me-2" style={{minWidth: '80px'}}>
                                    {renderProgressBar(shipment.progress)}
                                  </div>
                                  <span className="text-muted small">{shipment.progress}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="col-lg-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Notifications</h5>
                    <Link to="/notifications" className="btn btn-sm btn-outline-primary">View All</Link>
                  </div>
                  <div className="card-body">
                    {notifications.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {notifications.slice(0, 5).map(notification => (
                          <div key={notification.id} className={`list-group-item ${!notification.read ? 'bg-light' : ''}`}>
                            <div className="d-flex">
                              <div className={`me-3 mt-1 rounded-circle d-flex align-items-center justify-content-center ${notification.type === 'success' ? 'bg-success bg-opacity-10' : notification.type === 'warning' ? 'bg-warning bg-opacity-10' : 'bg-info bg-opacity-10'}`} style={{width: '24px', height: '24px'}}>
                                <i className={`bi ${notification.type === 'success' ? 'bi-check-circle' : notification.type === 'warning' ? 'bi-exclamation-triangle' : 'bi-info-circle'} ${notification.type === 'success' ? 'text-success' : notification.type === 'warning' ? 'text-warning' : 'text-info'}`}></i>
                              </div>
                              <div className="flex-grow-1">
                                <p className="mb-1">{notification.message}</p>
                                <small className="text-muted">{notification.time}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center">No notifications</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipments Tab */}
          {activeTab === 'shipments' && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <div className="row align-items-center">
                  <div className="col-md-6 mb-2 mb-md-0">
                    <h5 className="mb-0">All Shipments</h5>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex">
                      <div className="flex-grow-1 me-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search shipments..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <button className="btn btn-outline-secondary">
                        <i className="bi bi-funnel"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Tracking Number</th>
                        <th>Status</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Estimated Delivery</th>
                        <th>Progress</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShipments.map(shipment => (
                        <tr key={shipment.id}>
                          <td>
                            <Link to={`/tracking/${shipment.id}`} className="text-decoration-none fw-bold">
                              {shipment.trackingNumber}
                            </Link>
                          </td>
                          <td>
                            <span className={`badge ${getStatusClass(shipment.status)}`}>
                              {shipment.status}
                            </span>
                          </td>
                          <td>{shipment.origin}</td>
                          <td>{shipment.destination}</td>
                          <td>{shipment.estimatedDelivery}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 me-2" style={{minWidth: '80px'}}>
                                {renderProgressBar(shipment.progress)}
                              </div>
                              <span className="text-muted small">{shipment.progress}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-outline-secondary">
                                <i className="bi bi-pencil"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredShipments.length === 0 && (
                  <div className="text-center py-5">
                    <i className="bi bi-box-seam fs-1 text-muted mb-3"></i>
                    <p className="text-muted">No shipments found matching your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cargo Tab */}
          {activeTab === 'cargo' && (
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cargo Status</h5>
                <button className="btn btn-sm btn-outline-primary">
                  <i className="bi bi-plus-circle me-1"></i>Add Cargo
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Weight</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Shipment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargo.map(item => (
                        <tr key={item.id}>
                          <td>{item.description}</td>
                          <td>{item.weight}</td>
                          <td>
                            <span className={`badge ${getStatusClass(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>{item.location}</td>
                          <td>
                            {shipments.find(s => s.id === item.shipmentId)?.trackingNumber || 'N/A'}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-outline-secondary">
                                <i className="bi bi-pencil"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="row">
              <div className="col-lg-8 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Monthly Shipments</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-end h-100">
                      {analytics?.monthlyShipments.map((count, index) => (
                        <div key={index} className="flex-grow-1 px-1 text-center">
                          <div 
                            className="bg-primary mx-auto rounded-top" 
                            style={{height: `${count * 3}px`, minWidth: '20px'}}
                            title={`${count} shipments in ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}`}
                          ></div>
                          <small className="text-muted">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Shipment Status</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <div className="position-relative" style={{width: '200px', height: '200px'}}>
                        {/* This would be a pie chart in a real implementation */}
                        <div className="d-flex flex-wrap justify-content-center">
                          <div className="d-flex align-items-center me-3 mb-2">
                            <div className="rounded-circle bg-success me-2" style={{width: '12px', height: '12px'}}></div>
                            <span className="small">Delivered</span>
                          </div>
                          <div className="d-flex align-items-center me-3 mb-2">
                            <div className="rounded-circle bg-warning me-2" style={{width: '12px', height: '12px'}}></div>
                            <span className="small">In Transit</span>
                          </div>
                          <div className="d-flex align-items-center me-3 mb-2">
                            <div className="rounded-circle bg-info me-2" style={{width: '12px', height: '12px'}}></div>
                            <span className="small">Pending</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <div className="rounded-circle bg-danger me-2" style={{width: '12px', height: '12px'}}></div>
                            <span className="small">Delayed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Delivered</span>
                        <span className="fw-bold">{analytics?.shipmentStatus.delivered}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>In Transit</span>
                        <span className="fw-bold">{analytics?.shipmentStatus.inTransit}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Pending</span>
                        <span className="fw-bold">{analytics?.shipmentStatus.pending}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Delayed</span>
                        <span className="fw-bold">{analytics?.shipmentStatus.delayed}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard