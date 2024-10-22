CREATE TABLE IF NOT EXISTS users
(
	user_id SERIAL PRIMARY KEY,
	role_id INTEGER DEFAULT 1 REFERENCES roles(role_id) ON DELETE SET DEFAULT,
	username VARCHAR(30) NOT NULL UNIQUE CHECK(username != ''),
	user_password VARCHAR(30) NOT NULL CHECK(length(user_password) > 7),
	email VARCHAR(50) NOT NULL UNIQUE CHECK(email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
	phone VARCHAR(13) NOT NULL UNIQUE CHECK(phone ~ '^\+375[0-9]{9}$')
);

