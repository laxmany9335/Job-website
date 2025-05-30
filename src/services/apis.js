const BASE_URL = "http://localhost:5000"
// const BASE_URL = "https://www.sandyandco.com/api";

//User api
export const endpoints = {
  SENDOTP_API: BASE_URL + "/users/sendotp",
  SIGNUP_API: BASE_URL + "/users/signup",
  LOGIN_API: BASE_URL + "/users/login",
  LOGIN_fORGET_PASSWORD_API: BASE_URL + "/users/forget-password",
  RESET_PASSWORD_API: BASE_URL + "/users/reset-password",
  LOGOUT_API: BASE_URL + "/users/logout",
}