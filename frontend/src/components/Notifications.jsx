import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
    shipmentUpdates: true,
    deliveryNotifications: true,
    systemAlerts: true
  })

  // Mock data for notifications
  const mockNotifications = [
    { id: 1, message: 'Your shipment SH001 has departed from New York port', time: '2 hours ago', read: false, type: 'shipment' },
    { id: 2, message: 'New shipment quote available for your request', time: '1 day ago', read: true, type: 'system' },
    { id: 3, message: 'Driver has completed delivery for shipment SH002', time: '2 days ago', read: false, type: 'delivery' },
    { id: 4, message: 'Shipment SH003 has arrived at Chicago port', time: '3 days ago', read: true, type: 'shipment' },
    { id: 5, message: 'Scheduled maintenance on tracking system', time: '1 week ago', read: true, type: 'system' },
  ]

  useEffect(() => {
    // Simulate API call to fetch notifications
    setNotifications(mockNotifications)
  }, [])

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, read: true })
    ))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => 
      notification.id !== id
    ))
  }

  const handleSettingsChange = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    })
  }

  const unreadCount = notifications.filter(notification => !notification.read).length

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Notifications</h1>
            <div>
              <button className="btn btn-outline-primary me-2" onClick={markAllAsRead}>
                Mark All as Read
              </button>
              <button className="btn btn-primary" onClick={() => setShowSettings(!showSettings)}>
                {showSettings ? 'Hide Settings' : 'Notification Settings'}
              </button>
            </div>
          </div>
          <p>You have {unreadCount} unread notifications.</p>
        </div>
      </div>

      {/* Notification Settings */}
      {showSettings && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3>Notification Settings</h3>
              </div>
              <div className="card-body">
                <h4>Notification Methods</h4>
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="emailNotifications" 
                    checked={settings.email}
                    onChange={() => handleSettingsChange('email')}
                  />
                  <label className="form-check-label" htmlFor="emailNotifications">
                    Email Notifications
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="pushNotifications" 
                    checked={settings.push}
                    onChange={() => handleSettingsChange('push')}
                  />
                  <label className="form-check-label" htmlFor="pushNotifications">
                    Push Notifications
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="smsNotifications" 
                    checked={settings.sms}
                    onChange={() => handleSettingsChange('sms')}
                  />
                  <label className="form-check-label" htmlFor="smsNotifications">
                    SMS Notifications
                  </label>
                </div>

                <h4 className="mt-4">Notification Types</h4>
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="shipmentUpdates" 
                    checked={settings.shipmentUpdates}
                    onChange={() => handleSettingsChange('shipmentUpdates')}
                  />
                  <label className="form-check-label" htmlFor="shipmentUpdates">
                    Shipment Status Updates
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="deliveryNotifications" 
                    checked={settings.deliveryNotifications}
                    onChange={() => handleSettingsChange('deliveryNotifications')}
                  />
                  <label className="form-check-label" htmlFor="deliveryNotifications">
                    Delivery Notifications
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="systemAlerts" 
                    checked={settings.systemAlerts}
                    onChange={() => handleSettingsChange('systemAlerts')}
                  />
                  <label className="form-check-label" htmlFor="systemAlerts">
                    System Alerts
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Recent Notifications</h3>
            </div>
            <div className="card-body">
              {notifications.length > 0 ? (
                <div className="list-group">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`list-group-item list-group-item-action ${!notification.read ? 'bg-light' : ''}`}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{notification.message}</h5>
                        <small>{notification.time}</small>
                      </div>
                      <div className="d-flex w-100 justify-content-between mt-2">
                        <span className={`badge bg-${notification.type === 'shipment' ? 'primary' : notification.type === 'delivery' ? 'success' : 'warning'}`}>
                          {notification.type}
                        </span>
                        <div>
                          {!notification.read && (
                            <button 
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as Read
                            </button>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <h4>No notifications</h4>
                  <p>You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications