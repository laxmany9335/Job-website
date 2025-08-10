import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Award, Calendar, Trophy, Star, Target, ExternalLink } from 'lucide-react';
import { addAchievement } from '../../services/operation/profile/addAchievement';
import { getAchievement } from '../../services/operation/profile/getAchievements';
import { updateAchievement } from '../../services/operation/profile/updateAchievements';
import { deleteAchievement } from '../../services/operation/profile/deleteAchievements';
import { useDispatch, useSelector } from 'react-redux';

const AchievementsSection = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [achievementsList, setAchievementsList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: '',
    date: '',
    description: '',
    impact: '',
    skills: '',
    certificateUrl: ''
  });

  const categories = [
    'Academic',
    'Professional',
    'Leadership',
    'Technical',
    'Sports',
    'Volunteer',
    'Creative',
    'Research',
    'Awards',
    'Certifications',
    'Other'
  ];

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      organization: '',
      category: '',
      date: '',
      description: '',
      impact: '',
      skills: '',
      certificateUrl: ''
    });
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title || !formData.date) {
      alert('Please fill in required fields: achievement title and date');
      return;
    }

    setSubmitLoading(true);
    
    // Prepare data with correct structure for API
    const achievementData = {
      title: formData.title,
      organization: formData.organization,
      category: formData.category,
      date: formData.date,
      description: formData.description,
      impact: formData.impact,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      certificateUrl: formData.certificateUrl
    };

    // Debug: Log the data being sent
    console.log('Sending achievement data:', achievementData);

    try {
      if (editingId) {
        // Update existing achievement
        const success = await dispatch(updateAchievement(achievementData, editingId));
        if (success) {
          setAchievementsList(prev => 
            prev.map(achievement => 
              achievement._id === editingId
                ? { ...achievementData, _id: editingId }
                : achievement
            )
          );
        }
      } else {
        // Add new achievement
        const response = await dispatch(addAchievement(achievementData));
        if (response?.success || response?.data?.success) {
          const newAchievement = {
            ...achievementData,
            _id: response.data?._id || response._id || Date.now()
          };
          setAchievementsList(prev => [newAchievement, ...prev]);
        }
      }
      
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving achievement:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to save achievement');
    } finally {
      setSubmitLoading(false);
    }
  }, [formData, editingId, dispatch, resetForm]);

  const handleEdit = useCallback((achievement) => {
    setFormData({
      title: achievement.title || '',
      organization: achievement.organization || '',
      category: achievement.category || '',
      date: achievement.date || '',
      description: achievement.description || '',
      impact: achievement.impact || '',
      skills: Array.isArray(achievement.skills) ? achievement.skills.join(', ') : achievement.skills || '',
      certificateUrl: achievement.certificateUrl || ''
    });
    setEditingId(achievement._id);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;
    
    try {
      await dispatch(deleteAchievement(id));
      setAchievementsList(prev => prev.filter(achievement => achievement._id !== id));
    } catch (error) {
      console.error('Error deleting achievement:', error);
      alert('Failed to delete achievement');
    }
  }, [dispatch]);

  const openForm = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const getCategoryIcon = useCallback((category) => {
    switch (category) {
      case 'Academic': return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
      case 'Professional': return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case 'Leadership': return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />;
      case 'Technical': return <Target className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />;
      case 'Sports': return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
      case 'Volunteer': return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />;
      case 'Creative': return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />;
      case 'Research': return <Target className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />;
      case 'Awards': return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />;
      case 'Certifications': return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />;
      default: return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />;
    }
  }, []);

  const getCategoryColor = useCallback((category) => {
    switch (category) {
      case 'Academic': return 'bg-blue-100 text-blue-700';
      case 'Professional': return 'bg-green-100 text-green-700';
      case 'Leadership': return 'bg-purple-100 text-purple-700';
      case 'Technical': return 'bg-orange-100 text-orange-700';
      case 'Sports': return 'bg-red-100 text-red-700';
      case 'Volunteer': return 'bg-pink-100 text-pink-700';
      case 'Creative': return 'bg-indigo-100 text-indigo-700';
      case 'Research': return 'bg-teal-100 text-teal-700';
      case 'Awards': return 'bg-yellow-100 text-yellow-700';
      case 'Certifications': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }, []);

  const fetchAchievements = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await dispatch(getAchievement(token));
      console.log(response);
      if (response?.data?.success) {
        const achievements = response.data.achievement || response.data.achievements || [];
        setAchievementsList(Array.isArray(achievements) ? achievements : []);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  }, [token, dispatch]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  if (loading && achievementsList.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-yellow-50 min-h-screen">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <span className="ml-4 text-gray-600">Loading achievements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 md:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Achievements</h2>
            <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Showcase your accomplishments and milestones</p>
          </div>
        </div>
        <button
          onClick={openForm}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-yellow-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border border-gray-200 shadow-xl">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 flex items-center gap-2">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            {editingId ? 'Edit Achievement' : 'Add New Achievement'}
          </h3>

          <div className="space-y-4 sm:space-y-6">
            {/* Title and Organization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Dean's List, Employee of the Month"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Organization/Institution
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="e.g., Harvard University, Google Inc."
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Category and Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Date Achieved *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={getCurrentDate()}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe what you accomplished and how you achieved it..."
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Impact */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Impact/Results
              </label>
              <textarea
                name="impact"
                value={formData.impact}
                onChange={handleInputChange}
                rows="2"
                placeholder="What was the impact or result of this achievement?"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Skills and Certificate URL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Related Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="Leadership, Project Management (comma separated)"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Certificate/Proof URL
                </label>
                <input
                  type="url"
                  name="certificateUrl"
                  value={formData.certificateUrl}
                  onChange={handleInputChange}
                  placeholder="https://certificate-link.com"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="bg-gradient-to-r from-yellow-600 to-orange-700 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:from-yellow-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {editingId ? 'Update Achievement' : 'Add Achievement'}
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

      {/* Achievements List */}
      <div className="space-y-4 sm:space-y-6">
        {achievementsList.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg">
            <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Achievements Added Yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">Start showcasing your accomplishments and milestones.</p>
            <button
              onClick={openForm}
              className="bg-gradient-to-r from-yellow-600 to-orange-700 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:from-yellow-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Add Your First Achievement
            </button>
          </div>
        ) : (
          achievementsList.map((achievement) => (
            <div key={achievement._id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                      {achievement.title}
                    </h3>
                    {achievement.category && (
                      <div className="flex items-center gap-1 self-start sm:self-auto">
                        {getCategoryIcon(achievement.category)}
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getCategoryColor(achievement.category)}`}>
                          {achievement.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {achievement.organization && (
                    <p className="text-blue-600 font-medium mb-3 text-sm sm:text-base break-words">
                      {achievement.organization}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{formatDate(achievement.date)}</span>
                  </div>
                </div>

                <div className="flex gap-2 self-start">
                  {achievement.certificateUrl && (
                    <a
                      href={achievement.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Certificate"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(achievement._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {achievement.description && (
                <div className="mb-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Description:</h4>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                    {achievement.description}
                  </p>
                </div>
              )}

              {achievement.impact && (
                <div className="mb-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Impact:</h4>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                    {achievement.impact}
                  </p>
                </div>
              )}

              {achievement.skills && achievement.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {achievement.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 text-xs sm:text-sm rounded-full break-words"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AchievementsSection;