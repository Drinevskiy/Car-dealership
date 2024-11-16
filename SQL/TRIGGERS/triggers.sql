CREATE OR REPLACE FUNCTION public.check_advertisement_amount_trigger_fnc()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
	amount INTEGER;
BEGIN
	SELECT COUNT(*) INTO amount 
	FROM advertisements
	WHERE user_id = NEW.user_id;
	IF amount >= 5 THEN
        RAISE EXCEPTION 'Пользователь уже добавил максимальное количество объявлений.';
    END IF;
	RETURN NEW;
END;
$function$;

CREATE OR REPLACE TRIGGER check_advertisement_amount_trigger 
BEFORE INSERT ON public.advertisements 
FOR EACH ROW EXECUTE FUNCTION check_advertisement_amount_trigger_fnc();


CREATE OR REPLACE FUNCTION public.check_bookmark_amount_trigger_fnc()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
	amount INTEGER;
BEGIN
	SELECT COUNT(*) INTO amount 
	FROM bookmarks
	WHERE user_id = NEW.user_id;
	IF amount >= 10 THEN
        RAISE EXCEPTION 'Пользователь уже добавил максимальное количество закладок.';
    END IF;
	RETURN NEW;
END;
$function$;

CREATE OR REPLACE TRIGGER check_bookmark_amount_trigger 
BEFORE INSERT ON public.bookmarks 
FOR EACH ROW EXECUTE FUNCTION check_bookmark_amount_trigger_fnc();


CREATE OR REPLACE FUNCTION public.check_car_photo_amount_trigger_fnc()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
	amount INTEGER;
BEGIN
	SELECT COUNT(*) INTO amount 
	FROM car_photos
	WHERE car_id = NEW.car_id;
	IF amount >= 10 THEN
        RAISE EXCEPTION 'Загружено максимальное количество фото для одной машины.';
    END IF;
	RETURN NEW;
END;
$function$;

CREATE OR REPLACE TRIGGER check_car_photo_amount_trigger 
BEFORE INSERT ON public.car_photos 
FOR EACH ROW EXECUTE FUNCTION check_car_photo_amount_trigger_fnc();

CREATE OR REPLACE FUNCTION public.log_add_advertisement_trigger_fnc()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO logs(user_id, text, time)
	VALUES (NEW.user_id, 'Пользователь добавил объявление ' || NEW.advertisement_id::TEXT, NOW());
	RETURN NEW;
END;
$function$;

CREATE OR REPLACE TRIGGER log_add_advertisement_trigger 
AFTER INSERT ON public.advertisements 
FOR EACH ROW EXECUTE FUNCTION log_add_advertisement_trigger_fnc();

CREATE OR REPLACE FUNCTION public.log_add_feedback_trigger_fnc()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO logs(user_id, text, time)
	VALUES (NEW.user_sender_id, 'Пользователь оставил отзыв о пользователе с id ' || NEW.user_receiver_id::TEXT, NOW());
	RETURN NEW;
END;
$function$;

CREATE OR REPLACE TRIGGER log_add_feedback_trigger 
AFTER INSERT ON public.feedbacks 
FOR EACH ROW EXECUTE FUNCTION log_add_feedback_trigger_fnc();


CREATE OR REPLACE FUNCTION public.log_register_user_trigger_fnc()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
INSERT INTO logs(user_id, text, time)
VALUES (NEW.user_id, 'Пользователь зарегистрировался в системе.', NOW());
RETURN NEW;
END;
$function$;

CREATE OR REPLACE TRIGGER log_register_user_trigger 
AFTER INSERT ON public.users 
FOR EACH ROW EXECUTE FUNCTION log_register_user_trigger_fnc();

