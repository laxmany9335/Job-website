import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../component/InputField";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Facebook } from "@mui/icons-material";

const Signup = () => {
  const [formData, setFormData] = useState({
    accountType: "student",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Form Data:", formData);
    // API call here
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.gender &&
    formData.password &&
    formData.confirmPassword;

  return (
    <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-white"  style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)" }}>
      <div className="w-[60%] max-w-full h-[90vh] bg-white rounded-[12px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] flex overflow-hidden">
        
        {/* Left Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-4">
          <img
            src="/signup1.jpg"
            alt="Signup"
            className="w-full h-full object-cover rounded-[12px] max-h-[620px]"
            loading="lazy"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 px-6 py-4 flex flex-col justify-start items-center max-h-[620px] overflow-y-auto"
         style={{
          maxHeight: "620px",
          overflowY: "auto",
          scrollbarWidth: "none", /* for Firefox */
          msOverflowStyle: "none", /* for IE and Edge */
        }}>
          <div className="w-full max-w-[550px] flex flex-col gap-3">

            {/* Header */}
            <div className="flex flex-col justify-center items-center">
            <img src="/logo.png" alt="Logo" width="100px" height="50px" />
              <h1 className="text-[24px] font-bold text-[#111827]">Sign up</h1>
              <div className="w-[50%] h-[2px] bg-gray-200 my-1"/>
            </div>

            {/* Account Type Toggle */}
            <div className="flex bg-gray-200 rounded-full p-1 w-max mx-auto mb-4">
              {["student", "instructor"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, accountType: type }))}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${formData.accountType === type ? "bg-blue-600 text-white" : "text-gray-600"}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Name */}
            <div className="flex gap-3 mb-1">
              <InputField
                type="text"
                name="firstName"
                label="First Name"
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputField
                type="text"
                name="lastName"
                label="Last Name"
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <InputField
              type="email"
              name="email"
              label="Email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="mb-5"
            />

            {/* Phone */}
            <div className="flex gap-2 mb-1">
              <select 
                defaultValue="🇮🇳 +91"
                className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+977">🇳🇵 +977</option> {/* Nepal */}
                <option value="+92">🇵🇰 +92</option> {/* Pakistan */}
                <option value="+94">🇱🇰 +94</option> {/* Sri Lanka */}

              </select>
              <InputField
                type="tel"
                name="phone"
                label="Phone No"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Gender */}
            <div className="mb-1">
              <label className="block text-gray-700 text-md mb-2 flex items-start">Gender</label>
              <div className="flex gap-2">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleGenderSelect(g)}
                    className={`text-sm px-3 py-1 border rounded-full transition ${formData.gender === g ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Passwords */}
            <div className="flex gap-3 mb-1">
              <div className="relative w-1/2">
                <InputField
                  type={showPassword ? "text" : "password"}
                  name="password"
                  label="Password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-3 top-[20px] cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>
              <div className="relative w-1/2">
                <InputField
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-3 top-[20px] cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-3 mb-1">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full py-2 rounded-full text-white text-sm font-medium transition ${isFormValid ? "bg-[#1976D2] hover:bg-[#1565C0]" : "bg-gray-300 cursor-not-allowed"}`}
              >
                Sign Up
              </button>

              <p className="text-md text-gray-600 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </p>
            </div>

            {/* Social Media Login */}
            <div className="flex gap-4 mb-1">
              <button className="flex items-center justify-center gap-2 py-2 px-4 bg-yellow-700 text-white rounded-full w-full">
                <FcGoogle className="text-2xl" />
               <span>  Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
