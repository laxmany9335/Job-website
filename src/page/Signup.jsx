import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { setSignupData, setLoading } from "../slice/authSlice";
import { sendOtp } from "../services/operation/auth";
import InputField from "../component/InputField";
import "./Spinner.css";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    accountType: "Student",
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

  const isFormValid = Object.values(formData).every(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSignupData(formData));
    dispatch(setLoading(true));
    dispatch(sendOtp(formData.email, navigate));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-slate-100 to-white px-4 py-8">
      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Image Section */}
          <div className="hidden md:flex md:w-1/2 bg-gray-100 p-4 items-center justify-center">
            <img
              src="/signup1.jpg"
              alt="Signup Illustration"
              className="object-cover rounded-lg w-full h-full max-h-[700px]"
              loading="lazy"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 px-4 sm:px-6 lg:px-10 py-6 overflow-y-auto max-h-screen">
            <div className="mb-6 text-center">
              <img src="/logo.png" alt="Logo" className="w-20 mx-auto mb-2" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create your account</h1>
              <p className="text-gray-500 text-sm">Start your journey with us</p>
            </div>

            {/* Account Type Switch */}
            <div className="flex justify-center gap-4 mb-6">
              {["Student", "Recruiter"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, accountType: type }))
                  }
                  className={`px-4 py-1 rounded-full border text-sm font-medium ${
                    formData.accountType === type
                      ? "bg-blue-600 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="flex flex-col sm:flex-row gap-3">
                <InputField
                  type="text"
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <InputField
                  type="text"
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <InputField
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Phone */}
              <div className="flex flex-col sm:flex-row gap-3">
                <select className="w-full sm:w-24 px-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+977">🇳🇵 +977</option>
                </select>
                <InputField
                  type="tel"
                  name="phone"
                  label="Phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1"
                />
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="flex gap-3 flex-wrap">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleGenderSelect(g)}
                      className={`px-4 py-1 rounded-full text-sm border transition ${
                        formData.gender === g
                          ? "bg-blue-600 text-white border-blue-600"
                          : "text-gray-600 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Fields */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-1/2">
                  <InputField
                    type={showPassword ? "text" : "password"}
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </span>
                </div>
                <div className="relative w-full sm:w-1/2">
                  <InputField
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <span
                    className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-2 mt-2 rounded-full text-white font-semibold transition ${
                  isFormValid
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Sign Up
              </button>

              {/* Redirect */}
              <p className="text-sm text-gray-500 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>

              {/* Divider */}
              <div className="w-full h-[1px] bg-gray-200 my-2" />

              {/* Social Signup */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 text-sm hover:bg-gray-50"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
