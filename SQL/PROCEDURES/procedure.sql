CREATE OR REPLACE PROCEDURE public.add_car(IN p_model_name text, IN p_transmission_name text, IN p_engine_name text, IN p_price money, IN p_manufacture_date date)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
	INSERT INTO cars (model_id, transmission_id, engine_id, price, manufacture_date) 
	VALUES (
		(SELECT model_id FROM models WHERE model_name LIKE p_model_name), 
		(SELECT transmission_id FROM transmissions WHERE transmission_name LIKE p_transmission_name), 
		(SELECT engine_id FROM engine_types WHERE engine_name LIKE p_engine_name), 
		p_price, 
		p_manufacture_date
	);
END;
$procedure$;

CREATE OR REPLACE PROCEDURE public.leave_review(IN user_sender_name text, IN user_receiver_name text, IN mark integer, IN review_text text)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
	INSERT INTO feedbacks (user_sender_id, user_receiver_id, mark, text)
	VALUES((SELECT user_id FROM users WHERE username = user_sender_name),
		   (SELECT user_id FROM users WHERE username = user_receiver_name),
		   mark,
		   review_text
    ); 
END;
$procedure$
