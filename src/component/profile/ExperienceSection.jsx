import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase, Calendar, MapPin, Building, Award, Users } from 'lucide-react';
import { addExperience } from '../../services/operation/profile/addExperience';
import { getExperience } from '../../services/operation/profile/getExperience';
import { updateExperience } from '../../services/operation/profile/updateExperience';
import { deleteExperience } from '../../services/operation/profile/deleteExperience';
import { useDispatch, useSelector } from 'react-redux';

const ExperienceSection = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [experienceList, setExperienceList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    employmentType: 'Full-time',
    startDate: '',
    endDate: '',
    currentJob: false,
    description: '',
    responsibilities: '',
    achievements: '',
    skills: ''
  });

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

  const resetForm = useCallback(() => {
    setFormData({
      position: '',
      company: '',
      location: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: '',
      currentJob: false,
      description: '',
      responsibilities: '',
      achievements: '',
      skills: ''
    });
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'currentJob' && checked && { endDate: '' }) // Clear end date if current job is checked
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.position || !formData.company || !formData.startDate) {
      alert('Please fill in required fields: position, company name, and start date');
      return;
    }

    setSubmitLoading(true);
    const experienceData = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').filter(item => item.trim()),
      achievements: formData.achievements.split('\n').filter(item => item.trim()),
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
    };

    try {
      if (editingId) {
        // Update existing experience
        const updatedExperience = await dispatch(updateExperience(editingId, experienceData));
        setExperienceList(prev => 
          prev.map(exp => 
            exp.id === editingId || exp._id === editingId
              ? { ...experienceData, id: editingId, _id: editingId }
              : exp
          )
        );
      } else {
        // Add new experience
        const response = await dispatch(addExperience(experienceData));
        const newExperience = {
          ...experienceData,
          id: response.data?.id || Date.now(),
          _id: response.data?._id || Date.now()
        };
        setExperienceList(prev => [newExperience, ...prev]);
      }
      
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience');
    } finally {
      setSubmitLoading(false);
    }
  }, [formData, editingId, dispatch, resetForm]);

  const handleEdit = useCallback((experience) => {
    setFormData({
      position: experience.position || '',
      company: experience.company || '',
      location: experience.location || '',
      employmentType: experience.employmentType || 'Full-time',
      startDate: experience.startDate || '',
      endDate: experience.endDate || '',
      currentJob: experience.currentJob || false,
      description: experience.description || '',
      responsibilities: Array.isArray(experience.responsibilities) 
        ? experience.responsibilities.join('\n') 
        : experience.responsibilities || '',
      achievements: Array.isArray(experience.achievements) 
        ? experience.achievements.join('\n') 
        : experience.achievements || '',
      skills: Array.isArray(experience.skills) 
        ? experience.skills.join(', ') 
        : experience.skills || ''
    });
    setEditingId(experience.id || experience._id);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      await dispatch(deleteExperience(id));
      setExperienceList(prev => prev.filter(exp => 
        (exp.id || exp._id) !== id
      ));
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience');
    }
  }, [dispatch]);

  const openForm = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const calculateDuration = useCallback((startDate, endDate, currentJob) => {
    if (!startDate) return '';
    
    const start = new Date(startDate + '-01');
    const end = currentJob ? new Date() : new Date(endDate + '-01');
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }, []);

  const fetchExperience = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await dispatch(getExperience(token));
      if (response?.data?.success) {
        const experiences = response.data.experience || response.data.experiences || [];
        setExperienceList(Array.isArray(experiences) ? experiences : []);
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  }, [token, dispatch]);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  if (loading && experienceList.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-4 text-gray-600">Loading experiences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 md:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg sm:rounded-xl shadow-lg">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Work Experience</h2>
            <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Showcase your professional journey</p>
          </div>
        </div>
        <button
          onClick={openForm}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border border-gray-200 shadow-xl">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 flex items-center gap-2">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            {editingId ? 'Edit Experience' : 'Add New Experience'}
          </h3>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Position/Job Title *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Software Developer, Product Manager"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company/Organization name"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State/Country"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                >
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="month"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  max={getCurrentDate()}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  End Date {!formData.currentJob && '*'}
                </label>
                <input
                  type="month"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  disabled={formData.currentJob}
                  max={getCurrentDate()}
                  min={formData.startDate}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 text-sm sm:text-base"
                />
                <label className="flex items-center mt-2 sm:mt-3">
                  <input
                    type="checkbox"
                    name="currentJob"
                    checked={formData.currentJob}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">I currently work here</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of your role and work..."
                rows="3"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Key Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                placeholder="List your key responsibilities (one per line)"
                rows="4"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Key Achievements
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                placeholder="List your key achievements (one per line)"
                rows="3"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Skills Used
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="React, Node.js, Python (comma separated)"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                  
                    {editingId ? 'Update Experience' : 'Add Experience'}
                  </>
                )}
              </button>
              <button
                onClick={() => setIsFormOpen(false)}
                disabled={submitLoading}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold text-sm sm:text-base order-1 sm:order-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experience List */}
      <div className="space-y-4 sm:space-y-6">
        {experienceList.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg">
            <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Experience Added Yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">Start building your professional profile by adding your work experience.</p>
            <button
              onClick={openForm}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Add Your First Experience
            </button>
          </div>
        ) : (
          experienceList.map((experience) => (
            <div key={experience.id || experience._id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{experience.position}</h3>
                    {experience.currentJob && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full self-start">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium break-words">{experience.company}</span>
                    </div>
                    {experience.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="break-words">{experience.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {formatDate(experience.startDate)} - {experience.currentJob ? 'Present' : formatDate(experience.endDate)}
                      </span>
                    </div>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <span>{calculateDuration(experience.startDate, experience.endDate, experience.currentJob)}</span>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium self-start">
                      {experience.employmentType}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 self-start">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id || experience._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {experience.description && (
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">{experience.description}</p>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {experience.responsibilities && experience.responsibilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {experience.responsibilities.map((responsibility, index) => (
                        <li key={index} className="text-sm sm:text-base text-gray-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="break-words">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {experience.achievements && experience.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {experience.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm sm:text-base text-gray-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="break-words">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {experience.skills && experience.skills.length > 0 && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Skills Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors break-words">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;