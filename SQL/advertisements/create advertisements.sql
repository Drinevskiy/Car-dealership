CREATE TABLE IF NOT EXISTS advertisements(
	advertisement_id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
	car_id INTEGER REFERENCES cars(car_id) ON DELETE CASCADE,
	description VARCHAR(1000)
);