import { render, waitFor, screen } from '@testing-library/react';
import Welcome from './Welcome';
import Weather from './Weather';
import Navbar from './Navbar';
import WeatherApi from './WeatherApi'
import { MemoryRouter, useLocation } from 'react-router-dom';


test('renders correctly welcome', () => {
render(<Welcome/>);
  const button = screen.getByText(/Search/i);
}); 


test('renders correctly navbar', () => {
render(<Navbar/>);
  const cityInput = screen.getByPlaceholderText(/City/i);
}); 


//Fetching data

jest.mock('./weatherApi', () => ({
  fetchWeatherData: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

describe('Weather Component', () => {
  const mockWeatherData = {
    location: {
      name: 'Test City',
      region: 'Test Region',
      country: 'Test Country',
      localtime: '2025-06-05 10:00',
      lat: 12.34,
      lon: 56.78,
    },
    current: {
      is_day: 1,
      condition: {
        text: 'Sunny',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
      },
      temp_c: 25,
      temp_f: 77,
      feelslike_c: 27,
      feelslike_f: 80.6,
      wind_kph: 10,
      wind_mph: 6.2,
      wind_dir: 'NE',
      humidity: 50,
      pressure_mb: 1010,
      pressure_in: 29.83,
      uv: 5,
    },
    forecast: {
      forecastday: Array.from({ length: 5 }).map((_, i) => ({
        date: `2025-06-0${i + 5}`,
        day: {
          condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png'
          },
          maxtemp_c: 30,
          mintemp_c: 20,
          daily_chance_of_rain: 10
        }
      }))
    }
  };

  beforeEach(() => {
    useLocation.mockReturnValue({ state: { name: 'Test City' } });
    weatherApi.fetchWeatherData.mockResolvedValue(mockWeatherData);
  });

  it('fetches and displays weather data', async () => {
    render(
      <MemoryRouter>
        <Weather />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Test City/i)).toBeInTheDocument();
      expect(screen.getByText(/Local time:/i)).toBeInTheDocument();
      expect(screen.getByText(/Sunny/i)).toBeInTheDocument();
      expect(screen.getByText(/Max:/)).toBeInTheDocument();
    });
  });
});