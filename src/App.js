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

  const [uv, setUv] = useState('0');
  const [uvDescription, setUvDescription] = useState('undefined');
  const [wind, setWind] = useState('0.00 km/h');
  const [windDescription, setWindDescription] = useState('undefined');
  const [sunrice, setSunrice] = useState('00:00');
  const [sunset, setSunset] = useState('00:00');
  const [season, setSeason] = useState('undefined');
  const [humidity, setHumidity] = useState('00%');
  const [humidityDescription, setHumidityDescription] = useState('undefined');
  const [visibility, setVisibility] = useState('0');
  const [visibilityDescription, setVisibilityDescription] = useState('undefined');
  const [feelslike, setfeelslike] = useState('00.0');
  const [feelslikeDescription, setfeelslikeDescription] = useState('undefined');

  const dayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
  var [date, setDate] = useState(new Date());

  const celcius_btn = useRef();
  const fahrenheit_btn = useRef();

  const today_btn = useRef();
  const week_btn = useRef();

  const parse_json = (json) =>{
    //card small
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

  function change_see(e) {
    e.preventDefault();
    
  }

  function change_celsius(e) {
    e.preventDefault();

    var degreesValue = Cookies.get('degrees');

    if(e.target.value != degreesValue){

      if(e.target.value == "celsius"){
        Cookies.set('degrees', 'celsius', { expires: 365 });
      }
      else if(e.target.value == "fahrenheit"){
        Cookies.set('degrees', 'fahrenheit', { expires: 365 });
      }

      

      if(e.target.value == "fahrenheit"){
        setcelsiussymbol('F');
        fahrenheit_btn.current.style.backgroundColor = 'black';
        fahrenheit_btn.current.style.color = 'white';

        celcius_btn.current.style.backgroundColor = 'white';
        celcius_btn.current.style.color = 'black';
        setTemp(parseFloat(temp) + 32);
      }
      else{
        setcelsiussymbol('C');
        celcius_btn.current.style.backgroundColor = 'black';
        celcius_btn.current.style.color = 'white';

        fahrenheit_btn.current.style.backgroundColor = 'white';
        fahrenheit_btn.current.style.color = 'black';
        setTemp(parseFloat(temp) - 32);
      }
    }
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
      fahrenheit_btn.current.style.backgroundColor = 'black';
      fahrenheit_btn.current.style.color = 'white';

      celcius_btn.current.style.backgroundColor = 'white';
      celcius_btn.current.style.color = 'black';
      console.log(parseFloat(temp));
      setTemp(parseFloat(temp) + 32);
    }
    else{
      setcelsiussymbol('C');
      celcius_btn.current.style.backgroundColor = 'black';
      celcius_btn.current.style.color = 'white';

      fahrenheit_btn.current.style.backgroundColor = 'white';
      fahrenheit_btn.current.style.color = 'black';
    }
    
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
          <div className='top'>
            <div className='top_search'>
              <FontAwesomeIcon icon={faMapMarkerAlt} size="lg"/>
              <input type = "text" placeholder='Cauta o locatie' onChange={handleChange} value={inputlocation}/>
              <button onClick={buttonSubmit}><FaSearch /></button>
            </div>    
          </div>

          <div className='middle'>
            <div className='middle_location'>
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
          </div>

          <div className='bottom'>
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
        </div>
        <div className='card_big'>
          <div className='top'>
            <div className='left'>
              <button ref={today_btn} value="today" onClick={change_see}>Astăzi</button>
              <button ref={week_btn} value="week" onClick={change_see}>Săptămână</button>
            </div>
            <div className='right'>
              <button ref={celcius_btn} value = "celsius" onClick={change_celsius}>°C</button>
              <button ref={fahrenheit_btn} value = 'fahrenheit' onClick={change_celsius}>°F</button>
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
              <div className='card uv'>
                <div className='image'>
                  <img src = "weather/icons8-uv-index-64.png"/>
                </div>
                <div className='rows'>
                  <div className='row row_title'>
                    <p className='title'>Indice UV</p>
                  </div>
                  <div className='row row_flex'>
                    <p className='value'>{uv}</p>
                  </div>
                  <div className='row'>
                    <p className='value val_small'>{uvDescription}</p>
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className='image'>
                  <img src = "weather/icons8-windy-64.png"/>
                </div>
                <div className='rows'>
                  <div className='row row_title'>
                    <p className='title'>Starea vântului</p>
                  </div>
                  <div className='row row_flex'>
                    <p className='value'>{wind}</p>
                  </div>
                  <div className='row'>
                    <p className='value val_small'>{windDescription}</p>
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className='image img_special'>
                  <img src = "weather/icons8-sun-64.png"/>
                  <img className = "moon" src = "weather/icons8-moon-64.png"/>
                </div>
                <div className='rows'>
                  <div className='row row_title'>
                    <p className='title'>Răsărit & apus</p>
                  </div>
                  <div className='row row_flex_small'>
                    <p className='value'>{sunrice}</p>
                  </div>
                  <div className='row row_flex_small'>
                    <p className='value'>{sunset}</p>
                  </div>
                  <div className='row'>
                    <p className='value val_small'>{season}</p>
                  </div>
                </div>

              </div>
              <div className='card'>
                <div className='image'>
                  <img src = "weather/icons8-humidity-64.png"/>
                </div>
                <div className='rows'>
                  <div className='row row_title'>
                    <p className='title'>Umiditate</p>
                  </div>
                  <div className='row row_flex'>
                    <p className='value'>{humidity}</p>
                  </div>
                  <div className='row'>
                    <p className='value val_small'>{humidityDescription}</p>
                  </div>
                </div>

              </div>
              <div className='card'>
                <div className='image img_special_viz'>
                  <img src = "weather/icons8-summer-64.png"/>
                </div>
                <div className='rows'>
                  <div className='row row_title'>
                    <p className='title'>Visibilitate</p>
                  </div>
                  <div className='row row_flex'>
                    <p className='value'>{visibility}</p>
                  </div>
                  <div className='row'>
                    <p className='value val_small'>{visibilityDescription}</p>
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className='image'>
                  <img src = "weather/icons8-air-100.png"/>
                </div>
                <div className='rows'>
                  <div className='row row_title'>
                    <p className='title'>Temperatura resimțită</p>
                  </div>
                  <div className='row row_flex'>
                    <p className='value'>{feelslike}</p>
                  </div>
                  <div className='row'>
                    <p className='value val_small'>{feelslikeDescription  + "°" + celsiussymbol}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}

export default App;
