/*
# Create deals table for DealScout

1. New Tables
- `deals`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `user_id` (uuid, references auth.users, nullable; defaults to auth.uid())
  - `label` (text, not null)
  - `inputs` (jsonb, not null)
  - `metrics` (jsonb, not null)
  - `verdict` (text, not null)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `deals`.
- Owner-scoped CRUD for authenticated users.
- `user_id` defaults to `auth.uid()` so inserts that omit it satisfy WITH CHECK.
*/

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  inputs jsonb NOT NULL,
  metrics jsonb NOT NULL,
  verdict text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_deals" ON deals;
CREATE POLICY "select_own_deals" ON deals FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_deals" ON deals;
CREATE POLICY "insert_own_deals" ON deals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_deals" ON deals;
CREATE POLICY "update_own_deals" ON deals FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_deals" ON deals;
CREATE POLICY "delete_own_deals" ON deals FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS deals_user_id_idx ON deals(user_id);
