import { useCallback, useEffect, useState } from 'react';
import { Plus, Award, Calendar, ExternalLink, Edit2, Trash2, CheckCircle, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { addCertification } from '../../services/operation/profile/addCertification';
import { getCertification } from '../../services/operation/profile/getCertification';
import { updateCertification } from '../../services/operation/profile/updateCertification';
import { deleteCertification } from '../../services/operation/profile/deleteCertification';
import { useDispatch, useSelector } from 'react-redux';

const CertificationManager = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [certifications, setCertifications] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    instituteName: '',
    credentialId: '',
    issueDate: '',
    expiryDate: '',
    neverExpires: false,
    credentialUrl: '',
    description: '',
    skills: '',
    level: '',
  });

  const levels = [
    'Beginner',
    'Intermediate',
    'Advanced'
  ];

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      instituteName: '',
      credentialId: '',
      issueDate: '',
      expiryDate: '',
      neverExpires: false,
      credentialUrl: '',
      description: '',
      skills: '',
      level: '',
    });
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.name || !formData.instituteName || !formData.issueDate) {
      alert('Please fill in required fields: certification name, institute name, and issue date');
      return;
    }

    setSubmitLoading(true);
    
    // Prepare data with correct structure for API
    const certificationData = {
      name: formData.name,
      instituteName: formData.instituteName,
      credentialId: formData.credentialId,
      issueDate: formData.issueDate,
      expiryDate: formData.neverExpires ? null : formData.expiryDate,
      neverExpires: formData.neverExpires,
      credentialUrl: formData.credentialUrl,
      description: formData.description,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      level: formData.level
    };

    // Debug: Log the data being sent
    console.log('Sending certification data:', certificationData);

    try {
      if (editingId) {
        // Update existing certification
        const certificationId = editingId;
        const success = await dispatch(updateCertification( certificationData, certificationId ));
        
        if (success) {
          setCertifications(prev => 
            prev.map(cert => 
              cert._id === editingId
                ? { ...certificationData, _id: editingId }
                : cert
            )
          );
        }
      } else {
        // Add new certification
        const response = await dispatch(addCertification(certificationData));
        if (response?.success || response?.data?.success) {
          const newCertification = {
            ...certificationData,
            _id: response.data?._id || response._id || Date.now()
          };
          setCertifications(prev => [newCertification, ...prev]);
        }
      }
      
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving certification:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to save certification');
    } finally {
      setSubmitLoading(false);
    }
  }, [formData, editingId, dispatch, resetForm]);

  const handleEdit = useCallback((certification) => {
    setFormData({
      name: certification.name || '',
      instituteName: certification.instituteName || '',
      credentialId: certification.credentialId || '',
      issueDate: certification.issueDate || '',
      expiryDate: certification.expiryDate || '',
      neverExpires: certification.neverExpires || false,
      credentialUrl: certification.credentialUrl || '',
      description: certification.description || '',
      skills: Array.isArray(certification.skills) ? certification.skills.join(', ') : certification.skills || '',
      level: certification.level || ''
    });
    setEditingId(certification._id);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      await dispatch(deleteCertification(id));
      setCertifications(prev => prev.filter(cert => cert._id !== id));
    } catch (error) {
      console.error('Error deleting certification:', error);
      alert('Failed to delete certification');
    }
  }, [dispatch]);

  const openForm = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const fetchCertifications = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await dispatch(getCertification(token));
      if (response?.data?.success) {
        const certifications = response.data.certification || response.data.certifications || [];
        setCertifications(Array.isArray(certifications) ? certifications : []);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  }, [token, dispatch]);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

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

  if (loading && certifications.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-4 text-gray-600">Loading certifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 md:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Certifications</h2>
            <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Add your professional certifications</p>
          </div>
        </div>
        <button
          onClick={openForm}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border border-gray-200 shadow-xl">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 flex items-center gap-2">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            {editingId ? 'Edit Certification' : 'Add New Certification'}
          </h3>

          <div className="space-y-4 sm:space-y-6">
            {/* Certification Name and Institute */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Certification Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Institute Name *
                </label>
                <input
                  type="text"
                  name="instituteName"
                  value={formData.instituteName}
                  onChange={handleInputChange}
                  placeholder="e.g., Amazon Web Services, Microsoft"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Credential ID and Level */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Credential ID
                </label>
                <input
                  type="text"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC123456789"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
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

            {/* Issue Date and Expiry Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  disabled={formData.neverExpires}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 text-sm sm:text-base"
                />
                <label className="flex items-center mt-2 sm:mt-3">
                  <input
                    type="checkbox"
                    name="neverExpires"
                    checked={formData.neverExpires}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">This certification never expires</span>
                </label>
              </div>
            </div>

            {/* Credential URL */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Credential URL
              </label>
              <input
                type="url"
                name="credentialUrl"
                value={formData.credentialUrl}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Skills Validated (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., Cloud Computing, AWS, Docker"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
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
                placeholder="What skills or knowledge does this certification validate?"
                rows="3"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {editingId ? 'Update Certification' : 'Add Certification'}
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

      {/* Certifications List */}
      <div className="space-y-4 sm:space-y-6">
        {certifications.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg">
            <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Certifications Added Yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">Start building your professional profile by adding your certifications.</p>
            <button
              onClick={openForm}
              className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Add Your First Certification
            </button>
          </div>
        ) : (
          certifications.map((certification) => {
            const expiryInfo = getExpiryStatus(certification.expiryDate, certification.neverExpires);
            const IconComponent = expiryInfo.icon;
            
            return (
              <div key={certification._id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                        {certification.name}
                      </h3>
                      {certification.level && (
                        <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full self-start ${getLevelColor(certification.level)}`}>
                          {certification.level}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium break-words">{certification.instituteName}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>Issued: {formatDate(certification.issueDate)}</span>
                      </div>
                      <span className="text-gray-300 hidden sm:inline">•</span>
                      <div className={`flex items-center gap-1 ${expiryInfo.color}`}>
                        <IconComponent className="w-4 h-4" />
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(expiryInfo.status)}`}>
                          {expiryInfo.message}
                        </span>
                      </div>
                      {certification.credentialId && (
                        <>
                          <span className="text-gray-300 hidden sm:inline">•</span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium self-start">
                            ID: {certification.credentialId}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 self-start">
                    {certification.credentialUrl && (
                      <a
                        href={certification.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        title="View Credential"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(certification)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(certification._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Skills */}
                {certification.skills && certification.skills.length > 0 && (
                  <div className="mb-4">
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
                  </div>
                )}

                {/* Description */}
                {certification.description && (
                  <div className="pt-4 sm:pt-6 border-t border-gray-100">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{certification.description}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CertificationManager;