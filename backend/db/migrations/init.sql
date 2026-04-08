CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'technician',
  clinic_name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_code VARCHAR(100) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  phone VARCHAR(30),
  diabetes_type VARCHAR(10),
  diabetes_duration_years FLOAT,
  hba1c_percent FLOAT,
  systolic_bp INTEGER,
  diastolic_bp INTEGER,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  analyzed_by UUID REFERENCES users(id),
  original_image_path VARCHAR(500),
  gradcam_overlay_path VARCHAR(500),
  gradcam_heatmap_path VARCHAR(500),
  lime_image_path VARCHAR(500),
  blur_score FLOAT,
  contrast_score FLOAT,
  brightness_mean FLOAT,
  snr_score FLOAT,
  composite_quality FLOAT,
  quality_label VARCHAR(20),
  preprocessing_config JSONB,
  model_used VARCHAR(100),
  model_tier INTEGER,
  dr_grade INTEGER NOT NULL,
  confidence FLOAT NOT NULL,
  class_probabilities JSONB,
  attention_regions JSONB,
  clinical_recommendation TEXT,
  urgency_level VARCHAR(20),
  follow_up_months FLOAT,
  preprocessing_ms INTEGER,
  inference_ms INTEGER,
  gradcam_ms INTEGER,
  lime_ms INTEGER,
  total_ms INTEGER,
  doctor_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  is_reviewed BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
