CREATE TABLE IF NOT EXISTS car_photos(
	photo_id SERIAL PRIMARY KEY,
	car_id INTEGER REFERENCES cars(car_id) ON DELETE CASCADE,
	photo_path VARCHAR(200) NOT NULL CHECK(photo_path!='')
)