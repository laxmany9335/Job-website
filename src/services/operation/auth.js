import toast from 'react-hot-toast'
import { apiConnector } from '../apiConnector'
import { setLoading, setToken } from "../../slice/authSlice";
import { endpoints } from '../apis'
import { Cookie } from 'lucide-react';

const { SIGNUP_API, SENDOTP_API, LOGIN_API, LOGOUT_API, RESETPASSTOKEN_API, RESETPASSWORD_API } = endpoints

export function signUp( 
    firstName,
    lastName,
    email,
    phone,
    gender,
    password,
    confirmPassword,
    otp,
    accountType,
    navigate
) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))

        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                firstName,
                lastName,
                email,
                phone,
                gender,
                password,
                confirmPassword,
                otp,
                accountType
            })

            console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login")
            return response.data.success
        } catch (error) {
            console.log("SIGNUP API ERROR............", error)
            toast.error(error.response.data.message)
            return false
        } finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }
    }
}

export function sendOtp(email, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true)) 
        const toastId = toast.loading("Loading...") 
        console.log("send otp api called........................")
        try {
            const response = await apiConnector("POST", SENDOTP_API, {
                email
            })
            console.log("SENDOTP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message) 
            }
            navigate("/verify-email")
            toast.success("OTP Sent Successfully") 
            return response.data.success 
        } catch (error) {
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP") 
            return false
        } finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId) 
        }
    }
}

export function login(mobileOrEmail, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Logging in...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                mobileOrEmail,
                password,
            });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Login Successful");
            
            // Store token in both Redux and localStorage
            const token = response.data.token;
            dispatch(setToken(token));
            localStorage.setItem("token", JSON.stringify(token));
            
            navigate("/dashboard/my-profile");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Login Failed");
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

export const logout = (token, navigate) => {
    return async (dispatch) => {
       
            toast.success("Logout Successful");

            // Clear user data from both Redux store and localStorage
            dispatch(setToken(null));
            localStorage.removeItem("token");
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // Redirect to login page
            navigate("/login");
    };
};

export function getPasswordResetToken(email, setEmailSent) {
    return async(dispatch) => {
        console.log(email, setEmailSent)
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {email})

            console.log("RESET PASSWORD TOKEN RESPONSE....", response);

            if(!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Reset Email Sent");
            setEmailSent(true);
        }
        catch(error) {
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Failed to send email for resetting password");
        }
        dispatch(setLoading(false));
    }
}

export function resetPassword(password, confirmPassword, token, navigate) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            console.log("token.......................", token)
            const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});

            console.log("RESET Password RESPONSE ... ", response);

            if(!response.data.success) {
                throw new Error(response.data.message);
            }
            navigate("/login");
            toast.success("Password has been reset successfully");
        }
        catch(error) {
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Unable to reset password");
        }
        dispatch(setLoading(false));
    }
}

// Helper function to load token from localStorage on app initialization
export function loadTokenFromStorage() {
    return (dispatch) => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const parsedToken = JSON.parse(token);
                dispatch(setToken(parsedToken));
            }
        } catch (error) {
            console.error("Error loading token from localStorage:", error);
            localStorage.removeItem("token"); // Remove corrupted token
        }
    };
}