import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import axios from "../../utils/axios.js";

export const SearchSort = ({
    sortProperty,
    setSortProperty,
    sortDirection,
    setSortDirection,
    searchBrand,
    handleBrandChange,
    searchModel,
    setSearchModel,
    searchTransmission,
    setSearchTransmission,
    searchEngine,
    setSearchEngine,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minDate,
    setMinDate,
    maxDate,
    setMaxDate,
    brands,
    setBrands,
    models,
    transmissions,
    setTransmissions,
    engines,
    setEngines
}) => {
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get('/brands');
                setBrands(response.data);
            } catch (error) {
                console.error('Ошибка при получении марок:', error);
            }
        };

        const fetchTransmissions = async () => {
            try {
                const response = await axios.get('/transmissions');
                setTransmissions(response.data);
            } catch (error) {
                console.error('Ошибка при получении трансмиссий:', error);
            }
        };

        const fetchEngines = async () => {
            try {
                const response = await axios.get('/engines');
                setEngines(response.data);
            } catch (error) {
                console.error('Ошибка при получении двигателей:', error);
            }
        };

        fetchBrands();
        fetchTransmissions();
        fetchEngines();
    }, [setBrands, setTransmissions, setEngines]);

    return (
        <>
            <Form.Group className="my-5">
                <Row className="text-center">
                    <Col md={6}>
                        <Form.Select 
                            value={searchBrand} 
                            onChange={handleBrandChange}
                            aria-label="Поиск по марке"
                            className="mb-3"
                        >
                            <option value="">Выберите марку</option>
                            {brands.map(brand => (
                                <option key={brand.brand_id} value={brand.brand_name}>{brand.brand_name}</option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={6}>
                        <Form.Select 
                            value={searchModel} 
                            onChange={(e) => setSearchModel(e.target.value)}
                            aria-label="Поиск по модели"
                            className="mb-3"
                        >
                            <option value="">Выберите модель</option>
                            {models.map(model => (
                                <option key={model.model_id} value={model.model_name}>{model.model_name}</option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={6}>
                        <Form.Select 
                            value={searchTransmission} 
                            onChange={(e) => setSearchTransmission(e.target.value)}
                            aria-label="Поиск по трансмиссии"
                            className="mb-3"
                        >
                            <option value="">Выберите трансмиссию</option>
                            {transmissions.map(transmission => (
                                <option key={transmission.transmission_id} value={transmission.transmission_name}>{transmission.transmission_name}</option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={6}>
                        <Form.Select 
                            value={searchEngine} 
                            onChange={(e) => setSearchEngine(e.target.value)}
                            aria-label="Поиск по двигателю"
                            className="mb-3"
                        >
                            <option value="">Выберите двигатель</option>
                            {engines.map(engine => (
                                <option key={engine.engine_id} value={engine.engine_name}>{engine.engine_name}</option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={6}>
                        <Form.Control
                            type="number"
                            placeholder="Минимальная цена"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="mb-3"
                        />
                    </Col>

                    <Col md={6}>
                        <Form.Control
                            type="number"
                            placeholder="Максимальная цена"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="mb-3"
                        />
                    </Col>

                    <Col md={6}>
                        <Form.Control
                            type="date"
                            placeholder="Минимальная дата"
                            value={minDate}
                            onChange={(e) => setMinDate(e.target.value)}
                            className="mb-3"
                        />
                    </Col>

                    <Col md={6}>
                        <Form.Control
                            type="date"
                            placeholder="Максимальная дата"
                            value={maxDate}
                            onChange={(e) => setMaxDate(e.target.value)}
                            className="mb-3"
                        />
                    </Col>

                    <Col md={6}>
                        <Form.Select 
                            value={sortProperty} 
                            onChange={(e) => setSortProperty(e.target.value)}
                            aria-label="Выберите критерий сортировки"
                            className="mb-3"
                        >
                            <option>Выберите критерий сортировки</option>
                            <option value="brand_name">Марка</option>
                            <option value="model_name">Модель</option>
                            <option value="transmission_name">Трансимиссия</option>
                            <option value="engine_name">Двигатель</option>
                            <option value="price">Цена</option>
                            <option value="manufacture_date">Дата производства</option>
                        </Form.Select>
                    </Col>

                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <Form.Check
                            type='checkbox'
                            id='sort-checkbox'
                            label='Сортировать по убыванию'
                            checked={sortDirection === 'desc'} 
                            onChange={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        />
                    </Col>
                </Row>
            </Form.Group>
        </>
    );
};