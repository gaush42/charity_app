window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await axios.get('/api/organization/all');
    const orgs = res.data.organizations;
    const container = document.getElementById('org-container');

    if (!Array.isArray(orgs)) {
      container.innerHTML = '<p>No organizations found.</p>';
      return;
    }

    orgs.forEach(org => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${org.orgName}</h3>
      <p><strong>Category:</strong> ${org.category}</p>
      <p>${org.description}</p>
      <small>${org.locality}, ${org.city}, ${org.district}, ${org.state} - ${org.pin}</small>
    `;
    container.appendChild(card);
  });
  } catch (error) {
    console.error("Failed to load organizations:", error);
    document.getElementById('org-container').innerHTML = `<p>Error loading data.</p>`;
  }
});
