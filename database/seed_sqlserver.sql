-- Sample seed data for Logistics Management System
-- SQL Server Express compatible

USE logistics_hub;
GO

-- Insert lookup data for ENUM replacements
IF NOT EXISTS (SELECT * FROM UserRoles)
BEGIN
    INSERT INTO UserRoles (role_name) VALUES 
        ('admin'), 
        ('driver'), 
        ('client');
END
GO

IF NOT EXISTS (SELECT * FROM ShipmentStatus)
BEGIN
    INSERT INTO ShipmentStatus (status_name) VALUES 
        ('created'), 
        ('assigned'), 
        ('in_transit'), 
        ('delivered'), 
        ('verified');
END
GO

IF NOT EXISTS (SELECT * FROM PriorityLevels)
BEGIN
    INSERT INTO PriorityLevels (priority_level) VALUES 
        ('low'), 
        ('medium'), 
        ('high');
END
GO

IF NOT EXISTS (SELECT * FROM VerificationTypes)
BEGIN
    INSERT INTO VerificationTypes (verification_type) VALUES 
        ('QR'), 
        ('NFC'), 
        ('signature'), 
        ('photo');
END
GO

IF NOT EXISTS (SELECT * FROM NotificationTypes)
BEGIN
    INSERT INTO NotificationTypes (notification_type) VALUES 
        ('email'), 
        ('sms'), 
        ('push');
END
GO

IF NOT EXISTS (SELECT * FROM AlertTypes)
BEGIN
    INSERT INTO AlertTypes (alert_type) VALUES 
        ('route_deviation'), 
        ('delay'), 
        ('system');
END
GO

IF NOT EXISTS (SELECT * FROM DeliveryStatus)
BEGIN
    INSERT INTO DeliveryStatus (delivery_status) VALUES 
        ('success'), 
        ('failed'), 
        ('postponed');
END
GO

IF NOT EXISTS (SELECT * FROM ActionTypes)
BEGIN
    INSERT INTO ActionTypes (action_type) VALUES 
        ('INSERT'), 
        ('UPDATE'), 
        ('DELETE');
END
GO

IF NOT EXISTS (SELECT * FROM ZoneTypes)
BEGIN
    INSERT INTO ZoneTypes (zone_type) VALUES 
        ('restricted'), 
        ('monitored');
END
GO

-- Insert sample users
INSERT INTO Users (full_name, email, password_hash, role, phone_number, profile_image_url, organization_id) VALUES
('John Smith', 'john.smith@example.com', '$2b$10$examplehash1', 'admin', '+1234567890', 'https://example.com/profiles/john.jpg', NULL),
('Mike Johnson', 'mike.johnson@example.com', '$2b$10$examplehash2', 'driver', '+1234567891', 'https://example.com/profiles/mike.jpg', 1),
('Sarah Williams', 'sarah.williams@example.com', '$2b$10$examplehash3', 'driver', '+1234567892', 'https://example.com/profiles/sarah.jpg', 1),
('Acme Corp', 'contact@acmecorp.com', '$2b$10$examplehash4', 'client', '+1234567893', 'https://example.com/profiles/acme.jpg', 2),
('Global Shipping', 'info@globalshipping.com', '$2b$10$examplehash5', 'client', '+1234567894', 'https://example.com/profiles/global.jpg', 3);
GO

-- Insert sample shipments
INSERT INTO Shipments (tracking_number, client_id, driver_id, origin_address, destination_address, current_status, estimated_delivery, actual_delivery, priority, weight, dimensions_length, dimensions_width, dimensions_height, shipment_type, shipment_metadata, organization_id) VALUES
('TRK123456789', 4, 2, '123 Main St, New York, NY 10001', '456 Oak Ave, Los Angeles, CA 90210', 'in_transit', '2025-10-25T14:00:00', NULL, 'high', 15.5, 30.0, 20.0, 15.0, 'express', '{"fragile": true, "temperature_control": false}', 2),
('TRK987654321', 5, 3, '789 Broadway, Chicago, IL 60601', '321 Pine St, Miami, FL 33101', 'assigned', '2025-10-30T10:00:00', NULL, 'medium', 22.0, 40.0, 30.0, 25.0, 'standard', '{"fragile": false, "temperature_control": true}', 3),
('TRK555666777', 4, NULL, '123 Main St, New York, NY 10001', '777 Market St, San Francisco, CA 94103', 'created', '2025-11-05T09:00:00', NULL, 'low', 5.25, 20.0, 15.0, 10.0, 'parcel', '{"fragile": false, "temperature_control": false}', 2);
GO

