const API_BASE = 'http://localhost:3000/api/admin';
const token = localStorage.getItem('token');

if (!token) {
  alert('Unauthorized. Please login as admin.');
  window.location.href = '/html/user-auth.html';
}

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${token}` }
});

document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardSummary();
  fetchPendingOrgs();
  fetchAllOrgs();
  fetchAllProjects();
  fetchAllUsers();
  fetchAllDonations();
});

function logout() {
  localStorage.clear();
  window.location.href = '/index.html';
}

function createCard(content, buttons = '') {
  return `<div class="card">${content}${buttons}</div>`;
}

// Fetch summary
async function fetchDashboardSummary() {
  const res = await axiosInstance.get('/dashboard');
  const summary = res.data;
  const container = document.getElementById('summary');
  container.innerHTML = `
    <div class="grid">
      ${createCard(`<h3>Total Orgs</h3><p>${summary.totalOrganizations}</p>`)}
      ${createCard(`<h3>Total Projects</h3><p>${summary.totalProjects}</p>`)}
      ${createCard(`<h3>Total Users</h3><p>${summary.totalUsers}</p>`)}
      ${createCard(`<h3>Total Donations</h3><p>${summary.totalDonations}</p>`)}
      ${createCard(`<h3>Total Donations</h3><p>₹ ${summary.totalRaised}</p>`)}
    </div>
  `;
}

async function fetchPendingOrgs() {
  const res = await axiosInstance.get('/organization/pending');
  const container = document.getElementById('pending-orgs');
  container.innerHTML = '';
  res.data.forEach(org => {
    const content = `<strong>${org.orgName}</strong> - ${org.email}`;
    const buttons = `
      <button onclick="approveOrg(${org.id})">Approve</button>
      <button class="reject" onclick="rejectOrg(${org.id})">Reject</button>
    `;
    container.innerHTML += createCard(content, buttons);
  });
}

async function approveOrg(id) {
  await axiosInstance.post(`/organization/${id}/approve`);
  fetchPendingOrgs();
  fetchAllOrgs();
}

async function rejectOrg(id) {
  await axiosInstance.delete(`/organization/${id}/reject`);
  fetchPendingOrgs();
}

async function fetchAllOrgs() {
  const res = await axiosInstance.get('/all-orgs');
  const container = document.getElementById('all-orgs');
  container.innerHTML = '';
  res.data.forEach(org => {
    container.innerHTML += createCard(
      `<strong>${org.orgName}</strong><br>${org.city}, ${org.state}`
    );
  });
}

async function fetchAllProjects() {
  const res = await axiosInstance.get('/all-projects');
  const container = document.getElementById('all-projects');
  container.innerHTML = '';
  res.data.forEach(p => {
    container.innerHTML += createCard(
      `<strong>${p.title}</strong><br>₹${p.amountRaised} / ₹${p.goal}`
    );
  });
}

async function fetchAllUsers() {
  const res = await axiosInstance.get('/all-users');
  const container = document.getElementById('all-users');
  container.innerHTML = '';
  res.data.forEach(user => {
    container.innerHTML += createCard(`${user.fullname} (${user.email})`);
  });
}

async function fetchAllDonations() {
  const res = await axiosInstance.get('/all-donations');
  const container = document.getElementById('all-donations');
  container.innerHTML = '';
  res.data.forEach(d => {
    const content = `
      <strong>₹${d.amount}</strong> - ${d.paymentStatus}<br>
      User: ${d.User?.fullname || 'N/A'}<br>
      Project: ${d.Project?.title || 'N/A'}<br>
      Org ID: ${d.orgId}
    `;
    container.innerHTML += createCard(content);
  });
}
