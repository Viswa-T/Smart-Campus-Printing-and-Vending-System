-- XeroxGo Seed Data Migration: Colleges and Machines
-- V2__seed_colleges_and_machines.sql

-- 55 Distinct Genuine Colleges in Tamil Nadu (Coimbatore, Chennai, Madurai, Trichy, Salem, etc.)
INSERT INTO colleges (id, college_name, normalized_name, abbreviation, city, state, country, address, is_active) VALUES
(1, 'PSG College of Technology', 'psg college of technology', 'PSG Tech', 'Coimbatore', 'Tamil Nadu', 'India', 'Avinashi Road, Peelamedu, Coimbatore - 641004', TRUE),
(2, 'Sri Krishna College of Technology', 'sri krishna college of technology', 'SKCT', 'Coimbatore', 'Tamil Nadu', 'India', 'Kovaipudur, Coimbatore - 641042', TRUE),
(3, 'Kumaraguru College of Technology', 'kumaraguru college of technology', 'KCT', 'Coimbatore', 'Tamil Nadu', 'India', 'Athipalayam Road, Chinnavedampatti, Coimbatore - 641049', TRUE),
(4, 'Thiagarajar College of Engineering', 'thiagarajar college of engineering', 'TCE', 'Madurai', 'Tamil Nadu', 'India', 'Tiruparankundram, Madurai - 625015', TRUE),
(5, 'Government College of Technology', 'government college of technology', 'GCT', 'Coimbatore', 'Tamil Nadu', 'India', 'Thadagam Road, Coimbatore - 641013', TRUE),
(6, 'Coimbatore Institute of Technology', 'coimbatore institute of technology', 'CIT', 'Coimbatore', 'Tamil Nadu', 'India', 'Civil Aerodrome Post, Coimbatore - 641014', TRUE),
(7, 'College of Engineering, Guindy', 'college of engineering guindy', 'CEG', 'Chennai', 'Tamil Nadu', 'India', 'Anna University, Sardar Patel Road, Guindy, Chennai - 600025', TRUE),
(8, 'Madras Institute of Technology', 'madras institute of technology', 'MIT', 'Chennai', 'Tamil Nadu', 'India', 'Radha Nagar, Chromepet, Chennai - 600044', TRUE),
(9, 'Sri Sivasubramaniya Nadar College of Engineering', 'sri sivasubramaniya nadar college of engineering', 'SSN', 'Chennai', 'Tamil Nadu', 'India', 'Rajiv Gandhi Salai (OMR), Kalavakkam - 603110', TRUE),
(10, 'National Institute of Technology, Tiruchirappalli', 'national institute of technology tiruchirappalli', 'NIT Trichy', 'Tiruchirappalli', 'Tamil Nadu', 'India', 'Tanjore Main Road, NH67, Thuvakudi, Tiruchirappalli - 620015', TRUE),
(11, 'Sri Krishna College of Engineering and Technology', 'sri krishna college of engineering and technology', 'SKCET', 'Coimbatore', 'Tamil Nadu', 'India', 'Kuniamuthur, Coimbatore - 641008', TRUE),
(12, 'PSG Institute of Technology and Applied Research', 'psg institute of technology and applied research', 'PSG iTech', 'Coimbatore', 'Tamil Nadu', 'India', 'Avinashi Road, Neelambur, Coimbatore - 641062', TRUE),
(13, 'Bannari Amman Institute of Technology', 'bannari amman institute of technology', 'BIT', 'Sathyamangalam', 'Tamil Nadu', 'India', 'Alathukombai, Sathyamangalam, Erode - 638401', TRUE),
(14, 'Kongu Engineering College', 'kongu engineering college', 'KEC', 'Perundurai', 'Tamil Nadu', 'India', 'Perundurai, Erode - 638060', TRUE),
(15, 'Sona College of Technology', 'sona college of technology', 'Sona', 'Salem', 'Tamil Nadu', 'India', 'Junction Main Road, Salem - 636005', TRUE),
(16, 'Government College of Engineering, Salem', 'government college of engineering salem', 'GCE Salem', 'Salem', 'Tamil Nadu', 'India', 'Bangalore Highways, Salem - 636011', TRUE),
(17, 'Vellore Institute of Technology', 'vellore institute of technology', 'VIT', 'Vellore', 'Tamil Nadu', 'India', 'Katpadi, Vellore - 632014', TRUE),
(18, 'SRM Institute of Science and Technology', 'srm institute of science and technology', 'SRM', 'Kattankulathur', 'Tamil Nadu', 'India', 'Mahatma Gandhi Salai, Potheri, Kattankulathur - 603203', TRUE),
(19, 'Hindustan Institute of Technology and Science', 'hindustan institute of technology and science', 'HITS', 'Chennai', 'Tamil Nadu', 'India', '1, Rajiv Gandhi Salai (OMR), Padur, Chennai - 603103', TRUE),
(20, 'SASTRA Deemed University', 'sastra deemed university', 'SASTRA', 'Thanjavur', 'Tamil Nadu', 'India', 'Tirumalaisamudram, Thanjavur - 613401', TRUE),
(21, 'Karunya Institute of Technology and Sciences', 'karunya institute of technology and sciences', 'Karunya', 'Coimbatore', 'Tamil Nadu', 'India', 'Karunya Nagar, Coimbatore - 641114', TRUE),
(22, 'Amrita Vishwa Vidyapeetham', 'amrita vishwa vidyapeetham', 'Amrita', 'Coimbatore', 'Tamil Nadu', 'India', 'Amritanagar Post, Ettimadai, Coimbatore - 641112', TRUE),
(23, 'Hindusthan College of Engineering and Technology', 'hindusthan college of engineering and technology', 'HiCET', 'Coimbatore', 'Tamil Nadu', 'India', 'Othakkalmandapam Post, Coimbatore - 641032', TRUE),
(24, 'KPR Institute of Engineering and Technology', 'kpr institute of engineering and technology', 'KPRIET', 'Coimbatore', 'Tamil Nadu', 'India', 'Avinashi Road, Arasur, Coimbatore - 641407', TRUE),
(25, 'Sri Ramakrishna Engineering College', 'sri ramakrishna engineering college', 'SREC', 'Coimbatore', 'Tamil Nadu', 'India', 'Vattamalaipalayam, NGGO Colony Post, Coimbatore - 641022', TRUE),
(26, 'Dr. Mahalingam College of Engineering and Technology', 'dr mahalingam college of engineering and technology', 'MCET', 'Pollachi', 'Tamil Nadu', 'India', 'Mackinaickenpatti Post, Udumalai Road, Pollachi - 642003', TRUE),
(27, 'SNS College of Technology', 'sns college of technology', 'SNS Tech', 'Coimbatore', 'Tamil Nadu', 'India', 'SNS Kalvi Nagar, Sathy Main Road, Coimbatore - 641035', TRUE),
(28, 'Karpagam College of Engineering', 'karpagam college of engineering', 'KCE', 'Coimbatore', 'Tamil Nadu', 'India', 'Myleripalayam Village, Othakkalmandapam, Coimbatore - 641032', TRUE),
(29, 'Loyola-ICAM College of Engineering and Technology', 'loyola icam college of engineering and technology', 'LICET', 'Chennai', 'Tamil Nadu', 'India', 'Loyola College Campus, Nungambakkam, Chennai - 600034', TRUE),
(30, 'St. Joseph College of Engineering', 'st joseph college of engineering', 'St. Joseph', 'Chennai', 'Tamil Nadu', 'India', 'Jeppiaar Nagar, Old Mamallapuram Road, Chennai - 600119', TRUE),
(31, 'Rajalakshmi Engineering College', 'rajalakshmi engineering college', 'REC', 'Thandalam', 'Tamil Nadu', 'India', 'Rajalakshmi Nagar, Thandalam, Chennai - 602105', TRUE),
(32, 'Meenakshi Sundararajan Engineering College', 'meenakshi sundararajan engineering college', 'MSEC', 'Chennai', 'Tamil Nadu', 'India', '363, Arcot Road, Kodambakkam, Chennai - 600024', TRUE),
(33, 'Panimalar Engineering College', 'panimalar engineering college', 'Panimalar', 'Chennai', 'Tamil Nadu', 'India', 'Nazarathpettai, Poonamallee, Chennai - 600123', TRUE),
(34, 'Sri Venkateswara College of Engineering', 'sri venkateswara college of engineering', 'SVCE', 'Sriperumbudur', 'Tamil Nadu', 'India', 'Pennalur, Sriperumbudur, Kancheepuram - 602117', TRUE),
(35, 'Vel Tech Rangarajan Dr. Sagunthala R&D Institute', 'vel tech rangarajan dr sagunthala rd institute', 'Vel Tech', 'Chennai', 'Tamil Nadu', 'India', '400 Feet Outer Ring Road, Avadi, Chennai - 600062', TRUE),
(36, 'Mepco Schlenk Engineering College', 'mepco schlenk engineering college', 'MEPCO', 'Sivakasi', 'Tamil Nadu', 'India', 'Mepco Engineering College Post, Sivakasi - 626005', TRUE),
(37, 'Government College of Engineering, Tirunelveli', 'government college of engineering tirunelveli', 'GCE Tirunelveli', 'Tirunelveli', 'Tamil Nadu', 'India', 'Tirunelveli - 627007', TRUE),
(38, 'National Engineering College', 'national engineering college', 'NEC', 'Kovilpatti', 'Tamil Nadu', 'India', 'K.R. Nagar, Kovilpatti - 628503', TRUE),
(39, 'Alagappa Chettiar Government College of Engineering and Technology', 'alagappa chettiar government college of engineering and technology', 'ACGCET', 'Karaikudi', 'Tamil Nadu', 'India', 'College Road, Karaikudi - 630003', TRUE),
(40, 'K.L.N. College of Engineering', 'kln college of engineering', 'KLNCE', 'Pottapalayam', 'Tamil Nadu', 'India', 'Pottapalayam, Sivagangai District - 630612', TRUE),
(41, 'Sethu Institute of Technology', 'sethu institute of technology', 'SIT', 'Kariapatti', 'Tamil Nadu', 'India', 'Pulloor, Kariapatti, Virudhunagar - 626115', TRUE),
(42, 'PSNA College of Engineering and Technology', 'psna college of engineering and technology', 'PSNA', 'Dindigul', 'Tamil Nadu', 'India', 'Kothandaraman Nagar, Dindigul - 624622', TRUE),
(43, 'Government College of Engineering, Bodinayakkanur', 'government college of engineering bodinayakkanur', 'GCE Bodi', 'Theni', 'Tamil Nadu', 'India', 'Bodinayakkanur, Theni - 625513', TRUE),
(44, 'Saranathan College of Engineering', 'saranathan college of engineering', 'Saranathan', 'Tiruchirappalli', 'Tamil Nadu', 'India', 'Panjappur, Tiruchirappalli - 620012', TRUE),
(45, 'M.A.M. College of Engineering', 'mam college of engineering', 'MAM', 'Siruganur', 'Tamil Nadu', 'India', 'Trichy-Chennai Trunk Road, Siruganur, Trichy - 621105', TRUE),
(46, 'K. Ramakrishnan College of Technology', 'k ramakrishnan college of technology', 'KRCT', 'Tiruchirappalli', 'Tamil Nadu', 'India', 'Kariyamanickam Road, Samayapuram, Trichy - 621112', TRUE),
(47, 'Adhiyamaan College of Engineering', 'adhiyamaan college of engineering', 'ACE', 'Hosur', 'Tamil Nadu', 'India', 'Dr. M.G.R. Nagar, Hosur - 635109', TRUE),
(48, 'Government College of Engineering, Dharmapuri', 'government college of engineering dharmapuri', 'GCE Dharmapuri', 'Dharmapuri', 'Tamil Nadu', 'India', 'Settikarai Post, Dharmapuri - 636701', TRUE),
(49, 'Annapoorana Engineering College', 'annapoorana engineering college', 'AEC', 'Salem', 'Tamil Nadu', 'India', 'Sankari Main Road, Periaseeragapadi, Salem - 636308', TRUE),
(50, 'Nandha Engineering College', 'nandha engineering college', 'Nandha', 'Erode', 'Tamil Nadu', 'India', 'Vaikkaalmedu, Perundurai Road, Erode - 638052', TRUE),
(51, 'Erode Sengunthar Engineering College', 'erode sengunthar engineering college', 'ESEC', 'Thudupathi', 'Tamil Nadu', 'India', 'Thudupathi, Perundurai, Erode - 638057', TRUE),
(52, 'Velammal Engineering College', 'velammal engineering college', 'VEC', 'Chennai', 'Tamil Nadu', 'India', 'Ambattur-Red Hills Road, Surapet, Chennai - 600066', TRUE),
(53, 'Easwari Engineering College', 'easwari engineering college', 'EEC', 'Chennai', 'Tamil Nadu', 'India', 'Bharathi Salai, Ramapuram, Chennai - 600089', TRUE),
(54, 'Saveetha Engineering College', 'saveetha engineering college', 'Saveetha', 'Thandalam', 'Tamil Nadu', 'India', 'Saveetha Nagar, Thandalam, Chennai - 602105', TRUE),
(55, 'RMK Engineering College', 'rmk engineering college', 'RMK', 'Kavaraipettai', 'Tamil Nadu', 'India', 'RSM Nagar, Gummidipoondi Taluk, Kavaraipettai - 601206', TRUE);

