-- XeroxGo Initial Database Schema Migration
-- V1__init_schema.sql

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    account_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    selected_college_id BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL
);

-- 2. Colleges table
CREATE TABLE IF NOT EXISTS colleges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    college_name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(50) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    address TEXT NULL,
    logo_url VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_colleges_name ON colleges(college_name);
CREATE INDEX idx_colleges_abbrev ON colleges(abbreviation);
CREATE INDEX idx_colleges_city ON colleges(city);

-- 3. User College Memberships
CREATE TABLE IF NOT EXISTS user_college_memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'UNVERIFIED',
    student_id_card_url VARCHAR(500) NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_membership_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_membership_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_college UNIQUE (user_id, college_id)
);

-- 4. Printing Machines table
CREATE TABLE IF NOT EXISTS machines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    college_id BIGINT NOT NULL,
    machine_code VARCHAR(100) NOT NULL UNIQUE,
    machine_name VARCHAR(255) NOT NULL,
    location_description VARCHAR(255) NOT NULL,
    address TEXT NULL,
    operational_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    available_slots INT NOT NULL DEFAULT 4,
    total_slots INT NOT NULL DEFAULT 4,
    distance_km DECIMAL(4, 2) NOT NULL DEFAULT 0.50,
    supported_color_modes VARCHAR(100) NOT NULL DEFAULT 'BW,COLOR',
    supported_print_sides VARCHAR(100) NOT NULL DEFAULT 'SINGLE,DOUBLE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_status_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_machine_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE INDEX idx_machines_college ON machines(college_id);

-- 5. Documents table (storing binary document content directly in MySQL)
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    detected_mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    page_count INT NOT NULL DEFAULT 1,
    file_data LONGBLOB NOT NULL,
    processing_status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retention_until TIMESTAMP NULL,
    CONSTRAINT fk_document_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_documents_user ON documents(user_id);

-- 6. Pricing Configuration table
CREATE TABLE IF NOT EXISTS pricing_configurations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_version VARCHAR(50) NOT NULL UNIQUE,
    bw_price_per_page DECIMAL(10, 2) NOT NULL DEFAULT 1.00,
    color_price_per_page DECIMAL(10, 2) NOT NULL DEFAULT 5.00,
    double_side_discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 30.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert baseline authoritative pricing
INSERT INTO pricing_configurations (config_version, bw_price_per_page, color_price_per_page, double_side_discount_percent, currency, is_active)
VALUES ('v1.0', 1.00, 5.00, 30.00, 'INR', TRUE);

-- 7. Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    public_order_reference VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    machine_id BIGINT NOT NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_PAYMENT',
    total_pages INT NOT NULL,
    copies INT NOT NULL DEFAULT 1,
    color_mode VARCHAR(20) NOT NULL DEFAULT 'BW',
    print_sides VARCHAR(20) NOT NULL DEFAULT 'SINGLE',
    base_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    pricing_version VARCHAR(50) NOT NULL DEFAULT 'v1.0',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    collected_at TIMESTAMP NULL,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_order_college FOREIGN KEY (college_id) REFERENCES colleges(id),
    CONSTRAINT fk_order_machine FOREIGN KEY (machine_id) REFERENCES machines(id)
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_ref ON orders(public_order_reference);

-- 8. Order Documents join table
CREATE TABLE IF NOT EXISTS order_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    document_id BIGINT NOT NULL,
    page_count_at_order INT NOT NULL,
    copies INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_od_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_od_document FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE INDEX idx_od_order ON order_documents(order_id);

-- 9. Payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    payment_provider VARCHAR(50) NOT NULL,
    provider_payment_reference VARCHAR(255) NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'INITIATED',
    idempotency_reference VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_order ON payments(order_id);

-- 10. Access Codes table
CREATE TABLE IF NOT EXISTS access_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_code_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_access_codes_hash ON access_codes(code_hash);

-- 11. Order Status History
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    previous_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NOT NULL,
    actor_type VARCHAR(50) NOT NULL,
    actor_id BIGINT NULL,
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(500) NULL,
    CONSTRAINT fk_history_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_history_order ON order_status_history(order_id);

-- 12. Verification Tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tokens_hash ON verification_tokens(token_hash);

-- 13. Audit Events table
CREATE TABLE IF NOT EXISTS audit_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id BIGINT NULL,
    ip_address VARCHAR(50) NULL,
    details VARCHAR(1000) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
