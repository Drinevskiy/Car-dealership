import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
      <Link to="/" style={{textDecoration: "none"}}><Navbar.Brand>Мой Логотип</Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto"> {/* Центрирование с помощью mx-auto */}
            <Nav.Link href="#home">Главная</Nav.Link>
            <Nav.Link href="#features">Особенности</Nav.Link>
            <Nav.Link href="#pricing">Цены</Nav .Link>
            <Nav.Link href="#about">О нас</Nav.Link>
          </Nav>
          <Nav>
            <Button variant="outline-danger" href="#logout">Выйти</Button>
            <Nav.Link href="#profile">Профиль</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};