import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from "./page/Login"
import Home from './page/Home';
import Signup from './page/Signup';
import Forgetpassword from './page/Forgetpassword';
import VerifyEmail from './page/VerifyEmail';
import CompetitionsPage from './page/CompetitionsPage';
import Dashboard from './page/Dashboard';
import Error from './page/Error';
import OpenRoute from './component/route/OpenRoute';
import PrivateRoute from './component/route/PrivateRoute';
import ResetPassword from './page/ResetPassword';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <Home />
        } />
        <Route path="/login" element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        } />
        <Route path="/signup" element={
          <OpenRoute>
            <Signup />
          </OpenRoute>
        } />
        <Route path='/verify-email' element={
          <OpenRoute>
            <VerifyEmail />
          </OpenRoute>
        } />
        <Route path="/forgetpassword" element={
          <OpenRoute>
            <Forgetpassword />
          </OpenRoute>
        } />
        <Route path="/reset-password" element={
          <OpenRoute>
            <ResetPassword />
          </OpenRoute>
        } />
        <Route path="/competitions" element={
          <PrivateRoute>
            <CompetitionsPage />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;