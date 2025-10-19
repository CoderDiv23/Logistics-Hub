import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

// Mock API service
const mockApiService = {
  getShipments: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, trackingNumber: 'SH001', status: 'In Transit', origin: 'New York', destination: 'London', estimatedDelivery: '2025-10-25', route: 'NYC → London', progress: '65%', eta: '2 days', driver: 'John Smith' },
          { id: 2, trackingNumber: 'SH002', status: 'Delivered', origin: 'Los Angeles', destination: 'Tokyo', estimatedDelivery: '2025-10-15', route: 'LA → Tokyo', progress: '100%', eta: 'Delivered', driver: 'Hiro Tanaka' },
          { id: 3, trackingNumber: 'SH003', status: 'Pending', origin: 'Chicago', destination: 'Berlin', estimatedDelivery: '2025-10-30', route: 'Chicago → Berlin', progress: '0%', eta: '5 days', driver: 'Maria Lopez'  },
        ])
      }, 500)
    })
  },

  getCargo: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, shipmentId: 1, description: 'Electronics', weight: '500kg', status: 'Loaded', location: 'Port of New York', containerNumber: 'CNT001', departureDate: '2025-10-12', arrivalDate: '2025-10-25', gpsLocation: '41.2033° N, 73.2026° W', transportMode: 'Sea Freight', customClearanceStatus: 'Pending', handlingAgent: 'Global Logistics Ltd.', lastUpdate: '2025-10-18 08:30 AM', insuranceStatus: 'Insured' },
          { id: 2, shipmentId: 1, description: 'Clothing', weight: '200kg', status: 'In Transit', location: 'Atlantic Ocean',  containerNumber: 'CNT002', departureDate: '2025-10-13', arrivalDate: '2025-10-27', gpsLocation: '36.7783° N, 40.1234° W',transportMode: 'Sea Freight', customClearanceStatus: 'Cleared', handlingAgent: 'Maritime Cargo Co.', lastUpdate: '2025-10-18 09:10 AM', insuranceStatus: 'Insured' },
          { id: 3, shipmentId: 2, description: 'Automotive Parts', weight: '1200kg', status: 'Delivered', location: 'Tokyo Warehouse', containerNumber: 'CNT003', departureDate: '2025-09-29', arrivalDate: '2025-10-15', gpsLocation: '35.6895° N, 139.6917° E', transportMode: 'Air Freight', customClearanceStatus: 'Completed', handlingAgent: 'SkyFreight Japan',lastUpdate: '2025-10-15 05:45 PM', insuranceStatus: 'Insured' },
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
  const [loading, setLoading] = useState(false);

  const [expandedHeader, setExpandedHeader] = useState(null);


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
                      <th>Shipment ID</th>
                      <th>Route</th>   
                      <th>Progress</th>
                      <th>ETA</th>   
                      <th>Driver</th>
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
                        <td>{shipment.id}</td>
                        <td>{shipment.route}</td>
                        <td>{shipment.progress}</td>
                        <td>{shipment.eta}</td>
                        <td>{shipment.driver}</td>
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
                      
                     {[
                        { label: 'Description', title: 'Description of the cargo' },
                        { label: 'Weight', title: 'Weight of cargo in kilograms' },
                        { label: 'Status', title: 'Current status of the cargo' },
                        { label: 'Location', title: 'Current location of the cargo' },
                        { label: 'Shipment', title: 'Shipment tracking number' },
                        { label: 'Container Number', title: 'Container Number for cargo' },
                        { label: 'Departure Date', title: 'Departure Date' },
                        { label: 'Arrival Date', title: 'Arrival Date' },
                        { label: 'Current Location (GPS)', title: 'Current Location in GPS coordinates' },
                        { label: 'Transport Mode', title: 'Mode of transport' },
                        { label: 'Custom Clearance Status', title: 'Custom Clearance Status' },
                        { label: 'Handling Agent', title: 'Handling Agent for cargo' },
                        { label: 'Last Time Update', title: 'Last Time Update' },
                        { label: 'Insurance Status', title: 'Insurance Status' },
                      ].map((header, index) => (
                      <th
                        key={index}
                        className={expandedHeader === index ? 'expanded' : ''}
                        onClick={() => setExpandedHeader(expandedHeader === index ? null : index)}
                        style={{ position: 'relative' }}
                      >
                        {header.label}
                        {expandedHeader === index && (
                          <span style={{ marginLeft: '5px', fontWeight: 'normal', fontSize: '0.85em', color: '#555' }}>
                            ({header.title})
                          </span>
                        )}
                      </th>
                    ))}
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
                        <td>{item.containerNumber}</td>
                        <td>{item.departureDate}</td>
                        <td>{item.arrivalDate}</td>
                        <td>{item.gpsLocation}</td>
                        <td>{item.transportMode}</td>
                        <td>{item.customClearanceStatus}</td>
                        <td>{item.handlingAgent}</td>
                        <td>{item.lastUpdate}</td>
                        <td>{item.insuranceStatus}</td>
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