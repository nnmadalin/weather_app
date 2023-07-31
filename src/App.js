import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt  } from '@fortawesome/free-solid-svg-icons';
import 'typeface-roboto';
import React, { useState } from 'react';
import './App.css';

function App() {

  const [inputValue, setInputValue] = useState('');

  const handleChangeAndSize = (ev) => {
    const target = ev.target;
    target.style.width = '10px';
    target.style.width = `${target.scrollWidth}px`;

    handleChange(ev);
  };

  const handleChange = (ev) => {
    setInputValue(ev.target.value);
  };

  return (
    <>
      <div className='search_card'>
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        <input className='search' placeholder='...' onChange={handleChangeAndSize}/>
      </div>
      <div className='weather_card'>

      </div>
    </>
  );
}

export default App;