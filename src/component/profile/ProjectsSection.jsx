import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Code, Calendar, ExternalLink, Github } from 'lucide-react';
import { addProject } from '../../services/operation/profile/addProject';
import { getProject } from '../../services/operation/profile/getProject';
import { updateProject } from '../../services/operation/profile/updateProject';
import { deleteProject } from '../../services/operation/profile/deleteProject';
import { useDispatch, useSelector } from 'react-redux';

const ProjectsSection = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [projectsList, setProjectsList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    status: 'In Progress',
    liveUrl: '',
    githubUrl: '',
    role: '',
    currentlyWorking: false
  });

  const statusOptions = ['In Progress', 'Completed', 'On Hold', 'Cancelled'];

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      status: 'In Progress',
      liveUrl: '',
      githubUrl: '',
      role: '',
      currentlyWorking: false
    });
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'currentlyWorking' && checked && { endDate: '', status: 'In Progress' }) // Clear end date and set status if currently working
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in required fields: project title and description');
      return;
    }

    setSubmitLoading(true);
    
    // Prepare data with correct structure for API
    const projectData = {
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
      startDate: formData.startDate,
      endDate: formData.currentlyWorking ? null : formData.endDate,
      status: formData.currentlyWorking ? 'In Progress' : formData.status,
      liveUrl: formData.liveUrl,
      githubUrl: formData.githubUrl,
      role: formData.role,
      currentlyWorking: formData.currentlyWorking
    };

    // Debug: Log the data being sent
    console.log('Sending project data:', projectData);

    try {
      if (editingId) {
        // Update existing project
        const success = await dispatch(updateProject(projectData, editingId));
        if (success) {
          setProjectsList(prev => 
            prev.map(project => 
              project._id === editingId
                ? { ...projectData, _id: editingId }
                : project
            )
          );
        }
      } else {
        // Add new project
        const response = await dispatch(addProject(projectData));
        if (response?.success || response?.data?.success) {
          const newProject = {
            ...projectData,
            _id: response.data?._id || response._id || Date.now()
          };
          setProjectsList(prev => [newProject, ...prev]);
        }
      }
      
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to save project');
    } finally {
      setSubmitLoading(false);
    }
  }, [formData, editingId, dispatch, resetForm]);

  const handleEdit = useCallback((project) => {
    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      status: project.status || 'In Progress',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      role: project.role || '',
      currentlyWorking: project.currentlyWorking || false
    });
    setEditingId(project._id);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await dispatch(deleteProject(id));
      setProjectsList(prev => prev.filter(project => project._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  }, [dispatch]);

  const openForm = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const calculateDuration = useCallback((startDate, endDate, currentlyWorking) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = currentlyWorking ? new Date() : new Date(endDate);
    
    if (!end || end < start) return '';
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (months === 0) {
      return 'Less than a month';
    } else if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
      }
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await dispatch(getProject(token));
      if (response?.data?.success) {
        const projects = response.data.data.projects || [];
        setProjectsList(Array.isArray(projects) ? projects : []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [token, dispatch]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && projectsList.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-4 text-gray-600">Loading projects...</span>
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
            <Code className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Projects</h2>
            <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Showcase your development projects</p>
          </div>
        </div>
        <button
          onClick={openForm}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border border-gray-200 shadow-xl">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 flex items-center gap-2">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h3>

          <div className="space-y-4 sm:space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., E-commerce Website, Mobile App"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project, its features, and your contributions..."
                rows="4"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                required
              />
            </div>

            {/* Technologies and Role */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Technologies Used
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB (comma separated)"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Your Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Full Stack Developer, Frontend Developer"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Date, Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  max={getCurrentDate()}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  End Date {!formData.currentlyWorking && '*'}
                </label>
                <input
                  type="month"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || "2000-01"}
                  max={getCurrentDate()}
                  disabled={formData.currentlyWorking}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 text-sm sm:text-base"
                />
                <label className="flex items-center mt-2 sm:mt-3">
                  <input
                    type="checkbox"
                    name="currentlyWorking"
                    checked={formData.currentlyWorking}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Currently working on this</span>
                </label>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={formData.currentlyWorking}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 text-sm sm:text-base"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Live URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-project.com"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
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
                    {editingId ? 'Update Project' : 'Add Project'}
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

      {/* Projects List */}
      <div className="space-y-4 sm:space-y-6">
        {projectsList.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg">
            <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
              <Code className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Projects Added Yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">Start showcasing your work by adding your development projects.</p>
            <button
              onClick={openForm}
              className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Add Your First Project
            </button>
          </div>
        ) : (
          projectsList.map((project) => (
            <div key={project._id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {project.currentlyWorking && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full self-start">
                          Active
                        </span>
                      )}
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold self-start ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {project.role && (
                    <p className="text-purple-600 font-medium mb-3 text-sm sm:text-base break-words">{project.role}</p>
                  )}

                  <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base break-words">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs sm:text-sm break-all"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {project.startDate} - {project.currentlyWorking ? 'Present' : project.endDate}
                      </span>
                    </div>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <span>{calculateDuration(project.startDate, project.endDate, project.currentlyWorking)}</span>
                  </div>

                  {(project.liveUrl || project.githubUrl) && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm whitespace-nowrap"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                      
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-600 hover:text-gray-700 text-xs sm:text-sm whitespace-nowrap"
                        >
                          <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 self-start">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
    </div>
  );
};

export default ProjectsSection;