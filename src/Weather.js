import { Oval } from 'react-loader-spinner'; 
import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFrown } from '@fortawesome/free-solid-svg-icons'; 
import './Weather.css'; 
  
function WeatherApp() { 
    const [city, setCity] = useState(''); 
    const [weather, setWeather] = useState({ 
        loading: false, 
        data: {}, 
        error: false, 
    }); 
    const [error, setError] = useState(null);
    const getDate = () => { 
        const months = [ 
            'January', 
            'February', 
            'March', 
            'April', 
            'May', 
            'June', 
            'July', 
            'August', 
            'September', 
            'October', 
            'November', 
            'December', 
        ]; 
        const days = [ 
            'Sunday', 
            'Monday', 
            'Tuesday', 
            'Wednesday', 
            'Thursday', 
            'Friday', 
            'Saturday', 
        ]; 
        const currentDate = new Date(); 
        const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()] 
            }`; 
        return date; 
    }; 

    function validate(){
      if (city.length == 0) {
        localStorage.removeItem("weather")
        localStorage.removeItem("city")
        setError("Please enter city")
      }
      else{
        setError("")
        handleWeatherClick()
      }
    }

    const handleWeatherClick = async () =>{
      setCity(''); 
      setWeather({ ...weather, loading: true }); 
      const url = 'https://api.openweathermap.org/data/2.5/weather'; 
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c'; 
      await axios 
            .get(url, { 
                params: { 
                    q: city, 
                    units: 'metric', 
                    appid: api_key, 
                }, 
            }) 
            .then((res) => { 
                console.log('res', res); 
                localStorage.setItem('city', city);
                localStorage.setItem('weather', JSON.stringify(res.data));
                setError('')
                setWeather({ data: res.data, loading: false, error: false }); 
            }) 
            .catch((error) => { 
                localStorage.removeItem("weather")
                localStorage.removeItem("city")
                if(error.response.status == 404){
                  setError("City not found")
                }
                else{
                  setError(error.response.statusText)
                }
                setWeather({ ...weather, data: {}, error: true }); 
                setCity(''); 
                console.log('error', error); 
            }); 
    };
  
    return ( 
        <div className="MyApp"> 
            <h1 className="my-app-name"> 
                Weather App 
            </h1> 
            <div className="search-bar"> 
                <input
                    type="text"
                    className="city-search"
                    placeholder="Enter City"
                    name="query"
                    value={city} 
                    onChange={(event) => setCity(event.target.value)} 
                /> 
              <button type="button" class="submit-button" onClick={validate}>Submit</button>
            </div>  
            {weather.loading && ( 
                <> 
                    <br /> 
                    <br /> 
                    <Oval type="Oval" color="black" height={100} width={100} /> 
                </> 
            )} 
            {error && (
                              <> 
                              <span className="error-message"> 
                                  <FontAwesomeIcon icon={faFrown} /> 
                                  <span class="error_msg" style={{ fontSize: '20px' }}>{error}</span> 
                              </span> 
                          </> 
            )}
            {localStorage.weather && (
                              <div> 
                              <div className="city-name"> 
                                  <h2> 
                                      {JSON.parse(localStorage.weather).name}, <span>{JSON.parse(localStorage.weather).sys.country}</span> 
                                  </h2> 
                              </div> 
                              <div className="date"> 
                                  <span>{getDate()}</span> 
                              </div> 
                              <div className="icon-temp"> 
                                  <img 
                                      className=""
                                      src={`https://openweathermap.org/img/wn/${JSON.parse(localStorage.weather).weather[0].icon}@2x.png`} 
                                      alt={JSON.parse(localStorage.weather).weather[0].description} 
                                  /> 
                                  {Math.round(JSON.parse(localStorage.weather).main.temp)} 
                                  <sup className="deg">°C</sup> 
                              </div> 
                              <div className="des-wind"> 
                                  <p>{JSON.parse(localStorage.weather).weather[0].description.toUpperCase()}</p> 
                                  <p>Wind Speed: {JSON.parse(localStorage.weather).wind.speed}m/s</p> 
                              </div> 
                          </div> 
            )}
        </div> 
    ); 
} 
  
export default WeatherApp;