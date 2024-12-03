import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from "../../utils/axios.js";
import { useAuth } from '../../utils/AuthContext';

export const AddAdvertisementForm = () => {
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
    const { token } = useAuth();

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

    const handleBrandChange = async (e) => {
        const selectedBrandId = e.target.value;
        setFormData({ ...formData, brand_id: selectedBrandId, model_id: '' }); // Сбрасываем модель при выборе нового бренда

        if (selectedBrandId) {
            try {
                const modelsResponse = await axios.get(`/models?brandId=${selectedBrandId}`);
                setModels(modelsResponse.data);
            } catch (error) {
                console.error('Ошибка при загрузке моделей:', error);
            }
        } else {
            setModels([]); // Сбрасываем модели, если бренд не выбран
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Преобразуем FileList в массив
        setFormData({ ...formData, files }); // Сохраняем файлы в состоянии
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // formData.user_id = 10;
            const response = await axios.post('/advertisements', formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });
            const carId = response.data.carId;
            if (formData.files.length > 0) {
                const formDataToSend = new FormData();
                // formDataToSend.append('car_id', carId); // Добавляем ID объявления, если нужно
    
                // Добавляем файлы в FormData
                formData.files.forEach(file => {
                    formDataToSend.append('files', file);
                });
    
                // Отправляем файлы на сервер
                console.log("carId", carId);
                await axios.post(`/upload/cars/${carId}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Устанавливаем заголовок
                    },
                });
                window.history.back();
                console.log('Файлы успешно загружены.');
            }
    
            console.log('Машина успешно добавлена:', response.data);
            // Здесь вы можете добавить логику, например, очистить форму или показать сообщение об успехе
        } catch (error) {
            console.error('Ошибка:', error);
            // Здесь вы можете показать сообщение об ошибке
        }
    };

    return (
        <Container className='my-3'>
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ width: '40%' }}>
                <Form.Group className="mb-3" controlId="formBrand">
                    <Form.Label>Бренд<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control
                        as="select"
                        name="brand_id"
                        value={formData.brand_id}
                        onChange={handleBrandChange}
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
                        value={formData.price}
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
                        Добавить машину
                    </Button>
                </div>
            </Form>
        </Container>
    );
};
