import axios from 'axios';
import {Handler} from "@netlify/functions";

export const handler = async (event, context) => {
  const { city } = event.queryStringParameters;

  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'City parameter is required' }),
    };
  }

  try {
    const response = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: process.env.MY_API_KEY,
        q: city,
        days: 6,
        aqi: 'no',
        alerts: 'no',
      },
    });

    return {
      statusCode: 200,
   body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data' }),
    };
  }
};