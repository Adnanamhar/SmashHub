-- Jalankan SQL ini di Supabase Dashboard → SQL Editor → New Query → Run

-- 1. Tambah kolom quota dan time ke tabel Event
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS time TEXT DEFAULT '';
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS quota INTEGER DEFAULT 12;
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS owner TEXT DEFAULT 'GOR SmashHub';

-- 2. Buat tabel EventJoin untuk tracking peserta
CREATE TABLE IF NOT EXISTS "EventJoin" (
  id SERIAL PRIMARY KEY,
  "eventId" INTEGER NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL DEFAULT 'user_1',
  "joinedAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("eventId", "userId")
);

ALTER TABLE "EventJoin" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on EventJoin" ON "EventJoin" FOR ALL USING (true) WITH CHECK (true);
