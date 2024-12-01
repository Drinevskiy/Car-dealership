import { useState } from 'react';
export default function useToken() {
  const getToken = () => {
    return localStorage.getItem('token');
  };
  const [token, setToken] = useState(getToken());
  const saveToken = userToken => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };
  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  return {
    setToken: saveToken,
    clearToken,
    token
  }
}