import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

// Mock API service
const mockApiService = {
  getShipments: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            trackingNumber: 'SH001',
            status: 'In Transit',
            origin: 'New York, USA',
            destination: 'London, UK',
            estimatedDelivery: '2025-10-25',
            currentLocation: 'Atlantic Ocean',
            progress: 65,
            cargo: [
              { id: 1, description: 'Electronics', weight: '500kg', status: 'Loaded' },
              { id: 2, description: 'Clothing', weight: '200kg', status: 'In Transit' }
            ]
          },
          {
            id: 2,
            trackingNumber: 'SH002',
            status: 'Delivered',
            origin: 'Los Angeles, USA',
            destination: 'Tokyo, Japan',
            estimatedDelivery: '2025-10-15',
            currentLocation: 'Tokyo Warehouse',
            progress: 100,
            cargo: [
              { id: 3, description: 'Automotive Parts', weight: '1200kg', status: 'Delivered' }
            ]
          },
          {
            id: 3,
            trackingNumber: 'SH003',
            status: 'Pending',
            origin: 'Chicago, USA',
            destination: 'Berlin, Germany',
            estimatedDelivery: '2025-10-30',
            currentLocation: 'Chicago Port',
            progress: 10,
            cargo: [
              { id: 4, description: 'Machinery', weight: '800kg', status: 'Pending' },
              { id: 5, description: 'Tools', weight: '300kg', status: 'Pending' }
            ]
          },
          {
            id: 4,
            trackingNumber: 'SH004',
            status: 'In Transit',
            origin: 'Houston, USA',
            destination: 'Sydney, Australia',
            estimatedDelivery: '2025-11-05',
            currentLocation: 'Pacific Ocean',
            progress: 40,
            cargo: [
              { id: 6, description: 'Chemicals', weight: '1500kg', status: 'In Transit' }
            ]
          }
        ])
      }, 500)
    })
  },

  updateShipmentStatus: (shipmentId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Shipment ${shipmentId} status updated to ${status}` })
      }, 300)
    })
  }
}

const ShipmentTracking = () => {
  const [shipments, setShipments] = useState([])
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch shipments from mock API
    const fetchShipments = async () => {
      setLoading(true)
      try {
        const data = await mockApiService.getShipments()
        setShipments(data)
        // Set the first shipment as selected by default
        if (data.length > 0 && !selectedShipment) {
          setSelectedShipment(data[0])
        }
      } catch (error) {
        console.error('Error fetching shipments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShipments()
  }, [])

  // Filter shipments based on search term
  const filteredShipments = shipments.filter(shipment =>
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleShipmentSelect = (shipment) => {
    setSelectedShipment(shipment)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success'
      case 'In Transit': return 'warning'
      case 'Pending': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Shipment Tracking</h1>
          <p>Track your shipments in real-time with detailed status updates.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by tracking number, origin, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">Search</button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Loading indicator */}
        {loading && (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Shipment List */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h3>Shipments</h3>
            </div>
            <div className="card-body">
              <div className="list-group">
                {filteredShipments.map(shipment => (
                  <button
                    key={shipment.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${selectedShipment?.id === shipment.id ? 'active' : ''}`}
                    onClick={() => handleShipmentSelect(shipment)}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{shipment.trackingNumber}</h5>
                      <span className={`badge bg-${getStatusColor(shipment.status)}`}>{shipment.status}</span>
                    </div>
                    <p className="mb-1">{shipment.origin} → {shipment.destination}</p>
                    <small>Estimated Delivery: {shipment.estimatedDelivery}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="col-lg-8">
          {selectedShipment ? (
            <div className="card">
              <div className="card-header">
                <h3>Shipment Details: {selectedShipment.trackingNumber}</h3>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            <span className={`badge bg-${getStatusColor(selectedShipment.status)}`}>
                              {selectedShipment.status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Origin:</strong></td>
                          <td>{selectedShipment.origin}</td>
                        </tr>
                        <tr>
                          <td><strong>Destination:</strong></td>
                          <td>{selectedShipment.destination}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Current Location:</strong></td>
                          <td>{selectedShipment.currentLocation}</td>
                        </tr>
                        <tr>
                          <td><strong>Estimated Delivery:</strong></td>
                          <td>{selectedShipment.estimatedDelivery}</td>
                        </tr>
                        <tr>
                          <td><strong>Progress:</strong></td>
                          <td>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${selectedShipment.progress}%` }}
                                aria-valuenow={selectedShipment.progress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              >
                                {selectedShipment.progress}%
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Interactive Map Placeholder */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h4 className="card-title">Interactive Map</h4>
                        <p className="card-text">
                          In a full implementation, this would show a real-time map with the shipment's location.
                        </p>
                        <div className="border rounded" style={{ height: '300px', backgroundColor: '#e9ecef' }}>
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <span>Map Visualization for Shipment {selectedShipment.trackingNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cargo Details */}
                <div className="row">
                  <div className="col-12">
                    <h4>Cargo Details</h4>
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Weight</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedShipment.cargo.map(item => (
                            <tr key={item.id}>
                              <td>{item.description}</td>
                              <td>{item.weight}</td>
                              <td>
                                <span className={`badge bg-${getStatusColor(item.status)}`}>
                                  {item.status}
                                </span>
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
          ) : (
            <div className="card">
              <div className="card-body text-center">
                <h3>Select a shipment to view details</h3>
                <p className="lead">Choose a shipment from the list to see its tracking information and status updates.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShipmentTracking