const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3135;

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server with enhanced configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Store active shipments for simulation
let activeShipments = [
  {
    id: 1,
    trackingNumber: 'SH001',
    status: 'In Transit',
    origin: { lat: 40.7128, lng: -74.0060 }, // New York
    destination: { lat: 51.5074, lng: -0.1278 }, // London
    estimatedDelivery: '2025-10-25',
    currentLocation: { lat: 30.0000, lng: -30.0000 }, // Atlantic Ocean
    progress: 65,
    cargo: [
      { id: 1, description: 'Electronics', weight: '500kg', status: 'Loaded' },
      { id: 2, description: 'Clothing', weight: '200kg', status: 'In Transit' }
    ]
  },
  {
    id: 2,
    trackingNumber: 'SH002',
    status: 'Delivered',
    origin: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    destination: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    estimatedDelivery: '2025-10-15',
    currentLocation: { lat: 35.6762, lng: 139.6503 }, // Tokyo Warehouse
    progress: 100,
    cargo: [
      { id: 3, description: 'Automotive Parts', weight: '1200kg', status: 'Delivered' }
    ]
  },
  {
    id: 3,
    trackingNumber: 'SH003',
    status: 'In Transit',
    origin: { lat: 41.8781, lng: -87.6298 }, // Chicago
    destination: { lat: 52.5200, lng: 13.4050 }, // Berlin
    estimatedDelivery: '2025-10-30',
    currentLocation: { lat: 41.8781, lng: -87.6298 }, // Chicago Port
    progress: 10,
    cargo: [
      { id: 4, description: 'Machinery', weight: '800kg', status: 'Pending' },
      { id: 5, description: 'Tools', weight: '300kg', status: 'Pending' }
    ]
  },
  {
    id: 4,
    trackingNumber: 'SH004',
    status: 'In Transit',
    origin: { lat: 29.7604, lng: -95.3698 }, // Houston
    destination: { lat: -33.8688, lng: 151.2093 }, // Sydney
    estimatedDelivery: '2025-11-05',
    currentLocation: { lat: -10.0000, lng: -120.0000 }, // Pacific Ocean
    progress: 40,
    cargo: [
      { id: 6, description: 'Chemicals', weight: '1500kg', status: 'In Transit' }
    ]
  }
];

// Store active drivers for tracking with enhanced data
let activeDrivers = [
  {
    id: 1,
    name: 'John Smith',
    phone: '+1-234-567-8901',
    vehicle: 'Truck #123',
    status: 'On Delivery',
    location: { lat: 40.7128, lng: -74.0060 }, // New York
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
    location: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    shipmentId: null,
    lastUpdate: new Date(),
    speed: 0,
    heading: 0,
    battery: 92
  },
  {
    id: 3,
    name: 'Mike Williams',
    phone: '+1-456-789-0123',
    vehicle: 'Truck #789',
    status: 'In Transit',
    location: { lat: 41.8781, lng: -87.6298 }, // Chicago
    shipmentId: 3,
    lastUpdate: new Date(),
    speed: 0,
    heading: 0,
    battery: 78
  }
];