-- Insert route optimization data
INSERT INTO Route_Optimization (shipment_id, route_data, optimized_distance, optimized_time, recalculated_at) VALUES
(1, '{"waypoints": [{"lat": 40.7128, "lng": -74.0060}, {"lat": 39.9526, "lng": -75.1652}, {"lat": 34.0522, "lng": -118.2437}], "total_stops": 3}', 2780.5, 1680, '2025-10-18T10:00:00'),
(2, '{"waypoints": [{"lat": 41.8781, "lng": -87.6298}, {"lat": 39.7392, "lng": -104.9903}, {"lat": 25.7617, "lng": -80.1918}], "total_stops": 3}', 1950.75, 1260, '2025-10-18T11:00:00');
GO

-- Insert tracking data
INSERT INTO Tracking (shipment_id, latitude, longitude, speed, timestamp, status_note) VALUES
(1, 40.7128, -74.0060, 65.5, '2025-10-18T08:00:00', 'Departed from origin facility'),
(1, 40.7218, -74.0160, 62.3, '2025-10-18T09:30:00', 'In transit through New Jersey'),
(1, 40.7308, -74.0260, 0.0, '2025-10-18T10:15:00', 'Stopped for fuel break');
GO

-- Insert verifications
INSERT INTO Verifications (shipment_id, verification_type, verified_by, signature_image_url, photo_url, device_id) VALUES
(1, 'signature', 2, 'https://example.com/signatures/trk123456789.jpg', NULL, 'DRV001');
GO

-- Insert notifications
INSERT INTO Notifications (user_id, message, type, is_read, sent_at) VALUES
(4, 'Your shipment TRK123456789 has been picked up and is in transit', 'email', 0, '2025-10-18T08:30:00'),
(5, 'Your shipment TRK987654321 has been assigned to a driver', 'push', 0, '2025-10-18T09:00:00'),
(2, 'You have been assigned shipment TRK123456789', 'sms', 1, '2025-10-18T07:45:00');
GO

-- Insert alerts
INSERT INTO Alerts (shipment_id, alert_type, description, created_at, resolved) VALUES
(1, 'delay', 'Shipment delayed due to traffic congestion', '2025-10-18T10:15:00', 0),
(2, 'route_deviation', 'Driver has deviated from optimized route', '2025-10-18T11:30:00', 0);
GO

-- Insert shipment status history
INSERT INTO Shipment_Status_History (shipment_id, status, changed_by, changed_at) VALUES
(1, 'created', 4, '2025-10-17T14:00:00'),
(1, 'assigned', 1, '2025-10-17T15:30:00'),
(1, 'in_transit', 2, '2025-10-18T08:00:00'),
(2, 'created', 5, '2025-10-17T16:00:00'),
(2, 'assigned', 1, '2025-10-18T09:00:00');
GO

-- Insert geofencing data
INSERT INTO Geofencing (name, latitude, longitude, radius, zone_type, organization_id) VALUES
('Restricted Zone - Downtown LA', 34.0522, -118.2437, 2.5, 'restricted', NULL),
('High Priority Delivery Zone - Miami', 25.7617, -80.1918, 5.0, 'monitored', 3);
GO

-- Insert delivery attempts
INSERT INTO Delivery_Attempts (shipment_id, attempt_number, attempted_by, attempt_time, status, reason) VALUES
(1, 1, 2, '2025-10-18T12:00:00', 'failed', 'Recipient not home'),
(1, 2, 2, '2025-10-18T14:30:00', 'postponed', 'Requested redelivery for tomorrow');
GO

-- Insert audit trail entries
INSERT INTO Audit_Trail (table_name, record_id, action, changed_by, before_state, after_state, changed_at) VALUES
('Shipments', 1, 'INSERT', 4, NULL, '{"tracking_number": "TRK123456789", "current_status": "created"}', '2025-10-17T14:00:00'),
('Shipments', 1, 'UPDATE', 2, '{"current_status": "assigned"}', '{"current_status": "in_transit"}', '2025-10-18T08:00:00');
GO