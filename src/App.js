
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './page/Login';
import Signup from './page/Signup';
import Dashboard from './page/Dashboard';
import Home from './page/Home';

function App() {
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/login" element={<Login />} /> 
       <Route path="/signup" element={<Signup />} />
       <Route path="/dashboard" element={<Dashboard/>} /> 
     </Routes>
      
    </div>
  );
}

export default App;
