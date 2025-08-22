import User from '../model/userModel.js';
import Profile from '../model/CreateProfileModel.js';
import JobExperience from '../model/ExperienceModel.js';
import Education from '../model/EducationModel.js';
import Project from "../model/ProjectModel.js";
import mongoose from 'mongoose';
import Achievement from '../model/AchievementModel.js';
import Certification from '../model/CertificationModel.js';

// Helper function for error handling
const handleError = (res, error, message = "Internal Server Error") => {
  console.error(message, error);
  return res.status(500).json({
    success: false,
    message,
  });
};

// Helper function for user array operations
const updateUserArray = async (userId, arrayName, operation, data) => {
  const user = await findUserById(userId);

  switch (operation) {
    case 'add':
      if (!user[arrayName]) user[arrayName] = [];
      user[arrayName].push(data);
      break;
    case 'update':
      const index = user[arrayName].findIndex(item => item._id.toString() === data.id);
      if (index === -1) throw new Error(`${arrayName.slice(0, -1)} not found`);
      user[arrayName][index] = { ...user[arrayName][index], ...data.updateData };
      break;
    case 'delete':
      user[arrayName] = user[arrayName].filter(item => item._id.toString() !== data.id);
      break;
  }

  await user.save();
  return user[arrayName];
};

// Helper function to find user
const findUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Create Profile
const createProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("User ID:", userId);
    const { title, location, portfolio, bio } = req.body;

    if (!title || !location || !portfolio || !bio) {
      return res.status(400).json({
        success: false,
        message: "Please fill all details",
      });
    }

    const existUser = await findUserById(userId);

    const alreadyProfile = await Profile.findOne({ user: userId });
    if (alreadyProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile = await Profile.create({
      user: userId,
      title,
      location,
      portfolio,
      bio,
    });

    existUser.profile = profile._id;
    await existUser.save();

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Create Profile Error");
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, mobileNumber, title, location, portfolio, bio } = req.body;

    if (!firstName || !lastName || !mobileNumber || !title || !location || !portfolio || !bio) {
      return res.status(400).json({
        success: false,
        message: "Please fill all details",
      });
    }

    const existUser = await findUserById(userId);

    await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNumber },
      { new: true, runValidators: true }
    );

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { title, location, portfolio, bio },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Update Profile Error");
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    const profile = await Profile.findOne({ user: userId }).populate('user');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });

  } catch (error) {
    return handleError(res, error, "Get Profile Error");
  }
};

// Add Experience
const addExperience = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      position,
      companyName,
      location,
      employmentType,
      startDate,
      endDate,
      currentlyWorking,
      jobDescription,
      keyResponsibilities,
      keyAchievements,
      skillsUsed
    } = req.body;

    if (!position || !companyName || !location || !employmentType || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }
    console.log(position, companyName, location, employmentType, startDate, endDate, currentlyWorking, jobDescription, keyResponsibilities, keyAchievements, skillsUsed);
    const existUser = await findUserById(userId);

    const experience = await JobExperience.create({
      user: userId,
      position,
      companyName,
      location,
      employmentType,
      startDate,
      endDate: endDate || null,
      currentlyWorking,
      jobDescription: jobDescription || "",
      keyResponsibilities: keyResponsibilities || [],
      keyAchievements: keyAchievements || [],
      skillsUsed: skillsUsed || [],
    });

    if (!existUser.JobExperience) existUser.JobExperience = [];
    existUser.JobExperience.push(experience._id);
    await existUser.save();

    return res.status(201).json({
      success: true,
      message: "Experience added successfully",
      experience,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Add Experience Error");
  }
};

