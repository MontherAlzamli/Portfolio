'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import logger from '@/lib/logger';
import ImageUpload from './ImageUpload';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Upload,
  X,
  Save,
  Loader2,
  CheckSquare,
  Square,
  Download,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  link?: string;
  githubUrl?: string;
  technologies: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  githubUrl: string;
  technologies: string;
  featured: boolean;
}

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    githubUrl: '',
    technologies: '',
    featured: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      logger.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';

      const method = editingProject ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        slug: editingProject
          ? editingProject.slug
          : generateSlug(formData.title),
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        await fetchProjects();
        resetForm();
        // Show success notification
        Swal.fire({
          title: 'Success!',
          text: editingProject
            ? 'Project updated successfully!'
            : 'Project created successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: 'rgb(var(--fg))',
          background: 'rgb(var(--surface))',
          confirmButtonColor: '#15803d',
        });
      } else {
        const errorData = await response.json();
        // Show error notification
        Swal.fire({
          title: 'Error!',
          text: errorData.error || 'An error occurred',
          icon: 'error',
          color: 'rgb(var(--fg))',
          background: 'rgb(var(--surface))',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Network error occurred',
        icon: 'error',
        color: 'rgb(var(--fg))',
        background: 'rgb(var(--surface))',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      color: 'rgb(var(--fg))',
      background: 'rgb(var(--surface))',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProjects();
        // Show success notification
        Swal.fire({
          title: 'Success!',
          text: 'Project deleted successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: 'rgb(var(--fg))',
          background: 'rgb(var(--surface))',
          confirmButtonColor: '#15803d',
        });
      }
    } catch (error) {
      logger.error('Error deleting project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      link: project.link || '',
      githubUrl: project.githubUrl || '',
      technologies: project.technologies,
      featured: project.featured,
    });
    setShowForm(true);
  };

  const handleView = (project: Project) => {
    setViewingProject(project);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      githubUrl: '',
      technologies: '',
      featured: false,
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const addTechnology = (tech: string) => {
    if (tech.trim()) {
      const currentTechs = formData.technologies
        ? formData.technologies.split(',').map(t => t.trim())
        : [];
      if (!currentTechs.includes(tech.trim())) {
        const newTechs = [...currentTechs, tech.trim()];
        setFormData(prev => ({
          ...prev,
          technologies: newTechs.join(', '),
        }));
      }
    }
  };

  const removeTechnology = (tech: string) => {
    const currentTechs = formData.technologies
      ? formData.technologies.split(',').map(t => t.trim())
      : [];
    const newTechs = currentTechs.filter(t => t !== tech);
    setFormData(prev => ({
      ...prev,
      technologies: newTechs.join(', '),
    }));
  };

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedProjects.length} project(s). This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel',
      color: 'rgb(var(--fg))',
      background: 'rgb(var(--surface))',
    });

    if (!result.isConfirmed) return;

    setBulkLoading(true);
    try {
      await Promise.all(
        selectedProjects.map(id =>
          fetch(`/api/projects/${id}`, { method: 'DELETE' })
        )
      );
      await fetchProjects();
      setSelectedProjects([]);
      // Show success notification
      Swal.fire({
        title: 'Success!',
        text: `${selectedProjects.length} project(s) deleted successfully!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        color: 'rgb(var(--fg))',
        background: 'rgb(var(--surface))',
        confirmButtonColor: '#15803d',
      });
    } catch (error) {
      logger.error('Error deleting projects:', error);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredProjects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'projects-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredProjects = projects.filter(
    project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-fg">
          Project Management
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {selectedProjects.length > 0 && (
            <div className="flex items-center justify-between sm:justify-start space-x-2 bg-surface rounded-md p-2 sm:p-0 sm:bg-transparent">
              <span className="text-sm text-muted">
                {selectedProjects.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                disabled={bulkLoading}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
              >
                {bulkLoading && (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                )}
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Delete Selected</span>
                <span className="sm:hidden">Delete</span>
              </button>
            </div>
          )}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-surface border border-line text-fg rounded-md hover:bg-bg transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-brand-solid text-brand-on rounded-md hover:bg-brand-solid/90 transition-colors text-sm"
            >
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add New Project</span>
              <span className="sm:hidden">Add Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-surface border border-line text-fg rounded-md hover:bg-bg transition-colors whitespace-nowrap">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 text-muted hover:text-fg transition-colors"
          >
            {selectedProjects.length === filteredProjects.length ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5" />
            )}
            <span className="text-sm">
              {selectedProjects.length === filteredProjects.length
                ? 'Deselect All'
                : 'Select All'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-surface rounded-lg border border-line overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-bg relative">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <button
                    onClick={() => handleSelectProject(project.id)}
                    className="text-white hover:text-brand transition-colors"
                  >
                    {selectedProjects.includes(project.id) ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-fg">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-1 bg-brand-solid text-brand-on text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-muted text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies
                    .split(',')
                    .slice(0, 3)
                    .map(tech => (
                      <span
                        key={tech.trim()}
                        className="px-2 py-1 bg-bg text-muted text-xs rounded"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  {project.technologies.split(',').length > 3 && (
                    <span className="px-2 py-1 bg-bg text-muted text-xs rounded">
                      +{project.technologies.split(',').length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex items-center justify-center px-3 py-1 bg-brand-solid text-brand-on text-sm rounded hover:bg-brand-solid/90 transition-colors flex-1 sm:flex-none"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center justify-center px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors flex-1 sm:flex-none"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                  <button
                    onClick={() => handleView(project)}
                    className="flex items-center justify-center px-3 py-1 bg-bg border border-line text-fg text-sm rounded hover:bg-surface transition-colors flex-1 sm:flex-none"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">No projects found</p>
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg border border-line w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-line">
              <h3 className="text-xl font-semibold text-fg">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={resetForm} className="text-muted hover:text-fg">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Project Image *
                  </label>
                  <ImageUpload
                    onImageSelect={url =>
                      setFormData(prev => ({
                        ...prev,
                        imageUrl: url,
                      }))
                    }
                    currentImage={formData.imageUrl}
                    folder="projects"
                    showPreview={true}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, link: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        githubUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Technologies
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.technologies.split(',').map(
                    tech =>
                      tech.trim() && (
                        <span
                          key={tech.trim()}
                          className="flex items-center px-3 py-1 bg-brand-solid text-brand-on rounded-full text-sm"
                        >
                          {tech.trim()}
                          <button
                            type="button"
                            onClick={() => removeTechnology(tech.trim())}
                            className="ml-2 hover:text-red-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add technology..."
                    className="flex-1 px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechnology(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={e => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement;
                      addTechnology(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-brand-solid text-brand-on rounded-md hover:bg-brand-solid/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-fg">
                  Featured Project
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-line">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-bg border border-line text-fg rounded-md hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center px-4 py-2 bg-brand-solid text-brand-on rounded-md hover:bg-brand-solid/90 transition-colors disabled:opacity-50"
                >
                  {formLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  <Save className="h-4 w-4 mr-2" />
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project View Modal */}
      {viewingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg border border-line w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-line">
              <h3 className="text-xl font-semibold text-fg">Project Details</h3>
              <button
                onClick={() => setViewingProject(null)}
                className="text-muted hover:text-fg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Image */}
              <div className="aspect-video bg-bg rounded-md overflow-hidden">
                <img
                  src={viewingProject.imageUrl}
                  alt={viewingProject.title}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
                  }}
                />
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-fg mb-2">
                    {viewingProject.title}
                  </h4>
                  {viewingProject.featured && (
                    <span className="inline-block px-2 py-1 bg-brand-solid text-brand-on text-xs rounded-full mb-3">
                      Featured Project
                    </span>
                  )}
                  <p className="text-muted text-sm mb-4">
                    {viewingProject.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Links */}
                  <div className="space-y-2">
                    {viewingProject.link && (
                      <div>
                        <label className="text-sm font-medium text-fg">
                          Live Demo:
                        </label>
                        <a
                          href={viewingProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-brand hover:text-brand text-sm break-all"
                        >
                          {viewingProject.link}
                        </a>
                      </div>
                    )}
                    {viewingProject.githubUrl && (
                      <div>
                        <label className="text-sm font-medium text-fg">
                          GitHub:
                        </label>
                        <a
                          href={viewingProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-brand hover:text-brand text-sm break-all"
                        >
                          {viewingProject.githubUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="text-sm font-medium text-fg mb-2 block">
                      Technologies:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {viewingProject.technologies.split(',').map(tech => (
                        <span
                          key={tech.trim()}
                          className="px-2 py-1 bg-bg text-muted text-xs rounded"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Metadata */}
                  <div className="text-sm text-muted space-y-1">
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {new Date(viewingProject.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {new Date(viewingProject.updatedAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Slug:</span>{' '}
                      {viewingProject.slug}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-line">
                <button
                  onClick={() => setViewingProject(null)}
                  className="px-4 py-2 bg-bg border border-line text-fg rounded-md hover:bg-surface transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setViewingProject(null);
                    handleEdit(viewingProject);
                  }}
                  className="flex items-center px-4 py-2 bg-brand-solid text-brand-on rounded-md hover:bg-brand-solid/90 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
