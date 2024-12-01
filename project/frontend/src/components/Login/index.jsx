import React, { useState } from 'react';
import axios from '../../utils/axios';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { Form, Button, Alert, Container } from 'react-bootstrap';

const LoginForm = () => {
    const { token, saveToken } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState([]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = [];

        if (!emailRegex.test(formData.email)) {
            validationErrors.push({ path: 'email', msg: 'Неверный формат email.' });
        }

        if (!passwordRegex.test(formData.password)) {
            validationErrors.push({ path: 'password', msg: 'Пароль должен содержать минимум 8 символов, включая заглавные буквы, строчные буквы и цифры.' });
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios.post('/auth/login', formData, { withCredentials: true })
            .then(res => {
                saveToken(res.data.token);
            })
            .catch(error => {
                if (error.response && (error.response.status === 400 || error.response.status === 404)) {
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
        <Form onSubmit={handleSubmit} className="mt-4 mx-auto p-4" style={{width: "30%", border: "1px solid #a4c9d5", borderRadius: '8px', boxShadow: '0 0 3px rgba(0, 123, 255, 0.5)'}}>
            <Form.Group controlId="formEmail">
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

            {errors.find(error => error.message) && (
                <Alert variant="danger" className="mt-3">
                    {errors.find(error => error.message).message}
                </Alert>
            )}

            <Button variant="primary" type="submit" className="mt-3 d-block" style={{width: "100%"}}>
                Войти
            </Button>
        </Form>
    );
};

export { LoginForm };