-- Seed Machines for Top Colleges (including the 4 prototype reference machines)
-- College 1: PSG College of Technology
INSERT INTO machines (id, college_id, machine_code, machine_name, location_description, address, operational_status, available_slots, total_slots, distance_km, supported_color_modes, supported_print_sides, is_active) VALUES
(1, 1, 'VM001', 'Engineering Block A', 'Near Canteen, Ground Floor', 'Block A, PSG Tech Campus, Peelamedu', 'ACTIVE', 3, 4, 0.20, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE),
(2, 1, 'VM002', 'Library Ground Floor', 'Main Library, Entrance', 'Dr. G.R.D. Central Library, PSG Tech', 'ACTIVE', 4, 4, 0.50, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE),
(3, 1, 'VM003', 'Hostel Block B', 'Boys Hostel, Common Area', 'Men Hostel 2, PSG Tech Campus', 'ACTIVE', 2, 4, 0.80, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE),
(4, 1, 'VM004', 'Admin Building', 'Ground Floor, Main Entrance', 'Administrative Block, PSG Tech', 'ACTIVE', 1, 4, 1.20, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE);

-- College 2: Sri Krishna College of Technology (SKCT)
INSERT INTO machines (id, college_id, machine_code, machine_name, location_description, address, operational_status, available_slots, total_slots, distance_km, supported_color_modes, supported_print_sides, is_active) VALUES
(5, 2, 'VM005', 'Main Academic Block 1', 'Ground Floor, Reception', 'SKCT Campus, Kovaipudur', 'ACTIVE', 4, 4, 0.15, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE),
(6, 2, 'VM006', 'Central Library Kiosk', 'First Floor, Study Zone', 'SKCT Central Library, Kovaipudur', 'ACTIVE', 3, 4, 0.40, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE),
(7, 2, 'VM007', 'Mechanical Lab Complex', 'Block C, Corridors', 'SKCT Labs, Kovaipudur', 'ACTIVE', 2, 4, 0.70, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE);

