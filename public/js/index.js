window.addEventListener('DOMContentLoaded', async () => {
  try {
    const orgRes = await axios.get('/api/organization/all');
    const projectRes = await axios.get('/api/project/getall');

    const orgList = document.getElementById('org-list');
    orgRes.data.organizations.slice(0, 3).forEach(org => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${org.orgName}</h3>
        <p>${org.description}</p>
        <small>${org.city}, ${org.state}</small>
      `;
      orgList.appendChild(card);
    });

    const projectList = document.getElementById('project-list');
    projectRes.data.projects.slice(0, 3).forEach(project => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p>Raised: ₹${project.amountRaised} / ₹${project.goal}</p>
        <small>Deadline: ${new Date(project.deadline).toLocaleDateString()}</small>
      `;
      projectList.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading homepage:", error);
  }
});
