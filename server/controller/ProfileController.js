import User from '../model/userModel.js';
import Profile from '../model/CreateProfileModel.js';
import Experience from '../model/ExperienceModel.js';
import Education from '../model/EducationModel.js';

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
      user[arrayName][index] = data.updateData;
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

    const experience = await Experience.create({
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

    if (!existUser.experience) existUser.experience = [];
    existUser.experience.push(experience._id);
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

// Update Experience
const updateExperience = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { 
      experienceId, 
      position, 
      company, 
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

    if (!experienceId || !position || !company || !location || !employmentType || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    await findUserById(userId);

    const experience = await Experience.findByIdAndUpdate(
      experienceId,
      {
        position,
        companyName: company,
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
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Update Experience Error");
  }
};

// Get Experience
const getExperience = async (req, res) => {
  try {
    const userId = req.user?.id;

    const experiences = await Experience.find({ user: userId });

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

    const experience = await Experience.findByIdAndDelete(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience record not found",
      });
    }

    existUser.experience = existUser.experience.filter(id => id.toString() !== experienceId);
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
    const { degree, studyField, instituteName, location, startYear, endYear, grade, description } = req.body;
    console.log(degree, studyField, instituteName, location, startYear, endYear, grade, description);

    if (!degree || !studyField || !instituteName || !location || !startYear || !endYear) {
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
      endYear,
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
    const { educationId, degree, studyField, instituteName, location, startYear, endYear, grade, description } = req.body;

    if (!educationId || !degree || !studyField || !instituteName || !location || !startYear || !endYear) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    await findUserById(userId);

    const education = await Education.findByIdAndUpdate(
      educationId,
      {
        degree,
        studyField,
        instituteName,
        location,
        startYear,
        endYear,
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
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Update Education Error");
  }
};

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
}

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

const addAchievements = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const achievements = await updateUserArray(userId, 'achievements', 'add', { title, description });

    return res.status(201).json({
      success: true,
      message: "Achievement added successfully",
      achievements,
    });

  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Add Achievement Error");
  }
};

const updateAchievements = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { achievementId, title, description } = req.body;

    if (!achievementId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const achievements = await updateUserArray(userId, 'achievements', 'update', {
      id: achievementId,
      updateData: { title, description }
    });

    return res.status(200).json({
      success: true,
      message: "Achievement updated successfully",
      achievements,
    });

  } catch (error) {
    if (error.message === 'User not found' || error.message === 'achievement not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    return handleError(res, error, "Update Achievement Error");
  }
};

const getAchievements = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await findUserById(userId);

    return res.status(200).json({
      success: true,
      achievements: user.achievements || [],
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

const addSkills = async (req, res) => {
  try {
    const user = req.user?.id;
    const { skillName, proficiency } = req.body;

    if (!skillName || !proficiency) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    existUser.skillSet.push({ skillName, proficiency });
    await existUser.save();

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      skills: existUser.skillSet,
    });

  } catch (error) {
    console.error("Add Skill Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const updateSkills = async (req, res) => {
  try {
    const user = req.user?.id;
    const { skillId, skillName, proficiency } = req.body;

    if (!skillId || !skillName || !proficiency) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const skillIndex = existUser.skillSet.findIndex(s => s._id.toString() === skillId);
    if (skillIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    existUser.skillSet[skillIndex] = { skillName, proficiency };
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skills: existUser.skillSet,
    });

  } catch (error) {
    console.error("Update Skill Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getSkills = async (req, res) => {
  try {
    const user = req.user?.id;

    const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      skills: existUser.skillSet,
    });

  } catch (error) {
    console.error("Get Skills Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteSkills = async (req, res) => {
  try {
    const user = req.user?.id;
    const { skillId } = req.body;

    if (!skillId) {
      return res.status(400).json({
        success: false,
        message: "Skill ID is required",
      });
    }

    const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    existUser.skillSet = existUser.skillSet.filter(s => s._id.toString() !== skillId);
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
      skills: existUser.skillSet,
    });

  } catch (error) {
    console.error("Delete Skill Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const addSocialMedia = async (req, res) => {
  try {
    const user = req.user?.id;
    const { platform, link } = req.body;

    if (!platform || !link) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    existUser.socialMedia.push({ platform, link });
    await existUser.save();

    return res.status(201).json({
      success: true,
      message: "Social media link added successfully",
      socialMedia: existUser.socialMedia,
    });

  } catch (error) {
    console.error("Add Social Media Error:", error);
  }
}

const updateSocialMedia = async (req, res) => {
  try {
    const user = req.user?.id;
    const { socialMediaId, platform, link } = req.body;

    if (!socialMediaId || !platform || !link) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const socialMediaIndex = existUser.socialMedia.findIndex(s => s._id.toString() === socialMediaId);
    if (socialMediaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Social media link not found",
      });
    }

    existUser.socialMedia[socialMediaIndex] = { platform, link };
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Social media link updated successfully",
      socialMedia: existUser.socialMedia,
    });

  } catch (error) {
    console.error("Update Social Media Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const getSocialMedia = async (req, res) => {
  try {
    const user = req.user?.id;

    const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      socialMedia: existUser.socialMedia,
    });

  } catch (error) {
    console.error("Get Social Media Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteSocialMedia = async (req, res) => {
  try {
    const user = req.user?.id;
    const { socialMediaId } = req.body;

    if (!socialMediaId) {
      return res.status(400).json({
        success: false,
        message: "Social media ID is required",
      });
    }

    const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    existUser.socialMedia = existUser.socialMedia.filter(s => s._id.toString() !== socialMediaId);
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Social media link deleted successfully",
      socialMedia: existUser.socialMedia,
    });

  } catch (error) {
    console.error("Delete Social Media Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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
  addSkills,
  updateSkills,
  getSkills,
  deleteSkills,
  addSocialMedia,
  updateSocialMedia,
  getSocialMedia,
  deleteSocialMedia,
  // Add other exports as needed
};