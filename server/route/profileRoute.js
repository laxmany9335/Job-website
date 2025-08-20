import express from "express";
import {
    createProfile,
    updateProfile,
    getProfile,
    addExperience,
    updateExperience,
    getExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    getEducation,
    deleteEducation,
    addAchievements,
    updateAchievements,
    getAchievements,
    deleteAchievements,
    addCertification,
    updateCertification,
    deleteCertification,
    getCertification,
    addSkills,
    updateSkills,
    getSkills,
    deleteSkills,
    addSocialMedia,
    updateSocialMedia,
    getSocialMedia,
    deleteSocialMedia,
    addProject,
    getProject,
    updateProject,
    deleteProject
} from "../controller/ProfileController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

// Profile Routes
router.post("/add-profile", auth, createProfile);
router.put("/update-profile", auth, updateProfile);
router.get("/my-profile", auth, getProfile);

// Experience Routes
router.post("/add-experience", auth, addExperience);
router.patch("/experience/:id", auth,  updateExperience);
router.get("/get-experience", auth, getExperience);
router.delete("/experience/delete", auth, deleteExperience);

// Education Routes
router.post("/add-education", auth, addEducation);
router.patch("/education/:id", auth, updateEducation);
router.get("/education", auth, getEducation);
router.delete("/education/delete", auth, deleteEducation);

//Project Route
router.post("/add-project", auth, addProject);
router.get("/get-projects", auth, getProject);
router.patch("/project/:id", auth, updateProject);
router.delete("/project/delete", auth, deleteProject);

// Achievements Routes
router.post("/add-achievement", auth, addAchievements);
router.patch("/achievement/:id", auth, updateAchievements);
router.get("/get-achievements", auth, getAchievements);
router.delete("/achievement/delete", auth, deleteAchievements);

//Certification Routes
router.post("/add-certification", auth, addCertification);
router.delete("/certification/delete", auth,deleteCertification);
router.patch("/certification/:id", auth, updateCertification);
router.get("/get-certifications", auth, getCertification);

// Skills Routes
router.post("/skills", auth, addSkills);
router.put("/skills/:id", auth, updateSkills);
router.get("/skills", auth, getSkills);
router.delete("/skills/:id", auth, deleteSkills);

// Social Media Routes
router.post("/social", auth, addSocialMedia);
router.put("/social/:id", auth, updateSocialMedia);
router.get("/social", auth, getSocialMedia);
router.delete("/social/:id", auth, deleteSocialMedia);

export default router;
