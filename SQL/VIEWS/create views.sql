CREATE OR REPLACE VIEW all_cars AS
SELECT brand_name, model_name, transmission_name, engine_name
FROM cars c
JOIN models m USING(model_id)
JOIN brands b USING(brand_id)
JOIN transmissions t ON t.transmission_id = c.transmission_id
NATURAL JOIN engine_types
ORDER BY 1, 2;

CREATE OR REPLACE VIEW all_users AS
SELECT role_name, username, email, phone
FROM users u
FULL JOIN roles r ON r.role_id = u.role_id;

CREATE OR REPLACE VIEW all_advertisements AS
SELECT username, 
(SELECT ROUND(AVG(mark),1) 
	FROM feedbacks f
	JOIN users u1 ON f.user_receiver_id = u1.user_id AND u1.username LIKE u.username) "Average mark",
	brand_name, model_name, price, manufacture_date
FROM advertisements a
JOIN users u ON a.user_id = u.user_id
JOIN cars c ON c.car_id = a.car_id
JOIN models m ON m.model_id = c.model_id
JOIN brands b ON b.brand_id = m.brand_id
ORDER BY username, brand_name, model_name;

CREATE OR REPLACE VIEW all_bookmarks AS
SELECT username, brand_name, model_name, price, manufacture_date, note
FROM bookmarks bk
JOIN users u ON bk.user_id = u.user_id
JOIN advertisements a ON a.advertisement_id = bk.advertisement_id
JOIN cars c ON a.car_id = c.car_id
JOIN models m ON m.model_id = c.model_id
JOIN brands b ON b.brand_id = m.brand_id
ORDER BY username, brand_name, model_name;

CREATE OR REPLACE VIEW all_feedbacks AS
SELECT u2.username AS receiver_username, u1.username AS sender_username, mark, text
FROM feedbacks f
JOIN users u1 ON f.user_sender_id = u1.user_id
JOIN users u2 ON f.user_receiver_id = u2.user_id
ORDER BY receiver_username, mark DESC;
