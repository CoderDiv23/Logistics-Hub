import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

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

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Digital Logistics Hub</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                {user && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/tracking">Shipment Tracking</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cargo">Cargo Management</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/reports">Reports</Link>
                    </li>
                  </>
                )}
              </ul>
              <ul className="navbar-nav">
                {user ? (
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                      {user.name}
                    </a>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                      <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                      <li><Link className="dropdown-item" to="/notifications">Notifications</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={() => setUser(null)}>Logout</button></li>
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container-fluid mt-4">
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
        <footer className="bg-light text-center text-lg-start mt-5">
          <div className="container p-4">
            <div className="row">
              <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
                <h5 className="text-uppercase">Digital Logistics Hub</h5>
                <p>
                  Modern, efficient logistics management system for tracking cargo ships and docked cargo with real-time updates.
                </p>
              </div>
              <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
                <h5 className="text-uppercase">Links</h5>
                <ul className="list-unstyled mb-0">
                  <li>
                    <Link to="/tracking" className="text-dark">Shipment Tracking</Link>
                  </li>
                  <li>
                    <Link to="/cargo" className="text-dark">Cargo Management</Link>
                  </li>
                  <li>
                    <Link to="/reports" className="text-dark">Reports</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center p-3 bg-dark text-light">
            © 2025 Digital Logistics Hub
          </div>
        </footer>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="jumbotron">
            <h1 className="display-4">Welcome to Digital Logistics Hub</h1>
            <p className="lead">Your comprehensive solution for cargo tracking and logistics management.</p>
            <hr className="my-4" />
            <p>Track shipments, manage cargo, and optimize delivery routes with our modern platform.</p>
            <Link className="btn btn-primary btn-lg" to="/login" role="button">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
