import React, { useState } from "react";
import axios from "../../utils/axios.js"; // Убедитесь, что путь к axios корректен
import { useParams } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from '../../utils/AuthContext';

export const AddFeedbackForm = () => {
    const { id } = useParams(); // Получаем ID пользователя, о котором пишут отзыв
    const [rating, setRating] = useState(1); // Оценка от 1 до 5
    const [text, setText] = useState(""); // Текст отзыва
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { token } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await axios.post(`/feedbacks`, {
                receiver_id: id,
                mark: rating,
                text: text
            }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });
            setSuccessMessage("Отзыв успешно оставлен!");
            setText(""); // Очистка поля текста
            setRating(1); // Сброс оценки
        } catch (error) {
            console.error("Ошибка при отправке отзыва:", error);
            setErrorMessage("Произошла ошибка при отправке отзыва.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Оставить отзыв</h2>
            {successMessage && <Alert variant="success" className="mx-auto" style={{ width: '40%' }}>{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger" className="mx-auto" style={{ width: '40%' }}>{errorMessage}</Alert>}
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ width: '40%' }}>
                <Form.Group controlId="formRating" className="mb-3">
                    <Form.Label>Оценка</Form.Label>
                    <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5].map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formText" className="mb-3">
                    <Form.Label>Текст отзыва</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        style={{maxHeight: "200px"}}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="d-block mx-auto" style={{width: "50%"}}>
                    {loading ? "Отправка..." : "Отправить"}
                </Button>
            </Form>
        </Container>
    );
};