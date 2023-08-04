import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import { FaGithub, FaInstagram, FaFacebook, FaSearch} from "react-icons/fa";
import Cookies from 'js-cookie';
import 'typeface-roboto';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import DynamicCards from './DynamicCards';
import { useHistory } from 'react-router-dom';





function App() {

  const [inputlocation, Setinputlocation] = useState('');
  const [celsiussymbol, setcelsiussymbol] = useState('C');

  const [temp_bigger, setTemp] = useState('00.0');
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
  const [divDataAPI, setdivDataAPI] = useState([]);

  const celcius_btn = useRef();
  const fahrenheit_btn = useRef();

  const today_btn = useRef();
  const week_btn = useRef();

  const data_API = [];
  
  function convert_f(temp){
    return ((parseFloat(temp) * 9) / 5 + 32).toFixed(1);;
  }

  const parse_json = (json) =>{
    //card small
    setLocation(json["resolvedAddress"]);
    setIcon(json["currentConditions"]["icon"]);

    var temp_calc = json["currentConditions"]["temp"];
    if(Cookies.get('degrees') == "fahrenheit"){
      temp_calc = convert_f(temp_calc);
    }
    setTemp(temp_calc);

    var currentUrl = window.location.pathname;
    const { days } = json;
    if(currentUrl == "/week"){
      const parsedData = days.map((day) => ({
        datetime_parsed: day.datetime,
        icon_parsed: day.icon,
        temp_parsed: day.temp,
      }));
      parsedData.forEach((item, index) => {
        if(index > 0 && index < 8){
          const currentDate = new Date(item.datetime_parsed);
          var datetime_new = dayNames[currentDate.getDay()];
          
          var temp_calc = item.temp_parsed;
          if(Cookies.get('degrees') == "fahrenheit"){
            temp_calc = convert_f(temp_calc) + "°F";
          }
          else
          temp_calc += "°C";
          
          data_API.push({
            day: datetime_new,
            icon: item.icon_parsed,
            degrees: temp_calc,
          });
        }
      });
    }
    else{
      const hours = json["days"]["0"]["hours"];
      const parsedData = hours.map((hour) => ({
        datetime_parsed: hour.datetime,
        icon_parsed: hour.icon,
        temp_parsed: hour.temp,
      }));
      
      parsedData.forEach((item, index) => {
        if(index % 2 == 0){
          const [hours, minutes, seconds] = item.datetime_parsed.split(':');
          var datetime_new = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0');
          
          var temp_calc = item.temp_parsed;
          if(Cookies.get('degrees') == "fahrenheit"){
            temp_calc = convert_f(temp_calc) + "°F";
          }
          else
          temp_calc += "°C";

          data_API.push({
            day: datetime_new,
            icon: item.icon_parsed,
            degrees: temp_calc,
          });
        }
      });
    }

    setdivDataAPI(data_API);

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
    e.preventDefault();//#9c9c9c
    var currentUrl = window.location.origin;
  
    if(e.target.value == "week"){
      currentUrl += "/week";
    }
    
    window.location.href = currentUrl;
  }

  function change_celsius(e) {
    e.preventDefault();
    if(e.target.value == "celsius"){
      Cookies.set('degrees', 'celsius', { expires: 365 });
    }
    else if(e.target.value == "fahrenheit"){
      Cookies.set('degrees', 'fahrenheit', { expires: 365 });
    }

    window.location.reload(false);
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
    degreesValue = Cookies.get('degrees');
    cookieValue = Cookies.get('city');

    //check if celsius
    if(degreesValue == "fahrenheit"){
      setcelsiussymbol('F');
      fahrenheit_btn.current.style.backgroundColor = 'black';
      fahrenheit_btn.current.style.color = 'white';

      celcius_btn.current.style.backgroundColor = 'white';
      celcius_btn.current.style.color = 'black';
    }
    else{
      setcelsiussymbol('C');
      celcius_btn.current.style.backgroundColor = 'black';
      celcius_btn.current.style.color = 'white';

      fahrenheit_btn.current.style.backgroundColor = 'white';
      fahrenheit_btn.current.style.color = 'black';
    }

    today_btn.current.style.color = 'black';
    
    api_call();

    today_btn.current.style.color = '#9c9c9c';
    week_btn.current.style.color = '#9c9c9c';

    if(window.location.pathname == "/week"){
      week_btn.current.style.color = 'black';
    }
    else{
      today_btn.current.style.color = 'black';
    }
    
    //refresh page
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
        clearInterval(timer);
    };  
  }, []);

  const divDataArray = [
    { val1: 'Luni', icon: 'icon1', val3: '15°C' },
    { val1: 'Marti', icon: 'icon2', val3: '20°C' },
    { val1: 'Miercuri', icon: 'icon3', val3: '25°C' },
  ];

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
              <img src={"/icons/" + icon + ".svg"} />
            </div>
            
            <div className='middle_degrees'>
              <h1 className='degrees'>{temp_bigger}</h1>
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
            <div className='today week'>
            {divDataAPI.map((divData, index) => (
              <DynamicCards
                key={index}
                day={divData.day}
                icon={divData.icon}
                degrees={divData.degrees}
              />
            ))}
            </div>
          </div>

          <div className='bottom'>
            <div className='row'>
              <p>Informații generale despre astăzi</p>
            </div>
            <div className='contain'>
              <div className='card uv'>
                <div className='image'>
                  <img src = "/weather/icons8-uv-index-64.png"/>
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
                  <img src = "/weather/icons8-windy-64.png"/>
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
                  <img src = "/weather/icons8-sun-64.png"/>
                  <img className = "moon" src = "/weather/icons8-moon-64.png"/>
                </div>
                <div className='rows'>
                  <div className='row row_title'>
                    <p className='title'>Răsărit & apus</p>
                  </div>
                  <div className='row_special'>
                    <div className='row row_flex_small'>
                      <p className='value'>{sunrice}</p>
                    </div>
                    <div className='row row_flex_small'>
                      <p className='value'>{sunset}</p>
                    </div>
                  </div>
                  <div className='row'>
                    <p className='value val_small'>{season}</p>
                  </div>
                </div>

              </div>
              <div className='card'>
                <div className='image'>
                  <img src = "/weather/icons8-humidity-64.png"/>
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
                  <img src = "/weather/icons8-summer-64.png"/>
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
                  <img src = "/weather/icons8-air-100.png"/>
                </div>
                <div className='rows'>
                  <div className='row row_title'>
                    <p className='title'>Temperatura resimțită</p>
                  </div>
                  <div className='row row_flex'>
                    <p className='value'>{feelslike + "°" + celsiussymbol}</p>
                  </div>
                  <div className='row'>
                    <p className='value val_small'>{feelslikeDescription }</p>
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
