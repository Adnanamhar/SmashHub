-- Jalankan SQL ini di Supabase Dashboard → SQL Editor → New Query → Run

CREATE TABLE IF NOT EXISTS "Booking" (
  id SERIAL PRIMARY KEY,
  "courtId" INTEGER NOT NULL REFERENCES "Court"(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  "userId" TEXT NOT NULL DEFAULT 'user_1',
  status TEXT DEFAULT 'confirmed',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("courtId", date, time)
);

ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on Booking" ON "Booking" FOR ALL USING (true) WITH CHECK (true);
