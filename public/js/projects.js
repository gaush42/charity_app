const API_BASE = 'http://localhost:3000/api';
const token = localStorage.getItem('token');

function authHeaders() {
  return { headers: { Authorization: `Bearer ${token}` } };
}

async function loadProjects() {
  try {
    const res = await axios.get(`${API_BASE}/project/all`);
    const projects = res.data;

    const list = document.getElementById('projectList');
    /*list.innerHTML = projects.map(p => `
      <div class="project">
        <h3>${p.title}</h3>
        <p><b>Description:</b> ${p.description}</p>
        <p><b>Goal:</b> ₹${p.goal} &nbsp; | &nbsp; <b>Raised:</b> ₹${p.amountRaised}</p>
        <p><b>Deadline:</b> ${new Date(p.deadline).toLocaleDateString()}</p>
        <form onsubmit="donate(event, ${p.id})">
          <input type="number" name="amount" min="1" placeholder="Amount ₹" required />
          <button type="submit">Donate</button>
        </form>
      </div>
    `).join('');*/
    list.innerHTML = projects.map(p => `
    <div class="project">
      <h3>${p.title}</h3>
      <p><strong>Description:</strong> ${p.description}</p>
      <p><strong>Goal:</strong> ₹${p.goal} &nbsp; | &nbsp; <strong>Raised:</strong> ₹${p.amountRaised}</p>
      <p><strong>Deadline:</strong> ${new Date(p.deadline).toLocaleDateString()}</p>
      <form onsubmit="donate(event, ${p.id})">
        <input type="number" name="amount" min="1" placeholder="Amount ₹" required />
        <button type="submit">Donate</button>
      </form>
    </div>
  `).join('');

  } catch (err) {
    alert('Error loading projects');
    console.error(err);
  }
}

async function donate(event, projectId) {
  event.preventDefault();
  const form = event.target;
  const amount = parseFloat(form.amount.value);

  try {
    await axios.post(`${API_BASE}/donation/donate`, { projectId, amount }, authHeaders());
    alert('Thank you for your donation!');
    loadProjects(); // Refresh to update amountRaised
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to donate');
  }
}

loadProjects();
