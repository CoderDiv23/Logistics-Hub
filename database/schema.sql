-- Logistics Management System Database Schema
-- MySQL 8.0+ compatible

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS logistics_hub;
USE logistics_hub;

-- 1. Users table - Primary entity representing all system participants
CREATE TABLE Users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'driver', 'client') NOT NULL,
    phone_number VARCHAR(20),
    profile_image_url TEXT,
    organization_id BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_organization (organization_id)
);

-- 2. Shipments table - Central entity managing all shipment lifecycle data
CREATE TABLE Shipments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    client_id BIGINT NOT NULL,
    driver_id BIGINT,
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    current_status ENUM('created', 'assigned', 'in_transit', 'delivered', 'verified') NOT NULL,
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    weight DECIMAL(10,2),
    dimensions_length DECIMAL(10,2),
    dimensions_width DECIMAL(10,2),
    dimensions_height DECIMAL(10,2),
    shipment_type VARCHAR(100),
    shipment_metadata JSON,
    organization_id BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES Users(id) ON DELETE SET NULL,
    INDEX idx_tracking_number (tracking_number),
    INDEX idx_client_id (client_id),
    INDEX idx_driver_id (driver_id),
    INDEX idx_current_status (current_status),
    INDEX idx_priority (priority),
    INDEX idx_shipment_type (shipment_type),
    INDEX idx_organization (organization_id)
);

-- 3. Route_Optimization table - Advanced routing intelligence storage
CREATE TABLE Route_Optimization (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shipment_id BIGINT UNIQUE NOT NULL,
    route_data JSON NOT NULL,
    optimized_distance DECIMAL(10,2),
    optimized_time INTEGER,
    recalculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
    INDEX idx_shipment_id (shipment_id)
);

-- 4. Tracking table - Real-time GPS and telemetry data capture
CREATE TABLE Tracking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shipment_id BIGINT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    speed DECIMAL(6,2),
    timestamp TIMESTAMP NOT NULL,
    status_note TEXT,
    
    FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
    INDEX idx_shipment_id (shipment_id),
    INDEX idx_timestamp (timestamp)
);

-- Add geospatial index for location-based queries
ALTER TABLE Tracking ADD SPATIAL INDEX idx_location (latitude, longitude);

-- 5. Verifications table - Multi-factor delivery confirmation system
CREATE TABLE Verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shipment_id BIGINT UNIQUE NOT NULL,
    verification_type ENUM('QR', 'NFC', 'signature', 'photo') NOT NULL,
    verified_by BIGINT NOT NULL,
    signature_image_url TEXT,
    photo_url TEXT,
    device_id VARCHAR(255),
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_shipment_id (shipment_id),
    INDEX idx_verified_by (verified_by),
    INDEX idx_verification_type (verification_type)
);

-- 6. Notifications table - Personalized messaging system
CREATE TABLE Notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    type ENUM('email', 'sms', 'push') NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read)
);

-- 7. Alerts table - Proactive monitoring and exception handling
CREATE TABLE Alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shipment_id BIGINT NOT NULL,
    alert_type ENUM('route_deviation', 'delay', 'system') NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT false NOT NULL,
    
    FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
    INDEX idx_shipment_id (shipment_id),
    INDEX idx_alert_type (alert_type),
    INDEX idx_resolved (resolved)
);

-- 8. Status History table - Track all status changes with timestamps
CREATE TABLE Shipment_Status_History (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shipment_id BIGINT NOT NULL,
    status ENUM('created', 'assigned', 'in_transit', 'delivered', 'verified') NOT NULL,
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES Users(id) ON DELETE SET NULL,
    INDEX idx_shipment_id (shipment_id),
    INDEX idx_status (status),
    INDEX idx_changed_at (changed_at)
);

-- 9. Geofencing table - Define restricted or monitored zones
CREATE TABLE Geofencing (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    radius DECIMAL(10,2) NOT NULL,
    zone_type ENUM('restricted', 'monitored') NOT NULL,
    organization_id BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_organization (organization_id),
    SPATIAL INDEX idx_zone (latitude, longitude)
);

-- 10. Delivery Attempts table - Log multiple delivery tries
CREATE TABLE Delivery_Attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shipment_id BIGINT NOT NULL,
    attempt_number INTEGER NOT NULL,
    attempted_by BIGINT,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('success', 'failed', 'postponed') NOT NULL,
    reason TEXT,
    
    FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
    FOREIGN KEY (attempted_by) REFERENCES Users(id) ON DELETE SET NULL,
    INDEX idx_shipment_id (shipment_id),
    INDEX idx_attempted_by (attempted_by),
    INDEX idx_attempt_time (attempt_time)
);

-- Audit Trail table - Track critical operational changes
CREATE TABLE Audit_Trail (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    changed_by BIGINT,
    before_state JSON,
    after_state JSON,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (changed_by) REFERENCES Users(id) ON DELETE SET NULL,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_action (action),
    INDEX idx_changed_at (changed_at)
);

-- Partitioning the Tracking table by month for better performance
ALTER TABLE Tracking PARTITION BY RANGE (YEAR(timestamp) * 100 + MONTH(timestamp)) (
    PARTITION p202401 VALUES LESS THAN (202402),
    PARTITION p202402 VALUES LESS THAN (202403),
    PARTITION p202403 VALUES LESS THAN (202404),
    PARTITION p202404 VALUES LESS THAN (202405),
    PARTITION p202405 VALUES LESS THAN (202406),
    PARTITION p202406 VALUES LESS THAN (202407),
    PARTITION p202407 VALUES LESS THAN (202408),
    PARTITION p202408 VALUES LESS THAN (202409),
    PARTITION p202409 VALUES LESS THAN (202410),
    PARTITION p202410 VALUES LESS THAN (202411),
    PARTITION p202411 VALUES LESS THAN (202412),
    PARTITION p202412 VALUES LESS THAN (202501),
    PARTITION p202501 VALUES LESS THAN (202502),
    PARTITION p202502 VALUES LESS THAN (202503),
    PARTITION p202503 VALUES LESS THAN (202504),
    PARTITION p202504 VALUES LESS THAN (202505),
    PARTITION p202505 VALUES LESS THAN (202506),
    PARTITION p202506 VALUES LESS THAN (202507),
    PARTITION p202507 VALUES LESS THAN (202508),
    PARTITION p202508 VALUES LESS THAN (202509),
    PARTITION p202509 VALUES LESS THAN (202510),
    PARTITION p202510 VALUES LESS THAN (202511),
    PARTITION p202511 VALUES LESS THAN (202512),
    PARTITION p202512 VALUES LESS THAN (202601),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);