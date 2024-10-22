CREATE TABLE IF NOT EXISTS bookmarks(
	bookmark_id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
	advertisement_id INTEGER REFERENCES advertisements(advertisement_id) ON DELETE CASCADE,
	note VARCHAR(200) DEFAULT 'Заметка'
);