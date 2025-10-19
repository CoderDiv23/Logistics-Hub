-- Logistics Management System Database Schema
-- SQL Server Express compatible

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'logistics_hub')
BEGIN
    CREATE DATABASE logistics_hub;
END
GO

USE logistics_hub;
GO

-- Create UserRoles table to replace ENUM for Users.role
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserRoles' AND xtype='U')
BEGIN
    CREATE TABLE UserRoles (
        role_name NVARCHAR(20) PRIMARY KEY
    );
    
    INSERT INTO UserRoles (role_name) VALUES 
        ('admin'), 
        ('driver'), 
        ('client');
END
GO

-- Create ShipmentStatus table to replace ENUM for Shipments.current_status
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ShipmentStatus' AND xtype='U')
BEGIN
    CREATE TABLE ShipmentStatus (
        status_name NVARCHAR(20) PRIMARY KEY
    );
    
    INSERT INTO ShipmentStatus (status_name) VALUES 
        ('created'), 
        ('assigned'), 
        ('in_transit'), 
        ('delivered'), 
        ('verified');
END
GO

-- Create PriorityLevels table to replace ENUM for Shipments.priority
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PriorityLevels' AND xtype='U')
BEGIN
    CREATE TABLE PriorityLevels (
        priority_level NVARCHAR(10) PRIMARY KEY
    );
    
    INSERT INTO PriorityLevels (priority_level) VALUES 
        ('low'), 
        ('medium'), 
        ('high');
END
GO

-- Create VerificationTypes table to replace ENUM for Verifications.verification_type
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='VerificationTypes' AND xtype='U')
BEGIN
    CREATE TABLE VerificationTypes (
        verification_type NVARCHAR(20) PRIMARY KEY
    );
    
    INSERT INTO VerificationTypes (verification_type) VALUES 
        ('QR'), 
        ('NFC'), 
        ('signature'), 
        ('photo');
END
GO

-- Create NotificationTypes table to replace ENUM for Notifications.type
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='NotificationTypes' AND xtype='U')
BEGIN
    CREATE TABLE NotificationTypes (
        notification_type NVARCHAR(10) PRIMARY KEY
    );
    
    INSERT INTO NotificationTypes (notification_type) VALUES 
        ('email'), 
        ('sms'), 
        ('push');
END
GO

-- Create AlertTypes table to replace ENUM for Alerts.alert_type
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AlertTypes' AND xtype='U')
BEGIN
    CREATE TABLE AlertTypes (
        alert_type NVARCHAR(20) PRIMARY KEY
    );
    
    INSERT INTO AlertTypes (alert_type) VALUES 
        ('route_deviation'), 
        ('delay'), 
        ('system');
END
GO

-- Create DeliveryStatus table to replace ENUM for Delivery_Attempts.status
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DeliveryStatus' AND xtype='U')
BEGIN
    CREATE TABLE DeliveryStatus (
        delivery_status NVARCHAR(20) PRIMARY KEY
    );
    
    INSERT INTO DeliveryStatus (delivery_status) VALUES 
        ('success'), 
        ('failed'), 
        ('postponed');
END
GO

-- Create ActionTypes table to replace ENUM for Audit_Trail.action
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ActionTypes' AND xtype='U')
BEGIN
    CREATE TABLE ActionTypes (
        action_type NVARCHAR(10) PRIMARY KEY
    );
    
    INSERT INTO ActionTypes (action_type) VALUES 
        ('INSERT'), 
        ('UPDATE'), 
        ('DELETE');
END
GO

-- Create ZoneTypes table to replace ENUM for Geofencing.zone_type
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ZoneTypes' AND xtype='U')
BEGIN
    CREATE TABLE ZoneTypes (
        zone_type NVARCHAR(20) PRIMARY KEY
    );
    
    INSERT INTO ZoneTypes (zone_type) VALUES 
        ('restricted'), 
        ('monitored');
END
GO

-- 1. Users table - Primary entity representing all system participants
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        full_name NVARCHAR(255) NOT NULL,
        email NVARCHAR(320) UNIQUE NOT NULL,
        password_hash NVARCHAR(255) NOT NULL,
        role NVARCHAR(20) NOT NULL,
        phone_number NVARCHAR(20),
        profile_image_url NVARCHAR(MAX),
        organization_id BIGINT,
        deleted_at DATETIME2 NULL,
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_Users_Role FOREIGN KEY (role) REFERENCES UserRoles(role_name)
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_email ON Users (email);
    CREATE NONCLUSTERED INDEX idx_role ON Users (role);
    CREATE NONCLUSTERED INDEX idx_organization ON Users (organization_id);
END
GO

