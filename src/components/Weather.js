import { useState, useRef, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import { initializeWeatherApi, fetchWeatherData } from './WeatherApi';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #0077cc;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${spin} 1s linear infinite;
  margin: 2rem auto;
`;

const Alert = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #f8d7da;
  color: #842029;
  border-radius: 6px;
  font-weight: 600;
  text-align: center;
`;

const WeatherSection = styled.section`
  max-width: 900px;
  margin: 2rem auto;
  background: #f0f8ff;
  border-radius: 10px;
  padding: 1.5rem 2rem;
  box-shadow: 0 0 15px rgba(0, 119, 204, 0.2);
`;

const WeatherHeader = styled.h1`
  color: #005fa3;
  margin-bottom: 1rem;
  text-align: center;
`;

const WeatherRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

const WeatherCol = styled.div`
  flex: 1 1 300px;
  min-width: 280px;
`;

const WeatherImageWrapper = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const WeatherImage = styled.img`
  max-width: 100px;
  height: auto;
`;

const WeatherInfo = styled.p`
  font-size: 1rem;
  strong {
    color: #0077cc;
  }
`;

const ForecastSection = styled.section`
  max-width: 900px;
  margin: 2rem auto;
  background: #e1ecff;
  border-radius: 10px;
  padding: 1rem 2rem;
  box-shadow: 0 0 10px rgba(0, 119, 204, 0.15);
`;

const ForecastTitle = styled.h2`
  color: #004080;
  margin-bottom: 1rem;
  text-align: center;
`;

const ForecastGrid = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ForecastCard = styled.div`
  background: white;
  border-radius: 8px;
  width: 140px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
`;

const ForecastDate = styled.p`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ForecastIcon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 0.5rem;
`;

const ForecastTemp = styled.p`
  margin: 0.25rem 0;
  font-size: 0.9rem;
  strong {
    color: #005fa3;
  }
`;

const Weather = () => {
   const location = useLocation();
   const [city, setCity] = useState(location.state.name);
    const [loading, setLoading] = useState(true);
    const [data,setData] =useState(null);
    const [forecastData,setForecastData] =useState([]);
    const [image,setImage]=useState('');
    const [altImage,setAltImage]=useState('');
    const [firstCall,setFirstCall] = useState(true);
    /*
    const apiRef = useRef(axios.create({ baseURL: null }));

    const fetchData =() =>{
        console.log("call")
        apiRef.current.get(`${city}&days=5&aqi=no&alerts=no`)
        .then((response) => {
            setData(response.data);
            let aux="/weather-icons/"
            if(response.data.current.is_day == 1){
                aux=aux+"day-";
            }
            else{    
                aux=aux+"night-";
            }
            setImage(aux+response.data.current.condition.text+".png");
            setAltImage("https:" + response.data.current.condition.icon);
            setLoading(false); 
        })
        .catch(error => {
            setData(null);
            setImage(null);
            setAltImage(null);
            console.error('Error:', error);
            setLoading(false); 
        });  
    }

    useEffect(() => {
        fetch('/apikey.txt', {
          headers: {
            'Accept': 'text/plain',
          },
        })
        .then(function(response){
            return response.text();
        }).then(function (key) {
            apiRef.current.defaults.baseURL = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=`;
            fetchData();
        })
    },[]);

*/
    const processImage = (weatherData) => {
        let base = "/weather-icons/";
        base += weatherData.current.is_day === 1 ? "day-" : "night-";
        return {a:base + weatherData.current.condition.text.trim() + ".png",
            b:"https:" + weatherData.current.condition.icon};
    };

    const fetchAndSetData = async (cityName) => {
        try {
            const weatherData = await fetchWeatherData(cityName);
            setData(weatherData);
            const {a,b}=processImage(weatherData);
            setImage(a);
            setAltImage(b);
            const auxArr=[]
            for(let i=1;i<=5;i++){
                const aF="/weather-icons/day-" + weatherData.forecast.forecastday[i].day.condition.text.trim() + ".png";
                const bF= "https:" + weatherData.forecast.forecastday[i].day.condition.icon;
                const day={
                    date:weatherData.forecast.forecastday[i].date,
                    maxtemp_c:weatherData.forecast.forecastday[i].day.maxtemp_c,
                    mintemp_c:weatherData.forecast.forecastday[i].day.mintemp_c,
                    daily_chance_of_rain:weatherData.forecast.forecastday[i].day.daily_chance_of_rain,
                    imageA:aF,
                    imageB:bF,
                    condition:weatherData.forecast.forecastday[i].day.condition.text
                }
                auxArr.push(day);
            }
            console.log(auxArr);
            setForecastData(auxArr);
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
            setData(null);
            setForecastData([]);
            setImage(null);
            setAltImage(null);
            setLoading(false);
        }
    };

     useEffect(() => {
        const start = async () => {
            await initializeWeatherApi();
            await fetchAndSetData(city);
        };
        start();
        setFirstCall(false);
    }, []);

    useEffect(() => {
        if (!firstCall){ 
            setCity(location.state.name)
            fetchAndSetData(location.state.name);
        }
    }, [location.state.name]);

     useEffect(() => {
        const intervalId = setInterval(() => {
        if (data&&!firstCall) {
            fetchAndSetData(city);
        }
        }, 60000);
        return () => clearInterval(intervalId);
    }, [data]);

    
    const onError=()=> {
        setImage(altImage);
    };

    const onError2=(day)=> {
        setForecastData(prevData =>
            prevData.map(d =>
            d.date === day.date
                ? { ...d, imageA: d.imageB } 
                : d
            )
        );
    };

    if (loading) {
        return (<><Spinner /> <p>Loading...</p></>);
    } 

 return (
    <>
      {!data && !loading && (
        <Alert>City not found. Please try again.</Alert>
      )}

      {data && (
        <div>
        <WeatherSection>
          <WeatherImageWrapper>
            <WeatherImage src={image} alt={data.current.condition.text} onError={onError} />
          </WeatherImageWrapper>

          <WeatherHeader>
            {data.location.name}, {data.location.region}, {data.location.country}
          </WeatherHeader>

          <WeatherRow>
            <WeatherCol>
              <WeatherInfo><strong>Local time:</strong> {data.location.localtime}</WeatherInfo>
              <WeatherInfo><strong>Condition:</strong> {data.current.condition.text}</WeatherInfo>
              <WeatherInfo><strong>Temperature:</strong> {data.current.temp_c}°C ({data.current.temp_f}°F)</WeatherInfo>
              <WeatherInfo><strong>Feels Like:</strong> {data.current.feelslike_c}°C ({data.current.feelslike_f}°F)</WeatherInfo>
              <WeatherInfo><strong>Coordinates:</strong> {data.location.lat}, {data.location.lon}</WeatherInfo>
            </WeatherCol>

            <WeatherCol>
              <WeatherInfo><strong>Wind:</strong> {data.current.wind_kph} kph ({data.current.wind_mph} mph) {data.current.wind_dir}</WeatherInfo>
              <WeatherInfo><strong>Humidity:</strong> {data.current.humidity}%</WeatherInfo>
              <WeatherInfo><strong>Pressure:</strong> {data.current.pressure_mb} mb ({data.current.pressure_in} in)</WeatherInfo>
              <WeatherInfo><strong>UV Index:</strong> {data.current.uv}</WeatherInfo>
            </WeatherCol>
          </WeatherRow>
        </WeatherSection>

        <ForecastSection>
            <ForecastTitle>5-Day Forecast</ForecastTitle>
            <ForecastGrid>
              {forecastData.map(day => (
                <ForecastCard key={day.date}>
                  <ForecastDate>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', timeZone: "UTC"})}</ForecastDate>
                  <ForecastIcon
                    src={day.imageA} alt={day.condition} onError={() => onError2(day)}
                  />
                  <ForecastTemp><strong>Max:</strong> {day.maxtemp_c}°C</ForecastTemp>
                  <ForecastTemp><strong>Min:</strong> {day.mintemp_c}°C</ForecastTemp>
                  <ForecastTemp><strong>Rain Chance:</strong> {day.daily_chance_of_rain}%</ForecastTemp>
                </ForecastCard>
              ))}
            </ForecastGrid>
          </ForecastSection>
          </div>
      )}
    </>
  );
};

export default Weather;