import React, { useEffect, useState } from "react";
import axios from "../../utils/axios.js";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Carousel, Container } from "react-bootstrap";

export const AdvertisementCard = () => {
    const { id } = useParams(); // Получаем ID автомобиля из URL
    const [advertisement, setAdvertisement] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`/advertisements/${id}`);
                setAdvertisement(response.data);
                fetchImages(response.data); // Предполагается, что фотографии находятся в `photos`
            } catch (error) {
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
                    
                    <Button variant="primary" onClick={() => window.history.back()}>
                        Вернуться назад
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};



    