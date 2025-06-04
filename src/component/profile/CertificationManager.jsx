import React, { useState } from 'react';
import { Plus, Award, Calendar, ExternalLink, Edit2, Trash2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const CertificationManager = () => {
  const [certifications, setCertifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    credentialId: '',
    issueDate: '',
    expiryDate: '',
    neverExpires: false,
    credentialUrl: '',
    description: '',
    skills: '',
    level: '',
    cost: ''
  });

  const levels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
    'Professional',
    'Associate',
    'Specialist',
    'Master',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.issuingOrganization || !formData.issueDate) {
      alert('Please fill in the certification name, issuing organization, and issue date');
      return;
    }
    
    if (editingId) {
      // Update existing certification
      setCertifications(prev => 
        prev.map(cert => 
          cert.id === editingId 
            ? { ...formData, id: editingId }
            : cert
        )
      );
      setEditingId(null);
    } else {
      // Add new certification
      const newCertification = {
        ...formData,
        id: Date.now(),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      setCertifications(prev => [newCertification, ...prev]);
    }

    // Reset form
    setFormData({
      name: '',
      issuingOrganization: '',
      credentialId: '',
      issueDate: '',
      expiryDate: '',
      neverExpires: false,
      credentialUrl: '',
      description: '',
      skills: '',
      level: '',
      cost: ''
    });
    setShowForm(false);
  };

  const handleEdit = (certification) => {
    setFormData({
      ...certification,
      skills: Array.isArray(certification.skills) ? certification.skills.join(', ') : certification.skills
    });
    setEditingId(certification.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
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

  const getExpiryStatus = (expiryDate, neverExpires) => {
    if (neverExpires) {
      return { status: 'valid', message: 'Never expires', icon: CheckCircle, color: 'text-green-600' };
    }
    
    if (!expiryDate) {
      return { status: 'unknown', message: 'No expiry date', icon: Clock, color: 'text-gray-600' };
    }

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', message: 'Expired', icon: AlertTriangle, color: 'text-red-600' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', message: `Expires in ${daysUntilExpiry} days`, icon: AlertTriangle, color: 'text-orange-600' };
    } else if (daysUntilExpiry <= 90) {
      return { status: 'warning', message: `Expires in ${daysUntilExpiry} days`, icon: Clock, color: 'text-yellow-600' };
    } else {
      return { status: 'valid', message: `Valid until ${formatDate(expiryDate)}`, icon: CheckCircle, color: 'text-green-600' };
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'expiring': return 'bg-orange-100 text-orange-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-100 text-blue-700';
      case 'Intermediate': return 'bg-purple-100 text-purple-700';
      case 'Advanced': return 'bg-orange-100 text-orange-700';
      case 'Expert': return 'bg-red-100 text-red-700';
      case 'Professional': return 'bg-green-100 text-green-700';
      case 'Associate': return 'bg-teal-100 text-teal-700';
      case 'Specialist': return 'bg-indigo-100 text-indigo-700';
      case 'Master': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Certifications</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
                setFormData({
                  name: '',
                  issuingOrganization: '',
                  credentialId: '',
                  issueDate: '',
                  expiryDate: '',
                  neverExpires: false,
                  credentialUrl: '',
                  description: '',
                  skills: '',
                  level: '',
                  cost: ''
                });
              }
            }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Certification'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  name="issuingOrganization"
                  value={formData.issuingOrganization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Amazon Web Services, Microsoft"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential ID
                </label>
                <input
                  type="text"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., ABC123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select level</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  disabled={formData.neverExpires}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="neverExpires"
                checked={formData.neverExpires}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                This certification never expires
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credential URL
              </label>
              <input
                type="url"
                name="credentialUrl"
                value={formData.credentialUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://..."
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="What skills or knowledge does this certification validate?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Validated (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Cloud Computing, AWS, Docker"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost (optional)
                </label>
                <input
                  type="text"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., $150, Free"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                {editingId ? 'Update Certification' : 'Add Certification'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    issuingOrganization: '',
                    credentialId: '',
                    issueDate: '',
                    expiryDate: '',
                    neverExpires: false,
                    credentialUrl: '',
                    description: '',
                    skills: '',
                    level: '',
                    cost: ''
                  });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {certifications.length === 0 && !showForm && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">No certifications added yet</h3>
            <p className="text-gray-400 mb-4">Track your professional certifications and credentials</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Certification
            </button>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Certifications ({certifications.length})
            </h2>
            {certifications.map((certification) => {
              const expiryInfo = getExpiryStatus(certification.expiryDate, certification.neverExpires);
              const IconComponent = expiryInfo.icon;
              
              return (
                <div key={certification.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {certification.name}
                        </h3>
                        {certification.level && (
                          <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(certification.level)}`}>
                            {certification.level}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-lg text-purple-600 font-medium mb-2">
                        {certification.issuingOrganization}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Issued: {formatDate(certification.issueDate)}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${expiryInfo.color}`}>
                          <IconComponent className="w-4 h-4" />
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(expiryInfo.status)}`}>
                            {expiryInfo.message}
                          </span>
                        </div>
                      </div>

                      {certification.credentialId && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Credential ID:</span> {certification.credentialId}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {certification.credentialUrl && (
                        <a
                          href={certification.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Credential"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(certification)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(certification.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {certification.description && (
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">
                        {certification.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {certification.skills && certification.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(certification.skills) ? certification.skills : certification.skills.split(',')).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {certification.cost && (
                      <div className="text-sm text-gray-600 ml-4">
                        <span className="font-medium">Cost:</span> {certification.cost}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationManager;