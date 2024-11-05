// src/lib/github.ts
const API_BASE_URL = 'http://localhost:3000/api/github';
const GITHUB_USERNAME = 'chongwongus'; // Your GitHub username

interface GitHubRepo {
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string;
  }
  
export async function fetchUserProfile() {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/user/${GITHUB_USERNAME}`);
      const response = await fetch(`${API_BASE_URL}/user/${GITHUB_USERNAME}`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      console.log('Response text:', text);
      return JSON.parse(text);
    } catch (error) {
      console.error('Detailed error fetching user profile:', error);
      return null;
    }
  }
  
  export async function fetchUserRepos() {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/user/${GITHUB_USERNAME}/repos`);
      const response = await fetch(`${API_BASE_URL}/user/${GITHUB_USERNAME}/repos`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      console.log('Response text:', text);
      const repos: GitHubRepo[] = JSON.parse(text);
      return repos.map((repo: GitHubRepo) => ({
        name: repo.name,
        description: repo.description || 'No description available',
        tech: [repo.language].filter(Boolean),
        status: repo.open_issues_count > 0 ? 'Active Development' : 'Completed',
        metrics: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          issues: repo.open_issues_count
        }
      }));
    } catch (error) {
      console.error('Detailed error fetching repos:', error);
      return [];
    }
  }
    
  
export async function fetchRepoStats(repoName: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${GITHUB_USERNAME}/repo/${repoName}/stats`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching repo stats:', error);
    return null;
  }
}