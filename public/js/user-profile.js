const API_BASE_USER = 'http://localhost:3000/api/user';

function authHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
}

async function loadProfile() {
  const res = await axios.get(`${API_BASE_USER}/profile`, authHeaders());
  const user = res.data.user;
  const form = document.getElementById('profileForm');
  form.fullname.value = user.fullname;
  form.email.value = user.email;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.password) delete data.password; // optional
    await axios.put(`${API_BASE_USER}/profile`, data, authHeaders());
    alert('Profile updated!');
  };
}

async function loadDonations() {
  const res = await axios.get(`${API_BASE_USER}/donations`, authHeaders());
  const donations = res.data.donations;
  const tbody = document.getElementById('donationTableBody');
  tbody.innerHTML = donations.map(d => `
    <tr>
      <td>₹${d.amount}</td>
      <td>${d.Organization?.orgName || 'N/A'}</td>
      <td>${d.Project?.title || 'N/A'}</td>
      <td>${new Date(d.createdAt).toLocaleDateString()}</td>
    </tr>
  `).join('');
}

loadProfile();
loadDonations();
