import './App.css';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Weather from './components/Weather';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

function App() {
  return (
    <div className="App">
       <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Welcome/>}/>
          <Route path="/weather" element={<Weather/>}/>
        </Routes>
        </Router>     
    </div>
  );
}

export default App;
