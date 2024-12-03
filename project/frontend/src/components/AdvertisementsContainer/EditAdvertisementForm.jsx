import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import axios from "../../utils/axios.js";
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

export const EditAdvertisementForm = () => {
    const { id } = useParams(); // Получаем ID из URL
    const [advertisement, setAdvertisement] = useState(null);
    const [formData, setFormData] = useState({
        brand_id: '',
        model_id: '',
        transmission_id: '',
        engine_id: '',
        description: '',
        price: '',
        manufacture_date: '',
        files: [],
    });

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [engines, setEngines] = useState([]);
    const [isUser, setIsUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [checkUserCompleted, setCheckUserCompleted] = useState(false);
    const { token, isAdmin } = useAuth();

    useEffect(() => {
        const fetchAdvertisement = async () => {
            try {
                const response = await axios.get(`/advertisements/${id}`);
                setAdvertisement(response.data);
                setFormData({
                    brand_id: response.data.brand_id || '',
                    model_id: response.data.model_id || '',
                    transmission_id: response.data.transmission_id || '',
                    engine_id: response.data.engine_id || '',
                    description: response.data.description || '',
                    price: response.data.price || '',
                    manufacture_date: response.data.manufacture_date ? response.data.manufacture_date.slice(0, 10) : '',
                    files: [],
                });
            } catch (error) {
                console.error('Ошибка при загрузке объявления:', error);
            }
        };

        fetchAdvertisement();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const brandsResponse = await axios.get('/brands');
                const transmissionsResponse = await axios.get('/transmissions');
                const enginesResponse = await axios.get('/engines');
                setBrands(brandsResponse.data);
                setTransmissions(transmissionsResponse.data);
                setEngines(enginesResponse.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchModels = async () => {
            if (formData.brand_id) {
                try {
                    const modelsResponse = await axios.get(`/models?brandId=${formData.brand_id}`);
                    setModels(modelsResponse.data);
                } catch (error) {
                    console.error('Ошибка при загрузке моделей:', error);
                }
            }
        };
        fetchModels();
    }, [formData.brand_id]);

    useEffect(() => {
        const checkUser = async () => {
            try{
            const response = await axios.get(`/check-advertisement/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                setIsUser(response.data.isCorrect); // исправлено: доступ к данным из ответа
            } catch(error) { // исправлено: .error на .catch
                console.error('Ошибка при проверке пользователя:', error);
                setIsUser(false);
            } finally {
                setIsLoading(false);
                setCheckUserCompleted(true); // Устанавливаем, что проверка завершена
            };
        };
        if (token && advertisement) { // Проверяем только если есть токен и объявление загружено
            checkUser();
        } else {
            setCheckUserCompleted(true); // Если нет токена или объявления, устанавливаем завершение
        }
    }, [token, advertisement]); // Зависимость от token


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const priceInNumber = convertPriceFormat(formData.price);
            const updatedData = {
                ...formData,
                price: priceInNumber,
            };
            console.log(updatedData);
            const response = await axios.patch(`/advertisements/${advertisement.advertisement_id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const carId = advertisement.car_id;
            if (formData.files.length > 0) {
                const formDataToSend = new FormData();
                formData.files.forEach(file => {
                    formDataToSend.append('files', file);
                });

                await axios.post(`/upload/cars/${carId}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Файлы успешно загружены.');
            }
            window.history.back();
            console.log('Объявление успешно обновлено:', response.data);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const convertPriceFormat = (priceString) => {
        const cleanedString = priceString.replace(/Br/g, '').replace(/\s/g, '');
        const formattedString = cleanedString.replace(',', '.');
        return parseFloat(formattedString);
    };

    

    if (isLoading) {
        return <Spinner animation="border" />;
    }

    if (checkUserCompleted && !isUser && !isAdmin) {
        return <Navigate to='/' />;
    }
    

    return (
        <Container className='my-3'>
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ width: '40%' }}>
                <Form.Group className="mb-3" controlId="formBrand">
                    <Form.Label>Бренд<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control
                        as="select"
                        name="brand_id"
                        value={formData.brand_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите бренд</option>
                        {brands.map(brand => (
                            <option key={brand.brand_id} value={brand.brand_id}>
                                {brand.brand_name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formModel">
                    <Form.Label>Модель<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control
                        as="select"
                        name="model_id"
                        value={formData.model_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите модель</option>
                        {models.map(model => (
                            <option key={model.model_id} value={model.model_id}>
                                {model.model_name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTransmission">
                    <Form.Label>КПП<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control
                        as="select"
                        name="transmission_id"
                        value={formData.transmission_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите КПП</option>
                        {transmissions.map(transmission => (
                            <option key={transmission.transmission_id} value={transmission.transmission_id}>
                                {transmission.transmission_name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEngine">
                    <Form.Label>Двигатель<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control
                        as="select"
                        name="engine_id"
                        value={formData.engine_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите двигатель</option>
                        {engines.map(engine => (
                            <option key={engine.engine_id} value={engine.engine_id}>
                                {engine.engine_name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Описание<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Введите описание объявления"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPrice">
                    <Form.Label>Цена<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Введите цену"
                        name="price"
                        value={convertPriceFormat(formData.price)}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formManufactureDate">
                    <Form.Label>Дата производства<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control
                        type="date"
                        name="manufacture_date"
                        value={formData.manufacture_date}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>Загрузите изображения</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                </Form.Group>

                <div className='text-center'>
                    <Button variant="primary" type="submit" className='my-3'>
                        Сохранить изменения
                    </Button>
                </div>
            </Form>
        </Container>
    );
};