import { useState, useEffect } from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { RxCountdownTimer } from 'react-icons/rx';
import OtpInput from 'react-otp-input'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, sendOtp } from '../services/operation/auth';
import { toast } from 'react-hot-toast';

function VerifyEmail() {
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect to signup if no signup data
  useEffect(() => {
    if (!signupData || !signupData.email) {
      navigate('/signup');
    }
  }, [signupData, navigate]);

  // Timer countdown for resend
  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const validateOtp = () => {
    const newErrors = {};

    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (otp.length !== 6) {
      newErrors.otp = 'Please enter complete 6-digit OTP';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP should contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleVerifyAndSignup(e) {
    e.preventDefault();

    if (!validateOtp()) {
      return;
    }

    if (!signupData) {
      toast.error('Signup data not found. Please start over.');
      navigate('/signup');
      return;
    }

    try {
      const response = await dispatch(signUp(
        signupData.firstName,
        signupData.lastName,
        signupData.email,
        signupData.phone,
        signupData.gender,
        signupData.password,
        signupData.confirmPassword,
        otp,
        signupData.accountType,
        navigate
      ));

      if (response?.success) {
        toast.success('Account created successfully!');
      }
    } catch (err) {
      console.error("Error during verification:", err);
      toast.error('Verification failed. Please try again.');
    }
  }

  async function handleResendOtp() {
    if (!canResend || !signupData?.email) return;

    setResendLoading(true);
    try {
      await dispatch(sendOtp(signupData.email, navigate));
      toast.success('OTP sent successfully!');
      setTimer(60);
      setCanResend(false);
      setOtp(""); // Clear current OTP
      setErrors({}); // Clear errors
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', error);
    } finally {
      setResendLoading(false);
    }
  }

  const handleOtpChange = (value) => {
    setOtp(value);
    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors({});
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!signupData) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-8">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verify Email
            </h1>
            <p className="text-gray-600 text-sm">
              A verification code has been sent to
            </p>
            <p className="text-blue-600 font-medium text-sm">
              {signupData?.email}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Enter the 6-digit code below
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerifyAndSignup} className="space-y-6">
            <div>
              <OtpInput
                value={otp}
                onChange={handleOtpChange}
                numInputs={6}
                separator={<span className="mx-1"></span>}
                isInputNum={true}
                shouldAutoFocus={true}
                renderInput={(props, index) => (
                  <input
                    {...props}
                    placeholder="-"
                    style={{
                      boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-[50px] border-0 bg-gray-500 rounded-[0.5rem] text-white aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                  />
                )}
                containerStyle={{
                  justifyContent: "space-between",
                  gap: "0 4px",
                }}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.otp}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Footer Actions */}
          <div className="mt-8 space-y-4">
            {/* Resend OTP */}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RxCountdownTimer className="text-base" />
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                  <RxCountdownTimer className="text-base" />
                  Resend code in {formatTime(timer)}
                </p>
              )}
            </div>

            {/* Back to Signup */}
            <div className="text-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
              >
                <BiArrowBack className="text-base" />
                Back to Signup
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Didn't receive the code? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;