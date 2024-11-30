import './App.css';
import React, {useState, useEffect} from 'react';
import axios from './utils/axios.js';
import { Button, Modal, Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import * as Components from './components/index.js';

function App() {
  

  return (
    <div className="d-flex flex-column min-vh-100">
    <Components.Header/>
    <Container>
    {/* <div className='App'> */}
            <Routes>
              <Route path="/" element={<Components.AdvertisementsContainer/>}/>
              <Route path="/add-advertisement" element={<Components.AddAdvertisementForm/>}/>
              {/* <Route path="/add-animal" element={<Components.AddAnimalForm/>}/>
              <Route path="/edit-animal" element={<Components.EditAnimalForm/>}/>
              <Route path="/registration" element={<Components.RegistrationForm/>}/>
              <Route path="/login" element={<Components.LoginForm/>}/>
              <Route path="/news" element={<Components.NewsContainer/>}/>
              <Route path="/news/:id" element={<Components.NewsFullCard/>}/>
              <Route path="/animals/:id" element={<Components.AnimalFullCard/>}/>
              <Route path="/profile" element={<Components.Profile/>}/>
              <Route path="/partners" element={<Components.PartnerContainer/>}/>
              <Route path="/apis" element={<ApiPage/>}/>
              <Route path="*" element={<Components.NotFound />}/> */}
            </Routes>
          {/* </div> */}
      {/* <Button variant="primary" onClick={handleShow}>
        Открыть модальное окно
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Заголовок модального окна</Modal.Title>
        </Modal.Header>
        <Modal.Body>Это содержимое модального окна.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Сохранить изменения
          </Button>
        </Modal.Footer>
      </Modal>
      
        // <NewsCard key={newItem._id} newItem={newItem} />
    ))} */}
    </Container>
    <Components.Footer/>
    </div>
  );
}

export default App;
