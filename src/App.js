import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import { FaGithub, FaInstagram, FaFacebook, FaSearch} from "react-icons/fa";
import Cookies from 'js-cookie';
import 'typeface-roboto';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {

  const [celsiussymbol, setcelsiussymbol] = useState('C');
  const dayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
  var [date, setDate] = useState(new Date());
  const [inputValue, setInputValue] = useState(Cookies.get('city'));

  const handleChangeAndSize = (ev) => {
    const target = ev.target;
    target.style.width = '10px';
    target.style.width = `${target.scrollWidth}px`;

    Cookies.set('city', target.value, { expires: 365 })

    handleChange(ev);
  };

  const handleChange = (ev) => {
    setInputValue(ev.target.value);
  };

  useEffect(() => {

    //check cookie and create
    var cookieValue = Cookies.get('city');
    var degreesValue = Cookies.get('degrees');
    if (!cookieValue) {
      Cookies.set('city', 'Bucuresti', { expires: 365 });
    }
    if (!degreesValue) {
      Cookies.set('degrees', 'celsius', { expires: 365 });
    }

    //get cookie update
    cookieValue = Cookies.get('city');
    degreesValue = Cookies.get('degrees');

    //check if celsius
    if(degreesValue == "fahrenheit"){
      setcelsiussymbol('F');
    }
    else
      setcelsiussymbol('C');

    //refresh page
    var timer = setInterval(() => setDate(new Date()), 1000);
      return function cleanup() {
        clearInterval(timer);
    };

  }, []);

  return (
    <>
      <div className='container'>
        <div className='card_small'>

          <div className='top_search'>
            <FontAwesomeIcon icon={faMapMarkerAlt} size="lg"/>
            <input type = "text" placeholder='Cauta o locatie'/>
            <button><FaSearch /></button>
          </div>

          <div className='top_location'>
            <h1>undefined</h1>
          </div>

          <div className='middle_icon'>
            <img src='icons/question.svg' />
          </div>
          
          <div className='middle_degrees'>
            <h1 className='degrees'>0</h1>
            <h1 className='celsius'>°{celsiussymbol}</h1>
          </div>

          <div className='middle_day'>
            <h1 className='day'>{dayNames[(new Date()).getDay()]},</h1>
            <h1 className='hour'>{date.getHours() + ":" + date.getMinutes()}</h1>
          </div>

          <div className='separator'>
            <hr />
          </div>

          <div className='created'>
            <p>Neauna Madalin</p>
            <div className='social'>
              <a href='https://github.com/nnmadalin' target={"_blank"}><FaGithub /></a>
              <a href='https://www.instagram.com/nnmadalin/' target={"_blank"}><FaInstagram /></a>
              <a href='https://www.facebook.com/madalin.neauna' target={"_blank"}><FaFacebook /></a>
            </div>
          </div>
        </div>
        <div className='card_big'>
          
        </div>
      </div>
      
    </>
  );
}

export default App;
