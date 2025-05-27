require('dotenv').config(); // Load environment variables

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function getProject(owner, repoName) {
  const [rows] = await pool.execute(
    'SELECT * FROM github_vercel_projects WHERE github_owner = ? AND github_repo_name = ?',
    [owner, repoName]
  );
  return rows.length ? rows[0] : null;
}

async function insertProject(owner, repoName, vercelProjectId, deploymentUrl) {
  await pool.execute(
    `INSERT INTO github_vercel_projects (
      github_owner, github_repo_name, vercel_project_id, deployment_url, created_at, updated_at
    ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [owner, repoName, vercelProjectId, deploymentUrl]
  );
}

async function updateProjectId(owner, repoName, vercelProjectId) {
  await pool.execute(
    `UPDATE github_vercel_projects
     SET vercel_project_id = ?, updated_at = NOW()
     WHERE github_owner = ? AND github_repo_name = ?`,
    [vercelProjectId, owner, repoName]
  );
}

async function updateDeploymentUrl(owner, repoName, deploymentUrl) {
  await pool.execute(
    `UPDATE github_vercel_projects
     SET deployment_url = ?, updated_at = NOW()
     WHERE github_owner = ? AND github_repo_name = ?`,
    [deploymentUrl, owner, repoName]
  );
}

async function updateProjectDeploymentStatus(owner, repoName, status) {
  await pool.execute(
    `UPDATE github_vercel_projects
     SET deployment_status = ?, updated_at = NOW()
     WHERE github_owner = ? AND github_repo_name = ?`,
    [status, owner, repoName]
  );
}

module.exports = {
  getProject,
  insertProject,
  updateProjectId,
  updateDeploymentUrl,
  updateProjectDeploymentStatus
};
