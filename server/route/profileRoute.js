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
    addSkills,
    updateSkills,
    getSkills,
    deleteSkills,
    addSocialMedia,
    updateSocialMedia,
    getSocialMedia,
    deleteSocialMedia,
} from "../controller/ProfileController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

// Profile Routes
router.post("/profile", auth, createProfile);
router.put("/update-profile", auth, updateProfile);
router.get("/my-profile", auth, getProfile);

// Experience Routes
router.post("/experience", auth, addExperience);
router.put("/experience/:id", auth, updateExperience);
router.get("/experience", auth, getExperience);
router.delete("/experience/:id", auth, deleteExperience);

// Education Routes
router.post("/add-education", auth, addEducation);
router.put("/update-education/:id", auth, updateEducation);
router.get("/get-education", auth, getEducation);
router.delete("/delete-education/:id", auth, deleteEducation);

// Achievements Routes
router.post("/achievements", auth, addAchievements);
router.put("/achievements/:id", auth, updateAchievements);
router.get("/achievements", auth, getAchievements);
router.delete("/achievements/:id", auth, deleteAchievements);

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
