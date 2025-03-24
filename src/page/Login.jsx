import React, { useState, useRef } from "react";
import { Box, Grid, Typography, Button, Divider } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import AppleIcon from '@mui/icons-material/Apple';
import { Facebook } from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../Assests/loginlogo.png";
import logo2 from "../Assests/logoImage.jpg";
import InputField from "../component/InputField";
import ButtonBox from "../component/ButtonBox";
import axios from "axios";

function Login() {
  const [inputValue, setInputValue] = useState({ mobileOrEmail: "" });
  const [showOTPField, setShowOTPField] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef(Array(5).fill(null));

  const handleInputChange = (e) => {
    setInputValue({ ...inputValue, mobileOrEmail: e.target.value });
  };

  const isValidInput = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneRegex.test(inputValue.mobileOrEmail) || emailRegex.test(inputValue.mobileOrEmail);
  };


  const handleSendOTP = async () => {
    if (!isValidInput()) return;

    try {
      const response = await axios.post("https://your-api.com/send-otp", {
        mobileOrEmail: inputValue.mobileOrEmail,
      });

      if (response.data.success) {
        setShowOTPField(true);
        setResendTimer(60);
        startResendTimer();
      } else {
        console.error("Failed to send OTP:", response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post("https://your-api.com/resend-otp", {
        mobileOrEmail: inputValue.mobileOrEmail,
      });

      if (response.data.success) {
        setResendTimer(60);
        startResendTimer();
      } else {
        console.error("Failed to resend OTP:", response.data.message);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  const startResendTimer = () => {
    let timer = 60;
    const interval = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(interval);
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };


  const handleLogin = async () => {
    const otpCode = otp.join("");

    try {
      const response = await axios.post("https://your-api.com/verify-otp", {
        mobileOrEmail: inputValue.mobileOrEmail,
        otp: otpCode,
      });

      if (response.data.success) {
        console.log("Login successful!", response.data);
      } else {
        console.error("Invalid OTP:", response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };


  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      <Grid container sx={{
        width: "90%",
        maxWidth: "100vw",
        height: "100vh",
        alignItems: "stretch",
        overflow: "hidden"
      }}>

        {/* left Part */}
        <Grid item xs={12} md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
          }}>
          <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            padding: 2
          }}>
            <img src={logo} alt="Login"
              style={{
                width: "100%",
                maxHeight: "620px",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px"
              }}
              loading="lazy" />
          </Box>
        </Grid>

        {/* right part */}
        <Grid item xs={12} md={6}
          sx={{
            display: "flex",
            position: "relative",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Box sx={{
            width: "100%",
            maxWidth: "550px",
            height: "100%",
            maxHeight: "620px",
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.8,
            borderRadius: "12px"
          }}>
            <Typography color="#1D90A6" variant="h1"
              sx={{
                fontSize: { xs: "24px", md: "24px" }
              }}>
              <img src={logo2} alt="Logo" width="185.97px" height="110px" />
            </Typography>
            <Divider sx={{ width: "50%", }} />

            <Typography color="#111827" fontWeight="bold" variant="h1" sx={{ fontSize: { xs: "24px", md: "24px" }, }}>
              Login to Account
            </Typography>


            <ButtonBox icon={<FcGoogle style={{ fontSize: "20px" }} />} text="Continue with Google" />
            <ButtonBox icon={<AppleIcon />} text="Continue with Apple" />
            <ButtonBox icon={<Facebook />} text="Continue with Facebook" />


            <Box sx={{ display: "flex", alignItems: "center", width: "100%", height: "10px" }}>
              <Box sx={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} className='bg-blue-700' />
              <Typography sx={{ mx: 2, fontSize: "14px", color: "#666" }}>or</Typography>
              <Box sx={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
            </Box>

            <InputField label="Phone or Email" type="text" value={inputValue.mobileOrEmail} placeholder="Enter phone or email" onChange={handleInputChange} name="mobileOrEmail" />

            {showOTPField && (
              <Typography color="primary" variant="subtitle1" sx={{ fontSize: "14px", textAlign: "right", width: "100%" }}>
                {resendTimer > 0 ? `Resend in ${resendTimer} sec` : <Button color="blue" sx={{ textTransform: "none", fontSize: "14px" }} onClick={handleResendOTP}>resend OTP</Button>}
              </Typography>
            )}

            {showOTPField && (
              <>
                <Typography variant="subtitle1" sx={{ fontSize: "14px", textAlign: "left", width: "100%", }}>
                  Enter OTP
                </Typography>

                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", }}>
                  {otp.map((digit, index) => (
                    <InputField
                      key={index}
                      type="text"
                      variant="outlined"
                      inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleBackspace(index, e)}
                      inputRef={(el) => (otpRefs.current[index] = el)}
                      sx={{ width: "15%", height: 50 }}
                      placeholder="0"
                    />
                  ))}
                </Box>
              </>
            )}

            {!showOTPField ? (
              <Button variant="contained" fullWidth disabled={!isValidInput()} onClick={handleSendOTP} sx={{ backgroundColor: "#1976D2", "&:hover": { backgroundColor: "#1565C0" } }}>
                Send OTP
              </Button>
            ) : (
              <Button variant="contained" onClick={handleLogin} fullWidth sx={{ backgroundColor: "#1976D2", "&:hover": { backgroundColor: "#1565C0" } }}>
                Verify Number
              </Button>
            )}

            <Typography variant="body1">
              New user ? <Button component={Link} to="/signup" color="primary" sx={{ textTransform: "none", fontSize: "14px" }}>Sign-up</Button>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
