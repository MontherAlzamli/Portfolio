'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Globe,
  Download,
} from 'lucide-react';

interface AnalyticsData {
  contentStats: {
    totalProjects: number;
    totalSkills: number;
    totalExperience: number;
    featuredProjects: number;
  };
  skillDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  contactAnalytics: {
    totalContacts: number;
    unreadContacts: number;
    recentContacts: number;
  };
  experienceTimeline: Array<{
    startDate: string;
    endDate: string | null;
    current: boolean;
    duration: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    featured: boolean;
    createdAt: string;
  }>;
}

export default function AnalyticsTab() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    contentStats: {
      totalProjects: 0,
      totalSkills: 0,
      totalExperience: 0,
      featuredProjects: 0,
    },
    skillDistribution: [],
    contactAnalytics: {
      totalContacts: 0,
      unreadContacts: 0,
      recentContacts: 0,
    },
    experienceTimeline: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch analytics data on component mount
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (error) {
      logger.error('Error fetching analytics:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analytics-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-fg">Analytics Dashboard</h2>
        <button
          onClick={handleExportData}
          className="flex items-center px-4 py-2 bg-brand-solid text-brand-on rounded-md hover:bg-brand-solid/90 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-md text-danger">
          {error}
        </div>
      ) : (
        <>
          {/* Key Metrics - Real Data Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface rounded-lg p-6 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">Total Projects</p>
                  <p className="text-3xl font-bold text-fg">
                    {analyticsData.contentStats.totalProjects}
                  </p>
                  <p className="text-brand text-sm mt-1">
                    {analyticsData.contentStats.featuredProjects} featured
                  </p>
                </div>
                <div className="p-3 bg-brand/20 rounded-md">
                  <Eye className="h-6 w-6 text-brand" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">Skills</p>
                  <p className="text-3xl font-bold text-fg">
                    {analyticsData.contentStats.totalSkills}
                  </p>
                  <p className="text-brand text-sm mt-1">
                    Across {analyticsData.skillDistribution.length} categories
                  </p>
                </div>
                <div className="p-3 bg-brand/20 rounded-md">
                  <Calendar className="h-6 w-6 text-brand" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">Experience</p>
                  <p className="text-3xl font-bold text-fg">
                    {analyticsData.contentStats.totalExperience}
                  </p>
                  <p className="text-orange-400 text-sm mt-1">Work positions</p>
                </div>
                <div className="p-3 bg-brand/20 rounded-md">
                  <Users className="h-6 w-6 text-brand" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">Contact Messages</p>
                  <p className="text-3xl font-bold text-fg">
                    {analyticsData.contactAnalytics.totalContacts}
                  </p>
                  <p className="text-danger text-sm mt-1">
                    {analyticsData.contactAnalytics.unreadContacts} unread
                  </p>
                </div>
                <div className="p-3 bg-brand/20 rounded-md">
                  <BarChart3 className="h-6 w-6 text-brand" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface rounded-lg p-6 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">Total Projects</p>
                  <p className="text-3xl font-bold text-fg">
                    {analyticsData.contentStats.totalProjects}
                  </p>
                  <p className="text-brand text-sm mt-1">
                    {analyticsData.contentStats.featuredProjects} featured
                  </p>
                </div>
                <div className="p-3 bg-brand/20 rounded-md">
                  <BarChart3 className="h-6 w-6 text-brand" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">Skills</p>
                  <p className="text-3xl font-bold text-fg">
                    {analyticsData.contentStats.totalSkills}
                  </p>
                  <p className="text-brand text-sm mt-1">Across categories</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-md">
                  <TrendingUp className="h-6 w-6 text-brand" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">Experience</p>
                  <p className="text-3xl font-bold text-fg">
                    {analyticsData.contentStats.totalExperience}
                  </p>
                  <p className="text-orange-400 text-sm mt-1">Work positions</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-md">
                  <Calendar className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">Featured</p>
                  <p className="text-3xl font-bold text-fg">
                    {analyticsData.contentStats.featuredProjects}
                  </p>
                  <p className="text-purple-400 text-sm mt-1">
                    Highlighted projects
                  </p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-md">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Skill Distribution */}
          <div className="bg-surface rounded-lg p-6 border border-line mb-8">
            <h3 className="text-lg font-semibold text-fg mb-4">
              Skills Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.skillDistribution.map((skill, index) => (
                <div key={skill.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted text-sm">{skill.category}</span>
                    <span className="text-fg text-sm font-medium">
                      {skill.count} skills
                    </span>
                  </div>
                  <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-brand-solid rounded-full transition-all duration-500"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted text-right">
                    {skill.percentage}% of total skills
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="bg-surface rounded-lg p-6 border border-line mb-8">
            <h3 className="text-lg font-semibold text-fg mb-4">
              Experience Timeline
            </h3>
            <div className="space-y-4">
              {analyticsData.experienceTimeline.map((exp, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-brand-solid rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-fg font-medium">
                        {new Date(exp.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                        {exp.current
                          ? ' - Present'
                          : exp.endDate
                            ? ` - ${new Date(exp.endDate).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                }
                              )}`
                            : ''}
                      </span>
                      <span className="text-muted text-sm">{exp.duration}</span>
                    </div>
                    {exp.current && (
                      <div className="text-xs text-brand mt-1">
                        Currently active
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Projects List */}
          <div className="bg-surface rounded-lg p-6 border border-line mb-8">
            <h3 className="text-lg font-semibold text-fg mb-4">All Projects</h3>
            <div className="space-y-3">
              {analyticsData.projects.map((project, index) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-bg rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-solid rounded-md flex items-center justify-center text-brand-on font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-fg font-medium">
                        {project.title}
                      </span>
                      {project.featured && (
                        <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-muted text-sm">
                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface rounded-lg p-6 border border-line">
            <h3 className="text-lg font-semibold text-fg mb-4">
              Portfolio Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-solid rounded-full"></div>
                <p className="text-muted">
                  Portfolio contains {analyticsData.contentStats.totalProjects}{' '}
                  projects
                </p>
                <span className="text-muted text-sm">Real data</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-solid rounded-full"></div>
                <p className="text-muted">
                  {analyticsData.contentStats.totalSkills} skills across{' '}
                  {analyticsData.skillDistribution.length} categories
                </p>
                <span className="text-muted text-sm">Real data</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-solid rounded-full"></div>
                <p className="text-muted">
                  {analyticsData.contentStats.totalExperience} work experiences
                  documented
                </p>
                <span className="text-muted text-sm">Real data</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-solid rounded-full"></div>
                <p className="text-muted">
                  {analyticsData.contactAnalytics.totalContacts} contact
                  messages received
                </p>
                <span className="text-muted text-sm">Real data</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