const updateExperience = async (req, res) => {
  try {
    const userId = req.user?.id;
    const experienceId = req.params.id;
    const {
      position,
      companyName,
      location,
      employmentType,
      startDate,
      endDate,
      currentlyWorking,
      jobDescription,
      keyResponsibilities,
      keyAchievements,
      skillsUsed
    } = req.body;

    console.log("Updating experience for:", experienceId);
    console.log("Experience data received:", req.body);

    // Validate experienceId
    if (!experienceId || !mongoose.Types.ObjectId.isValid(experienceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing experienceId",
      });
    }

    // Ensure user exists
    await findUserById(userId);

    // Update experience
    const experience = await JobExperience.findByIdAndUpdate(
      experienceId,
      {
        position,
        companyName,
        location,
        employmentType,
        startDate,
        endDate: endDate || null,
        currentlyWorking: currentlyWorking || false,
        jobDescription: jobDescription || "",
        keyResponsibilities: keyResponsibilities || [],
        keyAchievements: keyAchievements || [],
        skillsUsed: skillsUsed || [],
      },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });

  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return handleError(res, error, "Update Experience Error");
  }
};

const addProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      startDate,
      endDate,
      status,
      liveUrl,
      githubUrl,
      role,
      currentlyWorking
    } = req.body;

    const userId = req.user.id;

    console.log("Project data:", title, description, technologies, startDate, endDate, status, liveUrl);

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Project title and description are required"
      });
    }

    // Create new project
    const newProject = new Project({
      user: userId,
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      role: role || '',
      startDate: startDate ? new Date(startDate) : null,
      endDate: currentlyWorking ? null : (endDate ? new Date(endDate) : null),
      status: currentlyWorking ? 'In Progress' : (status || 'In Progress'),
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      currentlyWorking: currentlyWorking || false
    });

    const savedProject = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project added successfully",
      data: savedProject
    });

  } catch (error) {
    console.error("Add project error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const getProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ user: userId })
      .sort({ createdAt: -1 }); // Sort by newest first
    console.log(projects)

    return res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: {
        projects: projects
      }
    });

  } catch (error) {
    console.error("Get projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const {
      title,
      description,
      technologies,
      startDate,
      endDate,
      status,
      liveUrl,
      githubUrl,
      role,
      currentlyWorking
    } = req.body;
    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Project title and description are required"
      });
    }

    // Find and update project
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, user: userId },
      {
        title,
        description,
        technologies: Array.isArray(technologies) ? technologies : [],
        role: role || '',
        startDate: startDate ? new Date(startDate) : null,
        endDate: currentlyWorking ? null : (endDate ? new Date(endDate) : null),
        status: currentlyWorking ? 'In Progress' : (status || 'In Progress'),
        liveUrl: liveUrl || '',
        githubUrl: githubUrl || '',
        currentlyWorking: currentlyWorking || false
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject
    });

  } catch (error) {
    console.error("Update project error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user.id;
    const deletedProject = await Project.findOneAndDelete({
      _id: projectId,
      user: userId
    });

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// Get Experience
const getExperience = async (req, res) => {
  try {
    const userId = req.user?.id;

    const experiences = await JobExperience.find({ user: userId });

    return res.status(200).json({
      success: true,
      experiences: experiences || [],
    });

  } catch (error) {
    return handleError(res, error, "Get Experience Error");
  }
};

// Delete Experience
const deleteExperience = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { experienceId } = req.body;

    if (!experienceId) {
      return res.status(400).json({
        success: false,
        message: "Experience ID is required",
      });
    }

    const existUser = await findUserById(userId);
    const experience = await JobExperience.findByIdAndDelete(experienceId);
    console.log(existUser, "existUser in deleteExperience function", experience, "experience in deleteExperience function");

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience record not found",
      });
    }

    existUser.JobExperience = existUser.JobExperience.filter(id => id.toString() !== experienceId);
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Delete Experience Error");
  }
};

// Add Education
const addEducation = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { degree, studyField, instituteName, location, startYear, endYear, currentlyStudying, grade, description } = req.body;
    console.log(degree, studyField, instituteName, location, startYear, endYear, grade, description);

    if (!degree || !studyField || !instituteName || !location || !startYear || (!endYear && !currentlyStudying)) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existUser = await findUserById(userId);

    const education = await Education.create({
      user: userId,
      degree,
      studyField,
      instituteName,
      location,
      startYear,
      endDate: endYear || null,
      currentlyStudying,
      grade: grade || "",
      description: description || "",
    });

    if (!existUser.education) existUser.education = [];
    existUser.education.push(education._id);
    await existUser.save();

    return res.status(201).json({
      success: true,
      message: "Education added successfully",
      education,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Add Education Error");
  }
};