-- College 3: Kumaraguru College of Technology (KCT)
INSERT INTO machines (id, college_id, machine_code, machine_name, location_description, address, operational_status, available_slots, total_slots, distance_km, supported_color_modes, supported_print_sides, is_active) VALUES
(8, 3, 'VM008', 'KCT Knowledge Centre', 'Level 1, Entrance Lobby', 'Mahalingam Vigyan Bhavan, KCT', 'ACTIVE', 3, 4, 0.25, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE),
(9, 3, 'VM009', 'C Canteen Hub', 'Student Plaza', 'KCT Food Court & Plaza', 'ACTIVE', 4, 4, 0.45, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE);

-- College 4: Thiagarajar College of Engineering (TCE)
INSERT INTO machines (id, college_id, machine_code, machine_name, location_description, address, operational_status, available_slots, total_slots, distance_km, supported_color_modes, supported_print_sides, is_active) VALUES
(10, 4, 'VM010', 'TCE Main Quadrangle', 'Ground Floor, South Wing', 'TCE Campus, Tiruparankundram', 'ACTIVE', 3, 4, 0.30, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE);

-- College 5: Government College of Technology (GCT)
INSERT INTO machines (id, college_id, machine_code, machine_name, location_description, address, operational_status, available_slots, total_slots, distance_km, supported_color_modes, supported_print_sides, is_active) VALUES
(11, 5, 'VM011', 'GCT Centenary Block', 'Near Main Auditorium', 'GCT Thadagam Road, Coimbatore', 'ACTIVE', 4, 4, 0.20, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE);

-- College 6: Coimbatore Institute of Technology (CIT)
INSERT INTO machines (id, college_id, machine_code, machine_name, location_description, address, operational_status, available_slots, total_slots, distance_km, supported_color_modes, supported_print_sides, is_active) VALUES
(12, 6, 'VM012', 'CIT Library Block', 'Ground Floor, Digital Section', 'CIT Civil Aerodrome Post, Coimbatore', 'ACTIVE', 3, 4, 0.35, 'BW,COLOR', 'SINGLE,DOUBLE', TRUE);
