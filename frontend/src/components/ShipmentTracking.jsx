import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/ShipmentTracking.css';

// Inline CSS for custom markers and status indicator
const markerStyles = `
.shipment-marker {
  box-shadow: 0 0 6px #3b82f6;
}
.driver-marker {
  box-shadow: 0 0 6px #10b981;
}
.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 2px;
  background: #d1d5db;
}
.status-indicator.online {
  background: #10b981;
}
.status-indicator.offline {
  background: #ef4444;
}
`;

// Inject styles into the document head
if (typeof document !== 'undefined' && !document.getElementById('shipment-tracking-marker-styles')) {
  const style = document.createElement('style');
  style.id = 'shipment-tracking-marker-styles';
  style.innerHTML = markerStyles;
  document.head.appendChild(style);
}

// Set Mapbox access token (in a real application, this should be in an environment variable)
// TODO: Move token to environment variable for production
mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpbWRhdWciLCJhIjoiY2swN2s5cHRoMDh6dzNkcXd5NzdjczZseiJ9.Jg9vWABHueLxSlucUQ4rMQ';

// Sample data for testing
const sampleShipments = [
  {
    id: 1,
    trackingNumber: 'SH001',
    status: 'In Transit',
    origin: { lat: 40.7128, lng: -74.0060, name: 'New York' },
    destination: { lat: 51.5074, lng: -0.1278, name: 'London' },
    estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    currentLocation: { lat: 40.7128, lng: -74.0060 },
    progress: 0,
    route: [
      { lat: 40.7128, lng: -74.0060 },
      { lat: 45.5017, lng: -73.5673 },
      { lat: 53.3498, lng: -6.2603 },
      { lat: 51.5074, lng: -0.1278 }
    ],
    currentRouteIndex: 0,
    speed: 800,
    distanceRemaining: 0,
    cargo: [
      { id: 1, description: 'Electronics', weight: '500kg', status: 'Loaded' }
    ],
    lastUpdate: new Date()
  },
  {
    id: 2,
    trackingNumber: 'SH002',
    status: 'Delivered',
    origin: { lat: 34.0522, lng: -118.2437 },
    destination: { lat: 35.6762, lng: 139.6503 },
    estimatedDelivery: '2025-10-15',
    currentLocation: { lat: 35.6762, lng: 139.6503 },
    progress: 100,
    cargo: [
      { id: 3, description: 'Automotive Parts', weight: '1200kg', status: 'Delivered' }
    ],
    lastUpdate: new Date()
  }
];

const sampleDrivers = [
  {
    id: 1,
    name: 'John Smith',
    phone: '+1-234-567-8901',
    vehicle: 'Truck #123',
    status: 'On Delivery',
    location: { lat: 40.7128, lng: -74.0060 },
    shipmentId: 1,
    lastUpdate: new Date(),
    speed: 0,
    heading: 0,
    battery: 85
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    phone: '+1-345-678-9012',
    vehicle: 'Van #456',
    status: 'Available',
    location: { lat: 34.0522, lng: -118.2437 },
    shipmentId: null,
    lastUpdate: new Date(),
    speed: 0,
    heading: 0,
    battery: 92
  }
];

