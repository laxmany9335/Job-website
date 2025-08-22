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
import MyProfile from './page/MyProfile';
import InternshipsPage from './page/InternshipsPage';
import Job from './page/Job';
import Mentorships from './page/Mentorships';
import Practice from './page/Practice';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { setToken } from './slice/authSlice';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // 🔹 Sync cookie → Redux on app load
  useEffect(() => {
    const cookieToken = Cookies.get("token");
    console.log(token," inside APP js......................");
    if (cookieToken && !token) {
      dispatch(setToken(cookieToken));
    }
  }, [dispatch, token]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Open Routes (No login required) */}
        <Route path="/login" element={<OpenRoute><Login /></OpenRoute>} />
        <Route path="/signup" element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path="/verify-email" element={<OpenRoute><VerifyEmail /></OpenRoute>} />
        <Route path="/forget-password" element={<OpenRoute><Forgetpassword /></OpenRoute>} />
        <Route path="update-password/:id" element={<OpenRoute><ResetPassword /></OpenRoute>} />

        {/* Private Routes (Login required) */}
        <Route path="/competitions" element={<PrivateRoute><CompetitionsPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard/my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
        <Route path="/internships" element={<PrivateRoute><InternshipsPage /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><Job /></PrivateRoute>} />
        <Route path="/mentorships" element={<PrivateRoute><Mentorships /></PrivateRoute>} />
        <Route path="/practice" element={<PrivateRoute><Practice /></PrivateRoute>} />

        {/* Error / Not Found */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
