import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { addEducation } from '../../services/operation/profile/addEducation';
import { getEducation } from '../../services/operation/profile/getEducation';
import { updateEducation } from '../../services/operation/profile/updateEducation';
import { deleteEducation } from '../../services/operation/profile/deleteEducation';
import { useDispatch, useSelector } from 'react-redux';

const EducationSection = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [educationList, setEducationList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    degree: '',
    studyField: '',
    instituteName: '',
    location: '',
    startYear: '',
    endYear: '',
    currentlyStudying: false,
    grade: '',
    description: ''
  });

  const resetForm = useCallback(() => {
    setFormData({
      degree: '',
      studyField: '',
      instituteName: '',
      location: '',
      startYear: '',
      endYear: '',
      currentlyStudying: false,
      grade: '',
      description: ''
    });
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'currentlyStudying' && checked && { endYear: '' }) // Clear end year if currently studying
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.degree || !formData.instituteName || !formData.startYear) {
      alert('Please fill in required fields: degree, institute name, and start year');
      return;
    }

    setSubmitLoading(true);
    
    // Prepare data with correct structure for API
    const educationData = {
      degree: formData.degree,
      studyField: formData.studyField,
      instituteName: formData.instituteName,
      location: formData.location,
      startYear: formData.startYear,
      endYear: formData.currentlyStudying ? null : formData.endYear,
      currentlyStudying: formData.currentlyStudying,
      grade: formData.grade,
      description: formData.description
    };

    // Debug: Log the data being sent
    console.log('Sending education data:', educationData);

    try {
      if (editingId) {
        // Update existing education
        const success = await dispatch(updateEducation(educationData, editingId));
        if (success) {
          setEducationList(prev => 
            prev.map(edu => 
              edu._id === editingId
                ? { ...educationData, _id: editingId }
                : edu
            )
          );
        }
      } else {
        // Add new education
        const response = await dispatch(addEducation(educationData));
        if (response?.success || response?.data?.success) {
          const newEducation = {
            ...educationData,
            _id: response.data?._id || response._id || Date.now()
          };
          setEducationList(prev => [newEducation, ...prev]);
        }
      }
      
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving education:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to save education');
    } finally {
      setSubmitLoading(false);
    }
  }, [formData, editingId, dispatch, resetForm]);

  const handleEdit = useCallback((education) => {
    setFormData({
      degree: education.degree || '',
      studyField: education.studyField || '',
      instituteName: education.instituteName || '',
      location: education.location || '',
      startYear: education.startYear || '',
      endYear: education.endYear || '',
      currentlyStudying: education.currentlyStudying || false,
      grade: education.grade || '',
      description: education.description || ''
    });
    setEditingId(education._id);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    
    try {
      await dispatch(deleteEducation(id));
      setEducationList(prev => prev.filter(edu => edu._id !== id));
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Failed to delete education');
    }
  }, [dispatch]);

  const openForm = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const calculateDuration = useCallback((startYear, endYear, currentlyStudying) => {
    if (!startYear) return '';
    
    const start = parseInt(startYear);
    const end = currentlyStudying ? new Date().getFullYear() : parseInt(endYear);
    
    if (!end || end < start) return '';
    
    const years = end - start;
    if (years === 0) {
      return 'Less than a year';
    } else if (years === 1) {
      return '1 year';
    } else {
      return `${years} years`;
    }
  }, []);

  const fetchEducation = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await dispatch(getEducation(token));
      if (response?.data?.success) {
        const educations = response.data.education || response.data.educations || [];
        setEducationList(Array.isArray(educations) ? educations : []);
      }
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  }, [token, dispatch]);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };

  if (loading && educationList.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading education...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 md:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Education</h2>
            <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Add your educational qualifications</p>
          </div>
        </div>
        <button
          onClick={openForm}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border border-gray-200 shadow-xl">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 flex items-center gap-2">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            {editingId ? 'Edit Education' : 'Add New Education'}
          </h3>

          <div className="space-y-4 sm:space-y-6">
            {/* Degree and Field of Study */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Degree/Course *
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g., B.Tech, MBA, M.Sc"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Field of Study
                </label>
                <input
                  type="text"
                  name="studyField"
                  value={formData.studyField}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science, Commerce"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Institute Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Institute Name *
              </label>
              <input
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleInputChange}
                placeholder="College/University name"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                required
              />
            </div>

            {/* Location, Start Year, End Year */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Start Year *
                </label>
                <input
                  type="number"
                  name="startYear"
                  value={formData.startYear}
                  onChange={handleInputChange}
                  placeholder="2020"
                  min="1950"
                  max={getCurrentYear()}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  End Year {!formData.currentlyStudying && '*'}
                </label>
                <input
                  type="number"
                  name="endYear"
                  value={formData.endYear}
                  onChange={handleInputChange}
                  placeholder="2024"
                  min={formData.startYear || "1950"}
                  max={getCurrentYear()}
                  disabled={formData.currentlyStudying}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 text-sm sm:text-base"
                />
                <label className="flex items-center mt-2 sm:mt-3">
                  <input
                    type="checkbox"
                    name="currentlyStudying"
                    checked={formData.currentlyStudying}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">I currently study here</span>
                </label>
              </div>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Grade/Score
              </label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                placeholder="e.g., 8.5 CGPA, 85%"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
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
                placeholder="Additional details, achievements, projects, etc..."
                rows="3"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {editingId ? 'Update Education' : 'Add Education'}
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

      {/* Education List */}
      <div className="space-y-4 sm:space-y-6">
        {educationList.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg">
            <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Education Added Yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">Start building your academic profile by adding your educational qualifications.</p>
            <button
              onClick={openForm}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Add Your First Education
            </button>
          </div>
        ) : (
          educationList.map((education) => (
            <div key={education._id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                      {education.degree}
                      {education.studyField && (
                        <span className="text-blue-600"> - {education.studyField}</span>
                      )}
                    </h3>
                    {education.currentlyStudying && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full self-start">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium break-words">{education.instituteName}</span>
                    </div>
                    {education.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="break-words">{education.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {education.startYear} - {education.currentlyStudying ? 'Present' : education.endYear}
                      </span>
                    </div>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <span>{calculateDuration(education.startYear, education.endYear, education.currentlyStudying)}</span>
                    {education.grade && (
                      <>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium self-start">
                          {education.grade}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 self-start">
                  <button
                    onClick={() => handleEdit(education)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(education._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {education.description && (
                <div className="pt-4 sm:pt-6 border-t border-gray-100">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{education.description}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EducationSection;