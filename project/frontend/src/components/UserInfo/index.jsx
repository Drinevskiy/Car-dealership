import React, { useEffect, useState } from "react";
import axios from "../../utils/axios.js"; // Убедитесь, что путь к axios корректен
import { Button, Card, Container, Table } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext.js";

export const UserInfo = () => {
    const { id } = useParams(); // Получаем ID пользователя из URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]); // Хранение логов
    const [loadingLogs, setLoadingLogs] = useState(true); // Индикатор загрузки логов
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/users/${id}`); // Получаем данные пользователя
                setUser(response.data);
            } catch (error) {
                console.error("Ошибка при получении данных пользователя:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    useEffect(() => {
        const fetchUserLogs = async () => {
            if (isAdmin) {
                try {
                    const response = await axios.get(`/users/logs/${id}`); // Получаем логи пользователя
                    setLogs(response.data);
                } catch (error) {
                    console.error("Ошибка при получении логов пользователя:", error);
                } finally {
                    setLoadingLogs(false);
                }
            } else {
                setLoadingLogs(false); // Если не админ, просто останавливаем загрузку
            }
        };

        fetchUserLogs();
    }, [isAdmin, id]);

    if (loading) {
        return <div>Загрузка...</div>; // Индикатор загрузки
    }

    if (!user) {
        navigate('/not-found');
        return null; // Возвращаем null, чтобы избежать ошибки при навигации
    }

    return (
        <Container className="my-5">
            <Card className="mx-auto" style={{ width: "50%" }}>
                <Card.Body className="mx-3">
                    <Card.Title className="my-2 fs-2 text-center">{user.username}</Card.Title>
                    <Card.Text className="mb-2">
                        <strong>Роль:</strong> {user.role_name}
                    </Card.Text>
                    <Card.Text className="mb-2">
                        <strong>Средняя оценка:</strong> {user.average_mark ? (user.average_mark) : 0}/5
                    </Card.Text>
                    <Card.Text className="mb-2">
                        <strong>Email:</strong> {user.email}
                    </Card.Text>
                    <Card.Text className="mb-2">
                        <strong>Телефон:</strong> {user.phone}
                    </Card.Text>
                </Card.Body>
                <div className="d-flex justify-content-evenly mb-3">
                    <Button variant="primary" onClick={() => navigate(`/user/${id}/add-feedback`)}>
                        Оставить отзыв
                    </Button>
                    <Button variant="info" onClick={() => navigate(`/user/${id}/feedbacks`)}>
                        Посмотреть отзывы
                    </Button>
                    {isAdmin ? 
                    <Button variant="danger" onClick={() => navigate(`/user/${id}/feedbacks`)}>
                        Заблокировать
                    </Button>
                    :<></>
                    }
                </div>
            </Card>

            {isAdmin && (
                <Card className="mx-auto mt-4" style={{ width: "50%" }}>
                    <Card.Body>
                        <Card.Title className="fs-4 text-center">Логи пользователя</Card.Title>
                        {loadingLogs ? (
                            <div>Загрузка логов...</div>
                        ) : (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Сообщение</th>
                                        <th>Время</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length > 0 ? (
                                        logs.map((log, index) => (
                                            <tr key={index}>
                                                <td>{log.text}</td>
                                                <td>{new Date(log.time).toLocaleString('ru-RU')}</td> {/* Форматированная дата */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">Логи отсутствуют</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};