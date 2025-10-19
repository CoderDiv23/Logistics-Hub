import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Load saved credentials if "Remember Me" was previously selected
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail')
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true'
    
    if (savedRememberMe && savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const validateForm = () => {
    if (!email) {
      setError('Email is required')
      return false
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email address is invalid')
      return false
    }
    
    if (!password) {
      setError('Password is required')
      return false
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      // Mock authentication - in a real app, this would be an API call
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
        throw new Error('Invalid credentials. Please try again.')
      }
      
      // Save email if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('savedEmail', email)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('savedEmail')
        localStorage.removeItem('rememberMe')
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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login to Digital Logistics Hub
              </h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope me-2"></i>Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby="emailHelp"
                    placeholder="Enter your email"
                  />
                  <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="bi bi-lock me-2"></i>Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                  </div>
                </div>
                
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-4 text-center">
                <a href="#!" className="text-decoration-none">Forgot password?</a>
              </div>
              
              <div className="mt-4">
                <h5 className="text-center mb-3">
                  <i className="bi bi-person-badge me-2"></i>Demo Credentials
                </h5>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h6 className="card-title text-primary">Client</h6>
                        <p className="card-text small">
                          <strong>Email:</strong> client@example.com<br/>
                          <strong>Password:</strong> client123
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-2">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h6 className="card-title text-success">Driver</h6>
                        <p className="card-text small">
                          <strong>Email:</strong> driver@example.com<br/>
                          <strong>Password:</strong> driver123
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-2">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h6 className="card-title text-warning">Admin</h6>
                        <p className="card-text small">
                          <strong>Email:</strong> admin@example.com<br/>
                          <strong>Password:</strong> admin123
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="mb-0">Don't have an account? <a href="#!" className="text-decoration-none">Sign up</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login