-- 2. Shipments table - Central entity managing all shipment lifecycle data
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Shipments' AND xtype='U')
BEGIN
    CREATE TABLE Shipments (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        tracking_number NVARCHAR(50) UNIQUE NOT NULL,
        client_id BIGINT NOT NULL,
        driver_id BIGINT,
        origin_address NVARCHAR(MAX) NOT NULL,
        destination_address NVARCHAR(MAX) NOT NULL,
        current_status NVARCHAR(20) NOT NULL,
        estimated_delivery DATETIME2,
        actual_delivery DATETIME2,
        priority NVARCHAR(10) DEFAULT 'medium',
        weight DECIMAL(10,2),
        dimensions_length DECIMAL(10,2),
        dimensions_width DECIMAL(10,2),
        dimensions_height DECIMAL(10,2),
        shipment_type NVARCHAR(100),
        shipment_metadata NVARCHAR(MAX),
        organization_id BIGINT,
        deleted_at DATETIME2 NULL,
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_Shipments_Client FOREIGN KEY (client_id) REFERENCES Users(id) ON DELETE CASCADE,
        CONSTRAINT FK_Shipments_Driver FOREIGN KEY (driver_id) REFERENCES Users(id) ON DELETE SET NULL,
        CONSTRAINT FK_Shipments_Status FOREIGN KEY (current_status) REFERENCES ShipmentStatus(status_name),
        CONSTRAINT FK_Shipments_Priority FOREIGN KEY (priority) REFERENCES PriorityLevels(priority_level)
        -- Removed ISJSON check constraint as it may not be available in all SQL Server versions
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_tracking_number ON Shipments (tracking_number);
    CREATE NONCLUSTERED INDEX idx_client_id ON Shipments (client_id);
    CREATE NONCLUSTERED INDEX idx_driver_id ON Shipments (driver_id);
    CREATE NONCLUSTERED INDEX idx_current_status ON Shipments (current_status);
    CREATE NONCLUSTERED INDEX idx_priority ON Shipments (priority);
    CREATE NONCLUSTERED INDEX idx_shipment_type ON Shipments (shipment_type);
    CREATE NONCLUSTERED INDEX idx_organization ON Shipments (organization_id);
END
GO

-- 3. Route_Optimization table - Advanced routing intelligence storage
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Route_Optimization' AND xtype='U')
BEGIN
    CREATE TABLE Route_Optimization (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        shipment_id BIGINT UNIQUE NOT NULL,
        route_data NVARCHAR(MAX) NOT NULL,
        optimized_distance DECIMAL(10,2),
        optimized_time INTEGER,
        recalculated_at DATETIME2 DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_Route_Optimization_Shipment FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE
        -- Removed ISJSON check constraint as it may not be available in all SQL Server versions
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_shipment_id ON Route_Optimization (shipment_id);
END
GO

-- 4. Tracking table - Real-time GPS and telemetry data capture
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tracking' AND xtype='U')
BEGIN
    CREATE TABLE Tracking (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        shipment_id BIGINT NOT NULL,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        speed DECIMAL(6,2),
        timestamp DATETIME2 NOT NULL,
        status_note NVARCHAR(MAX),
        
        CONSTRAINT FK_Tracking_Shipment FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_shipment_id ON Tracking (shipment_id);
    CREATE NONCLUSTERED INDEX idx_timestamp ON Tracking (timestamp);
END
GO

-- Add geospatial index for location-based queries
-- SQL Server uses geography data type for spatial data
IF NOT EXISTS (SELECT * FROM sys.columns WHERE name='location' AND object_id = OBJECT_ID('Tracking'))
BEGIN
    ALTER TABLE Tracking ADD location AS geography::Point(latitude, longitude, 4326) PERSISTED;
    CREATE SPATIAL INDEX idx_location ON Tracking(location);
END
GO

-- 5. Verifications table - Multi-factor delivery confirmation system
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Verifications' AND xtype='U')
BEGIN
    CREATE TABLE Verifications (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        shipment_id BIGINT UNIQUE NOT NULL,
        verification_type NVARCHAR(20) NOT NULL,
        verified_by BIGINT NOT NULL,
        signature_image_url NVARCHAR(MAX),
        photo_url NVARCHAR(MAX),
        device_id NVARCHAR(255),
        verified_at DATETIME2 DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_Verifications_Shipment FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
        CONSTRAINT FK_Verifications_User FOREIGN KEY (verified_by) REFERENCES Users(id) ON DELETE CASCADE,
        CONSTRAINT FK_Verifications_Type FOREIGN KEY (verification_type) REFERENCES VerificationTypes(verification_type)
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_shipment_id ON Verifications (shipment_id);
    CREATE NONCLUSTERED INDEX idx_verified_by ON Verifications (verified_by);
    CREATE NONCLUSTERED INDEX idx_verification_type ON Verifications (verification_type);
END
GO

-- 6. Notifications table - Personalized messaging system
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Notifications' AND xtype='U')
BEGIN
    CREATE TABLE Notifications (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL,
        message NVARCHAR(MAX) NOT NULL,
        type NVARCHAR(10) NOT NULL,
        is_read BIT DEFAULT 0 NOT NULL,
        sent_at DATETIME2 DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_Notifications_User FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        CONSTRAINT FK_Notifications_Type FOREIGN KEY (type) REFERENCES NotificationTypes(notification_type)
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_user_id ON Notifications (user_id);
    CREATE NONCLUSTERED INDEX idx_type ON Notifications (type);
    CREATE NONCLUSTERED INDEX idx_is_read ON Notifications (is_read);
END
GO

-- 7. Alerts table - Proactive monitoring and exception handling
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Alerts' AND xtype='U')
BEGIN
    CREATE TABLE Alerts (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        shipment_id BIGINT NOT NULL,
        alert_type NVARCHAR(20) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        resolved BIT DEFAULT 0 NOT NULL,
        
        CONSTRAINT FK_Alerts_Shipment FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
        CONSTRAINT FK_Alerts_Type FOREIGN KEY (alert_type) REFERENCES AlertTypes(alert_type)
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_shipment_id ON Alerts (shipment_id);
    CREATE NONCLUSTERED INDEX idx_alert_type ON Alerts (alert_type);
    CREATE NONCLUSTERED INDEX idx_resolved ON Alerts (resolved);
END
GO

-- 8. Status History table - Track all status changes with timestamps
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Shipment_Status_History' AND xtype='U')
BEGIN
    CREATE TABLE Shipment_Status_History (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        shipment_id BIGINT NOT NULL,
        status NVARCHAR(20) NOT NULL,
        changed_by BIGINT,
        changed_at DATETIME2 DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_Status_History_Shipment FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
        CONSTRAINT FK_Status_History_User FOREIGN KEY (changed_by) REFERENCES Users(id) ON DELETE SET NULL,
        CONSTRAINT FK_Status_History_Status FOREIGN KEY (status) REFERENCES ShipmentStatus(status_name)
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_shipment_id ON Shipment_Status_History (shipment_id);
    CREATE NONCLUSTERED INDEX idx_status ON Shipment_Status_History (status);
    CREATE NONCLUSTERED INDEX idx_changed_at ON Shipment_Status_History (changed_at);
END
GO

-- 9. Geofencing table - Define restricted or monitored zones
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Geofencing' AND xtype='U')
BEGIN
    CREATE TABLE Geofencing (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        radius DECIMAL(10,2) NOT NULL,
        zone_type NVARCHAR(20) NOT NULL,
        organization_id BIGINT,
        deleted_at DATETIME2 NULL,
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_Geofencing_Zone_Type FOREIGN KEY (zone_type) REFERENCES ZoneTypes(zone_type)
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_organization ON Geofencing (organization_id);
END
GO

-- Add geospatial index for geofencing zones
IF NOT EXISTS (SELECT * FROM sys.columns WHERE name='zone_location' AND object_id = OBJECT_ID('Geofencing'))
BEGIN
    ALTER TABLE Geofencing ADD zone_location AS geography::Point(latitude, longitude, 4326) PERSISTED;
    CREATE SPATIAL INDEX idx_zone ON Geofencing(zone_location);
END
GO

-- 10. Delivery Attempts table - Log multiple delivery tries
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Delivery_Attempts' AND xtype='U')
BEGIN
    CREATE TABLE Delivery_Attempts (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        shipment_id BIGINT NOT NULL,
        attempt_number INTEGER NOT NULL,
        attempted_by BIGINT,
        attempt_time DATETIME2 DEFAULT GETUTCDATE(),
        status NVARCHAR(20) NOT NULL,
        reason NVARCHAR(MAX),
        
        CONSTRAINT FK_Delivery_Attempts_Shipment FOREIGN KEY (shipment_id) REFERENCES Shipments(id) ON DELETE CASCADE,
        CONSTRAINT FK_Delivery_Attempts_User FOREIGN KEY (attempted_by) REFERENCES Users(id) ON DELETE SET NULL,
        CONSTRAINT FK_Delivery_Attempts_Status FOREIGN KEY (status) REFERENCES DeliveryStatus(delivery_status)
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_shipment_id ON Delivery_Attempts (shipment_id);
    CREATE NONCLUSTERED INDEX idx_attempted_by ON Delivery_Attempts (attempted_by);
    CREATE NONCLUSTERED INDEX idx_attempt_time ON Delivery_Attempts (attempt_time);
END
GO

-- Audit Trail table - Track critical operational changes
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Audit_Trail' AND xtype='U')
BEGIN
    CREATE TABLE Audit_Trail (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        table_name NVARCHAR(100) NOT NULL,
        record_id BIGINT NOT NULL,
        action NVARCHAR(10) NOT NULL,
        changed_by BIGINT,
        before_state NVARCHAR(MAX),
        after_state NVARCHAR(MAX),
        changed_at DATETIME2 DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_Audit_Trail_User FOREIGN KEY (changed_by) REFERENCES Users(id) ON DELETE SET NULL,
        CONSTRAINT FK_Audit_Trail_Action FOREIGN KEY (action) REFERENCES ActionTypes(action_type)
        -- Removed ISJSON check constraint as it may not be available in all SQL Server versions
    );
    
    -- Add indexes separately after table creation
    CREATE NONCLUSTERED INDEX idx_table_record ON Audit_Trail (table_name, record_id);
    CREATE NONCLUSTERED INDEX idx_action ON Audit_Trail (action);
    CREATE NONCLUSTERED INDEX idx_changed_at ON Audit_Trail (changed_at);
END
GO

-- Add additional indexes for SQL Server performance optimization
-- Composite index for shipment status and priority for filtering
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_shipments_status_priority' AND object_id = OBJECT_ID('Shipments'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_shipments_status_priority ON Shipments (current_status, priority);
END
GO

-- Composite index for shipment client and status for client dashboards
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_shipments_client_status' AND object_id = OBJECT_ID('Shipments'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_shipments_client_status ON Shipments (client_id, current_status);
END
GO

-- Index for tracking timestamp and shipment for time-based queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_tracking_shipment_timestamp' AND object_id = OBJECT_ID('Tracking'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_tracking_shipment_timestamp ON Tracking (shipment_id, timestamp);
END
GO

-- Index for notifications user and read status for user notifications
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_notifications_user_read' AND object_id = OBJECT_ID('Notifications'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_notifications_user_read ON Notifications (user_id, is_read, sent_at);
END
GO

-- Index for delivery attempts shipment and attempt number for delivery history
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_delivery_attempts_shipment_number' AND object_id = OBJECT_ID('Delivery_Attempts'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_delivery_attempts_shipment_number ON Delivery_Attempts (shipment_id, attempt_number);
END
GO

-- Add filtered indexes for active records (not soft deleted)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_users_active' AND object_id = OBJECT_ID('Users'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_users_active ON Users (email, role) WHERE deleted_at IS NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_shipments_active' AND object_id = OBJECT_ID('Shipments'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_shipments_active ON Shipments (tracking_number, current_status) WHERE deleted_at IS NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_geofencing_active' AND object_id = OBJECT_ID('Geofencing'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_geofencing_active ON Geofencing (name, zone_type) WHERE deleted_at IS NULL;
END
GO

-- Optimize the Users table with a computed column for full name searching
IF NOT EXISTS (SELECT * FROM sys.columns WHERE name='full_name_lower' AND object_id = OBJECT_ID('Users'))
BEGIN
    ALTER TABLE Users ADD full_name_lower AS LOWER(full_name) PERSISTED;
    CREATE NONCLUSTERED INDEX idx_users_full_name_lower ON Users (full_name_lower);
END
GO

-- Optimize the Shipments table with computed columns for address searching
IF NOT EXISTS (SELECT * FROM sys.columns WHERE name='origin_address_lower' AND object_id = OBJECT_ID('Shipments'))
BEGIN
    ALTER TABLE Shipments ADD origin_address_lower AS LOWER(origin_address) PERSISTED;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE name='destination_address_lower' AND object_id = OBJECT_ID('Shipments'))
BEGIN
    ALTER TABLE Shipments ADD destination_address_lower AS LOWER(destination_address) PERSISTED;
END
GO

-- Add indexes for the address searching columns
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_shipments_origin_lower' AND object_id = OBJECT_ID('Shipments'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_shipments_origin_lower ON Shipments (origin_address_lower);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_shipments_destination_lower' AND object_id = OBJECT_ID('Shipments'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_shipments_destination_lower ON Shipments (destination_address_lower);
END
GO

-- Add a check constraint to ensure logical consistency in shipments
-- A shipment cannot have an actual delivery time without being marked as delivered or verified
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Shipments_Delivery_Status')
BEGIN
    ALTER TABLE Shipments ADD CONSTRAINT CK_Shipments_Delivery_Status 
    CHECK (
        (actual_delivery IS NULL) OR 
        (current_status = 'delivered' OR current_status = 'verified')
    );
END
GO

-- Note: Removed the complex check constraint for Delivery_Attempts as it uses subqueries
-- which are not allowed in check constraints in SQL Server