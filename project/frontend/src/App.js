import './App.css';
import React, {useState, useEffect} from 'react';
import axios from './utils/axios.js';
import { Button, Modal, Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import * as Components from './components/index.js';
import { AuthProvider } from './utils/AuthContext';

function App() {
  

  return (
    <div className="d-flex flex-column min-vh-100">
      <AuthProvider>
    <Components.Header/>
    <Container>
    {/* <div className='App'> */}
            <Routes>
              <Route path="/" element={<Components.AdvertisementsContainer/>}/>
              <Route path="/advertisements/:id" element={<Components.AdvertisementCard/>}/>
              <Route path="/add-advertisement" element={<Components.AddAdvertisementForm/>}/>
              <Route path="/edit-advertisement/:id" element={<Components.EditAdvertisementForm/>}/>
              <Route path="/user/:id" element={<Components.UserInfo/>}/>
              <Route path="/user/:id/feedbacks" element={<Components.UserFeedbacks/>}/>
              <Route path="/user/:id/add-feedback" element={<Components.AddFeedbackForm/>}/>
              <Route path="/registration" element={<Components.RegistrationForm/>}/>
              <Route path="/login" element={<Components.LoginForm/>}/>
              <Route path="/profile" element={<Components.Profile/>}/>
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
              <Route path="*" element={<Components.NotFound />}/>
            </Routes>
    </Container>
    <Components.Footer/>
    </AuthProvider>
    </div>
  );
}

export default App;