// Update Education
const updateEducation = async (req, res) => {
  try {
    const userId = req.user?.id;
    const educationId = req.params.id; // ✅ Get from URL params, not body
    const {
      degree,
      studyField,
      instituteName,
      location,
      startYear,
      endYear,
      currentlyStudying, // ✅ Added this field
      grade,
      description
    } = req.body;

    console.log("Updating education for:", educationId);
    console.log("Education data received:", req.body);

    // Validate educationId
    if (!educationId || !mongoose.Types.ObjectId.isValid(educationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing educationId",
      });
    }

    // Validate required fields - only degree, instituteName, and startYear are required
    if (!degree || !instituteName || !startYear) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields: degree, institute name, and start year",
      });
    }

    // Validate years
    const currentYear = new Date().getFullYear();
    if (parseInt(startYear) > currentYear) {
      return res.status(400).json({
        success: false,
        message: "Start year cannot be in the future",
      });
    }

    if (endYear && !currentlyStudying && parseInt(endYear) < parseInt(startYear)) {
      return res.status(400).json({
        success: false,
        message: "End year cannot be before start year",
      });
    }

    // Ensure user exists
    await findUserById(userId);

    // Update education
    const education = await Education.findByIdAndUpdate(
      educationId,
      {
        degree,
        studyField: studyField || "",
        instituteName,
        location: location || "",
        startYear,
        endYear: currentlyStudying ? null : endYear, // ✅ Set to null if currently studying
        currentlyStudying: currentlyStudying || false, // ✅ Added this field
        grade: grade || "",
        description: description || "",
      },
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      education,
    });

  } catch (error) {
    console.error("Update Education Error:", error);

    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      });
    }

    return handleError(res, error, "Update Education Error");
  }
};

// Get Education
const getEducation = async (req, res) => {
  try {
    const userId = req.user?.id;

    const education = await Education.find({ user: userId });

    return res.status(200).json({
      success: true,
      education: education || [],
    });

  } catch (error) {
    return handleError(res, error, "Get Education Error");
  }
};

// Delete Education
const deleteEducation = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { educationId } = req.body;

    if (!educationId) {
      return res.status(400).json({
        success: false,
        message: "Education ID is required",
      });
    }

    const existUser = await findUserById(userId);

    const education = await Education.findByIdAndDelete(educationId);
    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    existUser.education = existUser.education.filter(id => id.toString() !== educationId);
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Delete Education Error");
  }
};

// Add Achievements
const addAchievements = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      title,
      organization,
      category,
      date,
      description,
      impact,
      skills = [],
      certificateUrl
    } = req.body;

    // Required fields check
    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: "Please fill required fields",
      });
    }

    // Find user
    const existUser = await findUserById(userId);
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create achievement
    const achievement = await Achievement.create({
      user: userId,
      title,
      organization,
      category,
      date,
      description,
      impact,
      skills,
      certificateUrl
    });

    // Push to user's achievement list
    if (!existUser.achievement) existUser.achievement = [];
    existUser.achievement.push(achievement._id);
    await existUser.save();

    return res.status(201).json({
      success: true,
      message: "Achievement added successfully",
      achievement, 
    });

  } catch (error) {
    return handleError(res, error, "Add Achievement Error");
  }
};

// Update Achievements

