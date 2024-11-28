import express from 'express';
import multer from 'multer';
import config from 'config';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';  // Импортируем библиотеку для генерации UUID

export default async (app) => {
    const dirToUpload = config.get('uploads') || 'uploads';

    const storage = multer.diskStorage({
        destination: (_, __, callback) => {
            callback(null, dirToUpload);
        },
        filename: (_, file, callback) => {
            // Генерируем уникальное имя файла используя UUID и сохраняем расширение оригинального файла
            const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
            callback(null, uniqueName);
        }
    });

    const upload = multer({ storage });

    app.use('/' + dirToUpload, express.static(dirToUpload));

    app.post('/upload', upload.single('image'), (req, res) => {
        // Возвращаем URL загруженного файла
        res.json({
            url: `${dirToUpload}/${req.file.filename}`
        });
    });
}