import React, { useState } from "react";
import { Box, Grid, Typography, Button, Divider } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { Facebook } from "@mui/icons-material";
import { Link } from "react-router-dom";
import InputField from "../component/InputField";
import ButtonBox from "../component/ButtonBox";
import { BiSolidHide } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { IoIosUnlock } from "react-icons/io";


function Login() {
  const [inputValue, setInputValue] = useState({ mobileOrEmail: "", password: "" });
  const [showPassword, setPassword] = useState(false);

  const handleInputChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const isValidInput = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneRegex.test(inputValue.mobileOrEmail) || emailRegex.test(inputValue.mobileOrEmail);
  };

  const isInputValid = isValidInput();

  const handleLogin = async () => {
    console.log(inputValue);
    // Add login API logic here  
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
      <Grid
        container
        sx={{
          width: "60%",
          maxWidth: "100vw",
          height: "90vh",
          padding: 2,
          backgroundColor: "#ffffff",
          alignItems: "stretch",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Left Part */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              padding: 2,
            }}
          >
            <img
              src="/loginlogo.png"
              alt="Login"
              style={{
                width: "100%",
                maxHeight: "620px",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
              loading="lazy"
            />
          </Box>
        </Grid>

        {/* Right Part */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "550px",
              height: "100%",
              maxHeight: "620px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.8,
              borderRadius: "12px",
            }}
          >
            <Typography
              color="#1D90A6"
              variant="h1"
            >
              <img src="/logo.png" alt="Logo" width="100px" height="50px" />
              <Divider sx={{ width: "100%", height: "2px" }} />
            </Typography>

            <Typography
              color="#111827"
              fontWeight="bold"
              variant="h1"
              sx={{ fontSize: { xs: "24px", md: "24px" } }}
            >
              Login to Account
            </Typography>

            <ButtonBox
              icon={<FcGoogle style={{ fontSize: "20px" }} />}
              text="Continue with Google"
            />
            <ButtonBox icon={<Facebook />} text="Continue with Facebook" />

            <Box
              sx={{ display: "flex", alignItems: "center", width: "100%", height: "10px" }}
            >
              <Box sx={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
              <Typography sx={{ mx: 2, fontSize: "14px", color: "#666" }}>or</Typography>
              <Box sx={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
            </Box>

            {/* Mobile or Email */}
            <InputField
              label="Phone or Email"
              type="text"
              value={inputValue.mobileOrEmail}
              placeholder="Enter phone or email"
              onChange={handleInputChange}
              name="mobileOrEmail"
            />

            {/* Password with Toggle */}
            <Box sx={{ position: "relative", width: "100%" }}>
              <InputField
                label="Enter Password"
                type={showPassword ? "text" : "password"}
                value={inputValue.password}
                placeholder="Enter your password"
                onChange={handleInputChange}
                name="password"
              />
              {!showPassword && (
                <BiSolidHide
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "20px",
                    color: "#666",
                    cursor: "pointer",
                  }}
                  onClick={() => setPassword(true)}
                />
              )}
              {showPassword && (
                <AiOutlineEye
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "20px",
                    color: "#666",
                    cursor: "pointer",
                  }}
                  onClick={() => setPassword(false)}
                />
              )}
            </Box>

            <Link to="/forgetpassword" className="flex gap-1 text-blue-500 hover:bg-blue-50 rounded-md p-1" > <IoIosUnlock fontSize={"20px"}/> <span>forget Password </span></Link>

            {/* Login Button */}
            <Button
              variant="contained"
              onClick={isInputValid ? handleLogin : undefined}
              fullWidth
              disabled={!isInputValid}
              sx={{
                backgroundColor: isInputValid ? "#1976D2" : "#c9c9c7",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: isInputValid ? "#1565C0" : "#c9c9c7",
                },
              }}
            >
              Login
            </Button>

            <Typography variant="body1">
              Don't have an account?
              <Button
                component={Link}
                to="/signup"
                color="primary"
                sx={{ textTransform: "none", fontSize: "14px" }}
              >
                Sign up
              </Button>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
