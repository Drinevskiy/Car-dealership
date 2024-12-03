import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios.js';
import { Link, Navigate } from 'react-router-dom';
import { Container, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/AuthContext';

export const AdminPanel = () => {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [users, setUsers] = useState([]); // Состояние для пользователей
    const [loading, setLoading] = useState(true);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [showModelModal, setShowModelModal] = useState(false);
    const [showEditBrandModal, setShowEditBrandModal] = useState(false);
    const [showDeleteBrandModal, setShowDeleteBrandModal] = useState(false);
    const [showEditModelModal, setShowEditModelModal] = useState(false);
    const [showDeleteModelModal, setShowDeleteModelModal] = useState(false);
    const [currentBrand, setCurrentBrand] = useState('');
    const [currentModel, setCurrentModel] = useState({ brand_id: '', model_name: '' });
    const [selectedBrandId, setSelectedBrandId] = useState(null); // ID выбранного бренда для редактирования/удаления
    const [selectedModelId, setSelectedModelId] = useState(null); // ID выбранной модели для редактирования/удаления
    const [selectedUserId, setSelectedUserId] = useState(null); // ID выбранного пользователя для блокировки/разблокировки
    const [errorMessage, setErrorMessage] = useState("");
    const { token, isAdmin } = useAuth();

    const fetchData = async () => {
        try {
            const response = await axios.get('/brands'); // Замените на правильный URL API
            const responseModel = await axios.get('/models'); // Замените на правильный URL API
            const responseUsers = await axios.get('/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); // Получаем пользователей
            setBrands(response.data);
            setModels(responseModel.data);
            setUsers(responseUsers.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleModelSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/models', currentModel, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchData();
            setShowModelModal(false);
            setCurrentModel({ brand_id: '', model_name: '' });
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Данная модель уже есть.');
            console.error('Ошибка при добавлении модели:', error);
        }
    };

    const handleBrandSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/brands', { brand_name: currentBrand }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchData();
            setShowBrandModal(false);
            setCurrentBrand('');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Данная марка уже есть.');
            console.error('Ошибка при добавлении марки:', error);
        }
    };

    const handleEditBrandSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`/brands/${selectedBrandId}`, { brand_name: currentBrand }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchData();
            setShowEditBrandModal(false);
            setCurrentBrand('');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Данная марка уже есть.');
            console.error('Ошибка при изменении марки:', error);
        }
    };

    const handleEditModelSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`/models/${selectedModelId}`, { model_name: currentModel.model_name, brand_id: currentModel.brand_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchData();
            setShowEditModelModal(false);
            setCurrentModel({ brand_id: '', model_name: '' });
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Данная модель уже есть.');
            console.error('Ошибка при изменении модели:', error);
        }
    };

    const handleDeleteBrand = async () => {
        try {
            await axios.delete(`/brands/${selectedBrandId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchData();
            setShowDeleteBrandModal(false);
        } catch (error) {
            console.error('Ошибка при удалении марки:', error);
        }
    };

    const handleDeleteModel = async () => {
        try {
            await axios.delete(`/models/${selectedModelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchData();
            setShowDeleteModelModal(false);
        } catch (error) {
            console.error('Ошибка при удалении модели:', error);
        }
    };

    const handleToggleUserStatus = async (userId, isBlocked) => {
        const action = isBlocked ? 'unblock' : 'block'; // Определяем действие
        try {
            await axios.patch(`/users/${action}/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            fetchData();
        } catch (error) {
            console.error(`Ошибка при ${action} пользователя:`, error);
            setErrorMessage(`Ошибка при ${action} пользователя.`);
        }
    };

    if (!isAdmin) {
        return <Navigate to='/' />;
    }

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container className="my-4">
            <h2 className="text-center mb-4">Управление автомобилями</h2>
            <Container className='text-center'>
                <Button className="mb-3 me-3" variant="primary" onClick={() => setShowBrandModal(true)}>
                    Добавить новую марку
                </Button>
                <Button className="mb-3" variant="primary" onClick={() => setShowModelModal(true)}>
                    Добавить новую модель
                </Button>
            </Container>

            {/* Таблица марок */}
            <h4>Список марок</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Марка</th>
                        <th style={{ width: '150px' }}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((brand) => (
                        <tr key={brand.brand_id}>
                            <td>{brand.brand_id}</td>
                            <td>{brand.brand_name}</td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <Button className='me-3' variant="warning" onClick={() => {
                                    setCurrentBrand(brand.brand_name);
                                    setSelectedBrandId(brand.brand_id);
                                    setShowEditBrandModal(true);
                                }}>
                                    Изменить
                                </Button>
                                <Button variant="danger" onClick={() => {
                                    setSelectedBrandId(brand.brand_id);
                                    setShowDeleteBrandModal(true);
                                }}>
                                    Удалить
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Таблица моделей */}
            <h4>Список моделей</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Марка</th>
                        <th>Модель</th>
                        <th style={{ width: '150px' }}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {models.map((model) => (
                        <tr key={model.model_id}>
                            <td>{model.model_id}</td>
                            <td>{brands.find(brand => brand.brand_id === model.brand_id)?.brand_name}</td>
                            <td>{model.model_name}</td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <Button className='me-3' variant="warning" onClick={() => {
                                    setCurrentModel({ brand_id: model.brand_id, model_name: model.model_name });
                                    setSelectedModelId(model.model_id);
                                    setShowEditModelModal(true);
                                }}>
                                    Изменить
                                </Button>
                                <Button variant="danger" onClick={() => {
                                    setSelectedModelId(model.model_id);
                                    setShowDeleteModelModal(true);
                                }}>
                                    Удалить
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Таблица пользователей */}
            <h4>Список пользователей</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя пользователя</th>
                        <th>Email</th>
                        <th>Телефон</th>
                        <th>Роль</th>
                        <th>Средняя оценка</th>
                        <th style={{ width: '150px' }}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td><Link to={`/user/${user.user_id}`}>{user.username}</Link></td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role_name}</td>
                            <td>{user.average_mark !== null ? user.average_mark : 'N/A'}</td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                {user.role_name !== 'Администратор' ?
                                <Button
                                    variant={user.is_blocked ? "primary" : "danger"}
                                    onClick={() => {
                                        setSelectedUserId(user.user_id);
                                        handleToggleUserStatus(user.user_id, user.is_blocked);
                                    }}>
                                    {user.is_blocked ? "Разблокировать" : "Заблокировать"}
                                </Button> : <></>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Модальные окна для управления марками и моделями (оставьте без изменений) */}

            {/* Модальное окно для добавления марки */}
            <Modal show={showBrandModal} onHide={() => {
                setShowBrandModal(false);
                setErrorMessage('');
                setCurrentBrand('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить марку</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleBrandSubmit}>
                        <Form.Group controlId="formBrand" className='mb-3'>
                            <Form.Label>Название марки</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentBrand}
                                onChange={(e) => setCurrentBrand(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {errorMessage && <Alert variant="danger" className="mx-auto">{errorMessage}</Alert>}
                        <Button variant="primary" type="submit">
                            Добавить
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Модальное окно для изменения марки */}
            <Modal show={showEditBrandModal} onHide={() => {
                setShowEditBrandModal(false);
                setErrorMessage('');
                setCurrentBrand('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить марку</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditBrandSubmit}>
                        <Form.Group controlId="formEditBrand" className='mb-3'>
                            <Form.Label>Название марки</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentBrand}
                                onChange={(e) => setCurrentBrand(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {errorMessage && <Alert variant="danger" className="mx-auto">{errorMessage}</Alert>}
                        <Button variant="primary" type="submit">
                            Сохранить
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Модальное окно для удаления марки */}
            <Modal show={showDeleteBrandModal} onHide={() => setShowDeleteBrandModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Удаление марки</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы уверены, что хотите удалить эту марку?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteBrandModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleDeleteBrand}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно для добавления модели */}
            <Modal show={showModelModal} onHide={() => {
                setShowModelModal(false);
                setErrorMessage('');
                setCurrentModel({ brand_id: '', model_name: '' });
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить модель</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleModelSubmit}>
                        <Form.Group controlId="formModelBrand">
                            <Form.Label>Выберите марку</Form.Label>
                            <Form.Control
                                as="select"
                                value={currentModel.brand_id}
                                onChange={(e) => setCurrentModel({ ...currentModel, brand_id: e.target.value })}
                                required
                            >
                                <option value="">Выберите марку</option>
                                {brands.map((brand) => (
                                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formModelName" className='mb-3'>
                            <Form.Label>Название модели</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentModel.model_name}
                                onChange={(e) => setCurrentModel({ ...currentModel, model_name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        {errorMessage && <Alert variant="danger" className="mx-auto">{errorMessage}</Alert>}
                        <Button variant="primary" type="submit">
                            Добавить
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Модальное окно для изменения модели */}
            <Modal show={showEditModelModal} onHide={() => {
                setShowEditModelModal(false);
                setErrorMessage('');
                setCurrentModel({ brand_id: '', model_name: '' });
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить модель</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditModelSubmit}>
                        <Form.Group controlId="formEditModelBrand">
                            <Form.Label>Выберите марку</Form.Label>
                            <Form.Control
                                as="select"
                                value={currentModel.brand_id}
                                onChange={(e) => setCurrentModel({ ...currentModel, brand_id: e.target.value })}
                                required
                            >
                                <option value="">Выберите марку</option>
                                {brands.map((brand) => (
                                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formEditModelName" className='mb-3'>
                            <Form.Label>Название модели</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentModel.model_name}
                                onChange={(e) => setCurrentModel({ ...currentModel, model_name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        {errorMessage && <Alert variant="danger" className="mx-auto">{errorMessage}</Alert>}
                        <Button variant="primary" type="submit">
                            Сохранить
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Модальное окно для удаления модели */}
            <Modal show={showDeleteModelModal} onHide={() => setShowDeleteModelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Удаление модели</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы уверены, что хотите удалить эту модель?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModelModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleDeleteModel}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};