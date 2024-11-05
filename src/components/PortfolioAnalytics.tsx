"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Code, GitFork, BookOpen, User, Star, Activity } from 'lucide-react';  // Add Star, Activity to imports
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchUserProfile, fetchUserRepos, fetchRepoStats } from '@/lib/github';
import Link from 'next/link';

interface ProjectMetrics {
  stars: number;
  forks: number;
  issues: number;
}

interface Project {
  name: string;
  description: string;
  tech: string[];
  status: string;
  metrics: ProjectMetrics;
}

interface GitHubData {
  profile: any;
  repos: Project[];
  stats: any;
}

interface Section {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProjectDetail {
  displayName: string;
  description: string;
  tech: string[];
  status: string;
}

// Then type the PROJECT_DETAILS object
const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'incremental-game-app': {
    displayName: "Incremental Life Tracker",
    description: "A life tracking app inspired by Runescape's skills with leveling curves and achievements. Created in Flutter utilizing Dart. Features mobile UI and implements tracking real life statistics such as steps taken.",
    tech: ["Flutter", "Dart", "Mobile"],
    status: "Active Development"
  },
  'newmangachecker': {
    displayName: "Manga Checker",
    description: "A test script in Cypress that checks for the latest chapter of a manga of choice. Utilizes pulling the API from MangaDex to check for chapters. Updates the chapter in a JSON file.",
    tech: ["Cypress", "JavaScript", "Automation"],
    status: "Completed"
  },
  'trivia-maze': {
    displayName: "Trivia Maze",
    description: "A Java trivia game featuring maze traversal with Swing GUI elements. Utilized SQL to manage a question database, optimizing access with HashMap data structures.",
    tech: ["Java", "SQL", "Swing"],
    status: "Completed"
  }
};


const PortfolioAnalytics: React.FC = () => {
  // Move these state declarations inside the component
  const [activeSection, setActiveSection] = useState('overview');
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  // Add useEffect here, right after the state declarations
  useEffect(() => {
    async function loadGitHubData() {
      setLoading(true);
      try {
        const [profile, repos] = await Promise.all([
          fetchUserProfile(),
          fetchUserRepos()
        ]);
  
        const featuredRepos = repos
        .filter(repo => Object.keys(PROJECT_DETAILS).includes(repo.name.toLowerCase()))
        .map(repo => {
          const details = PROJECT_DETAILS[repo.name.toLowerCase()];
          return {
            ...repo,
            name: details.displayName,
            description: details.description,
            tech: details.tech,
            status: details.status
          };
        });
        
        setGithubData({
          profile,
          repos: featuredRepos,
          stats: {
            totalRepos: featuredRepos.length,
            totalStars: featuredRepos.reduce((acc, repo) => acc + repo.metrics.stars, 0),
            totalForks: featuredRepos.reduce((acc, repo) => acc + repo.metrics.forks, 0)
          }
        });
      } catch (error) {
        console.error('Error loading GitHub data:', error);
      } finally {
        setLoading(false);
      }
    }
  
    loadGitHubData();
  }, []);
    
  const sections: Record<string, Section> = {
    overview: {
      title: "Overview",
      icon: User
    },
    projects: {
      title: "Projects",
      icon: Code
    },
    analytics: {
      title: "Growth Analytics",
      icon: GitFork
    },
    education: {
      title: "Education & Skills",
      icon: BookOpen
    }
  };

  // This is where the new renderContent function goes
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Richard Le</h2>
              <p className="mb-4">Software Engineer | CS Graduate Student</p>
              <p className="text-blue-100">
                Building innovative solutions with modern technologies.
                Currently focusing on full-stack development and algorithms.
              </p>
            </div>
          </div>
        );

      case 'projects':
        if (loading) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {githubData?.repos.map((project: Project) => (
              <Link
                href={`https://github.com/chongwongus/${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                target="_blank"
                rel="noopener noreferrer"
                key={project.name}
                className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'Active Development' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {project.tech.map((tech: string) => (
                    <span key={tech} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1" /> {project.metrics.stars}
                  </span>
                  <span className="flex items-center">
                    <GitFork className="h-4 w-4 mr-1" /> {project.metrics.forks}
                  </span>
                  <span className="flex items-center">
                    <Activity className="h-4 w-4 mr-1" /> {project.metrics.issues} issues
                  </span>
                </div>
              </Link>
            ))}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Contribution Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Jan', frontend: 30, backend: 20, mobile: 10 },
                    { month: 'Feb', frontend: 35, backend: 25, mobile: 15 },
                    { month: 'Mar', frontend: 40, backend: 30, mobile: 25 },
                    { month: 'Apr', frontend: 45, backend: 35, mobile: 30 },
                    { month: 'May', frontend: 50, backend: 40, mobile: 35 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="frontend"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="backend"
                      stroke="#16a34a"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="mobile"
                      stroke="#dc2626"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span className="text-sm">Frontend</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                  <span className="text-sm">Backend</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                  <span className="text-sm">Mobile</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-4">Learning Progress</h3>
                <div className="space-y-4">
                  {[
                    { label: 'LeetCode Progress', value: 33, color: 'blue' },
                    { label: 'Graduate Studies', value: 50, color: 'green' },
                    { label: 'Side Projects', value: 75, color: 'purple' }
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm text-gray-600">{item.label}</p>
                        <p className="text-sm font-medium">{item.value}%</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-${item.color}-500`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-4">GitHub Insights</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Contribution Streak', value: '15 days' },
                    { label: 'Most Active Time', value: '2-6 PM' },
                    { label: 'Most Used Language', value: 'TypeScript' },
                    { label: 'Weekly Commits', value: '23' }
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-4">Education</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Graduate Certificate in Computer Science</p>
                    <p className="text-sm text-gray-600">In Progress - Expected 2024</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Focusing on Advanced Algorithms and Software Engineering
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-4">Technical Skills</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="font-medium mb-3">Languages</p>
                  <div className="space-y-2">
                    {[
                      { name: 'JavaScript/TypeScript', level: 90 },
                      { name: 'Java', level: 85 },
                      { name: 'Dart', level: 75 },
                      { name: 'Python', level: 70 }
                    ].map(skill => (
                      <div key={skill.name} className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>{skill.name}</span>
                          <span className="text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-3">Frameworks & Libraries</p>
                  <div className="space-y-2">
                    {[
                      { name: 'React', level: 85 },
                      { name: 'Flutter', level: 80 },
                      { name: 'Express', level: 75 },
                      { name: 'Next.js', level: 70 }
                    ].map(skill => (
                      <div key={skill.name} className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>{skill.name}</span>
                          <span className="text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-600 h-1.5 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-3">Tools & Platforms</p>
                  <div className="space-y-2">
                    {[
                      { name: 'Git/GitHub', level: 90 },
                      { name: 'Docker', level: 75 },
                      { name: 'AWS', level: 70 },
                      { name: 'Firebase', level: 85 }
                    ].map(skill => (
                      <div key={skill.name} className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>{skill.name}</span>
                          <span className="text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-4">Current Learning Focus</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-2">Currently Learning</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Advanced Data Structures
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      System Design
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Cloud Architecture
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Upcoming Focus</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      Machine Learning
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      GraphQL
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      Microservices Architecture
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );



      default:
        return (
          <div className="space-y-6">
            <p>Section under construction...</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio & Analytics</CardTitle>
        <div className="flex space-x-4 mt-4">
          {Object.entries(sections).map(([key, section]) => {
            const IconComponent = section.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${activeSection === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{section.title}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default PortfolioAnalytics;