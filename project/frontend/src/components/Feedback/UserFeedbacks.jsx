import React, { useEffect, useState } from "react";
import axios from "../../utils/axios.js"; // Убедитесь, что путь к axios корректен
import { useParams } from "react-router-dom";
import { Container, Card, ListGroup, Badge, Pagination } from "react-bootstrap";

export const UserFeedbacks = () => {
    const { id } = useParams(); // Получаем ID пользователя из URL
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const [reviewsPerPage] = useState(5); // Количество отзывов на странице

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/feedbacks/${id}`); // Получаем отзывы по ID пользователя
                setReviews(response.data);
                calculateAverageRating(response.data);
            } catch (error) {
                console.error("Ошибка при получении отзывов:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [id]);

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return;
        const total = reviews.reduce((acc, review) => acc + review.mark, 0);
        const average = total / reviews.length;
        setAverageRating(average.toFixed(1)); // Округляем до одного знака после запятой
    };

    // Вычисляем отзывы для текущей страницы
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    // Определяем количество страниц
    const pageNumbers = Math.ceil(reviews.length / reviewsPerPage);

    // Обработка смены страницы
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Формируем массив страниц для отображения
    const createPageArray = () => {
        const pages = [];
        for (let i = 1; i <= pageNumbers; i++) {
            if (i === 1 || i === pageNumbers || (i >= currentPage - 2 && i <= currentPage + 2)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    const pageArray = createPageArray();

    if (loading) {
        return <div className="text-center mt-3">Загрузка...</div>; // Индикатор загрузки
    }

    if (!reviews.length) {
        return <div className="text-center mt-3">О пользователе еще не оставили отзывов.</div>; // Сообщение об отсутствии отзывов
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-3">Отзывы о пользователе {reviews[0].receiver_username}</h2>
            <h4 className="text-center mb-3">
                Средняя оценка: <Badge bg="info">{averageRating} звёзд</Badge>
            </h4>
            <ListGroup className="mx-auto" style={{ width: "40%" }}>
                {currentReviews.map((review, index) => {
                    let bgColor;
                    if (review.mark === 5) {
                        bgColor = "bg-success"; // Зеленый
                    } else if (review.mark >= 3) {
                        bgColor = "bg-warning"; // Желтый
                    } else {
                        bgColor = "bg-danger"; // Красный
                    }

                    return (
                        <ListGroup.Item key={index}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {review.sender_username} <Badge className={bgColor}>{review.mark} звёзд</Badge>
                                    </Card.Title>
                                    <Card.Text>{review.text}</Card.Text>
                                </Card.Body>
                            </Card>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>

            {/* Пагинация */}
            <div className="text-center mt-4">
                <Pagination className="d-flex justify-content-center mb-4">
                    <Pagination.Prev onClick={() => {
                        if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                        }
                    }} />
                    {pageArray.map((number, index) => (
                        <Pagination.Item
                            key={index}
                            active={number === currentPage}
                            onClick={() => {
                                if (number !== '...') handlePageChange(number);
                            }}
                        >
                            {number}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => {
                        if (currentPage < pageNumbers) {
                            setCurrentPage(currentPage + 1);
                        }
                    }} />
                </Pagination>
            </div>
        </Container>
    );
};