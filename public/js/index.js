window.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  await loadFeaturedOrganizations();
  await loadFeaturedProjects();
});

function setupNavigation() {
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  //const isOrg = localStorage.getItem('isOrg') === 'true';

  const nav = document.querySelector('header nav');
  nav.innerHTML = `
    <a href="/index.html">Home</a>
    <a href="/html/organization.html">Organizations</a>
    <a href="/html/projects.html">Projects</a>
  `;

  if (token && userName) {
    const welcomeSpan = document.createElement('span');
    welcomeSpan.textContent = `Welcome, ${userName}`;
    welcomeSpan.style.cssText = 'color: white; margin-left: 10px;';

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.cssText =
      'margin-left: 10px; background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px;';

    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      location.reload();
    });

    nav.appendChild(welcomeSpan);
    nav.appendChild(logoutBtn);
  } else {
    // Not logged in — add login/signup links
    nav.innerHTML += `
      <a href="/html/user-auth.html">Signup</a>
      <a href="/html/user-auth.html">Login</a>
    `;
  }
}

async function loadFeaturedOrganizations() {
  try {
    const res = await axios.get('/api/organization/all');
    const orgList = document.getElementById('org-list');

    if (res.data.organizations && Array.isArray(res.data.organizations)) {
      res.data.organizations.slice(0, 3).forEach(org => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${org.orgName}</h3>
          <p>${org.description}</p>
          <small>${org.city}, ${org.state}</small>
        `;
        orgList.appendChild(card);
      });
    }
  } catch (error) {
    console.error('Error loading organizations:', error);
  }
}

async function loadFeaturedProjects() {
  try {
    const res = await axios.get('/api/project/all');
    const projectList = document.getElementById('project-list');

    if (Array.isArray(res.data)) {
      res.data.slice(0, 3).forEach(project => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <p>Raised: ₹${project.amountRaised.toLocaleString()} / ₹${project.goal.toLocaleString()}</p>
          <small>Deadline: ${new Date(project.deadline).toLocaleDateString()}</small>
        `;
        projectList.appendChild(card);
      });
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}
