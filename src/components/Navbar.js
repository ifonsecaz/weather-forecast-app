import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: #0077cc;
  padding: 1rem;
  color: white;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Brand = styled.a`
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
  &:hover {
    color: #cce7ff;
  }
`;

const FormWrapper = styled.div`
  flex-grow: 1;
  margin-left: 1rem;
`;

const Form = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color:rgb(8, 110, 184);
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color:rgb(0, 8, 15);
  }
`;

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  color:rgb(235, 143, 143);
  font-weight: 600;
`;

const Navbar = () => {
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
    <Nav>
      <Container>
        <Brand href="/">Weather forecast</Brand>
        <FormWrapper>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="location"
              value={location}
              onChange={handleLocationChange}
              placeholder="City"
            />
            <Button type="submit">Search</Button>         
             {error && <ErrorMessage>{error}</ErrorMessage>}
          </Form>
        </FormWrapper>
      </Container>
    </Nav>
  );
};

export default Navbar;