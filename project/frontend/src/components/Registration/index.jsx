import React, { useState } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../utils/AuthContext';
import { Navigate } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';

const RegistrationForm = () => {
    const { token, saveToken } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState([]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const usernameRegex = /^.{3,15}$/; 
    const phoneRegex = /^\+375[0-9]{9}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = [];

        if (!usernameRegex.test(formData.username)) {
            validationErrors.push({ path: 'username', msg: 'Ник пользователя должен содержать от 3 до 15 символов.' });
        }

        if (!emailRegex.test(formData.email)) {
            validationErrors.push({ path: 'email', msg: 'Неверный формат почты.' });
        }

        if (!phoneRegex.test(formData.phone)) {
            validationErrors.push({ path: 'phone', msg: 'Неверный формат телефона. (+375441234567)' });
        }

        if (!passwordRegex.test(formData.password)) {
            validationErrors.push({ path: 'password', msg: 'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры.' });
        }

        if (formData.password !== formData.confirmPassword) {
            validationErrors.push({ path: 'confirmPassword', msg: 'Пароли не совпадают.' });
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const registrationData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
        };
        axios.post('/auth/register', registrationData, { withCredentials: true })
            .then(res => {
                saveToken(res.data.token);
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    setErrors(error.response.data);
                } else {
                    console.error(error);
                }
            });
    };

    if (token) {
        return <Navigate to='/' />;
    }

    return (
        <Container className="d-flex justify-content-center my-5">
            <Form onSubmit={handleSubmit} className="border p-4" style={{ width: "30%", border: "1px solid #a4c9d5", borderRadius: '8px', boxShadow: '0 0 3px rgba(0, 123, 255, 0.5)' }}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    {errors.find(error => error.path === 'username') && (
                        <Alert variant="danger" className="mt-2">
                            {errors.find(error => error.path === 'username').msg}
                        </Alert>
                    )}
                </Form.Group>

                <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Электронная почта</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.find(error => error.path === 'email') && (
                        <Alert variant="danger" className="mt-2">
                            {errors.find(error => error.path === 'email').msg}
                        </Alert>
                    )}
                </Form.Group>

                <Form.Group controlId="formPhone" className="mt-3">
                    <Form.Label>Телефон</Form.Label>
                    <Form.Control
                        type="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    {errors.find(error => error.path === 'phone') && (
                        <Alert variant="danger" className="mt-2">
                            {errors.find(error => error.path === 'phone').msg}
                        </Alert>
                    )}
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.find(error => error.path === 'password') && (
                        <Alert variant="danger" className="mt-2">
                            {errors.find(error => error.path === 'password').msg}
                        </Alert>
                    )}
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mt-3">
                    <Form.Label>Подтверждение пароля</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.find(error => error.path === 'confirmPassword') && (
                        <Alert variant="danger" className="mt-2">
                            {errors.find(error => error.path === 'confirmPassword').msg}
                        </Alert>
                    )}
                </Form.Group>

                {errors.find(error => error.message) && (
                    <Alert variant="danger" className="mt-3">
                        {errors.find(error => error.message).message}
                    </Alert>
                )}

                <Button variant="primary" type="submit" className="mt-3 d-block" style={{ width: "100%" }}>
                    Регистрация
                </Button>
            </Form>
        </Container>
    );
};

export { RegistrationForm };