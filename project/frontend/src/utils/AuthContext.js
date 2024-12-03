import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "./axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getToken = () => localStorage.getItem('token');
    const [token, setToken] = useState(getToken());
    const [isAdmin, setIsAdmin] = useState(false);

    const saveToken = (userToken) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    };

    const clearToken = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAdmin(false);
    };

    useEffect(() => {
        if (token) {
            decodeToken(); // Вызываем decodeToken только если токен установлен
        } else {
            setIsAdmin(false); // Если токена нет, сбрасываем isAdmin
        }
    }, [token]); // Зависимость от token

    const decodeToken = () => {
        axios.get('/check-admin', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            console.log('Декодирование токена:', response.data); // исправлено: response должен быть обработан
            setIsAdmin(response.data.isAdmin); // исправлено: доступ к данным из ответа
        })
        .catch(error => { // исправлено: .error на .catch
            console.error('Ошибка при декодировании токена:', error);
            setIsAdmin(false);
        });
    };
   

    return (
        <AuthContext.Provider value={{ token, isAdmin, saveToken, clearToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);