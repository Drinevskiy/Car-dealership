import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const emoji = '/icons/sad.png'
const NotFound = () => {
    return (
      <div className="notFound">
        <img src={emoji}/>
        <h2>Упс...<br/>Страница не найдена</h2>
        <p>Извините, такой страницы не существует. Попробуйте вернуться на <Link to="/">главную страницу</Link>.</p>
      </div>
    );
  }

export {NotFound};