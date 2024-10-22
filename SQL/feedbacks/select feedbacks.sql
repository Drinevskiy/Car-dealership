EXPLAIN ANALYZE SELECT feedback_id, u1.username AS sender_username, u2.username AS receiver_username, mark, text
FROM feedbacks f
JOIN users u1 ON f.user_sender_id = u1.user_id
JOIN users u2 ON f.user_receiver_id = u2.user_id
WHERE mark BETWEEN 3 AND 5
ORDER BY mark DESC;

-- Все отзывы с оценкой от 3 до 5
SELECT feedback_id, u1.username AS sender_username, u2.username AS receiver_username, mark, text
FROM feedbacks f
JOIN users u1 ON f.user_sender_id = u1.user_id
JOIN users u2 ON f.user_receiver_id = u2.user_id
WHERE mark BETWEEN 3 AND 5
ORDER BY mark DESC;

-- Все пользователи с их средней оценкой, которая больше средней оценки всех пользователей
SELECT username, ROUND(AVG(mark),1) "Average mark"
FROM feedbacks f
JOIN users u ON f.user_receiver_id = u.user_id
GROUP BY username
HAVING ROUND(AVG(mark),1) > 
(
	SELECT ROUND(AVG(mark),1)
	FROM feedbacks f
	JOIN users u ON f.user_receiver_id = u.user_id
)
ORDER BY 2 DESC;

-- VIEW для всех отзывов
SELECT * FROM all_feedbacks;



-- DELETE FROM feedbacks;