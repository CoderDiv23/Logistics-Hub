import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

// Mock API service
const mockApiService = {
  getShipments: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, trackingNumber: 'SH001', status: 'In Transit', origin: 'New York', destination: 'London', estimatedDelivery: '2025-10-25' },
          { id: 2, trackingNumber: 'SH002', status: 'Delivered', origin: 'Los Angeles', destination: 'Tokyo', estimatedDelivery: '2025-10-15' },
          { id: 3, trackingNumber: 'SH003', status: 'Pending', origin: 'Chicago', destination: 'Berlin', estimatedDelivery: '2025-10-30' },
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
        ])
      }, 500)
    })
  },

  getNotifications: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, message: 'Your shipment SH001 has departed from New York port', time: '2 hours ago', read: false },
          { id: 2, message: 'New shipment quote available for your request', time: '1 day ago', read: true },
        ])
      }, 500)
    })
  }
}

const ClientDashboard = ({ user }) => {
  const [shipments, setShipments] = useState([])
  const [cargo, setCargo] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch data from mock APIs
    const fetchData = async () => {
      setLoading(true)
      try {
        const [shipmentsData, cargoData, notificationsData] = await Promise.all([
          mockApiService.getShipments(),
          mockApiService.getCargo(),
          mockApiService.getNotifications()
        ])
        
        setShipments(shipmentsData)
        setCargo(cargoData)
        setNotifications(notificationsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const unreadNotifications = notifications.filter(notification => !notification.read).length

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Client Dashboard</h1>
          <p>Welcome, {user?.name}! Here's an overview of your shipments and cargo.</p>
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
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Shipments</h5>
              <p className="card-text display-4">{shipments.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Delivered</h5>
              <p className="card-text display-4">{shipments.filter(s => s.status === 'Delivered').length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">In Transit</h5>
              <p className="card-text display-4">{shipments.filter(s => s.status === 'In Transit').length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Notifications</h5>
              <p className="card-text display-4">{unreadNotifications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Tracking */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Shipment Tracking</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Tracking Number</th>
                      <th>Status</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Estimated Delivery</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map(shipment => (
                      <tr key={shipment.id}>
                        <td>{shipment.trackingNumber}</td>
                        <td>
                          <span className={`badge bg-${shipment.status === 'Delivered' ? 'success' : shipment.status === 'In Transit' ? 'warning' : 'secondary'}`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td>{shipment.origin}</td>
                        <td>{shipment.destination}</td>
                        <td>{shipment.estimatedDelivery}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">View Details</button>
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

      {/* Cargo Status */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Cargo Status</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Weight</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Shipment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargo.map(item => (
                      <tr key={item.id}>
                        <td>{item.description}</td>
                        <td>{item.weight}</td>
                        <td>
                          <span className={`badge bg-${item.status === 'Delivered' ? 'success' : item.status === 'In Transit' ? 'warning' : 'secondary'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>{item.location}</td>
                        <td>{shipments.find(s => s.id === item.shipmentId)?.trackingNumber || 'N/A'}</td>
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

export default ClientDashboard