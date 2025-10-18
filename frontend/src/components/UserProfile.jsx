import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Client',
    phone: '+1 (555) 123-4567',
    company: 'Global Logistics Inc.',
    address: '123 Logistics Way, Cargo City, CC 12345',
    profilePicture: '/placeholder-profile.jpg'
  })

  const [editedUser, setEditedUser] = useState({ ...user })

  const handleEdit = () => {
    setIsEditing(true)
    setEditedUser({ ...user })
  }

  const handleSave = () => {
    setUser({ ...editedUser })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser({ ...user })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedUser({
      ...editedUser,
      [name]: value
    })
  }

  const handlePictureUpload = (e) => {
    // In a real app, this would upload the file to a server
    // For now, we'll just simulate changing the profile picture
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setEditedUser({
          ...editedUser,
          profilePicture: event.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">User Profile</h1>
          <p>Manage your profile information and settings.</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h3>Profile Information</h3>
            </div>
            <div className="card-body">
              {isEditing ? (
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={editedUser.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={editedUser.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="company" className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      name="company"
                      value={editedUser.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      rows="3"
                      value={editedUser.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      id="role"
                      name="role"
                      value={editedUser.role}
                      readOnly
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="row mb-4">
                    <div className="col-md-3 text-center">
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="img-fluid rounded-circle mb-3" 
                        style={{ maxWidth: '150px', height: 'auto' }}
                      />
                      <div>
                        <label htmlFor="pictureUpload" className="btn btn-sm btn-outline-primary">
                          Change Picture
                        </label>
                        <input 
                          type="file" 
                          id="pictureUpload" 
                          className="d-none" 
                          onChange={handlePictureUpload}
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div className="col-md-9">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Name:</strong></td>
                            <td>{user.name}</td>
                          </tr>
                          <tr>
                            <td><strong>Email:</strong></td>
                            <td>{user.email}</td>
                          </tr>
                          <tr>
                            <td><strong>Role:</strong></td>
                            <td>
                              <span className="badge bg-primary">{user.role}</span>
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Phone:</strong></td>
                            <td>{user.phone}</td>
                          </tr>
                          <tr>
                            <td><strong>Company:</strong></td>
                            <td>{user.company}</td>
                          </tr>
                          <tr>
                            <td><strong>Address:</strong></td>
                            <td>{user.address}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={handleEdit}>
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Account Statistics</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 mb-3">
                  <div className="border rounded p-3 text-center">
                    <h4 className="display-6">24</h4>
                    <p className="mb-0">Shipments</p>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-3 text-center">
                    <h4 className="display-6">18</h4>
                    <p className="mb-0">Delivered</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h4 className="display-6">6</h4>
                    <p className="mb-0">In Transit</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h4 className="display-6">4.8</h4>
                    <p className="mb-0">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Security</h3>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary">Change Password</button>
                <button className="btn btn-outline-secondary">Two-Factor Authentication</button>
                <button className="btn btn-outline-danger">Deactivate Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile