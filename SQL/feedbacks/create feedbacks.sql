CREATE TABLE IF NOT EXISTS feedbacks(
	feedback_id SERIAL PRIMARY KEY,
	user_sender_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
	user_receiver_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
	mark INTEGER NOT NULL CHECK(mark BETWEEN 1 AND 5),
	text VARCHAR(500) NOT NULL DEFAULT 'Текст отзыва'
);