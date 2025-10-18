import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      shipmentVisibility: 'connections'
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true
    }
  })

  const handleThemeChange = (theme) => {
    setSettings({
      ...settings,
      theme: theme
    })
  }

  const handleLanguageChange = (language) => {
    setSettings({
      ...settings,
      language: language
    })
  }

  const handleNotificationChange = (notificationType) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [notificationType]: !settings.notifications[notificationType]
      }
    })
  }

  const handlePrivacyChange = (setting, value) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [setting]: value
      }
    })
  }

  const handleSecurityChange = (setting, value) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [setting]: value
      }
    })
  }

  const handleTimezoneChange = (timezone) => {
    setSettings({
      ...settings,
      timezone: timezone
    })
  }

  const handleSave = () => {
    // In a real app, this would save settings to a server
    alert('Settings saved successfully!')
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Settings</h1>
          <p>Configure your application preferences and account settings.</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h3>General Settings</h3>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h5>Theme</h5>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${settings.theme === 'light' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    className={`btn ${settings.theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h5>Language</h5>
                <select 
                  className="form-select w-25"
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="mb-4">
                <h5>Timezone</h5>
                <select 
                  className="form-select w-25"
                  value={settings.timezone}
                  onChange={(e) => handleTimezoneChange(e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time (EST)</option>
                  <option value="PST">Pacific Time (PST)</option>
                  <option value="CET">Central European Time (CET)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h3>Notification Preferences</h3>
            </div>
            <div className="card-body">
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="emailNotifications" 
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
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
                  checked={settings.notifications.push}
                  onChange={() => handleNotificationChange('push')}
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
                  checked={settings.notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                />
                <label className="form-check-label" htmlFor="smsNotifications">
                  SMS Notifications
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Privacy Settings</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h5>Profile Visibility</h5>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="profileVisibility" 
                    id="profilePublic" 
                    checked={settings.privacy.profileVisibility === 'public'}
                    onChange={() => handlePrivacyChange('profileVisibility', 'public')}
                  />
                  <label className="form-check-label" htmlFor="profilePublic">
                    Public (Anyone can view your profile)
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="profileVisibility" 
                    id="profileConnections" 
                    checked={settings.privacy.profileVisibility === 'connections'}
                    onChange={() => handlePrivacyChange('profileVisibility', 'connections')}
                  />
                  <label className="form-check-label" htmlFor="profileConnections">
                    Connections Only (Only your connections can view your profile)
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="profileVisibility" 
                    id="profilePrivate" 
                    checked={settings.privacy.profileVisibility === 'private'}
                    onChange={() => handlePrivacyChange('profileVisibility', 'private')}
                  />
                  <label className="form-check-label" htmlFor="profilePrivate">
                    Private (Only you can view your profile)
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <h5>Shipment Visibility</h5>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="shipmentVisibility" 
                    id="shipmentPublic" 
                    checked={settings.privacy.shipmentVisibility === 'public'}
                    onChange={() => handlePrivacyChange('shipmentVisibility', 'public')}
                  />
                  <label className="form-check-label" htmlFor="shipmentPublic">
                    Public (Anyone can view your shipments)
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="shipmentVisibility" 
                    id="shipmentConnections" 
                    checked={settings.privacy.shipmentVisibility === 'connections'}
                    onChange={() => handlePrivacyChange('shipmentVisibility', 'connections')}
                  />
                  <label className="form-check-label" htmlFor="shipmentConnections">
                    Connections Only (Only your connections can view your shipments)
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="shipmentVisibility" 
                    id="shipmentPrivate" 
                    checked={settings.privacy.shipmentVisibility === 'private'}
                    onChange={() => handlePrivacyChange('shipmentVisibility', 'private')}
                  />
                  <label className="form-check-label" htmlFor="shipmentPrivate">
                    Private (Only you can view your shipments)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Security Settings</h3>
            </div>
            <div className="card-body">
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="twoFactorAuth" 
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="twoFactorAuth">
                  Two-Factor Authentication
                </label>
              </div>
              <div className="form-check mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="loginAlerts" 
                  checked={settings.security.loginAlerts}
                  onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="loginAlerts">
                  Login Alerts
                </label>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary">Change Password</button>
                <button className="btn btn-outline-secondary">View Login History</button>
                <button className="btn btn-outline-danger">Deactivate Account</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Actions</h3>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
                <button className="btn btn-outline-secondary">Export Data</button>
                <button className="btn btn-outline-secondary">Import Settings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings