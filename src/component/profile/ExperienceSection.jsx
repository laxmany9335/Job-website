import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase, Calendar, MapPin, Building, Award, Users } from 'lucide-react';

const ExperienceSection = () => {
  const [experienceList, setExperienceList] = useState([
    {
      id: 1,
      position: "Senior Software Developer",
      company: "Tech Solutions Inc.",
      location: "Bangalore, India",
      employmentType: "Full-time",
      startDate: "2022-01",
      endDate: "",
      currentJob: true,
      description: "Leading a team of 5 developers in building scalable web applications. Responsible for architecture decisions, code reviews, and mentoring junior developers.",
      responsibilities: ["Team leadership", "Code architecture", "Performance optimization", "Mentoring junior developers"],
      achievements: ["Improved application performance by 40%", "Successfully delivered 5 major projects"],
      skills: ["React", "Node.js", "AWS", "MongoDB"]
    },
    {
      id: 2,
      position: "Frontend Developer",
      company: "Digital Innovations Ltd.",
      location: "Mumbai, India",
      employmentType: "Full-time",
      startDate: "2020-06",
      endDate: "2021-12",
      currentJob: false,
      description: "Developed responsive web applications using modern JavaScript frameworks and collaborated with design teams to implement pixel-perfect UI components.",
      responsibilities: ["Frontend development", "UI/UX implementation", "Cross-browser compatibility", "Code optimization"],
      achievements: ["Reduced page load time by 35%", "Built 15+ reusable components"],
      skills: ["React", "JavaScript", "CSS3", "Bootstrap"]
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  const resetForm = () => {
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
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.position || !formData.company) {
      alert('Please fill in position and company name');
      return;
    }

    const experienceData = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').filter(item => item.trim()),
      achievements: formData.achievements.split('\n').filter(item => item.trim()),
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
    };

    if (editingId) {
      setExperienceList(prev => 
        prev.map(exp => 
          exp.id === editingId 
            ? { ...experienceData, id: editingId }
            : exp
        )
      );
    } else {
      const newExperience = {
        ...experienceData,
        id: Date.now()
      };
      setExperienceList(prev => [newExperience, ...prev]);
    }

    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (experience) => {
    setFormData({
      position: experience.position,
      company: experience.company,
      location: experience.location,
      employmentType: experience.employmentType,
      startDate: experience.startDate,
      endDate: experience.endDate,
      currentJob: experience.currentJob,
      description: experience.description,
      responsibilities: Array.isArray(experience.responsibilities) ? experience.responsibilities.join('\n') : experience.responsibilities,
      achievements: Array.isArray(experience.achievements) ? experience.achievements.join('\n') : experience.achievements,
      skills: Array.isArray(experience.skills) ? experience.skills.join(', ') : experience.skills
    });
    setEditingId(experience.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      setExperienceList(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const openForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const calculateDuration = (startDate, endDate, currentJob) => {
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
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Work Experience</h2>
            <p className="text-gray-600">Showcase your professional journey</p>
          </div>
        </div>
        <button
          onClick={openForm}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-green-600" />
            {editingId ? 'Edit Experience' : 'Add New Experience'}
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position/Job Title *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Software Developer, Product Manager"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company/Organization name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State/Country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  disabled={formData.currentJob}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100"
                />
                <label className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    name="currentJob"
                    checked={formData.currentJob}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-600 font-medium">I currently work here</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of your role and work..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                placeholder="List your key responsibilities (one per line)"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Achievements
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                placeholder="List your key achievements (one per line)"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Skills Used
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="React, Node.js, Python (comma separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                {editingId ? 'Update Experience' : 'Add Experience'}
              </button>
              <button
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experience List */}
      <div className="space-y-6">
        {experienceList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Experience Added Yet</h3>
            <p className="text-gray-600 mb-6">Start building your professional profile by adding your work experience.</p>
            <button
              onClick={openForm}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add Your First Experience
            </button>
          </div>
        ) : (
          experienceList.map((experience) => (
            <div key={experience.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{experience.position}</h3>
                    {experience.currentJob && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{experience.company}</span>
                    </div>
                    {experience.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(experience.startDate)} - {experience.currentJob ? 'Present' : formatDate(experience.endDate)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>{calculateDuration(experience.startDate, experience.endDate, experience.currentJob)}</span>
                    <span className="text-gray-300">•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {experience.employmentType}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {experience.description && (
                <p className="text-gray-700 mb-6 leading-relaxed">{experience.description}</p>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {experience.responsibilities && experience.responsibilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {experience.responsibilities.map((responsibility, index) => (
                        <li key={index} className="text-gray-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {experience.achievements && experience.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-600" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {experience.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {experience.skills && experience.skills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Skills Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
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