// const BASE_URL = "http://localhost:5000/api/v1"
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

export const profileEndpoints = {
  GET_PROFILE_API: BASE_URL + "/users/profile",
  UPDATE_PROFILE_API: BASE_URL + "/users/profile/update",
  UPLOAD_PROFILE_PIC_API: BASE_URL + "/users/profile/upload-profile-pic",
  DELETE_PROFILE_PIC_API: BASE_URL + "/users/profile/delete-profile-pic",

  // Education
  ADD_EDUCATION: BASE_URL + "/profile/add-education",
  GET_EDUCATION: BASE_URL + "/users/profile/education",
  UPDATE_EDUCATION: BASE_URL + "/users/profile/education/update",

}