// Function to calculate ETA based on progress
function calculateETA(shipment) {
  // Parse the estimated delivery date
  const deliveryDate = new Date(shipment.estimatedDelivery);
  
  // Calculate days remaining based on progress (assuming linear progress)
  const daysTotal = 30; // Assuming 30 days total for shipment
  const daysRemaining = Math.max(0, daysTotal - (shipment.progress / 100) * daysTotal);
  
  // Calculate new ETA
  const currentDate = new Date();
  const etaDate = new Date(currentDate.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
  
  // Format date as YYYY-MM-DD
  const year = etaDate.getFullYear();
  const month = String(etaDate.getMonth() + 1).padStart(2, '0');
  const day = String(etaDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Enhanced simulation for real-time tracking updates
function simulateTrackingUpdates() {
  setInterval(() => {
    activeShipments.forEach(shipment => {
      // Only update shipments that are in transit
      if (shipment.status === 'In Transit' && shipment.progress < 100) {
        // Randomly update progress
        const increment = Math.floor(Math.random() * 3) + 1; // 1-3% increment
        shipment.progress = Math.min(shipment.progress + increment, 100);
        
        // Update ETA based on progress
        shipment.estimatedDelivery = calculateETA(shipment);
        
        // Update location based on progress with smooth transitions
        if (shipment.progress < 25) {
          // Move from origin towards departure port
          const ratio = shipment.progress / 25;
          shipment.currentLocation.lat = shipment.origin.lat + (40.0000 - shipment.origin.lat) * ratio;
          shipment.currentLocation.lng = shipment.origin.lng + (-40.0000 - shipment.origin.lng) * ratio;
        } else if (shipment.progress < 50) {
          // Move across ocean
          const ratio = (shipment.progress - 25) / 25;
          shipment.currentLocation.lat = 40.0000 + (30.0000 - 40.0000) * ratio;
          shipment.currentLocation.lng = -40.0000 + (-30.0000 - (-40.0000)) * ratio;
        } else if (shipment.progress < 75) {
          // Move towards arrival port
          const ratio = (shipment.progress - 50) / 25;
          shipment.currentLocation.lat = 30.0000 + (shipment.destination.lat - 30.0000) * ratio;
          shipment.currentLocation.lng = -30.0000 + (shipment.destination.lng - (-30.0000)) * ratio;
        } else if (shipment.progress < 90) {
          // Move from port to destination
          const ratio = (shipment.progress - 75) / 15;
          shipment.currentLocation.lat = shipment.destination.lat - (shipment.destination.lat - 45.0000) * (1 - ratio);
          shipment.currentLocation.lng = shipment.destination.lng - (shipment.destination.lng - -20.0000) * (1 - ratio);
        } else if (shipment.progress >= 100) {
          shipment.currentLocation = { ...shipment.destination };
          shipment.status = 'Delivered';
        }
        
        // Emit update to all connected clients
        io.emit('trackingUpdate', shipment);
      }
    });
  }, 5000); // Update every 5 seconds
}

// Enhanced simulation for real-time driver updates with GPS-like behavior
function simulateDriverUpdates() {
  setInterval(() => {
    activeDrivers.forEach(driver => {
      // Update driver locations with more realistic movement
      if (driver.status === 'In Transit' || driver.status === 'On Delivery') {
        // Find the associated shipment if any
        const shipment = activeShipments.find(s => s.id === driver.shipmentId);
        
        if (shipment) {
          // Move driver towards shipment destination
          const target = shipment.currentLocation;
          const current = driver.location;
          
          // Calculate direction vector
          const dx = target.lng - current.lng;
          const dy = target.lat - current.lat;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Move a portion of the way (simulate speed)
          if (distance > 0.0001) { // If not already at target
            const moveFactor = 0.05; // Move 5% of the way each update
            driver.location.lng += dx * moveFactor;
            driver.location.lat += dy * moveFactor;
            
            // Update speed and heading based on movement
            driver.speed = Math.min(80, Math.round(distance * 1000 * 3.6)); // Convert to km/h
            driver.heading = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
          } else {
            driver.speed = 0;
          }
        } else {
          // For drivers without shipments, move randomly
          const latChange = (Math.random() - 0.5) * 0.01;
          const lngChange = (Math.random() - 0.5) * 0.01;
          
          driver.location.lat = parseFloat((driver.location.lat + latChange).toFixed(6));
          driver.location.lng = parseFloat((driver.location.lng + lngChange).toFixed(6));
          driver.speed = Math.min(80, Math.round(Math.random() * 60));
        }
        
        // Update battery level
        driver.battery = Math.max(0, driver.battery - (Math.random() * 0.1));
        
        driver.lastUpdate = new Date();
        
        // Emit driver update to all connected clients
        io.emit('driverUpdate', driver);
      }
    });
  }, 3000); // Update every 3 seconds
}

// Start simulation when server starts
simulateTrackingUpdates();
simulateDriverUpdates();

// Socket.IO connection handling with enhanced features
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Send initial shipment data to newly connected client
  socket.emit('initialData', { shipments: activeShipments, drivers: activeDrivers });
  
  // Handle driver location updates from mobile devices
  socket.on('driverLocationUpdate', (data) => {
    const { driverId, location, speed, heading } = data;
    
    // Find the driver
    const driverIndex = activeDrivers.findIndex(d => d.id === driverId);
    if (driverIndex !== -1) {
      // Update driver location
      activeDrivers[driverIndex].location = location;
      activeDrivers[driverIndex].speed = speed;
      activeDrivers[driverIndex].heading = heading;
      activeDrivers[driverIndex].lastUpdate = new Date();
      
      // Broadcast update to all clients
      io.emit('driverUpdate', activeDrivers[driverIndex]);
      
      // Also update any associated shipment location
      const shipmentId = activeDrivers[driverIndex].shipmentId;
      if (shipmentId) {
        const shipmentIndex = activeShipments.findIndex(s => s.id === shipmentId);
        if (shipmentIndex !== -1) {
          activeShipments[shipmentIndex].currentLocation = { ...location };
          io.emit('trackingUpdate', activeShipments[shipmentIndex]);
        }
      }
    }
  });
  
  // Handle driver status updates
  socket.on('driverStatusUpdate', (data) => {
    const { driverId, status } = data;
    
    const driverIndex = activeDrivers.findIndex(d => d.id === driverId);
    if (driverIndex !== -1) {
      activeDrivers[driverIndex].status = status;
      activeDrivers[driverIndex].lastUpdate = new Date();
      
      // Broadcast update
      io.emit('driverUpdate', activeDrivers[driverIndex]);
    }
  });
  
  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server running on http://localhost:3135/");
});