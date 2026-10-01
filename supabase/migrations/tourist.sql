/*
# Create tourist spots and live updates tables (single-tenant, no auth)

1. New Tables
- `tourist_spots` — catalog of German tourist destinations
  - id (uuid, primary key)
  - name (text, not null) — name of the spot
  - city (text, not null) — city where located
  - description (text, not null) — description of the spot
  - image_url (text) — optional image URL
  - category (text, not null) — e.g. "Castle", "Museum", "Nature"
  - latitude (numeric) — geographic latitude
  - longitude (numeric) — geographic longitude
  - created_at (timestamptz, default now())
- `live_updates` — real-time updates/announcements for each tourist spot
  - id (uuid, primary key)
  - spot_id (uuid, foreign key to tourist_spots)
  - message (text, not null) — the update content
  - update_type (text, not null) — e.g. "info", "alert", "event", "weather"
  - author (text, not null, default 'Staff') — who posted the update
  - created_at (timestamptz, default now())
2. Security
- Enable RLS on both tables.
- Allow anon + authenticated full CRUD — data is intentionally public/shared (no sign-in app).
3. Important Notes
- This is a single-tenant app with no authentication.
- All policies use TO anon, authenticated so the anon-key frontend can read/write.
- Live updates are ordered by created_at descending in the frontend.
*/

CREATE TABLE IF NOT EXISTS tourist_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  description text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'Landmark',
  latitude numeric(9,6),
  longitude numeric(9,6),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tourist_spots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_spots" ON tourist_spots;
CREATE POLICY "anon_select_spots" ON tourist_spots FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_spots" ON tourist_spots;
CREATE POLICY "anon_insert_spots" ON tourist_spots FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_spots" ON tourist_spots;
CREATE POLICY "anon_update_spots" ON tourist_spots FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_spots" ON tourist_spots;
CREATE POLICY "anon_delete_spots" ON tourist_spots FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS live_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid NOT NULL REFERENCES tourist_spots(id) ON DELETE CASCADE,
  message text NOT NULL,
  update_type text NOT NULL DEFAULT 'info',
  author text NOT NULL DEFAULT 'Staff',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE live_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_updates" ON live_updates;
CREATE POLICY "anon_select_updates" ON live_updates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_updates" ON live_updates;
CREATE POLICY "anon_insert_updates" ON live_updates FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_updates" ON live_updates;
CREATE POLICY "anon_update_updates" ON live_updates FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_updates" ON live_updates;
CREATE POLICY "anon_delete_updates" ON live_updates FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_live_updates_spot_id ON live_updates(spot_id);
CREATE INDEX IF NOT EXISTS idx_live_updates_created_at ON live_updates(created_at DESC);
