import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import InputField from "../component/InputField";
import { Link } from "react-router-dom"; // ✅ Fixed: Correct Link import
import { IoIosArrowRoundBack } from "react-icons/io";

function Forgetpassword() {
  const [email, setEmail] = useState({ email: "" });

  // Handle input change
  function handleInputChange(e) {
    setEmail({ ...email, [e.target.name]: e.target.value });
  }

  // Email validation
  const isValidInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.email);
  };

  // Submit handler
  function handleSubmit(e) {
    e.preventDefault();
    if (!isValidInput()) return;
    console.log("Submitting email:", email.email);
    // TODO: Add backend logic here
  }

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
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
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
              justifyContent: "center",
              gap: 1.8,
              borderRadius: "12px",
            }}
          >
            {/* Heading */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start",
              }}
            >
              <Typography
                color="#111827"
                fontWeight="bold"
                variant="h1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: "24px", md: "24px" },
                }}
              >
                <img src="/lock.png" height={"60px"} width={"80px"} alt="Lock" />
                Forgot Password?
              </Typography>
              <p className="px-7">
                Create a new password to login to your account
              </p>
            </Box>

            {/* Input */}
            <InputField
              type="text"
              label="Email"
              placeholder="Enter your email"
              value={email.email}
              name="email"
              onChange={handleInputChange}
            />

            {/* Error Message */}
            {email.email && !isValidInput() && (
              <Typography variant="caption" color="error">
                Please enter a valid email address
              </Typography>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isValidInput()}
              className={`${
                isValidInput()
                  ? "bg-[#1D90A6] hover:bg-[#1D90A6] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white font-bold py-2 px-4 rounded-full w-full mt-4 transition duration-300 ease-in-out`}
            >
              Submit
            </button>

            {/* Back to Login Link */}
            <Link to="/login" className="text-blue-600 mt-3 py-2 border-2 border-gray-300 hover:bg-blue-600 hover:text-white w-full rounded-full">
       
              <span className="flex items-center justify-center gap-2"> <IoIosArrowRoundBack fontSize={"25px"}/> Back to login</span>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Forgetpassword;
