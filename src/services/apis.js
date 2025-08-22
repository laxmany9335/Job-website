// ===================== AUTH & USER ENDPOINTS ===================
// const BASE_URL = "http://localhost:5000/api/v1"
const BASE_URL = "https://job-website-wvwi.onrender.com/api/v1";

export const endpoints = {
  SENDOTP_API: `${BASE_URL}/users/sendotp`,
  SIGNUP_API: `${BASE_URL}/users/signup`,
  LOGIN_API: `${BASE_URL}/users/login`,
  LOGOUT_API: `${BASE_URL}/users/logout`,
  RESETPASSTOKEN_API: `${BASE_URL}/users/reset-password-token`,
  RESETPASSWORD_API: `${BASE_URL}/users/reset-password`,
};

// ===================== PROFILE ENDPOINTS =====================
export const profileEndpoints = {
  // Profile Info
  GET_PROFILE_API: `${BASE_URL}/profile`,
  UPDATE_PROFILE_API: `${BASE_URL}/profile/update`,
  UPLOAD_PROFILE_PIC_API: `${BASE_URL}/profile/upload-profile-pic`,
  DELETE_PROFILE_PIC_API: `${BASE_URL}/profile/delete-profile-pic`,

  // Education
  ADD_EDUCATION: `${BASE_URL}/profile/add-education`,
  GET_EDUCATION: `${BASE_URL}/profile/education`,
  UPDATE_EDUCATION: `${BASE_URL}/profile/education`,
  DELETE_EDUCATION: `${BASE_URL}/profile/education/delete`,

  // Skills
  UPDATE_SKILLS: `${BASE_URL}/profile/update-skills`,

  // Social Media
  UPDATE_SOCIAL_MEDIA: `${BASE_URL}/profile/update-social-media`,

  // Experience
  ADD_EXPERIENCE: `${BASE_URL}/profile/add-experience`,
  GET_EXPERIENCE: `${BASE_URL}/profile/get-experience`,
  UPDATE_EXPERIENCE: `${BASE_URL}/profile/experience`,
  DELETE_EXPERIENCE: `${BASE_URL}/profile/experience/delete`,

  // Projects
  ADD_PROJECT: `${BASE_URL}/profile/add-project`,
  GET_PROJECTS: `${BASE_URL}/profile/get-projects`,
  UPDATE_PROJECT: `${BASE_URL}/profile/project`,
  DELETE_PROJECT: `${BASE_URL}/profile/project/delete`,

  // Achievements
  ADD_ACHIEVEMENT: `${BASE_URL}/profile/add-achievement`,
  GET_ACHIEVEMENT: `${BASE_URL}/profile/get-achievements`,
  UPDATE_ACHIEVEMENT: `${BASE_URL}/profile/achievement`,
  DELETE_ACHIEVEMENT: `${BASE_URL}/profile/achievement/delete`,

  //CERTIFICATION
  ADD_CERTIFICATION: `${BASE_URL}/profile/add-certification`,
  DELETE_CERTIFICATION: `${BASE_URL}/profile/certification/delete`,
  UPDATE_CERTIFICATION: `${BASE_URL}/profile/certification`,
  GET_CERTIFICATION: `${BASE_URL}/profile/get-certifications`
};