const updateAchievements = async (req, res) => {
  try {
    const userId = req.user?.id;
    const achievementsId = req.params.id;

    if (!achievementsId) {
      return res.status(400).json({
        success: false,
        message: "Achievement ID is required",
      });
    }

    // Find the achievement to verify ownership
    const achievement = await Achievement.findById(achievementsId);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    if (achievement.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this achievement",
      });
    }

    // Extract fields (allow partial update)
    const {
      title,
      organization,
      category,
      date,
      description,
      impact,
      skills,
      certificateUrl
    } = req.body;

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      achievementsId,
      {
        ...(title && { title }),
        ...(organization && { organization }),
        ...(category && { category }),
        ...(date && { date }),
        ...(description && { description }),
        ...(impact && { impact }),
        ...(skills && { skills }),
        ...(certificateUrl && { certificateUrl }),
      },
      { new: true } // ✅ return updated document
    );

    return res.status(200).json({
      success: true,
      message: "Achievement updated successfully",
      achievement: updatedAchievement,
    });

  } catch (error) {
    return handleError(res, error, "Update Achievement Error");
  }
};

// Get Achievements
const getAchievements = async (req, res) => {
  try {
    const userId = req.user?.id;
    const achievment = await Achievement.find({ user: userId });
    return res.status(200).json({
      success: true,
      achievements: achievment,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Get Achievements Error");
  }
};

// Delete Achievements
const deleteAchievements = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { achievementId } = req.body;
    if (!achievementId) {
      return res.status(400).json({
        success: false,
        message: "Achievement ID is required",
      });
    }

    const achievements = await updateUserArray(userId, 'achievements', 'delete', { id: achievementId });

    return res.status(200).json({
      success: true,
      message: "Achievement deleted successfully",
      achievements,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Delete Achievement Error");
  }
};

//add Certification 
const addCertification = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      name,
      instituteName,
      credentialId,
      issueDate,
      expiryDate,
      neverExpires,
      credentialUrl,
      description,
      skills,
      level
    } = req.body;

    console.log("Certification data:", name, instituteName, credentialId, issueDate, expiryDate, neverExpires, credentialUrl, description, skills, level);

    // Required fields validation
    if (!name || !instituteName || !issueDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields: name, institute name, and issue date",
      });
    }

    // Find user
    const existUser = await findUserById(userId);

    // Create certification
    const certification = await Certification.create({
      user: userId,
      name,
      instituteName,
      credentialId: credentialId || "",
      issueDate,
      expiryDate: neverExpires ? null : expiryDate,
      neverExpires: neverExpires || false,
      credentialUrl: credentialUrl || "",
      description: description || "",
      skills: Array.isArray(skills) ? skills : [],
      level: level || ""
    });

    // Push to user's certification list
    if (!existUser.certification) existUser.certification = [];
    existUser.certification.push(certification._id);
    await existUser.save();

    return res.status(201).json({
      success: true,
      message: "Certification added successfully",
      certification,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Add Certification Error");
  }
};

// Update Certification
const updateCertification = async (req, res) => {
  try {
    const userId = req.user?.id;
    const certificationId = req.params.id;
    const {
      name,
      instituteName,
      credentialId,
      issueDate,
      expiryDate,
      neverExpires,
      credentialUrl,
      description,
      skills,
      level
    } = req.body;

    console.log("Updating certification for:", certificationId);
    console.log("Certification data received:", req.body);

    // Validate certificationId
    if (!certificationId || !mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing certificationId",
      });
    }

    // Validate required fields
    if (!name || !instituteName || !issueDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields: name, institute name, and issue date",
      });
    }

    // Ensure user exists
    await findUserById(userId);

    // Update certification
    const certification = await Certification.findByIdAndUpdate(
      certificationId,
      {
        name,
        instituteName,
        credentialId: credentialId || "",
        issueDate,
        expiryDate: neverExpires ? null : expiryDate,
        neverExpires: neverExpires || false,
        credentialUrl: credentialUrl || "",
        description: description || "",
        skills: Array.isArray(skills) ? skills : [],
        level: level || ""
      },
      { new: true, runValidators: true }
    );

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certification updated successfully",
      certification,
    });

  } catch (error) {
    console.error("Update Certification Error:", error);

    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      });
    }

    return handleError(res, error, "Update Certification Error");
  }
};

// Get Certifications
const getCertification = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("first")
    const certifications = await Certification.find({ user: userId })
      .sort({ createdAt: -1 }); // Sort by newest first

    return res.status(200).json({
      success: true,
      certification: certifications || [],
    });

  } catch (error) {
    return handleError(res, error, "Get Certification Error");
  }
};

