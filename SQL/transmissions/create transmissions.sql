CREATE TABLE IF NOT EXISTS transmissions(
	transmission_id SERIAL PRIMARY KEY,
	transmission_name VARCHAR(50) NOT NULL UNIQUE
);