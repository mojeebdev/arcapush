-- Migration: Add LAUNCH, PRO, PRO_MAX tiers
-- Run this before deploying v2.0

-- Step 1: Add new enum values
ALTER TYPE "StartupTier" ADD VALUE IF NOT EXISTS 'LAUNCH';
ALTER TYPE "StartupTier" ADD VALUE IF NOT EXISTS 'PRO';
ALTER TYPE "StartupTier" ADD VALUE IF NOT EXISTS 'PRO_MAX';

-- Step 2: Migrate existing PINNED startups to PRO
-- (existing pinned = they paid for hero slot, closest to PRO)
UPDATE "Startup"
SET tier = 'PRO'
WHERE tier = 'PINNED';

-- Step 3: (Optional) remove PINNED enum value after migration
-- Note: Postgres does not support removing enum values easily.
-- Leave PINNED in schema for safety. It will just go unused.
