SELECT car_id, brand_name, model_name, transmission_name, engine_name, price, manufacture_date 
FROM cars
	NATURAL JOIN models
	NATURAL JOIN brands
	NATURAL JOIN transmissions
	NATURAL JOIN engine_types;

-- Количество марок и моделей
SELECT brand_name, model_name, COUNT(car_id) as Количество
FROM cars
	NATURAL JOIN models
	NATURAL JOIN brands
-- GROUP BY brand_name, model_name;
-- GROUP BY GROUPING SETS(brand_name, model_name);
GROUP BY ROLLUP(brand_name, model_name);
-- GROUP BY CUBE(brand_name, model_name);

-- Количество автомобилей по типу трансмиссии
SELECT transmission_name, COUNT(*) as "Count"
FROM cars
NATURAL JOIN transmissions 
GROUP BY transmission_name
ORDER BY 2;

-- Количество автомобилей по типу двигателя
SELECT engine_name, COUNT(*) as "Count"
FROM cars
NATURAL JOIN engine_types
GROUP BY engine_name
ORDER BY 2 DESC;

-- Количество для каждой модели определенной марки с помощью оконной функции
SELECT brand_name, model_name, COUNT(car_id) OVER(PARTITION BY brand_name, model_name) as Количество
FROM cars
	NATURAL JOIN models
	NATURAL JOIN brands
ORDER BY 1, 3;

-- Категория автомобиля в зависимости от цены
SELECT brand_name, model_name, 
(CASE WHEN price > (SELECT MAX(price) FROM cars) / 3 * 2 THEN 'Expensive'
	  WHEN price < (SELECT MAX(price) FROM cars) / 3 THEN 'Cheap'
	  ELSE 'Average' END) AS category
FROM cars
	NATURAL JOIN models
	NATURAL JOIN brands	
ORDER BY price;	

--
SELECT * FROM all_cars;
