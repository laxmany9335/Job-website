import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Code, Calendar, ExternalLink, Github } from 'lucide-react';

const ProjectsSection = () => {
  const [projectsList, setProjectsList] = useState([
    {
      id: 1,
      title: "E-commerce Web Application",
      description: "Full-stack e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      startDate: "2023-01",
      endDate: "2023-06",
      status: "Completed",
      liveUrl: "https://example-ecommerce.com",
      githubUrl: "https://github.com/username/ecommerce-app",
      role: "Full Stack Developer"
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    status: 'In Progress',
    liveUrl: '',
    githubUrl: '',
    role: ''
  });

  const statusOptions = ['In Progress', 'Completed', 'On Hold', 'Cancelled'];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      status: 'In Progress',
      liveUrl: '',
      githubUrl: '',
      role: ''
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
    if (!formData.title || !formData.description) {
      alert('Please fill in project title and description');
      return;
    }

    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
    };

    if (editingId) {
      setProjectsList(prev => 
        prev.map(project => 
          project.id === editingId 
            ? { ...projectData, id: editingId }
            : project
        )
      );
    } else {
      const newProject = {
        ...projectData,
        id: Date.now()
      };
      setProjectsList(prev => [newProject, ...prev]);
    }

    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      role: project.role
    });
    setEditingId(project.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjectsList(prev => prev.filter(project => project.id !== id));
    }
  };

  const openForm = () => {
    resetForm();
    setIsFormOpen(true);
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

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
            <Code className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Projects</h2>
            <p className="text-sm sm:text-base text-gray-600">Showcase your development projects</p>
          </div>
        </div>
        <button
          onClick={openForm}
          className="flex items-center justify-center gap-2 bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Add Project</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 md:mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h3>
          
          <div className="space-y-4">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., E-commerce Website, Mobile App"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project, its features, and your contributions..."
                rows="4"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                required
              />
            </div>

            {/* Technologies and Role */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies Used
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB (comma separated)"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Full Stack Developer, Frontend Developer"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Date and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="month"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Live URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-project.com"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col xs:flex-row gap-3 pt-2">
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base order-2 xs:order-1"
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

      {/* Projects List */}
      <div className="space-y-4 md:space-y-6">
        {projectsList.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <Code className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No projects found</h3>
            <p className="text-xs sm:text-sm px-4">Click "Add Project" to showcase your development projects</p>
          </div>
        ) : (
          projectsList.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="p-2 bg-purple-50 rounded-lg self-start flex-shrink-0">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight break-words">
                            {project.title}
                          </h3>
                          
                          {project.role && (
                            <p className="text-purple-600 font-medium mt-1 text-sm sm:text-base break-words">{project.role}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center self-start xs:self-auto">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mt-3 leading-relaxed text-sm sm:text-base break-words">
                        {project.description}
                      </p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
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
                      
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 mt-4 text-xs sm:text-sm text-gray-600">
                        {(project.startDate || project.endDate) && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{project.startDate} - {project.endDate || 'Present'}</span>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 xs:gap-3">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 whitespace-nowrap"
                            >
                              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">Live Demo</span>
                              <span className="xs:hidden">Demo</span>
                            </a>
                          )}
                          
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-gray-600 hover:text-gray-700 whitespace-nowrap"
                            >
                              <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">Source Code</span>
                              <span className="xs:hidden">Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-row lg:flex-col gap-2 justify-end lg:justify-start flex-shrink-0">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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
      {projectsList.length > 0 && (
        <div className="text-center mt-6 md:mt-8">
          <button
            onClick={openForm}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 mx-auto text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            Add More Projects
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;