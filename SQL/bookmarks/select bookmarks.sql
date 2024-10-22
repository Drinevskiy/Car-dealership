SELECT bookmark_id, username, advertisement_id, note 
FROM bookmarks
RIGHT JOIN users USING(user_id);

-- VIEW для всех закладок
SELECT * FROM all_bookmarks;