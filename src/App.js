import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from "./page/Login"
import Home from './page/Home';
import Signup from './page/Signup';
import Forgetpassword from './page/Forgetpassword';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />
      </Routes>   
    </div>
  );
}

export default App;