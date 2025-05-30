import { useState } from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { RxCountdownTimer } from 'react-icons/rx';
import OtpInput from 'react-otp-input'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../services/operation/auth';

function VerifyEmail() {
  const { signupData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const loading = false;

  async function handleVerifyAndSignup(e) {
    e.preventDefault();

    // Create data object with otp from state, not from signupData
    const data = {
      ...signupData,
      otp: otp,  // use otp from state
    };

    try {
      const response = await dispatch(signUp(
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.gender,
        data.password,
        data.confirmPassword,
        data.otp, 
        data.accountType,
        navigate
      ));

      console.log("Verification successful");
      console.log("........response", response);
    } catch (err) {
      console.error("Error during verification:", err);
    }
  }

  return (
    <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-white" style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)" }}>
      {loading ? (
        <div>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="w-[30%] max-w-full h-[50vh] bg-white rounded-[12px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] flex flex-col justify-center p-5">
          <h1 className="text-gray-900 font-semibold text-2xl leading-[2.375rem]">
            Verify Email <sup className="text-red-500">*</sup>
          </h1>
          <p className="text-md leading-[1.625rem] my-4 text-gray-400">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="md:w-[48px] lg:w-[50px] border-0 bg-gray-500 rounded-[0.5rem] text-white aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 4px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-gray-900 cursor-pointer"
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/signup">
              <p className="text-richblack-5 flex items-center gap-x-2">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            <button
              className="flex items-center text-blue-500 gap-x-2 cursor-pointer"
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
