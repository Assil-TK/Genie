//../api/githubApi

// Fetch current logged-in user details
export async function fetchUser() {
  const res = await fetch('http://localhost:5010/api/user', {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Not logged in: ${errorDetails}`);
  }

  return res.json();
}

// Fetch user's repositories
export async function fetchRepos() {
  const res = await fetch('http://localhost:5010/api/repos', {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Failed to fetch repos: ${errorDetails}`);
  }

  return res.json();
}

// Fetch files from a specific repo and path
export async function fetchFiles(repo, path = '') {
  const res = await fetch(`http://localhost:5010/api/files?repo=${repo}&path=${path}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Failed to fetch files: ${errorDetails}`);
  }

  return res.json();
}

// Fetch content of a specific file from a repo
export async function fetchFileContent(repo, path) {
  try {
    const res = await fetch(`http://localhost:5010/api/file-content?repo=${repo}&path=${path}`, {
      credentials: 'include',
    });

    if (!res.ok) {
      const errorData = await res.json();
      if (res.status === 404) {
        console.warn(`File not found: ${path} in ${repo}`);
        return null;
      }
      throw new Error(`Failed to fetch file content: ${errorData.error || errorData.details || res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error in fetchFileContent:', error);
    return null;
  }
}

// Update content of a file in a repo
export async function updateFileContent(repo, path, content, sha, message) {
  const res = await fetch('http://localhost:5010/api/update-file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repo, path, content, sha, message }),
    credentials: 'include', // Make sure the session cookie is included
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Failed to update file: ${errorDetails}`);
  }

  return res.json();
}

// Save a React project to backend
export async function saveReactProject(projectName) {
  const res = await fetch('http://localhost:5010/api/react-projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ projectName }),
  });
  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Failed to save project: ${errorDetails}`);
  }
  return res.json();
}

// Fetch saved React projects from backend
export async function fetchReactProjects() {
  const res = await fetch('http://localhost:5010/api/react-projects', {
    credentials: 'include',
  });
  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Failed to fetch saved projects: ${errorDetails}`);
  }
  return res.json();
}
