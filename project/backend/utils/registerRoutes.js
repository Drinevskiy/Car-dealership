// import * as Validators from '../validators/index.js';
import {checkAuth, handleValidationErrors} from './index.js';
import * as Controllers from '../controllers/index.js';

export default async (app) => {
    // Пользователи
    // app.post('/auth/login', Validators.loginValidator, handleValidationErrors, Controllers.UserController.login);
    // app.post('/auth/logout',  Controllers.UserController.logout);
    // app.post('/auth/register', Validators.registerValidator, handleValidationErrors, Controllers.UserController.register);
    // app.get('/auth/profile', checkAuth, Controllers.UserController.profile);
    // app.patch('/auth/profile', checkAuth, Controllers.UserController.changePassword);

    // Партнеры
    // app.get('/partners', Controllers.PartnerController.getAll);
    // app.get('/partners/:id', Controllers.PartnerController.getOne);
    // app.post('/partners', checkAuth, Validators.partnerCreateValidator, handleValidationErrors, Controllers.PartnerController.create);
    // app.patch('/partners/:id', checkAuth, handleValidationErrors, Controllers.PartnerController.update);
    // app.delete('/partners/:id', checkAuth, Controllers.PartnerController.remove);

    // // Вольеры
    // app.get('/aviary', Controllers.AviaryController.getAll);
    // app.get('/aviary/:id', Controllers.AviaryController.getOne);
    // app.post('/aviary', checkAuth, Validators.aviaryCreateValidator, handleValidationErrors, Controllers.AviaryController.create);
    // app.patch('/aviary/:id', checkAuth, handleValidationErrors, Controllers.AviaryController.update);
    // app.delete('/aviary/:id', checkAuth, Controllers.AviaryController.remove);

    // // Новости
    // app.get('/news', Controllers.NewController.getAll);
    // app.get('/news/:id', Controllers.NewController.getOne);
    // app.post('/news',  Validators.newCreateValidator, handleValidationErrors, Controllers.NewController.create);
    // app.patch('/news/:id', checkAuth, handleValidationErrors, Controllers.NewController.update);
    // app.delete('/news/:id', checkAuth, Controllers.NewController.remove);

    // // Животные 
    // app.get('/animals', Controllers.AnimalController.getAll);
    // app.get('/animals/:id', Controllers.AnimalController.getOne);
    // app.post('/animals', checkAuth, Validators.animalCreateValidator, handleValidationErrors, Controllers.AnimalController.create);
    // app.patch('/animals/:id', checkAuth, handleValidationErrors, Controllers.AnimalController.update);
    // app.delete('/animals/:id', checkAuth, Controllers.AnimalController.remove);
};