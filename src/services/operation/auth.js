import toast from 'react-hot-toast'
import { apiConnector } from '../apiConnector'
import { setLoading } from '../../slice/authSlice'
import { endpoints } from '../apis'
import { setToken } from '../../slice/authSlice'
const { SIGNUP_API,SENDOTP_API, LOGIN_API, LOGIN_fORGET_PASSWORD_API, LOGOUT_API, RESET_PASSWORD_API } = endpoints

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
            toast.error("Signup Failed")
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
    console.log("login api called........................", mobileOrEmail, password);
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        mobileOrEmail,
        password,
      });

      console.log("LOGIN WITH PASSWORD API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.accessToken)); 
      navigate("/dashboard");
      return response.data.success;
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error(error.message || "Login Failed");
      return false;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


export const logout = (navigate) => {
    return async (dispatch) => {
        const toastId = toast.loading("Logging out...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", LOGOUT_API, {});
            
            console.log("LOGOUT API RESPONSE............", response);
            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            
            toast.success("Logout Successful");
            
            // Clear user data from Redux store
            dispatch(setToken(null));
            
            // Redirect to login page
            navigate("/login");
            return true;
        }
        catch (error) {
            console.log("LOGOUT API ERROR............", error);
            toast.error(error.message || "Logout Failed");
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}


export const forgetPassword = (email ,navigate) => {
    return async (dispatch) => {
        const toastId = toast.loading("Sending OTP...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", LOGIN_fORGET_PASSWORD_API, { email });

            console.log("FORGET PASSWORD API RESPONSE............", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("OTP Sent Successfully");
            navigate("/reset-password");
            return response.data.success;
        } catch (error) {
            console.log("FORGET PASSWORD API ERROR............", error);
            toast.error(error.message || "Failed to send OTP");
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

export const resetPassword = (newPassword, confirmPassword, navigate) => {
    return async (dispatch) => {
        const toastId = toast.loading("Resetting Password...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", RESET_PASSWORD_API, { newPassword, confirmPassword });

            console.log("RESET PASSWORD API RESPONSE............", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Password Reset Successful");
            navigate("/login");
            return response.data.success;
        } catch (error) {
            console.log("RESET PASSWORD API ERROR............", error);
            toast.error(error.message || "Failed to reset password");
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
