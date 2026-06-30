-- ═══════════════════════════════════════════
-- RIGHTROAM — Base de données PostgreSQL v2
-- ═══════════════════════════════════════════

-- UTILISATEURS (voyageurs)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nationality VARCHAR(100),
  passport_number VARCHAR(50),
  birth_date DATE,
  phone VARCHAR(30),
  emergency_contact VARCHAR(30),
  address TEXT,
  language VARCHAR(10) DEFAULT 'fr',
  profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AVOCATS (s'inscrivent librement, vérifiés par RightRoam)
CREATE TABLE lawyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  bar_number VARCHAR(100) NOT NULL,
  bar_country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  specialties TEXT[],
  languages TEXT[],
  bio TEXT,
  bar_certificate_url VARCHAR(500) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_cases INTEGER DEFAULT 0,
  commission_rate DECIMAL(4,2) DEFAULT 0.18,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ABONNEMENTS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('per_trip', 'monthly', 'annual')),
  price DECIMAL(8,2) NOT NULL,
  currency VARCHAR(5) DEFAULT 'EUR',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
  stripe_subscription_id VARCHAR(255),
  paypal_subscription_id VARCHAR(255),
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- VOYAGES (enregistrés AVANT le paiement)
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  destination_country VARCHAR(100) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- DOSSIERS JURIDIQUES
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  lawyer_id UUID REFERENCES lawyers(id),
  trip_id UUID REFERENCES trips(id),
  case_type VARCHAR(50) NOT NULL CHECK (case_type IN (
    'accident', 'theft', 'hotel_dispute', 'flight_issue',
    'arrest', 'medical', 'other'
  )),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'accepted', 'in_progress', 'resolved', 'cancelled'
  )),
  urgency VARCHAR(10) DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'urgent')),
  lawyer_fee DECIMAL(10,2),
  platform_commission DECIMAL(10,2),
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- MESSAGES CHAT
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'lawyer')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ÉVALUATIONS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id),
  user_id UUID REFERENCES users(id),
  lawyer_id UUID REFERENCES lawyers(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PAIEMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(5) DEFAULT 'EUR',
  payment_method VARCHAR(20) CHECK (payment_method IN ('stripe', 'paypal')),
  stripe_payment_id VARCHAR(255),
  paypal_order_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_lawyers_city ON lawyers(city, country, is_verified, is_available);
CREATE INDEX idx_trips_active ON trips(is_active, destination_city);
CREATE INDEX idx_cases_status ON cases(status, created_at);
CREATE INDEX idx_messages_case ON messages(case_id, created_at);
