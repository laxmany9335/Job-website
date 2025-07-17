import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { addEducation } from '../../services/operation/profile/addEducation';
import { useDispatch } from 'react-redux';

const EducationSection = () => {
  const [educationList, setEducationList] = useState([
    {
      id: 1,
      degree: "Bachelor of Technology",
      studyField: "Computer Science",
      instituteName: "Indian Institute of Technology",
      location: "Delhi, India",
      startYear: "2019",
      endYear: "2023",
      grade: "8.5 CGPA",
      description: "Specialized in software development and data structures. Active member of coding club."
    }
  ]);
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    studyField: '',
    instituteName: '',
    location: '',
    startYear: '',
    endYear: '',
    grade: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      degree: '',
      studyField: '',
      instituteName: '',
      location: '',
      startYear: '',
      endYear: '',
      grade: '',
      description: ''
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.degree || !formData.instituteName) {
      alert('Please fill in degree and instituteName name');
      return;
    }

    if (editingId) {
      setEducationList(prev =>
        prev.map(edu =>
          edu.id === editingId
            ? { ...formData, id: editingId }
            : edu
        )
      );
    } else {
      try {
        const success = await dispatch(addEducation(formData));
        if (success) {
          setEducationList(prev => [formData, ...prev]);
        }
        console.log(success)
      }
      catch (error) {
        console.error("Error adding education:", error);
        alert("Failed to add education. Please try again.");
      }
    }

    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (education) => {
    setFormData({
      degree: education.degree,
      studyField: education.studyField,
      instituteName: education.instituteName,
      location: education.location,
      startYear: education.startYear,
      endYear: education.endYear,
      grade: education.grade,
      description: education.description
    });
    setEditingId(education.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      setEducationList(prev => prev.filter(edu => edu.id !== id));
    }
  };

  const openForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Education</h2>
            <p className="text-sm sm:text-base text-gray-600">Add your educational qualifications</p>
          </div>
        </div>
        <button
          onClick={openForm}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Add Education</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 md:mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit Education' : 'Add New Education'}
          </h3>

          <div className="space-y-4">
            {/* Degree and studyField */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree/Course *
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g., B.Tech, MBA, M.Sc"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  studyField of Study
                </label>
                <input
                  type="text"
                  name="studyField"
                  value={formData.studyField}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science, Commerce"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* instituteName */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                instituteName Name *
              </label>
              <input
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleInputChange}
                placeholder="College/University name"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Location, Start Year, End Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Year
                </label>
                <input
                  type="text"
                  name="startYear"
                  value={formData.startYear}
                  onChange={handleInputChange}
                  placeholder="2020"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Year
                </label>
                <input
                  type="text"
                  name="endYear"
                  value={formData.endYear}
                  onChange={handleInputChange}
                  placeholder="2024 or Present"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade/Score
              </label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                placeholder="e.g., 8.5 CGPA, 85%"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Additional details, achievements, projects, etc..."
                rows="3"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col xs:flex-row gap-3 pt-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base order-2 xs:order-1"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base order-1 xs:order-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-4 md:space-y-6">
        {educationList.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No education entries found</h3>
            <p className="text-xs sm:text-sm px-4">Click "Add Education" to add your educational qualifications</p>
          </div>
        ) : (
          educationList.map((education) => (
            <div key={education.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg self-start flex-shrink-0">
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                        <span className="block sm:inline">{education.degree}</span>
                        {education.studyField && (
                          <span className="block sm:inline text-blue-600 sm:ml-0">
                            <span className="hidden sm:inline"> - </span>
                            {education.studyField}
                          </span>
                        )}
                      </h3>

                      <p className="text-base sm:text-lg text-gray-700 mt-1 break-words">{education.instituteName}</p>

                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 mt-3 text-xs sm:text-sm text-gray-600">
                        {education.location && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{education.location}</span>
                          </div>
                        )}

                        {(education.startYear || education.endYear) && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{education.startYear} - {education.endYear || 'Present'}</span>
                          </div>
                        )}

                        {education.grade && (
                          <div className="font-medium text-green-600 flex-shrink-0">
                            {education.grade}
                          </div>
                        )}
                      </div>

                      {education.description && (
                        <p className="text-gray-600 mt-3 leading-relaxed text-sm sm:text-base break-words">
                          {education.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row lg:flex-col gap-2 justify-end lg:justify-start flex-shrink-0">
                  <button
                    onClick={() => handleEdit(education)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(education.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add More Button */}
      {educationList.length > 0 && (
        <div className="text-center mt-6 md:mt-8">
          <button
            onClick={openForm}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            Add More Education
          </button>
        </div>
      )}
    </div>
  );
};

export default EducationSection;