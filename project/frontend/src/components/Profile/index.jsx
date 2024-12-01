import React, { useEffect, useState } from "react";
import axios from "../../utils/axios.js";
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Spinner, Container, Pagination, Badge, Button, ListGroup, Form, Alert } from "react-bootstrap";
import { useAuth } from '../../utils/AuthContext';

export const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [advertisements, setAdvertisements] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const [images, setImages] = useState({});
    const [fakeImage, setFakeImage] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // Валидация пароля
    const navigate = useNavigate();
  // Пагинация для отзывов
    const [currentPage, setCurrentPage] = useState(1);
    const [feedbacksPerPage] = useState(5); // Количество отзывов на странице

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(response.data.user);
                setAdvertisements(response.data.advertisements);
                setFeedbacks(response.data.feedbacks);
                fetchImages(response.data.advertisements);
            } catch (error) {
                console.error("Ошибка при получении данных пользователя:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    const fetchImages = async (ads) => {
        const newImages = {};
        const fakeImageUrl = 'uploads/no_car.jpg';
        const responseFake = await axios.get(fakeImageUrl, { responseType: 'blob' });
        const objectFakeUrl = URL.createObjectURL(responseFake.data);
        setFakeImage(objectFakeUrl);

        for (const ad of ads) {
            const imageUrl = ad.photos.length > 0 ? ad.photos[0] : '';
            try {
                if (imageUrl) {
                    const response = await axios.get(imageUrl, { responseType: 'blob' });
                    const objectUrl = URL.createObjectURL(response.data);
                    newImages[ad.advertisement_id] = objectUrl;
                }
            } catch (error) {
                console.error('Ошибка при получении изображения:', error);
            }
        }
        setImages(newImages);
    };

    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
    const pageNumbers = Math.ceil(feedbacks.length / feedbacksPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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

    const handlePasswordChange = async () => {
        setErrors([]); // Сбрасываем ошибки перед новой валидацией
        const validationErrors = [];
    
        if (!passwordRegex.test(newPassword)) {
          validationErrors.push({ path: 'newPassword', msg: 'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры.' });
        }
    
        if (newPassword !== confirmPassword) {
          validationErrors.push({ path: 'confirmPassword', msg: 'Пароли не совпадают.' });
        }
    
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          return;
        }
    
        try {
          const response = await axios.patch('/auth/profile', {
            oldPassword,
            newPassword,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSuccessMessage(response.data.message); // Успех от сервера
          setErrors([]); // Сбрасываем сообщения об ошибках
          // Сбрасываем поля ввода
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } catch (error) {
          if (error.response && error.response.data) {
            setErrors([{ msg: error.response.data.message }]); // Устанавливаем сообщение об ошибке от сервера
          } else {
            setErrors([{ msg: 'Ошибка при изменении пароля.' }]); // Общая ошибка
          }
          setSuccessMessage(''); // Сбрасываем сообщение об успехе
          console.error('Ошибка при изменении пароля:', error);
        }
      };

    function editAdvertisement(advertisementId){
        navigate(`/edit-advertisement/${advertisementId}`);
    } 

    async function deleteAdvertisement(id){
        try{
            await axios.delete(`/advertisements/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            navigate('/profile');
        } catch(error){
            console.log(error);
        }
    }

    if (loading) {
        return <Spinner animation="border" />;
    }

    if(!token){
        return <Navigate to='/login'/>
      }

    return (
        <Container className="mt-5">
            {userData && (
                <Card.Body className="mx-3">
                <Card.Title className="my-2 fs-2 text-center">{userData.username}</Card.Title>
                <Card.Text className="mb-2">
                    <strong>Роль:</strong> {userData.role_name}
                </Card.Text>
                <Card.Text className="mb-2">
                    <strong>Средняя оценка:</strong> {advertisements[0].average_mark}/5
                </Card.Text>
                <Card.Text className="mb-2">
                    <strong>Email:</strong> {userData.email}
                </Card.Text>
                <Card.Text className="mb-2">
                    <strong>Телефон:</strong> {userData.phone}
                </Card.Text>
                
            </Card.Body>
            )}

            <h3 className="text-center my-3">Мои объявления</h3>
            <Row xs={1} md={3} className="g-4">
                {advertisements.map((ad) => (
                    <Col key={ad.advertisement_id}>
                        <Card>
                            <Card.Img
                                className="d-block w-100"
                                variant="top"
                                src={images[ad.advertisement_id] || fakeImage}
                                alt={`Фото ${ad.brand_name} ${ad.model_name}`}
                                style={{ height: '200px', objectFit: 'cover' }}

                            />
                            <Card.Body>
                                <Card.Title className="my-4 fs-3">{`${ad.brand_name} ${ad.model_name}`}</Card.Title>
                                <Card.Text>
                                    <strong>Описание:</strong> {ad.description}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Трансимиссия:</strong> {ad.transmission_name}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Двигатель:</strong> {ad.engine_name}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Цена:</strong> {ad.price}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Дата производства:</strong> {new Date(ad.manufacture_date).toLocaleDateString('ru-RU')}
                                </Card.Text>
                            </Card.Body>
                            <div className="d-flex justify-content-evenly my-4">
                                <Button 
                                    className="d-block"
                                    style={{width: "35%"}}
                                    variant='warning' 
                                    onClick={() => editAdvertisement(ad.advertisement_id)}
                                >
                                    Изменить
                                </Button>
                                <Button 
                                    className="d-block"
                                    style={{width: "35%"}}
                                    variant="danger" 
                                    onClick={() => deleteAdvertisement(ad.advertisement_id)}
                                >
                                    Удалить
                                </Button>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <h3 className="my-4 text-center">Отзывы обо мне</h3>
            {currentFeedbacks.length > 0 ? (
                <ListGroup className="mx-auto" style={{width: "40%"}}>
                    {currentFeedbacks.map((feedback, index) => (
                        <ListGroup.Item key={index} className="list-group-item">
                            <strong>{feedback.sender_username}:</strong> {feedback.text} <br />
                            <strong>Оценка:</strong> <Badge bg="info">{feedback.mark}/5</Badge>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>Отзывов нет.</p>
            )}

            {/* Пагинация для отзывов */}
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
            <Form className="password-form">
            <h2>Изменение пароля</h2>
                {errors.map((error, index) => (
                <Alert key={index} variant="danger" className="mx-auto">
                    {error.msg}
                </Alert>
                ))}
                {successMessage && <Alert variant="success" className="mx-auto">{successMessage}</Alert>}
                <Form.Group controlId="old-password">
                    <Form.Label>Старый пароль:</Form.Label>
                    <Form.Control
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="new-password">
                    <Form.Label>Новый пароль:</Form.Label>
                    <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="confirm-password">
                    <Form.Label>Подтверждение нового пароля:</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button 
                    variant="primary" 
                    type="button" 
                    onClick={handlePasswordChange} 
                    className="my-3"
                >
                    Изменить пароль
                </Button>
            </Form>
        </Container>
    );
};