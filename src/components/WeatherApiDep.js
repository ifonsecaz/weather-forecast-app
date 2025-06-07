import axios from 'axios';

let apiInstance = null;

export const initializeWeatherApi = async () => {
  apiInstance = axios.create({
    baseURL: `http://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER}&q=`
  });
};

export const fetchWeatherData = async (city) => {
  if (!apiInstance) throw new Error("API not initialized");
  const response = await apiInstance.get(`${city}&days=6&aqi=no&alerts=no`);
  return response.data;
};