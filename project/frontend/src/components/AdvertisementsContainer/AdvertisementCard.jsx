import React, { useEffect, useState } from "react";
import axios from "../../utils/axios.js";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Carousel, Container, Modal, Form } from "react-bootstrap";
import { useAuth } from '../../utils/AuthContext';

const bookmark = '/icons/bookmark.png';
const bookmark2 = '/icons/bookmark2.png';

export const AdvertisementCard = () => {
    const { id } = useParams(); // Получаем ID автомобиля из URL
    const [advertisement, setAdvertisement] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const { token, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [modalShow, setModalShow] = useState(false);
    const [note, setNote] = useState('');

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`/advertisements/${id}`);
                if(token){
                    const result = await axios.get(`/bookmarks/${id}`, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(result);
                    if(result.data.bookmark_id){
                        setSaved(true);
                    } else{
                        setSaved(false);
                    }
                }
                setAdvertisement(response.data);
                fetchImages(response.data); // Предполагается, что фотографии находятся в `photos`
            } catch (error) {
                setSaved(false);
                console.error("Ошибка при получении данных автомобиля:", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchImages = async (ads) => {
            const newImages = [];
            const fakeImageUrl = 'uploads/no_car.jpg';
            const responseFake = await axios.get(fakeImageUrl, { responseType: 'blob' });
            const objectFakeUrl = URL.createObjectURL(responseFake.data);
            // setFakeImage(objectFakeUrl);
            console.log(ads);
            for (const ad of ads.photos) {
                    if(ad != null){
                    try {
                        const response = await axios.get(ad, { responseType: 'blob' });
                        const objectUrl = URL.createObjectURL(response.data);
                        newImages.push(objectUrl);
                    } catch (error) {
                        console.error('Ошибка при получении изображения:', error);
                    }
                }
            }
            console.log(newImages);
            if(Array.isArray(newImages) && newImages.length === 0){
                newImages.push(objectFakeUrl);
            }
            setImages(newImages);
        };

        fetchCarDetails();
    }, [id]);

    function addToBookmarks(){
        setModalShow(true);
    }

    async function removeFromBookmarks(advertisementId){
        try{
            await axios.delete(`/bookmarks/${advertisementId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setSaved(false);
            navigate('.');
        } catch(error){
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/bookmarks/${advertisement.advertisement_id}`, { note }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSaved(true); // Устанавливаем статус закладки как сохранённый
            setModalShow(false); // Закрываем модальное окно
            setNote(''); // Сбрасываем заметку
        } catch (error) {
            console.error("Ошибка при добавлении закладки:", error);
        }
    };

    function editAdvertisement(){
        navigate(`/edit-advertisement/${id}`);
    } 

    async function deleteAdvertisement(){
        try{
            await axios.delete(`/advertisements/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
        } catch(error){
            console.log(error);
        }
    }

    if (loading) {
        return <div>Загрузка...</div>; // Индикатор загрузки
    }

    if (!advertisement || Object.keys(advertisement).length === 0) {
        navigate('/not-found');
        // return <div>Объявления не найдено.</div>; // Сообщение об ошибке
    }

    return (
        <Container className="my-5">
            <Card className="mx-auto" style={{width: "50%"}}>
                <Carousel indicators={false} interval={2000} controls={images.length > 1}>
                    {images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={image}
                                alt={`Фото автомобиля ${advertisement.brand_name} ${advertisement.model_name}`}
                                style={{ height: '400px', objectFit: 'cover' }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
                <Card.Body className="fs-6">
                    <Card.Title className="my-4 fs-3">{`${advertisement.brand_name} ${advertisement.model_name}`}</Card.Title>
                    <Card.Text>
                        <strong>Описание:</strong> {advertisement.description}
                    </Card.Text>
                    <Card.Text>
                        <strong>Трансимиссия:</strong> {advertisement.transmission_name}
                    </Card.Text>
                    <Card.Text>
                        <strong>Двигатель:</strong> {advertisement.engine_name}
                    </Card.Text>
                    <Card.Text>
                        <strong>Цена:</strong> {advertisement.price}
                    </Card.Text>
                    <Card.Text>
                        <strong>Дата производства:</strong> {new Date(advertisement.manufacture_date).toLocaleDateString('ru-RU')}
                    </Card.Text>
                    <Card.Text>
                        <strong>Владелец:</strong> <Link to={`/user/${advertisement.user_id}`}>{advertisement.username}</Link>
                    </Card.Text>
                    
                    <div className="d-flex justify-content-between my-4">
                        <Button variant="primary" onClick={() => window.history.back()}>
                            Вернуться назад
                        </Button>
                        {isAdmin ? (
                        <>
                            <Button variant="warning" onClick={editAdvertisement}>
                                Изменить
                            </Button>
                            <Button variant="danger" onClick={deleteAdvertisement}>
                                Удалить
                            </Button>
                        </>) : (<></>)}
                        {saved ? (<Button variant="link" onClick={() => removeFromBookmarks(advertisement.advertisement_id)}>
                            <img src={bookmark2} style={{ width: '24px', height: '24px' }}/>
                        </Button>) : (
                        <Button variant="link" onClick={() => addToBookmarks()}>
                            <img src={bookmark} style={{ width: '24px', height: '24px' }}/>
                        </Button>)}
                        
                    </div>
                </Card.Body>
            </Card>
            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить заметку</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNote" className="mb-3">
                            <Form.Label>Заметка</Form.Label>
                            <Form.Control
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Введите вашу заметку"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Добавить
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};



    