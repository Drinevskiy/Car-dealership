import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const Footer = () => {
  return (
    <footer className="bg-light mt-auto" style={{ backgroundColor: '#ade', padding: '20px 0' }}>
      <Container>
        <Row>
          <Col className="text-center">
            <h5>Контакты</h5>
            <p>
              Email: drinevskiy3@gmail.com
            </p>
            <p>
              Телефон: +375 (44) 891-12-34
            </p>
          </Col>
          <Col className="text-center">
            <h5>Навигация</h5>
            <p>
              <a href="#home">Главная</a><br />
              <a href="#features">Особенности</a><br />
              <a href="#pricing">Цены</a><br />
              <a href="#about">О нас</a>
            </p>
          </Col>
          <Col className="text-center">
            <h5>Социальные сети</h5>
            <p>
              <a href="https://facebook.com">Facebook</a><br />
              <a href="https://twitter.com">Twitter</a><br />
              <a href="https://instagram.com">Instagram</a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Kirad. Все права защищены.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
