import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operation/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Loading Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-xl font-medium gray-900 animate-pulse">
            Sending reset email...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-gray-800 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {emailSent ? "Check Your Email" : "Reset Password"}
              </h1>
              <p className="text-gray-300 leading-relaxed">
                {emailSent
                  ? `We've sent password reset instructions to your email address.`
                  : `No worries! Enter your email address and we'll send you instructions to reset your password.`}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!emailSent && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Email Address <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full h-12 px-4 pr-10 bg-white/10 border border-white/20 rounded-lg 
                        text-white placeholder-gray-400 backdrop-blur-sm
                        focus:outline-none focus:ring-2 focus:ring-purple-500
                        transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {emailSent && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-300 text-sm">
                      Reset email sent to <span className="font-medium">{email}</span>
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 
                  hover:from-purple-700 hover:to-pink-700 
                  text-white font-semibold rounded-lg
                  transform transition-all duration-200 
                  hover:scale-[1.02] hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emailSent ? "Resend Email" : "Send Reset Link"}
              </button>
            </form>

            {/* Navigation */}
            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                <BiArrowBack className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="font-medium">Back to Login</span>
              </Link>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
