'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import logger from '@/lib/logger';
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Search,
  Save,
  X,
  Loader2,
  Building2,
} from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
  order: number;
}

interface ExperienceFormData {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export default function ExperienceTab() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch experiences
  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experience?limit=500', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();

        setExperiences(data.data || []);
      } else {
        logger.error('Failed to fetch experiences:', response.status);
      }
    } catch (error) {
      logger.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const url = editingExperience
        ? `/api/experience/${editingExperience.id}`
        : '/api/experience';

      const method = editingExperience ? 'PUT' : 'POST';

      const experienceData = {
        ...formData,
        endDate: formData.current ? '' : formData.endDate || '',
        order: editingExperience
          ? editingExperience.order
          : experiences.length + 1,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
      });

      if (response.ok) {
        resetForm();

        Swal.fire({
          title: 'Success!',
          text: editingExperience
            ? 'Experience updated successfully!'
            : 'Experience created successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: 'rgb(var(--fg))',
          background: 'rgb(var(--surface))',
          confirmButtonColor: '#15803d',
        });

        // Then refresh the list
        setTimeout(async () => {
          await fetchExperiences();
          // Trigger dashboard refresh
          window.dispatchEvent(new CustomEvent('refreshDashboard'));
        }, 200);
      } else {
        const errorData = await response.json();
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
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchExperiences();
        Swal.fire({
          title: 'Deleted!',
          text: 'Experience has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: 'rgb(var(--fg))',
          background: 'rgb(var(--surface))',
          confirmButtonColor: '#15803d',
        });
      }
    } catch (error) {
      logger.error('Error deleting experience:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete experience.',
        icon: 'error',
        color: 'rgb(var(--fg))',
        background: 'rgb(var(--surface))',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      role: experience.role,
      startDate: experience.startDate.split('T')[0], // Convert to YYYY-MM-DD format
      endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
      description: experience.description,
      current: experience.current,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    });
    setEditingExperience(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const filteredExperiences = experiences.filter(
    experience =>
      experience.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          Experience Management
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setLoading(true);
              fetchExperiences();
            }}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-surface text-fg rounded-md hover:bg-bg transition-colors border border-line text-sm"
          >
            <Loader2 className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-brand-solid text-brand-on rounded-md hover:bg-brand-solid/90 transition-colors text-sm"
          >
            <Plus className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add New Experience</span>
            <span className="sm:hidden">Add Experience</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search experiences..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-4">
        {filteredExperiences
          .sort(
            (a, b) =>
              a.order - b.order ||
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
          .map((experience, index) => (
            <div
              key={experience.id}
              className="bg-surface rounded-lg border border-line p-4 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-solid rounded-md flex items-center justify-center">
                      <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-brand-on" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-fg">
                        {experience.role}
                      </h3>
                      {experience.current && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full self-start">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-base sm:text-lg text-brand font-medium mb-2">
                      {experience.company}
                    </p>
                    <div className="flex items-center text-muted text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(experience.startDate)} —{' '}
                        {experience.current
                          ? 'Present'
                          : experience.endDate
                            ? formatDate(experience.endDate)
                            : 'N/A'}
                      </span>
                    </div>
                    <p className="text-muted leading-relaxed text-sm sm:text-base">
                      {experience.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:flex-shrink-0">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="flex items-center justify-center px-3 py-1 bg-brand-solid text-brand-on text-sm rounded hover:bg-brand-solid/90 transition-colors flex-1 lg:flex-none"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="flex items-center justify-center px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors flex-1 lg:flex-none"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {filteredExperiences.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">No experiences found</p>
        </div>
      )}

      {/* Experience Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg border border-line w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-line">
              <h3 className="text-xl font-semibold text-fg">
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </h3>
              <button onClick={resetForm} className="text-muted hover:text-fg">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, role: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    disabled={formData.current}
                    className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                  placeholder="Describe your role, responsibilities, and achievements..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate,
                    }));
                  }}
                  className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                />
                <label htmlFor="current" className="ml-2 text-sm text-fg">
                  Currently working here
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
                  {editingExperience
                    ? 'Update Experience'
                    : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
