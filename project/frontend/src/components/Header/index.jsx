import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import axios from '../../utils/axios';

const logo = '/icons/logo.png';
const bookmark = '/icons/bookmark.png';

export const Header = () => {
  const { token, clearToken, isAdmin } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    if(window.confirm("Вы действительно хотите выйти?")){
      axios.post('/auth/logout',{}, { withCredentials: true })
            .then(res => {
                clearToken();
                navigate('/'); 
            })
            .catch(error => {console.error(error)});
    }
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container className="d-flex justify-content-between">
      <Link to="/" style={{textDecoration: "none"}}><Navbar.Brand>
        <img 
              src={logo} 
              alt="Логотип" 
              style={{ height: '50px', width: 'auto' }} // Установите высоту и ширину по необходимости
            />
        </Navbar.Brand>
      </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='d-flex justify-content-between'>
          {isAdmin ?
          (<Nav className="mx-auto"> {/* Центрирование с помощью mx-auto */}
            <Nav.Link onClick={() => navigate('/admin-panel')}>Админ-панель</Nav.Link>
          </Nav>) : (<div></div>)
          }
          <Nav>
          {!token ? (
              <>
                <Button variant="outline-primary" onClick={() => navigate("/login")} className='me-2'>Войти</Button>
                <Button variant="primary" onClick={() => navigate("/registration")}>Регистрация</Button>
              </>
            ) : (
              <div className='d-flex align-items-center'>
                <Nav.Link onClick={() => navigate("/bookmarks")} className='me-2'>
                  <img 
                    src={bookmark} 
                    alt="Логотип" 
                    style={{ height: '25px', width: 'auto' }} // Установите высоту и ширину по необходимости
                  />
                </Nav.Link>
                <Button variant="outline-danger" onClick={handleLogout} className='me-2'>Выйти</Button>
                <Button variant="warning" onClick={() => navigate("/profile")}>Профиль</Button>
              </div>
            )}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};