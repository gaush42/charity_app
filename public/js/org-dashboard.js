const API_BASE_ORG = "http://localhost:3000/api/organization";
const API_BASE_PRG = "http://localhost:3000/api/project";
const token = localStorage.getItem('token');
const content = document.getElementById('contentArea');

function authHeaders() {
  return { headers: { Authorization: `Bearer ${token}` } };
}

/*function loadProfile() {
  content.innerHTML = `
    <h2>Update Profile</h2>
    <form id="profileForm">
      <input name="orgName" placeholder="Organization Name" />
      <input name="category" placeholder="Category" />
      <input name="state" placeholder="State" />
      <input name="city" placeholder="City" />
      <input name="district" placeholder="District" />
      <input name="locality" placeholder="Locality" />
      <input name="pin" placeholder="PIN Code" type="number" />
      <textarea name="description" placeholder="Description"></textarea>
      <button type="submit">Update</button>
    </form>
  `;

  document.getElementById('profileForm').onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    await axios.put(`${API_BASE_ORG}/profile`, data, authHeaders());
    alert('Profile updated!');
  };
}*/
async function loadProfile() {
  try {
    const res = await axios.get(`${API_BASE_ORG}/profile`, authHeaders());
    const profile = res.data.organization; // <-- Corrected here

    /*content.innerHTML = `
      <h2>Update Profile</h2>
      <form id="profileForm">
        <input name="orgName" placeholder="Organization Name" value="${profile.orgName || ''}" />
        <select name="category">
          <option value="Education" ${profile.category === 'Education' ? 'selected' : ''}>Education</option>
          <option value="Healthcare" ${profile.category === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
          <option value="Environment" ${profile.category === 'Environment' ? 'selected' : ''}>Environment</option>
          <option value="Animal Welfare" ${profile.category === 'Animal Welfare' ? 'selected' : ''}>Animal Welfare</option>
          <option value="Disaster Relief" ${profile.category === 'Disaster Relief' ? 'selected' : ''}>Disaster Relief</option>
          <option value="Women Empowerment" ${profile.category === 'Women Empowerment' ? 'selected' : ''}>Women Empowerment</option>
          <option value="Rural Development" ${profile.category === 'Rural Development' ? 'selected' : ''}>Rural Development</option>
        </select>
        <input name="state" placeholder="State" value="${profile.state || ''}" />
        <input name="city" placeholder="City" value="${profile.city || ''}" />
        <input name="district" placeholder="District" value="${profile.district || ''}" />
        <input name="locality" placeholder="Locality" value="${profile.locality || ''}" />
        <input name="pin" placeholder="PIN Code" type="number" value="${profile.pin || ''}" />
        <textarea name="description" placeholder="Description">${profile.description || ''}</textarea>
        <button type="submit">Update</button>
      </form>
    `;*/
    content.innerHTML = `
      <h2 class="section-title">Update Profile</h2>
      <form id="profileForm" class="form">
        <input name="orgName" placeholder="Organization Name" value="${profile.orgName || ''}" class="form-input" />

        <select name="category" class="form-input">
          ${['Education', 'Healthcare', 'Environment', 'Animal Welfare', 'Disaster Relief', 'Women Empowerment', 'Rural Development']
            .map(c => `<option value="${c}" ${profile.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>

        <input name="state" placeholder="State" value="${profile.state || ''}" class="form-input" />
        <input name="city" placeholder="City" value="${profile.city || ''}" class="form-input" />
        <input name="district" placeholder="District" value="${profile.district || ''}" class="form-input" />
        <input name="locality" placeholder="Locality" value="${profile.locality || ''}" class="form-input" />
        <input name="pin" placeholder="PIN Code" type="number" value="${profile.pin || ''}" class="form-input" />
        <textarea name="description" placeholder="Description" class="form-input">${profile.description || ''}</textarea>

        <button type="submit" class="form-button">Update</button>
      </form>
    `;


    document.getElementById('profileForm').onsubmit = async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      await axios.put(`${API_BASE_ORG}/profile`, data, authHeaders());
      alert('Profile updated!');
    };
  } catch (err) {
    alert('Failed to load profile');
    console.error(err);
  }
}

async function loadDonations() {
  const res = await axios.get(`${API_BASE_ORG}/donations`, authHeaders());
  const donations = res.data.donations;

  const rows = donations.map(d => `
    <tr>
      <td>${d.User.fullname}</td>
      <td>${d.User.email}</td>
      <td>${d.Project.title}</td>
      <td>₹${d.amount}</td>
      <td>${d.paymentStatus}</td>
      <td>${d.transactionId}</td>
      <td>${new Date(d.createdAt).toLocaleString()}</td>
    </tr>
  `).join('');

  /*content.innerHTML = `
    <h2>Donation History</h2>
    <table border="1" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>Donor Name</th>
          <th>Email</th>
          <th>Project</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Transaction ID</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;*/
  content.innerHTML = `
    <h2 class="section-title">Donation History</h2>
    <div class="table-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Donor Name</th>
            <th>Email</th>
            <th>Project</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Transaction ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

}


async function loadProjects() {
  const res = await axios.get(`${API_BASE_PRG}/get`, authHeaders());
  const projects = res.data;

  /*content.innerHTML = `
    <h2>Projects</h2>
    <div id="projectList">
      ${projects.map(p => `
        <div id="project-${p.id}" style="border: 1px solid #444; padding: 10px; margin-bottom: 15px;">
          <strong>${p.title}</strong>
          <p>${p.description}</p>
          <p><b>Goal:</b> ₹${p.goal}</p>
          <p><b>Raised:</b> ₹${p.amountRaised}</p>
          <p><b>Deadline:</b> ${new Date(p.deadline).toLocaleDateString()}</p>
          <p><b>Status:</b> ${p.isActive ? 'Active' : 'Inactive'}</p>
          <button onclick="editProject(${p.id})">Edit</button>
          <button onclick="deleteProject(${p.id})">Delete</button>
        </div>
      `).join('')}
    </div>

    <h3>Create New Project</h3>
    <form id="createForm">
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" required></textarea>
      <input name="goal" placeholder="Goal Amount" type="number" step="0.01" required />
      <input name="deadline" placeholder="Deadline" type="date" required />
      <label>
        <input type="checkbox" name="isActive" checked /> Active
      </label>
      <button type="submit">Create</button>
    </form>
  `;*/
  content.innerHTML = `
    <h2 class="section-title">Projects</h2>
    <div id="projectList">
      ${projects.map(p => `
        <div class="project-card">
          <strong>${p.title}</strong>
          <p>${p.description}</p>
          <p><b>Goal:</b> ₹${p.goal}</p>
          <p><b>Raised:</b> ₹${p.amountRaised}</p>
          <p><b>Deadline:</b> ${new Date(p.deadline).toLocaleDateString()}</p>
          <p><b>Status:</b> ${p.isActive ? 'Active' : 'Inactive'}</p>
          <div class="project-actions">
            <button onclick="editProject(${p.id})" class="btn-edit">Edit</button>
            <button onclick="deleteProject(${p.id})" class="btn-delete">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>

    <h3 class="section-title">Create New Project</h3>
    <form id="createForm" class="form">
      <input name="title" placeholder="Title" required class="form-input" />
      <textarea name="description" placeholder="Description" required class="form-input"></textarea>
      <input name="goal" placeholder="Goal Amount" type="number" step="0.01" required class="form-input" />
      <input name="deadline" placeholder="Deadline" type="date" required class="form-input" />
      <label class="checkbox-label">
        <input type="checkbox" name="isActive" checked /> Active
      </label>
      <button type="submit" class="form-button">Create</button>
    </form>
  `;


  document.getElementById('createForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.isActive = formData.get('isActive') === 'on'; // checkbox handling
    console.log(data);
    await axios.post(`${API_BASE_PRG}/create`, data, authHeaders());
    alert('Project created');
    loadProjects();
  };
}

async function editProject(id) {
  const project = await axios.get(`${API_BASE_PRG}/get`, authHeaders());
  const current = project.data.find(p => p.id === id);

  const title = prompt("New title:", current.title);
  const description = prompt("New description:", current.description);
  const goal = prompt("New goal amount:", current.goal);
  const deadline = prompt("New deadline (YYYY-MM-DD):", current.deadline?.slice(0, 10));
  const isActive = confirm("Should the project be active?");

  if (title && description && goal && deadline) {
    await axios.put(`${API_BASE_PRG}/update/${id}`, {
      title,
      description,
      goal: parseFloat(goal),
      deadline,
      isActive
    }, authHeaders());
    alert('Updated');
    loadProjects();
  }
}
function deleteProject(id) {
  if (confirm('Are you sure you want to delete this project?')) {
    axios.delete(`${API_BASE_PRG}/delete/${id}`, authHeaders())
      .then(() => {
        alert('Deleted');
        loadProjects();
      });
  }
}
