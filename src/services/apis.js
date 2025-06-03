// const BASE_URL = "http://localhost:5000"
const BASE_URL = "https://job-website-wvwi.onrender.com";

//User api
export const endpoints = {
  SENDOTP_API: BASE_URL + "/users/sendotp",
  SIGNUP_API: BASE_URL + "/users/signup",
  LOGIN_API: BASE_URL + "/users/login",
  LOGOUT_API: BASE_URL + "/users/logout",
  RESETPASSTOKEN_API: BASE_URL + "/users/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/users/reset-password",

}