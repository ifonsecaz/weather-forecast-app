import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.header`
  max-width: 700px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
  background: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  color: #0077cc;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h3`
  color: #005fa3;
  margin-bottom: 2rem;
  font-weight: 400;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 2px solid #0077cc;
  border-radius: 4px;
  width: 250px;

  &:focus {
    outline: none;
    border-color: #004080;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.2rem;
  background-color: #0077cc;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #005fa3;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: #ff4d4d;
  font-weight: 600;
`;

const Welcome = () => {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location !== '') {
      navigate('/weather', { state: { id: 1, name: location } });
    } else {
      setError('Please enter a city');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <Header>
      <Title>Hello!, Welcome to our weather forecast platform</Title>
      <Subtitle>Search the weather forecast for a city:</Subtitle>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="location"
          value={location}
          onChange={handleLocationChange}
          placeholder="City"
        />
        <Button type="submit">Search</Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Header>
  );
};

export default Welcome;