const ShipmentTracking = () => {
  const [useSampleData, setUseSampleData] = useState(false);
  const [shipments, setShipments] = useState(sampleShipments || []);
  const [selectedShipment, setSelectedShipment] = useState(sampleShipments[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [drivers, setDrivers] = useState(sampleDrivers || []);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [mapError, setMapError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(1.5);
  const [filterLoading, setFilterLoading] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({});
  const driverMarkers = useRef({});
  const socketRef = useRef(null);

  const updateShipmentMarker = (shipment) => {
    if (!map.current || !mapLoaded) return;

    const markerId = `shipment-${shipment.id}`;
    const location = shipment.currentLocation;

    if (markers.current[markerId]) {
      const marker = markers.current[markerId];
      marker.setLngLat([location.lng, location.lat]);
    } else {
      const el = document.createElement('div');
      el.className = 'shipment-marker moving';
      el.style.background = shipment.status === 'In Transit' ? '#3b82f6' : '#6b7280';
      el.style.border = '3px solid white';
      el.style.borderRadius = '50%';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);

      markers.current[markerId] = marker;

      el.addEventListener('click', () => {
        handleShipmentSelect(shipment);
        setSelectedDriver(null);
      });
    }
  };

  const updateDriverMarker = useCallback((driver) => {
    if (!map.current || !mapLoaded) return;

    const markerId = `driver-${driver.id}`;
    const location = driver.location;

    if (driverMarkers.current[markerId]) {
      driverMarkers.current[markerId].setLngLat([location.lng, location.lat]);
    } else {
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.style.background = driver.status === 'On Delivery' ? '#10b981' : driver.status === 'In Transit' ? '#f59e0b' : '#6b7280';
      el.style.border = '2px solid white';
      el.style.borderRadius = '50%';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);

      driverMarkers.current[markerId] = marker;

      el.addEventListener('click', () => {
        setSelectedDriver(driver);
        setSelectedShipment(null);
      });
    }
  }, [mapLoaded]);

  useEffect(() => {
    const socket = io('http://localhost:3135', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketRef.current = socket;

    const handleInitialData = (data) => {
      const safeShipments = data?.shipments || sampleShipments || [];
      const safeDrivers = data?.drivers || sampleDrivers || [];

      if (!useSampleData && isConnected) {
        setShipments(safeShipments);
        setDrivers(safeDrivers);

        if (safeShipments.length > 0 && !selectedShipment) {
          setSelectedShipment(safeShipments[0]);
        }
      }
      setLoading(false);
    };

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('initialData', handleInitialData);

    socket.on('trackingUpdate', (updatedShipment) => {
      if (useSampleData) return;

      setShipments(prevShipments =>
        prevShipments.map(shipment =>
          shipment.id === updatedShipment.id ? updatedShipment : shipment
        )
      );

      if (selectedShipment?.id === updatedShipment.id) {
        setSelectedShipment(updatedShipment);
      }
      updateShipmentMarker(updatedShipment);
    });

    socket.on('driverUpdate', (updatedDriver) => {
      if (useSampleData) return;

      setDrivers(prevDrivers => {
        const existingDriverIndex = prevDrivers.findIndex(driver => driver.id === updatedDriver.id);
        if (existingDriverIndex >= 0) {
          const updatedDrivers = [...prevDrivers];
          updatedDrivers[existingDriverIndex] = updatedDriver;
          return updatedDrivers;
        } else {
          return [...prevDrivers, updatedDriver];
        }
      });

      setLastUpdate(new Date());
      updateDriverMarker(updatedDriver);
    });

    socket.on('connect_error', (err) => {
      setIsConnected(false);
      setLoading(false);
      setMapError(`Socket connection error: ${err.message}`);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('initialData', handleInitialData);
      socket.off('trackingUpdate');
      socket.off('driverUpdate');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [useSampleData, isConnected, selectedShipment, updateShipmentMarker, updateDriverMarker]);

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [0, 0],
          zoom: zoom,
          attributionControl: false
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true
          }),
          'top-right'
        );

        map.current.on('load', () => {
          setMapLoaded(true);
          shipments.forEach(updateShipmentMarker);
          drivers.forEach(updateDriverMarker);
        });

        map.current.on('error', (e) => {
          setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
        });

      } catch (error) {
        setMapError(`Error initializing map: ${error.message}`);
      }
    }

    return () => {
      Object.values(markers.current).forEach(marker => marker.remove());
      Object.values(driverMarkers.current).forEach(marker => marker.remove());
      markers.current = {};
      driverMarkers.current = {};

      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [zoom, shipments, drivers, updateShipmentMarker, updateDriverMarker]);

  useEffect(() => {
    setFilterLoading(true);
    const timeout = setTimeout(() => {
      setFilterLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const MapErrorBoundary = ({ error, children }) => {
    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Map Loading Error</h4>
          <p>{error}</p>
          <p>Please check your internet connection and Mapbox access token.</p>
        </div>
      );
    }
    return children;
  };

  const displayedShipments = (useSampleData || !isConnected ? sampleShipments : shipments) || [];
  const displayedDrivers = (useSampleData || !isConnected ? sampleDrivers : drivers) || [];
  const displayedSelectedShipment = selectedShipment;

  const filteredShipments = displayedShipments?.filter(shipment =>
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleShipmentSelect = (shipment) => {
    setSelectedShipment(shipment);
    setSelectedDriver(null);
  };

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
    setSelectedShipment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'In Transit': return 'warning';
      case 'Pending': return 'secondary';
      case 'On Delivery': return 'success';
      case 'Available': return 'info';
      default: return 'secondary';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTimeDifference = (timestamp) => {
    const now = new Date();
    const diffMs = now - new Date(timestamp);
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) {
      return `${diffSecs} seconds ago`;
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else {
      return `${diffHours} hours ago`;
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="row mx-0">
        <div className="col-12 px-0">
          <h1 className="mb-4">Real-Time Vehicle Tracking</h1>
          <p className="lead">Track shipments and drivers in real-time with detailed status updates.</p>
          <div className="mb-3 d-flex flex-wrap align-items-center">
            <span className={`badge ${isConnected ? 'bg-success' : 'bg-danger'} me-2 mb-2`}>
              {isConnected ? 'Live Tracking Active' : 'Disconnected'}
            </span>
            <span className="text-muted small me-2 mb-2">
              Last update: {formatTimeDifference(lastUpdate)}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary mb-2"
              onClick={() => setUseSampleData(!useSampleData)}
            >
              {useSampleData ? 'Use Real Data' : 'Use Sample Data'}
            </button>
          </div>
        </div>
      </div>

      <MapErrorBoundary error={mapError}>
        {mapError && (
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Map Loading Error</h4>
            <p>{mapError}</p>
            <p>Please check your internet connection and Mapbox access token.</p>
          </div>
        )}
      </MapErrorBoundary>

      <div className="row mb-4 mx-0">
        <div className="col-12 px-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by tracking number or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search Shipments"
            />
          </div>
        </div>
      </div>

      <div className="row">
        {loading && (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="col-xl-4 col-lg-5 col-md-12 px-0">
          {(typeof activeView !== 'undefined' ? activeView === 'shipments' : true) || window.innerWidth >= 768 ? (
            <div className="card shadow-sm mb-4 h-100">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <i className="bi bi-box-seam me-2"></i>Shipments
                </h3>
                <span className="badge bg-light text-dark">
                  {filteredShipments.length}
                </span>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {filteredShipments.length > 0 ? (
                    filteredShipments.map(shipment => (
                      <button
                        key={shipment.id}
                        type="button"
                        className={`list-group-item list-group-item-action ${displayedSelectedShipment?.id === shipment.id ? 'active' : ''}`}
                        onClick={() => handleShipmentSelect(shipment)}
                        aria-pressed={displayedSelectedShipment?.id === shipment.id}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">{shipment.trackingNumber}</h5>
                          <div>
                            <span className={`badge bg-${getStatusColor(shipment.status)} me-2`}>
                              {shipment.status}
                            </span>
                          </div>
                        </div>
                        <p className="mb-1">
                          <i className="bi bi-geo-alt me-1"></i>
                          {shipment.origin?.name || 'Unknown'} → {shipment.destination?.name || 'Unknown'}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small>
                            <i className="bi bi-clock me-1"></i>
                            Updated: {formatTimeDifference(shipment.lastUpdate)}
                          </small>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="list-group-item text-center text-muted">
                      <i className="bi bi-inbox fs-1"></i>
                      <p className="mt-2">No shipments found</p>
                      {searchTerm && (
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Drivers</h3>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {displayedDrivers.map(driver => (
                  <button
                    key={driver.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${selectedDriver?.id === driver.id ? 'active' : ''}`}
                    onClick={() => handleDriverSelect(driver)}
                    tabIndex={0}
                    aria-selected={selectedDriver?.id === driver.id}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{driver.name}</h5>
                      <div>
                        <span className={`badge bg-${getStatusColor(driver.status)} me-2`}>
                          {driver.status}
                        </span>
                        <span className="badge bg-info">
                          {formatTimeDifference(driver.lastUpdate)}
                        </span>
                      </div>
                    </div>
                    <p className="mb-1">{driver.vehicle}</p>
                    <div className="d-flex justify-content-between">
                      <small>Last update: {formatTimestamp(driver.lastUpdate)}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-8 col-lg-7 col-md-12 px-0">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h3 className="mb-0">Tracking Map</h3>
            </div>
            <div className="card-body p-0">
              <div
                ref={mapContainer}
                className="map-container w-100"
                style={{ height: '500px' }}
              />
              {!mapLoaded && !mapError && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '500px' }}>
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading map...</span>
                    </div>
                    <p className="mt-2">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              {displayedSelectedShipment ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0">Shipment Details: {displayedSelectedShipment.trackingNumber}</h3>
                    <div>
                      <span className={`badge bg-${getStatusColor(displayedSelectedShipment.status)} fs-6 me-2`}>
                        {displayedSelectedShipment.status}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Status:</strong></td>
                            <td>
                              <span className={`badge bg-${getStatusColor(displayedSelectedShipment.status)}`}>
                                {displayedSelectedShipment.status}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Origin:</strong></td>
                            <td>
                              {displayedSelectedShipment.origin.lat.toFixed(4)}, 
                              {displayedSelectedShipment.origin.lng.toFixed(4)}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Destination:</strong></td>
                            <td>
                              {displayedSelectedShipment.destination.lat.toFixed(4)}, 
                              {displayedSelectedShipment.destination.lng.toFixed(4)}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Current Location:</strong></td>
                            <td>
                              {displayedSelectedShipment.currentLocation.lat.toFixed(4)}, 
                              {displayedSelectedShipment.currentLocation.lng.toFixed(4)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Estimated Delivery:</strong></td>
                            <td>{displayedSelectedShipment.estimatedDelivery}</td>
                          </tr>
                          <tr>
                            <td><strong>Last Update:</strong></td>
                            <td>{formatTimestamp(displayedSelectedShipment.lastUpdate)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-12">
                      <h4>Cargo Details</h4>
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Weight</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedSelectedShipment.cargo.map(item => (
                              <tr key={item.id}>
                                <td>{item.description}</td>
                                <td>{item.weight}</td>
                                <td>
                                  <span className={`badge bg-${getStatusColor(item.status)}`}>
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedDriver ? (
                <div>
                  <h3 className="mb-3">Driver Details: {selectedDriver.name}</h3>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Status:</strong></td>
                            <td>
                              <span className={`badge bg-${getStatusColor(selectedDriver.status)}`}>
                                {selectedDriver.status}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Vehicle:</strong></td>
                            <td>{selectedDriver.vehicle}</td>
                          </tr>
                          <tr>
                            <td><strong>Phone:</strong></td>
                            <td>{selectedDriver.phone}</td>
                          </tr>
                          <tr>
                            <td><strong>Speed:</strong></td>
                            <td>{selectedDriver.speed} km/h</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Current Location:</strong></td>
                            <td>
                              {selectedDriver.location.lat.toFixed(4)}, 
                              {selectedDriver.location.lng.toFixed(4)}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Heading:</strong></td>
                            <td>{selectedDriver.heading}°</td>
                          </tr>
                          <tr>
                            <td><strong>Assigned Shipment:</strong></td>
                            <td>
                              {selectedDriver.shipmentId ? 
                                `SH00${selectedDriver.shipmentId}` : 
                                'None'}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Battery:</strong></td>
                            <td>
                              <div className="progress" style={{ height: '10px' }}>
                                <div
                                  className="progress-bar bg-success"
                                  role="progressbar"
                                  style={{ width: `${selectedDriver.battery}%` }}
                                  aria-valuenow={selectedDriver.battery}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                </div>
                              </div>
                              {Math.round(selectedDriver.battery)}%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <h3>Select a shipment or driver to view details</h3>
                  <p className="lead">Choose a shipment or driver from the list to see its tracking information and status updates.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracking;