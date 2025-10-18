import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Mock authentication - in a real app, this would be an API call
    if (email && password) {
      // Mock user data with roles
      let mockUser = null
      
      if (email === 'client@example.com' && password === 'client123') {
        mockUser = {
          id: 1,
          name: 'Client User',
          email: email,
          role: 'client'
        }
      } else if (email === 'driver@example.com' && password === 'driver123') {
        mockUser = {
          id: 2,
          name: 'Driver User',
          email: email,
          role: 'driver'
        }
      } else if (email === 'admin@example.com' && password === 'admin123') {
        mockUser = {
          id: 3,
          name: 'Admin User',
          email: email,
          role: 'admin'
        }
      } else {
        setError('Invalid credentials. Please try again.')
        return
      }
      
      setUser(mockUser)
      
      // Role-based redirection
      switch (mockUser.role) {
        case 'client':
          navigate('/client-dashboard')
          break
        case 'driver':
          navigate('/driver-dashboard')
          break
        case 'admin':
          // For now, we'll redirect admin to client dashboard as well
          // In a full implementation, there would be an admin dashboard
          navigate('/client-dashboard')
          break
        default:
          navigate('/')
      }
    } else {
      setError('Please enter both email and password.')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Login to Digital Logistics Hub</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
              
              <div className="mt-4">
                <h5 className="text-center">Demo Credentials</h5>
                <ul className="list-group">
                  <li className="list-group-item">
                    <strong>Client:</strong> client@example.com / client123
                  </li>
                  <li className="list-group-item">
                    <strong>Driver:</strong> driver@example.com / driver123
                  </li>
                  <li className="list-group-item">
                    <strong>Admin:</strong> admin@example.com / admin123
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login