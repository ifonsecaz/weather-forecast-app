export const apiCall = async (cityname) => {
    const url = `/.netlify/functions/WeatherApi?city=${cityname}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
         }
        const data = await response.json();
        return data;
  } catch (err) {
    console.error('API call error:', err);
    return null;
  }
}