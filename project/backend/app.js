import express from 'express';
import session from 'express-session';
import config from 'config';
// import cookieParser from 'cookie-parser';
// import mongoose from 'mongoose';
import cors from 'cors';
import {pool} from './utils/index.js'
// import { registerMulter, registerRoutes, registerPassport } from './utils/index.js';
const SESSION_SECRET_KEY = config.get('SESSION_SECRET_KEY');

// mongoose
//     .connect(config.get('mongoUri'))
//     .then(() => console.log('MongoDB connected'))
//     .catch((err) => console.log('MongoDB failed connect', err));

const app = express();


// app.use(cookieParser());
// app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:3000', 
//     credentials: true
// }));
// app.use(session({
//     secret: SESSION_SECRET_KEY, 
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false } // true, если HTTPS
// })); 

app.get('/', (req, res) => {
    res.send("Hello")
});

app.get("/cars", (req, res) => {
    const sql = "SELECT * FROM cars";
    pool.query(sql, [], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.json(result.rows);
    });
  });
// registerMulter(app);
// registerRoutes(app);
// registerPassport();
  

const PORT = config.get('port') || 5000;
app.listen(PORT, () => console.log(`Start server on port ${PORT}`));

