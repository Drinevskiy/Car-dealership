CREATE TABLE IF NOT EXISTS models(
	model_id SERIAL PRIMARY KEY,
	brand_id INTEGER REFERENCES brands(brand_id) ON DELETE CASCADE,
	model_name VARCHAR(50) NOT NULL CHECK(model_name <> '')
);