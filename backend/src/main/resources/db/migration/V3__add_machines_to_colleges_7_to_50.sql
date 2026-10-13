-- Add one prototype vending machine to colleges 7 through 50 that do not
-- already have an active or inactive machine record.
-- Existing machines for colleges 1-6 are preserved.
-- These are demo records, not confirmation of real-world installations.

INSERT INTO machines (
    college_id,
    machine_code,
    machine_name,
    location_description,
    address,
    operational_status,
    available_slots,
    total_slots,
    distance_km,
    supported_color_modes,
    supported_print_sides,
    is_active
)
SELECT
    c.id,
    CONCAT('VM-COLLEGE-', LPAD(c.id, 3, '0')),
    'Campus Print Kiosk',
    'Main academic block - prototype location',
    c.address,
    'ACTIVE',
    4,
    4,
    0.50,
    'BW,COLOR',
    'SINGLE,DOUBLE',
    TRUE
FROM colleges c
WHERE c.id BETWEEN 7 AND 50
  AND NOT EXISTS (
      SELECT 1
      FROM machines m
      WHERE m.college_id = c.id
  );
