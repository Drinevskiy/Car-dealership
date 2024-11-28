import jwt from 'jsonwebtoken';
import config from 'config';

const SECRET_KEY = config.get('SECRET_KEY');

export default async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.userId = decoded.id;
            return next();
            
        } catch (err) {
            console.log(err);
            return res.status(403).json({ message: "Отказано в доступе" });
        }
    } else {
        return res.status(403).json({ message: "Отказано в доступе" });
    }
};