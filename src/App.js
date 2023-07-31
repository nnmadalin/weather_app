import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt  } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import 'typeface-roboto';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

var is_use = false;

function App() {

  const [inputValue, setInputValue] = useState(Cookies.get('city'));

  const handleChangeAndSize = (ev) => {
    const target = ev.target;
    target.style.width = '10px';
    target.style.width = `${target.scrollWidth}px`;

    Cookies.set('city', target.value, { expires: 365 })

    handleChange(ev);
  };
  const inputRef = useRef(null);
  
  const handleChange = (ev) => {
    setInputValue(ev.target.value);
  };

  const addValueOnStartup = (value) => {
    if (inputRef.current) {
      inputRef.current.value = value;
      const target = inputRef.current;
      target.style.width = '10px';
      target.style.width = `${target.scrollWidth}px`;
    }
  };

  useEffect(() => {
    const cookieValue = Cookies.get('city');
    if (!cookieValue) {
      Cookies.set('city', 'Bucuresti', { expires: 365 });
    }

    addValueOnStartup(cookieValue);

  }, []);

  return (
    <>
      <div className='search_card'>
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        <input ref={inputRef} className='search' placeholder='...' onChange={handleChangeAndSize}/>
      </div>
      <div className='weather_card'>

      </div>
    </>
  );
}

export default App;