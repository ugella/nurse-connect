-- Create enum types
CREATE TYPE user_role AS ENUM ('client', 'nurse', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create nurses table
CREATE TABLE nurses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialty TEXT NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    availability TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create nurse specialties table (many-to-many)
CREATE TABLE nurse_specialties (
    nurse_id UUID REFERENCES nurses(id) ON DELETE CASCADE,
    specialty TEXT NOT NULL,
    PRIMARY KEY (nurse_id, specialty)
);

-- Create bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nurse_id UUID NOT NULL REFERENCES nurses(id),
    client_id UUID NOT NULL REFERENCES users(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    service_type TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    nurse_id UUID NOT NULL REFERENCES nurses(id),
    client_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT unique_booking_review UNIQUE (booking_id)
);

-- Create indexes
CREATE INDEX idx_nurses_specialty ON nurses(specialty);
CREATE INDEX idx_nurses_location ON nurses(location);
CREATE INDEX idx_bookings_nurse_id ON bookings(nurse_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_nurse_id ON reviews(nurse_id);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nurses_updated_at
    BEFORE UPDATE ON nurses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for nurse listings
CREATE VIEW nurse_listings AS
SELECT 
    n.id,
    u.name,
    n.specialty,
    n.hourly_rate,
    n.location,
    n.image_url,
    n.is_verified,
    n.availability,
    COALESCE(AVG(r.rating), 0) as rating,
    ARRAY_AGG(DISTINCT ns.specialty) as specialties
FROM nurses n
JOIN users u ON n.user_id = u.id
LEFT JOIN nurse_specialties ns ON n.id = ns.nurse_id
LEFT JOIN reviews r ON n.id = r.nurse_id
GROUP BY n.id, u.name;

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurses ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurse_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Public can view verified nurses"
    ON nurses FOR SELECT
    USING (is_verified = true);

CREATE POLICY "Public can view nurse specialties"
    ON nurse_specialties FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = client_id OR 
          auth.uid() IN (SELECT user_id FROM nurses WHERE id = nurse_id));

CREATE POLICY "Public can view reviews"
    ON reviews FOR SELECT
    USING (true);
