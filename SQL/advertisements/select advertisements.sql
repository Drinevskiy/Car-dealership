SELECT advertisement_id, username, car_id, description 
FROM advertisements
JOIN users USING(user_id);

-- DELETE FROM advertisements;

-- Все машины пользователя с username
SELECT brand_name, model_name, price, manufacture_date
FROM advertisements a
NATURAL JOIN cars
NATURAL JOIN models
NATURAL JOIN brands
WHERE EXISTS(
	SELECT 1 
	FROM users u
	WHERE a.user_id = u.user_id AND u.username LIKE '%Nikita%'
)
ORDER BY 3;

-- Плохой пример union
SELECT u.username, brand_name, model_name, price, manufacture_date
FROM advertisements a
NATURAL JOIN cars
NATURAL JOIN models
NATURAL JOIN brands
NATURAL JOIN users u
WHERE EXISTS(
	SELECT 1 
	FROM users u1
	WHERE a.user_id = u1.user_id AND u1.username LIKE '%Nikita%'
)
UNION
SELECT u.username, brand_name, model_name, price, manufacture_date
FROM advertisements a
NATURAL JOIN cars
NATURAL JOIN models
NATURAL JOIN brands
NATURAL JOIN users u
WHERE EXISTS(
	SELECT 1 
	FROM users u1
	WHERE a.user_id = u1.user_id AND u1.username LIKE '%Lisa%'
)
ORDER BY 1;



-- View для всех объявлений
SELECT * FROM all_advertisements;