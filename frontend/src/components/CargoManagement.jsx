import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

// Mock API service
const mockApiService = {
  getCargoItems: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, shipmentId: 'SH001', description: 'Electronics', weight: '500kg', status: 'Loaded', location: 'Port of New York' },
          { id: 2, shipmentId: 'SH001', description: 'Clothing', weight: '200kg', status: 'In Transit', location: 'Atlantic Ocean' },
          { id: 3, shipmentId: 'SH002', description: 'Automotive Parts', weight: '1200kg', status: 'Delivered', location: 'Tokyo Warehouse' },
          { id: 4, shipmentId: 'SH003', description: 'Machinery', weight: '800kg', status: 'Pending', location: 'Chicago Port' },
          { id: 5, shipmentId: 'SH003', description: 'Tools', weight: '300kg', status: 'Pending', location: 'Chicago Port' },
          { id: 6, shipmentId: 'SH004', description: 'Chemicals', weight: '1500kg', status: 'In Transit', location: 'Pacific Ocean' },
        ])
      }, 500)
    })
  },

  addCargoItem: (cargoItem) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Cargo item added successfully', id: Date.now() })
      }, 300)
    })
  },

  updateCargoStatus: (cargoId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Cargo item ${cargoId} status updated to ${status}` })
      }, 300)
    })
  }
}

const CargoManagement = () => {
  const [cargoItems, setCargoItems] = useState([])
  const [filteredCargo, setFilteredCargo] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(false)
  const [newCargo, setNewCargo] = useState({
    shipmentId: '',
    description: '',
    weight: '',
    status: 'Pending',
    location: ''
  })

  useEffect(() => {
    // Fetch cargo items from mock API
    const fetchCargoItems = async () => {
      setLoading(true)
      try {
        const data = await mockApiService.getCargoItems()
        setCargoItems(data)
        setFilteredCargo(data)
      } catch (error) {
        console.error('Error fetching cargo items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCargoItems()
  }, [])

  useEffect(() => {
    // Filter cargo items based on search term and status filter
    let result = cargoItems
    
    if (searchTerm) {
      result = result.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shipmentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'All') {
      result = result.filter(item => item.status === statusFilter)
    }
    
    setFilteredCargo(result)
  }, [searchTerm, statusFilter, cargoItems])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success'
      case 'In Transit': return 'warning'
      case 'Loaded': return 'info'
      case 'Pending': return 'secondary'
      default: return 'secondary'
    }
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setNewCargo({
      ...newCargo,
      [id]: value
    })
  }

  const handleAddCargo = async (e) => {
    e.preventDefault()
    
    if (!newCargo.shipmentId || !newCargo.description || !newCargo.weight || !newCargo.location) {
      alert('Please fill in all fields')
      return
    }
    
    try {
      const response = await mockApiService.addCargoItem(newCargo)
      if (response.success) {
        // Add the new cargo item to the list
        const newCargoItem = {
          id: response.id,
          ...newCargo
        }
        setCargoItems([...cargoItems, newCargoItem])
        setFilteredCargo([...filteredCargo, newCargoItem])
        
        // Reset form
        setNewCargo({
          shipmentId: '',
          description: '',
          weight: '',
          status: 'Pending',
          location: ''
        })
        
        alert(response.message)
      }
    } catch (error) {
      console.error('Error adding cargo item:', error)
      alert('Error adding cargo item')
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Cargo Management</h1>
          <p>Manage your cargo inventory, track status updates, and monitor locations.</p>
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

      {/* Search and Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by description or shipment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">Search</button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${statusFilter === 'All' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleStatusFilterChange('All')}
            >
              All
            </button>
            <button
              type="button"
              className={`btn ${statusFilter === 'Pending' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleStatusFilterChange('Pending')}
            >
              Pending
            </button>
            <button
              type="button"
              className={`btn ${statusFilter === 'Loaded' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleStatusFilterChange('Loaded')}
            >
              Loaded
            </button>
            <button
              type="button"
              className={`btn ${statusFilter === 'In Transit' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleStatusFilterChange('In Transit')}
            >
              In Transit
            </button>
            <button
              type="button"
              className={`btn ${statusFilter === 'Delivered' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleStatusFilterChange('Delivered')}
            >
              Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Cargo Items Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Cargo Inventory</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Shipment ID</th>
                      <th>Description</th>
                      <th>Weight</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCargo.map(item => (
                      <tr key={item.id}>
                        <td>{item.shipmentId}</td>
                        <td>{item.description}</td>
                        <td>{item.weight}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>{item.location}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">View Details</button>
                          <button className="btn btn-sm btn-outline-warning">Update Status</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredCargo.length === 0 && !loading && (
                <div className="text-center py-4">
                  <h4>No cargo items found</h4>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Cargo Form */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Add New Cargo</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddCargo}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="shipmentId" className="form-label">Shipment ID</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="shipmentId" 
                        placeholder="Enter shipment ID" 
                        value={newCargo.shipmentId}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="description" 
                        placeholder="Enter cargo description" 
                        value={newCargo.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="weight" className="form-label">Weight</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="weight" 
                        placeholder="Enter weight (e.g., 500kg)" 
                        value={newCargo.weight}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select 
                        className="form-select" 
                        id="status"
                        value={newCargo.status}
                        onChange={handleInputChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Loaded">Loaded</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">Location</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="location" 
                        placeholder="Enter current location" 
                        value={newCargo.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Add Cargo</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CargoManagement