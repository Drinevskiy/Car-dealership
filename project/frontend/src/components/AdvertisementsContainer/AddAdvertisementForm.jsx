import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from "../../utils/axios.js";

export const AddAdvertisementForm = () => {
    const [formData, setFormData] = useState({
        brand_name: '',
        model_name: '',
        transmission_name: '',
        engine_name: '',
        description: '',
        price: '',
        manufacture_date: '',
        files: [],
    });

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
            formData.user_id = 10;
            
            const response = await axios.post('/advertisements', formData, {
                // headers: {
                //     'Content-Type': 'multipart/form-data' // Устанавливаем заголовок
                // }
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
        <Container>
            <h1>Добавить объявление</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBrand">
                    <Form.Label>Бренд</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите название бренда"
                        name="brand_name"
                        value={formData.brand_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formModel">
                    <Form.Label>Модель</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите название модели"
                        name="model_name"
                        value={formData.model_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formTransmission">
                    <Form.Label>КПП</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите название КПП"
                        name="transmission_name"
                        value={formData.transmission_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEngine">
                    <Form.Label>Двигатель</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите описание двигателя"
                        name="engine_name"
                        value={formData.engine_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3} // Количество строк по умолчанию
                        placeholder="Введите описание объявления"
                        name="description" // Исправьте имя на 'description'
                        value={formData.description} // Измените на 'description'
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPrice">
                    <Form.Label>Цена</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Введите цену"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formManufactureDate">
                    <Form.Label>Дата производства</Form.Label>
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
                        onChange={handleFileChange} // Обработчик изменения файлов
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
