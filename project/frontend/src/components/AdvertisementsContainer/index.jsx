import React, {useState, useEffect} from "react";
import axios from "../../utils/axios.js";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const AdvertisementsContainer = () => {
const [advertisements, setAdvertisements] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
      const fetchAdvertisements = async () => {
        try {
            const response = await axios.get('/advertisements');
            console.log(response);
            setAdvertisements(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } finally {
            // setIsLoading(false);
        }
    };

    fetchAdvertisements();
  }, []);

  function addAdvertisement(){
    navigate('/add-advertisement');
  };

  return(
    <>
    <Row xs={2} md={4} className="g-4 my-5">
      {advertisements.map((advertisement) => (
        <Col key={advertisement.car_id}>
          <Card>
            <Card.Img variant="top" src="holder.js/100px160" />
            <Card.Body>
              <Card.Title>{advertisement.brand_name + " " + advertisement.model_name}</Card.Title>
              <Card.Text>{advertisement.description}</Card.Text>
              <Card.Text>{advertisement.price}</Card.Text>
              <Card.Text>{advertisement.username}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    <div className="text-center">
      <Button className="mb-4" onClick={addAdvertisement}>
        Добавить объявление
      </Button>
    </div>
    </>
  );
};