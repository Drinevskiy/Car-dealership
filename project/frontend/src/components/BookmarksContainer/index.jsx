import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios.js';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Spinner, Button } from 'react-bootstrap';
import { useAuth } from '../../utils/AuthContext';


export const BookmarksContainer = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    const fetchBookmarks = async () => {
        try {
            const response = await axios.get('/bookmarks', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }); // Замените на правильный URL вашего API
            setBookmarks(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке закладок:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchBookmarks();
    }, []);

    function goToAdvertisement(advertisementId){
        navigate(`/advertisements/${advertisementId}`);
    }

    async function deleteBookmark(bookmarkId){
        try{
            await axios.delete(`/bookmarks/${bookmarkId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            await fetchBookmarks();
        } catch(error){
            console.log(error);
        }
    }

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container className="my-4">
            <h2 className='text-center mb-3'>Мои закладки</h2>
            <Row>
                {bookmarks.map((bookmark) => (
                    <Col key={bookmark.advertisement_id} sm={6} md={4} lg={3} className="mb-4">
                        <Card style={{height: "250px"}} className="d-flex justify-content-between">
                            <Card.Body style={{height: "150px"}}>
                                <Card.Title>{bookmark.brand_name} {bookmark.model_name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {bookmark.price}
                                </Card.Subtitle>
                                <Card.Text>
                                    <strong>Дата производства:</strong> {new Date(bookmark.manufacture_date).toLocaleDateString()}
                                    <br />
                                    <strong>Заметка:</strong> {bookmark.note}
                                </Card.Text>
                            </Card.Body>
                            <div className="d-flex justify-content-evenly my-4">
                                <Button 
                                    className="d-block"
                                    style={{width: "35%"}}
                                    variant='primary' 
                                    onClick={() => goToAdvertisement(bookmark.advertisement_id)}
                                >
                                    Открыть
                                </Button>
                                <Button 
                                    className="d-block"
                                    style={{width: "35%"}}
                                    variant="danger" 
                                    onClick={() => deleteBookmark(bookmark.advertisement_id)}
                                >
                                    Удалить
                                </Button>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};
