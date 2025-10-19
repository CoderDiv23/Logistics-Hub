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
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <Router>
      <div className="App">
        {/* Sidebar */}
        <div className={`sidenav ${isOpen ? 'open' : ''}`}>
          <button className="closebtn" onClick={closeSidebar}>&times;</button>
          <Link to="/" onClick={closeSidebar}>Home</Link>
          <Link to="/client-dashboard" onClick={closeSidebar}>Client Dashboard</Link>
          <Link to="/tracking" onClick={closeSidebar}>Shipment Tracking</Link>
          <Link to="/cargo" onClick={closeSidebar}>Cargo Management</Link>
          <Link to="/reports" onClick={closeSidebar}>Reports</Link>
          <Link to="/login" onClick={closeSidebar}>Login</Link>
        </div>

        {/* Overlay */}
        {isOpen && <div className="overlay" onClick={closeSidebar}></div>}

        {/* Main content */}
        <div id="main" className={isOpen ? 'shifted' : ''}>
          {/* Sidebar toggle button */}
          <button className="openbtn" onClick={toggleSidebar}>☰ </button>

          <main className="container-fluid p-0">
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

          <footer className="text-center p-3 bg-dark text-light mt-5">
            © 2025 Digital Logistics Hub
          </footer>
        </div>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            Welcome to Digital <span style={{ color: '#28a745' }}>Logistics</span>{' '}
            <span style={{ color: '#ffc107' }}>Hub</span>
          </h1>
          <p>Your comprehensive solution for cargo tracking and logistics management.</p>
           <Link
    className="btn btn-primary btn-lg mt-4"
    to="/login"
    role="button"
    style={{ marginTop: '40px' }} // Adjust the distance here
  >
    Get Started
  </Link>
        </div>
      </div>

      {/* SPECIAL FEATURES SECTION */}
      <div className="container text-center mt-5">
        <h1 className="mb-4 fw-bold">Special Features</h1>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100 p-3 shadow-sm feature-card feature-blue">
              <h5>Real-Time Tracking</h5>
              <p>Monitor your shipments and deliveries as they happen.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 p-3 shadow-sm feature-card feature-green">
              <h5>Fleet Management</h5>
              <p>Optimize routes and manage drivers efficiently.</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 p-3 shadow-sm feature-card feature-yellow">
              <h5>Data Analytics</h5>
              <p>Visualize your logistics performance with insightful analytics.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App
