let isSignup = false;

/*function toggleForm() {
  isSignup = !isSignup;
  document.getElementById('formTitle').innerText = isSignup ? 'Signup' : 'Login';
  document.getElementById('toggleLabel').innerText = isSignup ? 'Login' : 'Signup';

  if (document.getElementById('fullnameField'))
    document.getElementById('fullnameField').classList.toggle('hidden', !isSignup);

  if (document.getElementById('orgNameField'))
    document.getElementById('orgNameField').classList.toggle('hidden', !isSignup);
}*/
function toggleForm() {
  isSignup = !isSignup;

  document.getElementById('formTitle').innerText = isSignup ? 'Signup' : 'Login';
  document.getElementById('toggleLabel').innerText = isSignup ? 'Login' : 'Signup';

  const signupFields = document.getElementById('signupFields');
  if (signupFields) {
    // Show or hide the signup field section
    signupFields.classList.toggle('hidden', !isSignup);

    // Enable or disable all signup fields based on mode
    toggleFieldsetState(signupFields, isSignup);
  }
}
function toggleFieldsetState(container, enabled) {
  const elements = container.querySelectorAll('input, textarea, select');
  elements.forEach(el => {
    el.disabled = !enabled;
  });
}

/*function setupAuthForm(type) {
  const form = document.querySelector('form');
  const API_BASE = 'http://localhost:3000/api/auth';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    let endpoint = '';
    if (type === 'user') {
      endpoint = isSignup ? '/signup' : '/login';
    } else {
      endpoint = isSignup ? '/org-signup' : '/org-login';
    }

    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, data);
      localStorage.setItem('token', res.data.token);
      alert('Success!');
      // Redirect to dashboard or homepage
      window.location.href = '/html/org-dashboard.html';
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  });
}*/
function setupAuthForm(type) {
  const form = document.querySelector('form');
  const API_BASE = 'http://localhost:3000/api/auth';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    let endpoint = '';
    if (type === 'user') {
      endpoint = isSignup ? '/signup' : '/login';
    } else {
      endpoint = isSignup ? '/org-signup' : '/org-login';
    }

    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, data);
      const token = res.data.token;
      localStorage.setItem('token', token);

      const decoded = decodeJWT(token);

      if (decoded?.isAdmin) {
        window.location.href = '/html/admin.html';
        return;
      }

      if (res.data.user) {
      localStorage.setItem('userName', res.data.user.fullname);
      localStorage.setItem('isOrg', 'false');
      window.location.href = '/html/user-dashboard.html';
    } else if (res.data.Org) {
      localStorage.setItem('userName', res.data.Org.fullname);
      localStorage.setItem('isOrg', 'true');
      window.location.href = '/html/org-dashboard.html';
    }
      alert('Success!');

      // Redirection logic based on type and action
      if (type === 'org') {
        if (isSignup) {
          // After org signup, show login page
          window.location.href = '/html/org-auth.html';
        } else {
          // After org login, show org dashboard
          window.location.href = '/html/org-dashboard.html';
        }
      } else {
        if (isSignup) {
          // After user signup, show login page
          window.location.href = '/html/user-auth.html';
        } else {
          // After user login, go to user dashboard
          window.location.href = '/html/user-profile.html';
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  });
}
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

