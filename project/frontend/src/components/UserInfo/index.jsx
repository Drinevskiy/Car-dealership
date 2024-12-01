import React, { useEffect, useState } from "react";
import axios from "../../utils/axios.js"; // Убедитесь, что путь к axios корректен
import { Button, Card, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

export const UserInfo = () => {
    const { id } = useParams(); // Получаем ID пользователя из URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/users/${id}`); // Предполагается, что API возвращает данные по ID пользователя
                setUser(response.data);
            } catch (error) {
                console.error("Ошибка при получении данных пользователя:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    if (loading) {
        return <div>Загрузка...</div>; // Индикатор загрузки
    }

    if (!user) {
        navigate('/not-found');

        // return <div>Пользователь не найден.</div>; // Сообщение об ошибке
    }

    return (
        <Container className="my-5">
            <Card className="mx-auto" style={{ width: "40%" }}>
                <Card.Body className="mx-3">
                    <Card.Title className="my-2 fs-2 text-center">{user.username}</Card.Title>
                    <Card.Text className="mb-2">
                        <strong>Роль:</strong> {user.role_name}
                    </Card.Text>
                    <Card.Text className="mb-2">
                        <strong>Средняя оценка:</strong> {user.average_mark}/5
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
                    </div>
            </Card>
        </Container>
    );
};
