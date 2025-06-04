import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, MapPin } from 'lucide-react';

const EducationSection = () => {
  const [educationList, setEducationList] = useState([
    {
      id: 1,
      degree: "Bachelor of Technology",
      field: "Computer Science",
      institution: "Indian Institute of Technology",
      location: "Delhi, India",
      startYear: "2019",
      endYear: "2023",
      grade: "8.5 CGPA",
      description: "Specialized in software development and data structures. Active member of coding club."
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    field: '',
    institution: '',
    location: '',
    startYear: '',
    endYear: '',
    grade: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      degree: '',
      field: '',
      institution: '',
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

  const handleSubmit = () => {
    if (!formData.degree || !formData.institution) {
      alert('Please fill in degree and institution name');
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
      const newEducation = {
        ...formData,
        id: Date.now()
      };
      setEducationList(prev => [newEducation, ...prev]);
    }

    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (education) => {
    setFormData({
      degree: education.degree,
      field: education.field,
      institution: education.institution,
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
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Education</h2>
            <p className="text-gray-600">Add your educational qualifications</p>
          </div>
        </div>
        <button
          onClick={openForm}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit Education' : 'Add New Education'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  name="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science, Commerce"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="College/University name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-6">
        {educationList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No education entries found</h3>
            <p className="text-sm">Click "Add Education" to add your educational qualifications</p>
          </div>
        ) : (
          educationList.map((education) => (
            <div key={education.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {education.degree}
                        {education.field && (
                          <span className="text-blue-600"> - {education.field}</span>
                        )}
                      </h3>
                      
                      <p className="text-lg text-gray-700 mt-1">{education.institution}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {education.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {education.location}
                          </div>
                        )}
                        
                        {(education.startYear || education.endYear) && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {education.startYear} - {education.endYear || 'Present'}
                          </div>
                        )}
                        
                        {education.grade && (
                          <div className="font-medium text-green-600">
                            {education.grade}
                          </div>
                        )}
                      </div>
                      
                      {education.description && (
                        <p className="text-gray-600 mt-3 leading-relaxed">
                          {education.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
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
      
      {educationList.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={openForm}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto"
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