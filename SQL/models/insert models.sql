-- INSERT INTO models (brand_id, model_name) VALUES (2, 'M3'), (2, 'M5'), (2, 'X3'), (2, 'X5'), (2, 'X7');
-- INSERT INTO models (brand_id, model_name) VALUES (3, 'Passat'), (3, 'Jetta'), (3, 'Polo'), (3, 'Sharan'), (3, 'Touran');
-- INSERT INTO models (brand_id, model_name) VALUES (4, '911'), (4, 'Carrera'), (4, 'Panamera'), (4, 'Cayenne'), (4, 'Taycan');
-- INSERT INTO models (brand_id, model_name) VALUES (5, 'Vaneo'), (5, 'AMG GT'), (5, 'C-класс W206'), (5, 'A-класс W177'), (5, 'G-класс W464');




INSERT INTO models (brand_id, model_name) 
VALUES 
((SELECT brand_id FROM brands WHERE brand_name = 'Chevrolet'), 'Camaro'),
((SELECT brand_id FROM brands WHERE brand_name = 'Chevrolet'), 'Cobalt'),
((SELECT brand_id FROM brands WHERE brand_name = 'Chevrolet'), 'Corvette'),
((SELECT brand_id FROM brands WHERE brand_name = 'Chevrolet'), 'Lacetti'),
((SELECT brand_id FROM brands WHERE brand_name = 'Chevrolet'), 'Malibu'),
((SELECT brand_id FROM brands WHERE brand_name = 'Chevrolet'), 'Niva');

INSERT INTO models (brand_id, model_name) 
VALUES 
((SELECT brand_id FROM brands WHERE brand_name = 'Citroen'), 'Berlingo'),
((SELECT brand_id FROM brands WHERE brand_name = 'Citroen'), 'C4'),
((SELECT brand_id FROM brands WHERE brand_name = 'Citroen'), 'C5'),
((SELECT brand_id FROM brands WHERE brand_name = 'Citroen'), 'Evasion'),
((SELECT brand_id FROM brands WHERE brand_name = 'Citroen'), 'Xantia'),
((SELECT brand_id FROM brands WHERE brand_name = 'Citroen'), 'Xsara');


INSERT INTO models (brand_id, model_name) 
VALUES 
((SELECT brand_id FROM brands WHERE brand_name = 'Cadillac'), 'CT4'),
((SELECT brand_id FROM brands WHERE brand_name = 'Cadillac'), 'Eldorado'),
((SELECT brand_id FROM brands WHERE brand_name = 'Cadillac'), 'Escalade'),
((SELECT brand_id FROM brands WHERE brand_name = 'Cadillac'), 'STS'),
((SELECT brand_id FROM brands WHERE brand_name = 'Cadillac'), 'Seville'),
((SELECT brand_id FROM brands WHERE brand_name = 'Cadillac'), 'XT5');


INSERT INTO models (brand_id, model_name) 
VALUES 
((SELECT brand_id FROM brands WHERE brand_name = 'Dodge'), 'Avenger'),
((SELECT brand_id FROM brands WHERE brand_name = 'Dodge'), 'Dart'),
((SELECT brand_id FROM brands WHERE brand_name = 'Dodge'), 'Hornet'),
((SELECT brand_id FROM brands WHERE brand_name = 'Dodge'), 'Magnum'),
((SELECT brand_id FROM brands WHERE brand_name = 'Dodge'), 'Stratus'),
((SELECT brand_id FROM brands WHERE brand_name = 'Dodge'), 'Challenger');

INSERT INTO models (brand_id, model_name) 
VALUES 
((SELECT brand_id FROM brands WHERE brand_name = 'Ford'), 'Cougar'),
((SELECT brand_id FROM brands WHERE brand_name = 'Ford'), 'Edge'),
((SELECT brand_id FROM brands WHERE brand_name = 'Ford'), 'Escape'),
((SELECT brand_id FROM brands WHERE brand_name = 'Ford'), 'Escort'),
((SELECT brand_id FROM brands WHERE brand_name = 'Ford'), 'Fiesta'),
((SELECT brand_id FROM brands WHERE brand_name = 'Ford'), 'Focus');

INSERT INTO models (brand_id, model_name) 
VALUES 
((SELECT brand_id FROM brands WHERE brand_name = 'Geely'), 'Atlas'),
((SELECT brand_id FROM brands WHERE brand_name = 'Geely'), 'Boyue'),
((SELECT brand_id FROM brands WHERE brand_name = 'Geely'), 'Monjaro'),
((SELECT brand_id FROM brands WHERE brand_name = 'Geely'), 'Galaxy E8'),
((SELECT brand_id FROM brands WHERE brand_name = 'Geely'), 'Emgrand'),
((SELECT brand_id FROM brands WHERE brand_name = 'Geely'), 'Coolray');