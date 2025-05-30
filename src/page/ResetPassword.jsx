import { useState } from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { RxCountdownTimer } from 'react-icons/rx';

import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/operation/auth';

function ResetPassword() {
    const loading = false;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    async function resetPasswordHandler(e) {
        e.preventDefault();
      try{
        const response = dispatch(resetPassword( passwords.newPassword, passwords.confirmPassword, navigate));
         console.log("Reset Password API Response:", response);
      }
      catch (error) {
        console.error("Error resetting password:", error);
      }
    }

    return (
        <div>
            <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-white" style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)" }}>
                {loading ? (
                    <div>
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="w-[30%] max-w-full h-[70vh]  bg-white rounded-[12px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] flex flex-col justify-center p-5">
                        <h1 className="text-gray-900 font-semibold text-2xl leading-[2.375rem]">
                            Reset Password <sup className="text-red-500">*</sup>
                        </h1>
                        <p className="text-md leading-[1.625rem] my-4 text-gray-400">
                            Enter your new password below. Make sure it is strong and secure.
                        </p>
                        <form onSubmit={resetPasswordHandler}>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                placeholder="New Password"
                                className="w-full bg-gray-800 text-white rounded-[8px] mt-6 py-[12px] px-[12px] border border-richblack-700 focus:outline-none focus:border-yellow-50"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="w-full bg-gray-800 text-white rounded-[8px] mt-4 py-[12px] px-[12px] border border-richblack-700 focus:outline-none focus:border-yellow-50"
                            />
                            <button
                                type="submit"
                                className="w-full bg-yellow-500 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-gray-900 cursor-pointer"
                            >
                                Reset Password
                            </button>
                        </form>

                        <div className="mt-6 flex items-center justify-between">
                            <Link to="/login">
                                <p className="text-richblack-5 flex items-center gap-x-2">
                                    <BiArrowBack /> Back To login
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
        </div>
    )
}

export default ResetPassword