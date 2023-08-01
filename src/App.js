import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import { FaGithub, FaInstagram, FaFacebook, FaSearch} from "react-icons/fa";
import Cookies from 'js-cookie';
import 'typeface-roboto';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';


function App() {

  const [inputlocation, Setinputlocation] = useState('');
  const [celsiussymbol, setcelsiussymbol] = useState('C');
  const [temp, setTemp] = useState('0');
  const [location, setLocation] = useState('undefined');
  const [icon, setIcon] = useState('question');
  const dayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
  var [date, setDate] = useState(new Date());

  const parse_json = (json) =>{
    setLocation(json["resolvedAddress"]);
    setIcon(json["currentConditions"]["icon"]);
    setTemp(json["currentConditions"]["temp"]);
  };

  const handleChange = (event) => {
    Setinputlocation(event.target.value);
  };

  const api_call = async () =>{
    var cityValue_first = Cookies.get('city');
    if(inputlocation != ""){
      Cookies.set('city', inputlocation, { expires: 365 });
    }

    var cityValue = Cookies.get('city');
    var url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" 
    + cityValue +
    "?unitGroup=metric&include=events%2Ccurrent%2Cdays%2Chours%2Calerts&key="
    + process.env.REACT_APP_WEATHER_API_KEY +
    "&contentType=json";
  
    (async () => {
      try {
        const response = await fetch(url);
        const parsed = await response.json();
        parse_json(parsed);
        Setinputlocation('');
      } catch (error) {
        Cookies.set('city', cityValue_first, { expires: 365 });
      }
    })();

  };
  
  function buttonSubmit(e) {
    e.preventDefault();
    api_call();
  }


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
    
    //api_call();

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
            <input type = "text" placeholder='Cauta o locatie' onChange={handleChange} value={inputlocation}/>
            <button onClick={buttonSubmit}><FaSearch /></button>
          </div>

          <div className='top_location'>
            <h1>{location}</h1>
          </div>

          <div className='middle_icon'>
            <img src={"icons/" + icon + ".svg"} />
          </div>
          
          <div className='middle_degrees'>
            <h1 className='degrees'>{temp}</h1>
            <h1 className='celsius'>°{celsiussymbol}</h1>
          </div>

          <div className='middle_day'>
            <h1 className='day'>{dayNames[(new Date()).getDay()]},</h1>
            <h1 className='hour'>{date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0')}</h1>
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
          <div className='top'>
            <div className='left'>
              <button className='select'>Astăzi</button>
              <button>Săptămână</button>
            </div>
            <div className='right'>
              <button className='select'>°C</button>
              <button>°F</button>
            </div>
          </div>

          <div className='middle'>
            <div className='card'></div>
            <div className='card'></div>
            <div className='card'></div>
            <div className='card'></div>
            <div className='card'></div>
          </div>

          <div className='bottom'>
            <div className='row'>
              <p>Informații generale despre astăzi</p>
            </div>
            <div className='contain'>
              <div className='card'></div>
              <div className='card'></div>
              <div className='card'></div>
              <div className='card'></div>
              <div className='card'></div>
              <div className='card'></div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}

export default App;
