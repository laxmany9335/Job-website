import React, { useState } from 'react';
import { Plus, Award, Calendar, Edit2, Trash2, Trophy, Star, Target } from 'lucide-react';

const AchievementManager = () => {
  const [achievements, setAchievements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date) {
      alert('Please fill in the title and date fields');
      return;
    }
    
    if (editingId) {
      // Update existing achievement
      setAchievements(prev => 
        prev.map(achievement => 
          achievement.id === editingId 
            ? { ...formData, id: editingId }
            : achievement
        )
      );
      setEditingId(null);
    } else {
      // Add new achievement
      const newAchievement = {
        ...formData,
        id: Date.now(),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      setAchievements(prev => [newAchievement, ...prev]);
    }

    // Reset form
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
    setShowForm(false);
  };

  const handleEdit = (achievement) => {
    setFormData({
      ...achievement,
      skills: Array.isArray(achievement.skills) ? achievement.skills.join(', ') : achievement.skills
    });
    setEditingId(achievement.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== id));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Academic': return <Trophy className="w-5 h-5 text-blue-600" />;
      case 'Professional': return <Award className="w-5 h-5 text-green-600" />;
      case 'Leadership': return <Star className="w-5 h-5 text-purple-600" />;
      case 'Technical': return <Target className="w-5 h-5 text-orange-600" />;
      case 'Sports': return <Trophy className="w-5 h-5 text-red-600" />;
      case 'Volunteer': return <Award className="w-5 h-5 text-pink-600" />;
      case 'Creative': return <Star className="w-5 h-5 text-indigo-600" />;
      case 'Research': return <Target className="w-5 h-5 text-teal-600" />;
      case 'Awards': return <Award className="w-5 h-5 text-yellow-600" />;
      case 'Certifications': return <Trophy className="w-5 h-5 text-cyan-600" />;
      default: return <Award className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-800">Achievements</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
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
              }
            }}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Achievement'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g., Dean's List, Employee of the Month"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization/Institution
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g., Harvard University, Google Inc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Achieved *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Describe what you accomplished and how you achieved it..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impact/Results
              </label>
              <textarea
                name="impact"
                value={formData.impact}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="What was the impact or result of this achievement?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g., Leadership, Project Management, Public Speaking"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate/Proof URL (optional)
              </label>
              <input
                type="url"
                name="certificateUrl"
                value={formData.certificateUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                {editingId ? 'Update Achievement' : 'Add Achievement'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
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
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {achievements.length === 0 && !showForm && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">No achievements added yet</h3>
            <p className="text-gray-400 mb-4">Showcase your accomplishments and milestones</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Achievement
            </button>
          </div>
        )}

        {achievements.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Achievements ({achievements.length})
            </h2>
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {achievement.title}
                      </h3>
                      {achievement.category && (
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(achievement.category)}
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(achievement.category)}`}>
                            {achievement.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {achievement.organization && (
                      <p className="text-lg text-blue-600 font-medium mb-2">
                        {achievement.organization}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(achievement.date)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {achievement.certificateUrl && (
                      <a
                        href={achievement.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Certificate"
                      >
                        <Award className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(achievement.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {achievement.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                )}
                
                {achievement.impact && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Impact:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {achievement.impact}
                    </p>
                  </div>
                )}
                
                {achievement.skills && achievement.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(achievement.skills) ? achievement.skills : achievement.skills.split(',')).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementManager;