import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

// Mock API service
const mockApiService = {
  getDeliveries: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, shipmentId: 'SH001', address: '123 Main St, London', status: 'Pending', scheduledTime: '2025-10-20 09:00', priority: 'High' },
          { id: 2, shipmentId: 'SH003', address: '456 Park Ave, Berlin', status: 'In Progress', scheduledTime: '2025-10-21 14:00', priority: 'Medium' },
          { id: 3, shipmentId: 'SH005', address: '789 Ocean Dr, Paris', status: 'Completed', scheduledTime: '2025-10-18 10:00', priority: 'Low' },
        ])
      }, 500)
    })
  },

  getVehicleStatus: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          vehicleId: 'VH001',
          model: 'Freightliner Cascadia',
          status: 'In Transit',
          location: '40.7128° N, 74.0060° W',
          fuelLevel: '75%',
          lastMaintenance: '2025-10-10',
        })
      }, 500)
    })
  },

  getPerformanceMetrics: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          deliveriesCompleted: 24,
          onTimeDeliveryRate: '92%',
          averageDeliveryTime: '2.3 days',
          customerSatisfaction: '4.8/5.0',
        })
      }, 500)
    })
  }
}

const DriverDashboard = ({ user }) => {
  const [deliveries, setDeliveries] = useState([])
  const [vehicleStatus, setVehicleStatus] = useState({})
  const [performance, setPerformance] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch data from mock APIs
    const fetchData = async () => {
      setLoading(true)
      try {
        const [deliveriesData, vehicleData, performanceData] = await Promise.all([
          mockApiService.getDeliveries(),
          mockApiService.getVehicleStatus(),
          mockApiService.getPerformanceMetrics()
        ])
        
        setDeliveries(deliveriesData)
        setVehicleStatus(vehicleData)
        setPerformance(performanceData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Driver Dashboard</h1>
          <p>Welcome, {user?.name}! Here's your delivery schedule and vehicle information.</p>
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
              <h5 className="card-title">Today's Deliveries</h5>
              <p className="card-text display-4">{deliveries.filter(d => d.status !== 'Completed').length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">On-Time Rate</h5>
              <p className="card-text display-4">{performance.onTimeDeliveryRate || '0%'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Fuel Level</h5>
              <p className="card-text display-4">{vehicleStatus.fuelLevel || '0%'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Satisfaction</h5>
              <p className="card-text display-4">{performance.customerSatisfaction || '0/5'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Status */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Vehicle Status</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Vehicle ID:</strong></td>
                        <td>{vehicleStatus.vehicleId || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Model:</strong></td>
                        <td>{vehicleStatus.model || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td>
                          <span className={`badge bg-${vehicleStatus.status === 'In Transit' ? 'warning' : 'success'}`}>
                            {vehicleStatus.status || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Current Location:</strong></td>
                        <td>{vehicleStatus.location || 'Unknown'}</td>
                      </tr>
                      <tr>
                        <td><strong>Fuel Level:</strong></td>
                        <td>{vehicleStatus.fuelLevel || 'Unknown'}</td>
                      </tr>
                      <tr>
                        <td><strong>Last Maintenance:</strong></td>
                        <td>{vehicleStatus.lastMaintenance || 'Unknown'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Schedule */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Delivery Schedule</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Shipment ID</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Scheduled Time</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map(delivery => (
                      <tr key={delivery.id}>
                        <td>{delivery.shipmentId}</td>
                        <td>{delivery.address}</td>
                        <td>
                          <span className={`badge bg-${delivery.status === 'Completed' ? 'success' : delivery.status === 'In Progress' ? 'warning' : 'secondary'}`}>
                            {delivery.status}
                          </span>
                        </td>
                        <td>{delivery.scheduledTime}</td>
                        <td>
                          <span className={`badge bg-${delivery.priority === 'High' ? 'danger' : delivery.priority === 'Medium' ? 'warning' : 'secondary'}`}>
                            {delivery.priority}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">View Details</button>
                          {delivery.status !== 'Completed' && (
                            <button className="btn btn-sm btn-outline-success">Mark Complete</button>
                          )}
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

export default DriverDashboard