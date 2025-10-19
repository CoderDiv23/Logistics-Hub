import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'

// Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'

// Import custom components
import Login from './components/Login'
import ClientDashboard from './components/ClientDashboard'
import DriverDashboard from './components/DriverDashboard'
import ShipmentTracking from './components/ShipmentTracking'
import CargoManagement from './components/CargoManagement'
import UserProfile from './components/UserProfile'
import Notifications from './components/Notifications'
import Settings from './components/Settings'
import Reports from './components/Reports'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.navbar-toggler')) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [sidebarOpen])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          {/* Skip to main content for accessibility */}
          <a href="#main-content" className="skip-link">Skip to main content</a>
          
          {/* Navigation Bar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
            <div className="container-fluid">
              <Link className="navbar-brand d-flex align-items-center" to="/">
                <i className="bi bi-box-seam me-2"></i>
                <span>Digital Logistics Hub</span>
              </Link>
              <button 
                className="navbar-toggler" 
                type="button" 
                onClick={toggleSidebar}
                aria-label="Toggle navigation"
                aria-expanded={sidebarOpen}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className={`collapse navbar-collapse ${sidebarOpen ? 'show' : ''}`} id="navbarNav">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/" onClick={() => setSidebarOpen(false)}>Home</Link>
                  </li>
                  {user && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/tracking" onClick={() => setSidebarOpen(false)}>Shipment Tracking</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/cargo" onClick={() => setSidebarOpen(false)}>Cargo Management</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/reports" onClick={() => setSidebarOpen(false)}>Reports</Link>
                      </li>
                    </>
                  )}
                </ul>
                <ul className="navbar-nav">
                  {user ? (
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-person-circle me-1"></i>
                        <span>{user.name}</span>
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><Link className="dropdown-item" to="/profile" onClick={() => setSidebarOpen(false)}><i className="bi bi-person me-2"></i>Profile</Link></li>
                        <li><Link className="dropdown-item" to="/settings" onClick={() => setSidebarOpen(false)}><i className="bi bi-gear me-2"></i>Settings</Link></li>
                        <li><Link className="dropdown-item" to="/notifications" onClick={() => setSidebarOpen(false)}><i className="bi bi-bell me-2"></i>Notifications</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item" onClick={() => { setUser(null); setSidebarOpen(false); }}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                      </ul>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <Link className="nav-link btn btn-outline-light ms-2" to="/login" onClick={() => setSidebarOpen(false)}>Login</Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main id="main-content" className="container-fluid flex-grow-1 mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/client-dashboard" element={<ClientDashboard user={user} />} />
              <Route path="/driver-dashboard" element={<DriverDashboard user={user} />} />
              <Route path="/tracking" element={<ShipmentTracking />} />
              <Route path="/cargo" element={<CargoManagement />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-light text-center text-lg-start mt-auto border-top">
            <div className="container p-4">
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase d-flex align-items-center">
                    <i className="bi bi-box-seam me-2"></i>
                    Digital Logistics Hub
                  </h5>
                  <p>
                    Modern, efficient logistics management system for tracking cargo ships and docked cargo with real-time updates.
                  </p>
                </div>
                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">Services</h5>
                  <ul className="list-unstyled mb-0">
                    <li><Link to="/tracking" className="text-dark">Shipment Tracking</Link></li>
                    <li><Link to="/cargo" className="text-dark">Cargo Management</Link></li>
                    <li><Link to="/reports" className="text-dark">Analytics</Link></li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">Resources</h5>
                  <ul className="list-unstyled mb-0">
                    <li><a href="#!" className="text-dark">Documentation</a></li>
                    <li><a href="#!" className="text-dark">API</a></li>
                    <li><a href="#!" className="text-dark">Support</a></li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">Contact</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-start mb-2">
                      <i className="bi bi-geo-alt me-2"></i>
                      <span>123 Logistics Way, Port City, PC 12345</span>
                    </li>
                    <li className="d-flex align-items-start mb-2">
                      <i className="bi bi-telephone me-2"></i>
                      <span>+1 (555) 123-4567</span>
                    </li>
                    <li className="d-flex align-items-start">
                      <i className="bi bi-envelope me-2"></i>
                      <span>info@digitallogisticshub.com</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center p-3 bg-dark text-light">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-md-6 text-md-start mb-2 mb-md-0">
                    © 2025 Digital Logistics Hub. All rights reserved.
                  </div>
                  <div className="col-md-6 text-md-end">
                    <a href="#!" className="text-light me-3"><i className="bi bi-facebook"></i></a>
                    <a href="#!" className="text-light me-3"><i className="bi bi-twitter"></i></a>
                    <a href="#!" className="text-light me-3"><i className="bi bi-linkedin"></i></a>
                    <a href="#!" className="text-light"><i className="bi bi-instagram"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

function Home() {
  const [stats, setStats] = useState({
    shipments: 1242,
    inTransit: 328,
    delivered: 892,
    onTime: 97.8
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Shipment #DLH-2025-001234 dispatched', time: '2 minutes ago', status: 'success' },
    { id: 2, action: 'Driver John Smith assigned to route #RT-456', time: '15 minutes ago', status: 'info' },
    { id: 3, action: 'Shipment #DLH-2025-001233 delivered', time: '1 hour ago', status: 'success' },
    { id: 4, action: 'New cargo received at warehouse #WH-07', time: '2 hours ago', status: 'info' },
    { id: 5, action: 'Shipment #DLH-2025-001232 delayed due to weather', time: '3 hours ago', status: 'warning' }
  ])

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="jumbotron bg-gradient-primary text-white rounded-3 p-5 shadow">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-4 fw-bold">Welcome to Digital Logistics Hub</h1>
                <p className="lead">Your comprehensive solution for cargo tracking and logistics management.</p>
                <hr className="my-4 bg-white opacity-100" />
                <p>Track shipments, manage cargo, and optimize delivery routes with our modern platform.</p>
                <div className="d-flex flex-wrap gap-2">
                  <Link className="btn btn-light btn-lg" to="/login" role="button">Get Started</Link>
                  <a className="btn btn-outline-light btn-lg" href="#features" role="button">Learn More</a>
                </div>
              </div>
              <div className="col-lg-4 d-none d-lg-block text-center">
                <div className="bg-white p-4 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '200px', height: '200px'}}>
                  <i className="bi bi-truck fs-1 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row mb-5" id="features">
        <div className="col-md-3 mb-4">
          <div className="card h-100 border-primary border-2 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                <i className="bi bi-box-seam text-primary fs-3"></i>
              </div>
              <h3 className="card-title">{stats.shipments.toLocaleString()}</h3>
              <p className="card-text text-muted">Total Shipments</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card h-100 border-success border-2 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                <i className="bi bi-truck text-success fs-3"></i>
              </div>
              <h3 className="card-title">{stats.inTransit.toLocaleString()}</h3>
              <p className="card-text text-muted">In Transit</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card h-100 border-info border-2 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                <i className="bi bi-check-circle text-info fs-3"></i>
              </div>
              <h3 className="card-title">{stats.delivered.toLocaleString()}</h3>
              <p className="card-text text-muted">Delivered</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card h-100 border-warning border-2 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                <i className="bi bi-clock-history text-warning fs-3"></i>
              </div>
              <h3 className="card-title">{stats.onTime}%</h3>
              <p className="card-text text-muted">On-Time Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="row mb-5">
        <div className="col-12 mb-4">
          <h2 className="text-center mb-4">Our Features</h2>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-geo-alt text-primary"></i>
                </div>
                <h5 className="card-title mb-0">Real-Time Tracking</h5>
              </div>
              <p className="card-text">Monitor your shipments in real-time with our advanced GPS tracking system. Get instant updates on location, status, and estimated delivery times.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-shield-check text-success"></i>
                </div>
                <h5 className="card-title mb-0">Secure & Reliable</h5>
              </div>
              <p className="card-text">Our platform ensures the highest level of security for your data with end-to-end encryption and compliance with industry standards.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-graph-up text-info"></i>
                </div>
                <h5 className="card-title mb-0">Analytics & Reports</h5>
              </div>
              <p className="card-text">Gain valuable insights with our comprehensive analytics dashboard. Track performance metrics, identify trends, and optimize operations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h3 className="mb-0">Recent Activity</h3>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{activity.action}</div>
                    </div>
                    <span className={`badge bg-${activity.status === 'success' ? 'success' : activity.status === 'warning' ? 'warning' : 'info'} rounded-pill`}>
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card bg-gradient-primary text-white rounded-3 shadow">
            <div className="card-body text-center p-5">
              <h2 className="card-title mb-3">Ready to Optimize Your Logistics?</h2>
              <p className="card-text mb-4">Join thousands of businesses using Digital Logistics Hub to streamline their supply chain operations.</p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link className="btn btn-light btn-lg" to="/login">Get Started Today</Link>
                <a className="btn btn-outline-light btn-lg" href="#!" role="button">Schedule a Demo</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
