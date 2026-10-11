'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import logger from '@/lib/logger';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Search,
  Save,
  X,
  Loader2,
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  iconUrl?: string;
  order: number;
}

interface SkillFormData {
  name: string;
  category: string;
  level: number;
  iconUrl: string;
}

const skillCategories = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Design',
  'Tools',
  'Other',
];

const skillLevels = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Novice' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' },
];

export default function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    category: 'Frontend',
    level: 3,
    iconUrl: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [draggedSkill, setDraggedSkill] = useState<string | null>(null);

  // Fetch skills
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data.data || []);
      }
    } catch (error) {
      logger.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const url = editingSkill
        ? `/api/skills/${editingSkill.id}`
        : '/api/skills';

      const method = editingSkill ? 'PUT' : 'POST';

      const skillData = {
        ...formData,
        order: editingSkill ? editingSkill.order : skills.length + 1,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillData),
      });

      if (response.ok) {
        await fetchSkills();
        resetForm();
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: editingSkill
            ? 'Skill updated successfully!'
            : 'Skill created successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: 'rgb(var(--fg))',
          background: 'rgb(var(--surface))',
          confirmButtonColor: '#15803d',
        });
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
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSkills();
        Swal.fire({
          title: 'Deleted!',
          text: 'Skill has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: 'rgb(var(--fg))',
          background: 'rgb(var(--surface))',
          confirmButtonColor: '#15803d',
        });
      }
    } catch (error) {
      logger.error('Error deleting skill:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete skill.',
        icon: 'error',
        color: 'rgb(var(--fg))',
        background: 'rgb(var(--surface))',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      iconUrl: skill.iconUrl || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Frontend',
      level: 3,
      iconUrl: '',
    });
    setEditingSkill(null);
    setShowForm(false);
  };

  const handleDragStart = (e: React.DragEvent, skillId: string) => {
    setDraggedSkill(skillId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetSkillId: string) => {
    e.preventDefault();

    if (!draggedSkill || draggedSkill === targetSkillId) return;

    const draggedSkillData = skills.find(s => s.id === draggedSkill);
    const targetSkillData = skills.find(s => s.id === targetSkillId);

    if (!draggedSkillData || !targetSkillData) return;

    // Update order
    const newSkills = [...skills];
    const draggedIndex = newSkills.findIndex(s => s.id === draggedSkill);
    const targetIndex = newSkills.findIndex(s => s.id === targetSkillId);

    newSkills.splice(draggedIndex, 1);
    newSkills.splice(targetIndex, 0, draggedSkillData);

    // Update order numbers
    newSkills.forEach((skill, index) => {
      skill.order = index + 1;
    });

    setSkills(newSkills);

    // Update in database
    try {
      await Promise.all(
        newSkills.map(skill =>
          fetch(`/api/skills/${skill.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: skill.order }),
          })
        )
      );
    } catch (error) {
      logger.error('Error updating skill order:', error);
      // Revert on error
      await fetchSkills();
    }

    setDraggedSkill(null);
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedSkills = filteredSkills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-fg">Skills Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-brand-solid text-brand-on rounded-md hover:bg-brand-solid/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Skill
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
        >
          <option value="All">All Categories</option>
          {skillCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div
            key={category}
            className="bg-surface rounded-lg border border-line p-6"
          >
            <h3 className="text-xl font-semibold text-fg mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills
                .sort((a, b) => a.order - b.order)
                .map(skill => (
                  <div
                    key={skill.id}
                    draggable
                    onDragStart={e => handleDragStart(e, skill.id)}
                    onDragOver={handleDragOver}
                    onDrop={e => handleDrop(e, skill.id)}
                    className="bg-bg rounded-md border border-line p-4 hover:shadow-md transition-shadow cursor-move"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="h-4 w-4 text-muted" />
                        {skill.iconUrl && (
                          <img
                            src={skill.iconUrl}
                            alt={skill.name}
                            className="h-6 w-6"
                          />
                        )}
                        <span className="font-medium text-fg">
                          {skill.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-1 text-brand hover:text-brand transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1 text-danger hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted">Proficiency</span>
                        <span className="text-xs text-brand font-medium">
                          {
                            skillLevels.find(l => l.value === skill.level)
                              ?.label
                          }
                        </span>
                      </div>
                      <div className="h-2 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-brand-solid rounded-full transition-all duration-300"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedSkills).length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">No skills found</p>
        </div>
      )}

      {/* Skill Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg border border-line w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-line">
              <h3 className="text-xl font-semibold text-fg">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button onClick={resetForm} className="text-muted hover:text-fg">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  {skillCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Proficiency Level *
                </label>
                <select
                  required
                  value={formData.level}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      level: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  {skillLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">
                  Icon URL
                </label>
                <input
                  type="url"
                  value={formData.iconUrl}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, iconUrl: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-bg border border-line rounded-md text-fg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
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
                  {editingSkill ? 'Update Skill' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
