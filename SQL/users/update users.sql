UPDATE users
SET username='Kolya',
	user_password='qwerty1234'
WHERE username='Kirill';

UPDATE users
SET role_id = (SELECT role_id FROM roles WHERE role_name LIKE '%Администратор%')
WHERE username LIKE '%Admin%';