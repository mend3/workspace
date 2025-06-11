DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'n8n'
   ) THEN
      CREATE DATABASE n8n;
   END IF;
END
$$;
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'sws'
   ) THEN
      CREATE DATABASE sws;
   END IF;
END
$$;

\c sws

CREATE TABLE
  products (
    product_id SERIAL PRIMARY KEY,
    product_name TEXT,
    product_code TEXT,
    has_ingredient BOOLEAN,
    has_nutritional_values BOOLEAN,
    has_special_description BOOLEAN,
    description TEXT,
    batch_price NUMERIC,
    claims JSONB,
    rate_base NUMERIC,
    rate_average NUMERIC,
    rate_counter NUMERIC,
    mandatory_text TEXT,
    recommended_text TEXT,
    forbidden_text TEXT,
    page INTEGER,
    position INTEGER,
    brand TEXT,
    is_sponsored BOOLEAN,
    ean TEXT,
    fidelity_price NUMERIC,
    manufacturer TEXT,
    additional_information TEXT,
    region TEXT,
    total_sold INTEGER,
    color TEXT,
    size TEXT,
    weight TEXT,
    is_best_seller BOOLEAN,
    can_buy BOOLEAN,
    from_price NUMERIC,
    unit_price NUMERIC,
    seller TEXT,
    shipper TEXT,
    tax NUMERIC,
    eta TEXT,
    discount TEXT,
    task_reference TEXT,
    date_reference TEXT,
    time_reference TEXT,
    source TEXT
  );

CREATE TABLE
  hero_images (
    hero_image_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (product_id),
    image TEXT,
    inner_text TEXT
  );

CREATE TABLE
  images (
    image_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (product_id),
    image_url TEXT
  );

CREATE TABLE
  reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (product_id),
    inner_rate INTEGER,
    user_name TEXT,
    date TEXT,
    inner_text TEXT
  );

CREATE TABLE
  video_urls (
    video_url_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (product_id),
    video_url TEXT
  );

CREATE TABLE
  rating_breakdowns (
    rating_breakdown_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (product_id),
    rating_breakdown TEXT
  );

CREATE TABLE
  marketplaces (
    marketplace_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (product_id),
    can_buy BOOLEAN,
    from_price NUMERIC,
    unit_price NUMERIC,
    seller TEXT,
    shipper TEXT,
    tax NUMERIC,
    eta TEXT,
    discount TEXT
  );

CREATE TABLE
  banners (
    banner_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (product_id),
    banner_url TEXT,
    banner_text TEXT
  );

CREATE TABLE
  categories (
    category_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (product_id),
    category_name TEXT,
    category_url TEXT
  );
