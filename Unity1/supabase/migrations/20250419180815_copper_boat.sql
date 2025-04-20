/*
  # Initial Schema Setup for TurfBuddy

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `avatar_url` (text)
      - `role` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `turfs`
      - `id` (uuid, primary key) 
      - `name` (text)
      - `description` (text)
      - `owner_id` (uuid, references profiles)
      - `location` (jsonb)
      - `sports` (text[])
      - `surfaces` (text[])
      - `facilities` (text[])
      - `photos` (text[])
      - `pricing` (jsonb)
      - `available_hours` (jsonb)
      - `min_players` (int)
      - `max_players` (int)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `turf_id` (uuid, references turfs)
      - `user_id` (uuid, references profiles)
      - `date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `sport` (text)
      - `total_players` (int)
      - `price_per_player` (numeric)
      - `total_amount` (numeric)
      - `payment_status` (text)
      - `booking_status` (text)
      - `need_players` (boolean)
      - `players_needed` (int)
      - `created_at` (timestamp)
    
    - `player_requests`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `user_id` (uuid, references profiles)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `turf_id` (uuid, references turfs)
      - `user_id` (uuid, references profiles)
      - `rating` (int)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  role text NOT NULL CHECK (role IN ('player', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create turfs table
CREATE TABLE IF NOT EXISTS turfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  location jsonb NOT NULL,
  sports text[] NOT NULL,
  surfaces text[] NOT NULL,
  facilities text[] NOT NULL,
  photos text[] NOT NULL,
  pricing jsonb NOT NULL,
  available_hours jsonb NOT NULL,
  min_players int NOT NULL,
  max_players int NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  turf_id uuid REFERENCES turfs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  sport text NOT NULL,
  total_players int NOT NULL,
  price_per_player numeric NOT NULL,
  total_amount numeric NOT NULL,
  payment_status text NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  booking_status text NOT NULL CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
  need_players boolean DEFAULT false,
  players_needed int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create player_requests table
CREATE TABLE IF NOT EXISTS player_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  turf_id uuid REFERENCES turfs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE turfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Turfs policies
CREATE POLICY "Turfs are viewable by everyone"
  ON turfs FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert turfs"
  ON turfs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update own turfs"
  ON turfs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.id = turfs.owner_id
    )
  );

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = bookings.user_id
  ));

CREATE POLICY "Admin can view turf bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.id IN (
        SELECT owner_id FROM turfs WHERE id = bookings.turf_id
      )
    )
  );

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = bookings.user_id
  ));

-- Player requests policies
CREATE POLICY "Users can view own requests"
  ON player_requests FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = player_requests.user_id
  ));

CREATE POLICY "Users can create requests"
  ON player_requests FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = player_requests.user_id
  ));

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = reviews.user_id
  ));

-- Create functions
CREATE OR REPLACE FUNCTION get_turf_rating(turf_id uuid)
RETURNS TABLE (average numeric, count bigint)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(AVG(rating)::numeric(10,2), 0) as average,
    COUNT(*)::bigint
  FROM reviews
  WHERE reviews.turf_id = $1;
END;
$$;

-- Create triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_turfs_updated_at
  BEFORE UPDATE ON turfs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();