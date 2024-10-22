CREATE TABLE IF NOT EXISTS roles
(
	role_id SERIAL CONSTRAINT roles_pkey PRIMARY KEY,
	role_name VARCHAR(30) CONSTRAINT role_name_key NOT NULL UNIQUE
);

INSERT INTO roles (role_name) VALUES ('Пользователь'), ('Администратор');
