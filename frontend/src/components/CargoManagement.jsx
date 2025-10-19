import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

// Mock API service
const mockApiService = {
  getCargoItems: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, shipmentId: 'SH001', description: 'Electronics', weight: '500kg', status: 'Loaded', location: 'Port of New York', category: 'Electronics', value: '$25,000', lastUpdated: '2025-10-19T08:00:00Z' },
          { id: 2, shipmentId: 'SH001', description: 'Clothing', weight: '200kg', status: 'In Transit', location: 'Atlantic Ocean', category: 'Apparel', value: '$5,000', lastUpdated: '2025-10-19T07:30:00Z' },
          { id: 3, shipmentId: 'SH002', description: 'Automotive Parts', weight: '1200kg', status: 'Delivered', location: 'Tokyo Warehouse', category: 'Automotive', value: '$45,000', lastUpdated: '2025-10-18T14:20:00Z' },
          { id: 4, shipmentId: 'SH003', description: 'Machinery', weight: '800kg', status: 'Pending', location: 'Chicago Port', category: 'Industrial', value: '$30,000', lastUpdated: '2025-10-19T06:15:00Z' },
          { id: 5, shipmentId: 'SH003', description: 'Tools', weight: '300kg', status: 'Pending', location: 'Chicago Port', category: 'Tools', value: '$8,000', lastUpdated: '2025-10-19T06:10:00Z' },
          { id: 6, shipmentId: 'SH004', description: 'Chemicals', weight: '1500kg', status: 'In Transit', location: 'Pacific Ocean', category: 'Chemicals', value: '$22,000', lastUpdated: '2025-10-19T05:45:00Z' },
          { id: 7, shipmentId: 'SH005', description: 'Furniture', weight: '600kg', status: 'Loaded', location: 'Los Angeles Port', category: 'Furniture', value: '$15,000', lastUpdated: '2025-10-19T08:10:00Z' },
          { id: 8, shipmentId: 'SH006', description: 'Medical Supplies', weight: '150kg', status: 'Pending', location: 'Miami Port', category: 'Medical', value: '$12,000', lastUpdated: '2025-10-19T07:50:00Z' }
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
  },

  deleteCargoItem: (cargoId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Cargo item ${cargoId} deleted successfully` })
      }, 300)
    })
  }
}

const CargoManagement = () => {
  const [cargoItems, setCargoItems] = useState([])
  const [filteredCargo, setFilteredCargo] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCargo, setNewCargo] = useState({
    shipmentId: '',
    description: '',
    weight: '',
    status: 'Pending',
    location: '',
    category: 'Electronics',
    value: ''
  })
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [selectedCargo, setSelectedCargo] = useState(null)

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
        item.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'All') {
      result = result.filter(item => item.status === statusFilter)
    }
    
    if (categoryFilter !== 'All') {
      result = result.filter(item => item.category === categoryFilter)
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    setFilteredCargo(result)
  }, [searchTerm, statusFilter, categoryFilter, cargoItems, sortConfig])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success'
      case 'In Transit': return 'warning'
      case 'Loaded': return 'info'
      case 'Pending': return 'secondary'
      default: return 'secondary'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Electronics': return 'bi-laptop'
      case 'Apparel': return 'bi-t-shirt'
      case 'Automotive': return 'bi-car-front'
      case 'Industrial': return 'bi-tools'
      case 'Tools': return 'bi-wrench'
      case 'Chemicals': return 'bi-droplet'
      case 'Furniture': return 'bi-house-door'
      case 'Medical': return 'bi-heart-pulse'
      default: return 'bi-box'
    }
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
  }

  const handleCategoryFilterChange = (category) => {
    setCategoryFilter(category)
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setNewCargo({
      ...newCargo,
      [id]: value
    })
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleAddCargo = async (e) => {
    e.preventDefault()
    
    if (!newCargo.shipmentId || !newCargo.description || !newCargo.weight || !newCargo.location) {
      alert('Please fill in all required fields')
      return
    }
    
    try {
      const response = await mockApiService.addCargoItem(newCargo)
      if (response.success) {
        // Add the new cargo item to the list
        const newCargoItem = {
          id: response.id,
          ...newCargo,
          lastUpdated: new Date().toISOString()
        }
        setCargoItems([...cargoItems, newCargoItem])
        setFilteredCargo([...filteredCargo, newCargoItem])
        
        // Reset form
        setNewCargo({
          shipmentId: '',
          description: '',
          weight: '',
          status: 'Pending',
          location: '',
          category: 'Electronics',
          value: ''
        })
        
        alert(response.message)
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Error adding cargo item:', error)
      alert('Error adding cargo item')
    }
  }

  const handleDeleteCargo = async (id) => {
    if (window.confirm('Are you sure you want to delete this cargo item?')) {
      try {
        const response = await mockApiService.deleteCargoItem(id)
        if (response.success) {
          const updatedCargo = cargoItems.filter(item => item.id !== id)
          setCargoItems(updatedCargo)
          setFilteredCargo(updatedCargo)
          alert(response.message)
        }
      } catch (error) {
        console.error('Error deleting cargo item:', error)
        alert('Error deleting cargo item')
      }
    }
  }

  const handleViewDetails = (cargo) => {
    setSelectedCargo(cargo)
  }

  const formatCurrency = (value) => {
    if (!value) return '$0'
    if (value.startsWith('$')) return value
    return `$${value}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  // Get unique categories for filter dropdown
  const categories = [...new Set(cargoItems.map(item => item.category))]

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <h1 className="mb-0">Cargo Management</h1>
              <p className="lead mb-0">Manage your cargo inventory, track status updates, and monitor locations.</p>
            </div>
            <div className="mt-3 mt-md-0">
              <Link to="/reports" className="btn btn-outline-primary me-2">
                <i className="bi bi-bar-chart me-1"></i>Reports
              </Link>
              <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                <i className={`bi ${showAddForm ? 'bi-x-lg' : 'bi-plus-circle'} me-1`}></i>
                {showAddForm ? 'Cancel' : 'Add Cargo'}
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
                  <h6 className="text-muted mb-1">Total Cargo</h6>
                  <h3 className="mb-0">{cargoItems.length}</h3>
                </div>
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-boxes text-primary fs-5"></i>
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
                  <h3 className="mb-0">{cargoItems.filter(item => item.status === 'In Transit').length}</h3>
                </div>
                <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-truck text-warning fs-5"></i>
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
                  <h3 className="mb-0">{cargoItems.filter(item => item.status === 'Delivered').length}</h3>
                </div>
                <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-check-circle text-success fs-5"></i>
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
                  <h6 className="text-muted mb-1">Total Value</h6>
                  <h3 className="mb-0">
                    {formatCurrency(cargoItems.reduce((total, item) => {
                      const value = parseFloat(item.value?.replace('$', '').replace(',', '') || 0)
                      return total + value
                    }, 0).toLocaleString())}
                  </h3>
                </div>
                <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-currency-dollar text-info fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Cargo Form */}
      {showAddForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>Add New Cargo
                </h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddCargo}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="shipmentId" className="form-label">Shipment ID <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="shipmentId" 
                          placeholder="Enter shipment ID" 
                          value={newCargo.shipmentId}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="description"
                          placeholder="Enter cargo description" 
                          value={newCargo.description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="weight" className="form-label">Weight <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="weight" 
                          placeholder="Enter weight (e.g., 500kg)" 
                          value={newCargo.weight}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="value" className="form-label">Value</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="value" 
                          placeholder="Enter value (e.g., $25000)" 
                          value={newCargo.value}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
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
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select 
                          className="form-select" 
                          id="category"
                          value={newCargo.category}
                          onChange={handleInputChange}
                        >
                          <option value="Electronics">Electronics</option>
                          <option value="Apparel">Apparel</option>
                          <option value="Automotive">Automotive</option>
                          <option value="Industrial">Industrial</option>
                          <option value="Tools">Tools</option>
                          <option value="Chemicals">Chemicals</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Medical">Medical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-3">
                        <label htmlFor="location" className="form-label">Location <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="location" 
                          placeholder="Enter current location" 
                          value={newCargo.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-plus-circle me-1"></i>Add Cargo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by description, shipment ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search cargo items"
            />
          </div>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Loaded">Loaded</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select"
            value={categoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cargo Items Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">
                <i className="bi bi-boxes me-2"></i>Cargo Inventory
              </h3>
              <span className="badge bg-primary">
                {filteredCargo.length} items
              </span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" onClick={() => handleSort('shipmentId')} className="sortable">
                        Shipment ID {sortConfig.key === 'shipmentId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th scope="col" onClick={() => handleSort('description')} className="sortable">
                        Description {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th scope="col" onClick={() => handleSort('category')} className="sortable">
                        Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th scope="col" onClick={() => handleSort('weight')} className="sortable">
                        Weight {sortConfig.key === 'weight' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th scope="col" onClick={() => handleSort('value')} className="sortable">
                        Value {sortConfig.key === 'value' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th scope="col" onClick={() => handleSort('status')} className="sortable">
                        Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th scope="col" onClick={() => handleSort('location')} className="sortable">
                        Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th scope="col" onClick={() => handleSort('lastUpdated')} className="sortable">
                        Last Updated {sortConfig.key === 'lastUpdated' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCargo.map(item => (
                      <tr key={item.id}>
                        <td>
                          <Link to={`/tracking/${item.shipmentId}`} className="text-decoration-none">
                            {item.shipmentId}
                          </Link>
                        </td>
                        <td>{item.description}</td>
                        <td>
                          <i className={`bi ${getCategoryIcon(item.category)} me-1`}></i>
                          {item.category}
                        </td>
                        <td>{item.weight}</td>
                        <td>{formatCurrency(item.value)}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>{item.location}</td>
                        <td>{formatDate(item.lastUpdated)}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button 
                              className="btn btn-outline-primary" 
                              onClick={() => handleViewDetails(item)}
                              title="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-outline-warning" 
                              title="Update Status"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger" 
                              onClick={() => handleDeleteCargo(item.id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredCargo.length === 0 && !loading && (
                <div className="text-center py-5">
                  <i className="bi bi-box-seam fs-1 text-muted mb-3"></i>
                  <h4>No cargo items found</h4>
                  <p>Try adjusting your search or filter criteria</p>
                  <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                    <i className="bi bi-plus-circle me-1"></i>Add New Cargo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cargo Details Modal */}
      {selectedCargo && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Cargo Details: {selectedCargo.description}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedCargo(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Shipment ID:</strong></td>
                          <td>{selectedCargo.shipmentId}</td>
                        </tr>
                        <tr>
                          <td><strong>Description:</strong></td>
                          <td>{selectedCargo.description}</td>
                        </tr>
                        <tr>
                          <td><strong>Category:</strong></td>
                          <td>
                            <i className={`bi ${getCategoryIcon(selectedCargo.category)} me-1`}></i>
                            {selectedCargo.category}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Weight:</strong></td>
                          <td>{selectedCargo.weight}</td>
                        </tr>
                        <tr>
                          <td><strong>Value:</strong></td>
                          <td>{formatCurrency(selectedCargo.value)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            <span className={`badge bg-${getStatusColor(selectedCargo.status)}`}>
                              {selectedCargo.status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Location:</strong></td>
                          <td>{selectedCargo.location}</td>
                        </tr>
                        <tr>
                          <td><strong>Last Updated:</strong></td>
                          <td>{formatDate(selectedCargo.lastUpdated)}</td>
                        </tr>
                        <tr>
                          <td><strong>Shipment Link:</strong></td>
                          <td>
                            <Link to={`/tracking/${selectedCargo.shipmentId}`} className="text-decoration-none">
                              View Shipment Details
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4">
                  <h5>Shipment Progress</h5>
                  <div className="progress" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: selectedCargo.status === 'Delivered' ? '100%' : selectedCargo.status === 'In Transit' ? '60%' : selectedCargo.status === 'Loaded' ? '30%' : '10%' }}
                    >
                      {selectedCargo.status}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedCargo(null)}>Close</button>
                <button type="button" className="btn btn-primary">Update Status</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CargoManagement