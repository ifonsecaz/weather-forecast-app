async function apiCall(cityname) {
    const url = `/.netlify/functions/fetchWeatherData?city=${cityname}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}