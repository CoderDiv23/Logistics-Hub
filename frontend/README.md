# Digital Logistics Hub

A comprehensive client-side web application for real-time cargo tracking and logistics management.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Components](#components)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [Performance Optimization](#performance-optimization)
- [Contributing](#contributing)
- [License](#license)

## Overview

Digital Logistics Hub is a modern, responsive web application designed for efficient cargo tracking and logistics management. The application provides real-time tracking of shipments and drivers, comprehensive cargo management, detailed analytics, and an intuitive user interface that works across all devices.

## Features

### Real-Time Tracking
- Live tracking of shipments and drivers
- Interactive map visualization with Mapbox
- Real-time status updates
- Progress indicators for all shipments

### Cargo Management
- Comprehensive cargo inventory management
- Status tracking (Pending, Loaded, In Transit, Delivered)
- Category-based organization
- Value tracking for cargo items

### Analytics & Reporting
- Shipment analytics with visual charts
- Cargo volume tracking
- Performance metrics
- Exportable reports in multiple formats

### User Management
- Role-based access control
- Profile management
- Notification system
- Settings customization

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Optimized performance on mobile devices

## Components

### 1. Main Application (App.jsx)
The main application component that provides:
- Navigation bar with responsive menu
- Routing for all application pages
- User authentication state management
- Global layout structure with header, content, and footer

### 2. Login Component (Login.jsx)
User authentication interface featuring:
- Email and password validation
- "Remember Me" functionality
- Demo credentials for testing
- Password visibility toggle
- Loading states and error handling

### 3. Client Dashboard (ClientDashboard.jsx)
Comprehensive dashboard with:
- Key metrics and statistics
- Recent shipments overview
- Notification center
- Tabbed interface for different views
- Search and filtering capabilities

### 4. Shipment Tracking (ShipmentTracking.jsx)
Real-time tracking interface including:
- Interactive Mapbox map
- Shipment and driver lists
- Detailed shipment information
- Route visualization
- Live status updates

### 5. Cargo Management (CargoManagement.jsx)
Cargo inventory management with:
- Add, edit, and delete cargo items
- Category-based filtering
- Status tracking
- Search functionality
- Detailed cargo information modals

### 6. Reports & Analytics (Reports.jsx)
Data visualization and reporting:
- Shipment, cargo, and performance reports
- Interactive charts
- Time range filtering
- Export functionality
- Detailed data tables

### 7. User Profile (UserProfile.jsx)
User account management:
- Profile information editing
- Password change functionality
- Notification preferences
- Account settings

### 8. Notifications (Notifications.jsx)
Notification system with:
- Real-time alerts
- Notification history
- Mark as read/unread functionality
- Notification filtering

### 9. Settings (Settings.jsx)
Application configuration:
- Theme preferences
- Notification settings
- Privacy controls
- Account security options

## Technology Stack

- **Frontend Framework**: React.js with Hooks
- **Routing**: React Router
- **Styling**: Bootstrap 5 with custom CSS
- **Icons**: Bootstrap Icons
- **Maps**: Mapbox GL JS
- **Real-time Communication**: Socket.IO
- **Build Tool**: Vite
- **Package Manager**: npm

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Demo Credentials
- **Client**: client@example.com / client123
- **Driver**: driver@example.com / driver123
- **Admin**: admin@example.com / admin123

### Navigation
1. **Home**: Overview of the application
2. **Shipment Tracking**: Real-time tracking of shipments and drivers
3. **Cargo Management**: Manage cargo inventory
4. **Reports**: Analytics and data visualization
5. **Profile**: User account settings
6. **Settings**: Application configuration
7. **Notifications**: Alert center

## Responsive Design

The application implements a mobile-first responsive design approach:
- Flexible grid layouts using Bootstrap
- Media queries for different screen sizes
- Touch-friendly interface elements
- Adaptive navigation for mobile devices
- Optimized performance on all devices

### Breakpoints
- **Extra Small (<576px)**: Mobile optimization
- **Small (≥576px)**: Landscape phones
- **Medium (≥768px)**: Tablets
- **Large (≥992px)**: Desktops
- **Extra Large (≥1200px)**: Large desktops

## Accessibility

The application follows WCAG 2.1 guidelines for accessibility:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management
- Skip to content links

### Features
- Keyboard operable interface
- Proper heading hierarchy
- Alt text for images
- Form labels and error messages
- Reduced motion support
- High contrast mode support

## Browser Support

The application supports modern browsers:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers with modern JavaScript support

### Polyfills
For older browsers, the following polyfills may be required:
- Promise
- Fetch API
- Array methods (forEach, map, filter)
- Object.assign

## Performance Optimization

### Techniques Implemented
- Code splitting with React.lazy
- Component memoization
- Efficient state management
- Lazy loading of images and maps
- CSS optimization
- Minified production builds

### Performance Features
- Loading spinners for async operations
- Skeleton screens for content loading
- Efficient re-rendering with React.memo
- Debounced search functionality
- Virtualized lists for large datasets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team or open an issue in the repository.
