-- Extend schema for Lexal Tech Store storefront (idempotent-ish; run once)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'Gadgets',
  ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) NOT NULL DEFAULT 4.5,
  ADD COLUMN IF NOT EXISTS reviews_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stock INT NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS badge VARCHAR(30) NOT NULL DEFAULT '';

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_address VARCHAR(500) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS shipping_type VARCHAR(20) NOT NULL DEFAULT 'Standard';

-- NOTE: MariaDB <10.x may not support IF NOT EXISTS for ADD COLUMN.
-- If it fails, run the app once: src/repos/base.js ensureProductColumns() migrates automatically.

