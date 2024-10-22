CREATE TABLE IF NOT EXISTS cars(
	car_id SERIAL PRIMARY KEY,
	model_id INTEGER NOT NULL REFERENCES models(model_id) ON DELETE CASCADE,
	transmission_id INTEGER NOT NULL REFERENCES transmissions(transmission_id) ON DELETE CASCADE,
	engine_id INTEGER NOT NULL REFERENCES engine_types(engine_id) ON DELETE CASCADE,
	price MONEY DEFAULT 1,
	manufacture_date DATE NOT NULL CHECK(manufacture_date <= NOW())
);