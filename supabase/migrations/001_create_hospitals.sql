-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Hospitals table
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    name_urdu VARCHAR(200),
    city VARCHAR(100) NOT NULL DEFAULT 'Lahore',
    address TEXT NOT NULL,
    address_urdu TEXT,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(50),
    cost_tier INTEGER NOT NULL CHECK (cost_tier IN (1, 2, 3)),
    has_er BOOLEAN NOT NULL DEFAULT false,
    open_24h BOOLEAN NOT NULL DEFAULT false,
    specialties TEXT[] DEFAULT '{}',
    opening_hours VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial index
CREATE INDEX hospitals_location_idx ON hospitals 
    USING GIST (ST_SetSRID(ST_MakePoint(lng, lat), 4326));

-- Query logs table
CREATE TABLE query_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100),
    city VARCHAR(100),
    urgency_level INTEGER,
    language VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEED DATA: Insert these exact 20 Lahore hospitals
INSERT INTO hospitals 
(name, name_urdu, city, address, lat, lng, phone, cost_tier, has_er, open_24h, specialties) 
VALUES
('Services Hospital Lahore', 'سروسز ہسپتال لاہور', 'Lahore', 'Jail Road, Lahore', 31.5497, 74.3436, '042-99231386', 1, true, true, ARRAY['general','pediatrics','emergency','surgery']),
('Mayo Hospital Lahore', 'مایو ہسپتال لاہور', 'Lahore', 'Nila Gumbad, Lahore', 31.5651, 74.3094, '042-99231386', 1, true, true, ARRAY['general','oncology','neurology','emergency']),
('Lahore General Hospital', 'لاہور جنرل ہسپتال', 'Lahore', 'Ferozepur Road, Lahore', 31.5089, 74.3267, '042-35761999', 1, true, true, ARRAY['general','surgery','obstetrics','emergency']),
('Shaukat Khanum Memorial', 'شوکت خانم میموریل', 'Lahore', '7-A, Block R-3, M.A. Johar Town, Lahore', 31.4697, 74.2728, '042-35945100', 3, true, true, ARRAY['oncology','surgery','radiology','pediatrics']),
('Doctors Hospital', 'ڈاکٹرز ہسپتال', 'Lahore', '152-G/1, Canal Bank Road, Lahore', 31.4883, 74.3156, '042-35302401', 2, true, true, ARRAY['general','cardiology','neurology','emergency']),
('Ittefaq Hospital', 'اتفاق ہسپتال', 'Lahore', '54, Jail Road, Model Town Link Road, Lahore', 31.4873, 74.3300, '042-35761202', 2, true, true, ARRAY['general','cardiology','orthopedics','emergency']),
('Hameed Latif Hospital', 'حمید لطیف ہسپتال', 'Lahore', '14, Abu Bakar Block, New Garden Town, Lahore', 31.5012, 74.3401, '042-35883741', 2, true, false, ARRAY['general','gynecology','pediatrics']),
('Children''s Hospital Lahore', 'چلڈرنز ہسپتال لاہور', 'Lahore', 'Ferozepur Road, Lahore', 31.5103, 74.3251, '042-99230371', 1, true, true, ARRAY['pediatrics','neonatology','pediatric_surgery']),
('Lady Aitchison Hospital', 'لیڈی ایچیسن ہسپتال', 'Lahore', 'The Mall, Lahore', 31.5587, 74.3229, '042-99211130', 1, true, true, ARRAY['obstetrics','gynecology','neonatology']),
('Sheikh Zayed Hospital', 'شیخ زید ہسپتال', 'Lahore', 'University Avenue, Lahore', 31.4801, 74.2611, '042-35168000', 2, true, true, ARRAY['general','transplant','nephrology','emergency']),
('National Hospital Lahore', 'نیشنل ہسپتال لاہور', 'Lahore', '132/3, Jail Road, Lahore', 31.5450, 74.3412, '042-35761001', 2, true, true, ARRAY['general','cardiology','neurology']),
('Farooq Hospital', 'فاروق ہسپتال', 'Lahore', 'Main Boulevard, Gulberg III, Lahore', 31.5105, 74.3436, '042-35715025', 2, true, true, ARRAY['general','orthopedics','urology']),
('Shaikh Khalifa Bin Zayed Hospital', 'شیخ خلیفہ ہسپتال', 'Lahore', 'Chungi Amar Sadhu, Lahore', 31.4519, 74.2822, '042-35302300', 2, true, true, ARRAY['general','emergency','surgery']),
('PAK International Medical Complex', 'پاک انٹرنیشنل میڈیکل', 'Lahore', '61, Shadman Market, Lahore', 31.5362, 74.3312, '042-35765001', 2, false, false, ARRAY['general','gynecology','dentistry']),
('Kidney Centre Lahore', 'کڈنی سینٹر لاہور', 'Lahore', 'Canal Road, Ferozepur Road, Lahore', 31.5042, 74.3189, '042-35762591', 2, false, false, ARRAY['nephrology','urology','transplant']),
('Jinnah Hospital Lahore', 'جناح ہسپتال لاہور', 'Lahore', 'Shad Bagh, Allama Iqbal Road, Lahore', 31.5839, 74.3412, '042-99230371', 1, true, true, ARRAY['general','emergency','surgery','obstetrics']),
('Ghurki Trust Teaching Hospital', 'غرکی ٹرسٹ ہسپتال', 'Lahore', 'Jallo Mor, Grand Trunk Road, Lahore', 31.5901, 74.4512, '042-36531401', 2, true, true, ARRAY['general','emergency','orthopedics']),
('Al-Shifa Trust Eye Hospital', 'الشفاء آنکھوں کا ہسپتال', 'Lahore', '25-B, Mini Market, Gulberg II, Lahore', 31.5211, 74.3512, '042-35780001', 2, false, false, ARRAY['ophthalmology']),
('Centre For Nuclear Medicine (CENUM)', 'CENUM', 'Lahore', 'Mayo Hospital Complex, Lahore', 31.5651, 74.3094, '042-99231710', 1, false, false, ARRAY['radiology','oncology','nuclear_medicine']),
('Fatima Memorial Hospital', 'فاطمہ میموریل ہسپتال', 'Lahore', 'Shadman, Lahore', 31.5389, 74.3217, '042-35761999', 2, true, true, ARRAY['general','gynecology','pediatrics','emergency']);