// Delete Certification
const deleteCertification = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { certificationId } = req.body;
    if (!certificationId) {
      return res.status(400).json({
        success: false,
        message: "Certification ID is required",
      });
    }

    // Validate certificationId
    if (!mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certification ID",
      });
    }

    const existUser = await findUserById(userId);
    const certifications = await Certification.findByIdAndDelete(certificationId);
    // Remove from user's certification array
     existUser.certifications = existUser.certifications.filter(id => id.toString() !== certificationId);
     await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Certification deleted successfully",
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Delete Certification Error");
  }
};

// Add Skills
const addSkills = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { skillName, proficiency } = req.body;

    if (!skillName || !proficiency) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existUser = await findUserById(userId);

    if (!existUser.skillSet) existUser.skillSet = [];
    existUser.skillSet.push({ skillName, proficiency });
    await existUser.save();

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      skills: existUser.skillSet,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Add Skill Error");
  }
};

// Update Skills
const updateSkills = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { skillId, skillName, proficiency } = req.body;

    if (!skillId || !skillName || !proficiency) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existUser = await findUserById(userId);

    const skillIndex = existUser.skillSet.findIndex(s => s._id.toString() === skillId);
    if (skillIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    existUser.skillSet[skillIndex] = { ...existUser.skillSet[skillIndex], skillName, proficiency };
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skills: existUser.skillSet,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Update Skill Error");
  }
};

// Get Skills
const getSkills = async (req, res) => {
  try {
    const userId = req.user?.id;

    const existUser = await findUserById(userId);

    return res.status(200).json({
      success: true,
      skills: existUser.skillSet || [],
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Get Skills Error");
  }
};

// Delete Skills
const deleteSkills = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { skillId } = req.body;

    if (!skillId) {
      return res.status(400).json({
        success: false,
        message: "Skill ID is required",
      });
    }

    const existUser = await findUserById(userId);

    existUser.skillSet = existUser.skillSet.filter(s => s._id.toString() !== skillId);
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
      skills: existUser.skillSet,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Delete Skill Error");
  }
};

// Add Social Media
const addSocialMedia = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { platform, link } = req.body;

    if (!platform || !link) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existUser = await findUserById(userId);

    if (!existUser.socialMedia) existUser.socialMedia = [];
    existUser.socialMedia.push({ platform, link });
    await existUser.save();

    return res.status(201).json({
      success: true,
      message: "Social media link added successfully",
      socialMedia: existUser.socialMedia,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Add Social Media Error");
  }
};

// Update Social Media
const updateSocialMedia = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { socialMediaId, platform, link } = req.body;

    if (!socialMediaId || !platform || !link) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existUser = await findUserById(userId);

    const socialMediaIndex = existUser.socialMedia.findIndex(s => s._id.toString() === socialMediaId);
    if (socialMediaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Social media link not found",
      });
    }

    existUser.socialMedia[socialMediaIndex] = { ...existUser.socialMedia[socialMediaIndex], platform, link };
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Social media link updated successfully",
      socialMedia: existUser.socialMedia,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Update Social Media Error");
  }
};

// Get Social Media
const getSocialMedia = async (req, res) => {
  try {
    const userId = req.user?.id;

    const existUser = await findUserById(userId);

    return res.status(200).json({
      success: true,
      socialMedia: existUser.socialMedia || [],
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Get Social Media Error");
  }
};

// Delete Social Media
const deleteSocialMedia = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { socialMediaId } = req.body;

    if (!socialMediaId) {
      return res.status(400).json({
        success: false,
        message: "Social media ID is required",
      });
    }

    const existUser = await findUserById(userId);

    existUser.socialMedia = existUser.socialMedia.filter(s => s._id.toString() !== socialMediaId);
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Social media link deleted successfully",
      socialMedia: existUser.socialMedia,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Delete Social Media Error");
  }
};

export {
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
  deleteProject,
};