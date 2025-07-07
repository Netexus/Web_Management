    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const forgotLink = document.getElementById('forgotLink');

    const defaultPassword = 'Admin123';
    // const DB_PATH = path.join(__dirname, '../database/data.json');

    function obtenerContrasenaGuardada() {
      const pass = localStorage.getItem('adminPassword');
      return pass && pass.length >= 6 ? pass : defaultPassword;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const storedPassword = obtenerContrasenaGuardada();

      if (email === 'antony@rpm.com' && password === storedPassword) {
        localStorage.setItem('adminName', 'Antony');
        window.location.href = '../admin/dashboard.html';
      } else {
        errorMessage.classList.remove('hidden');
      }
    });

    emailInput.addEventListener('input', function () {
      if (emailInput.value.trim() === 'antony@rpm.com') {
        forgotLink.classList.remove('hidden');
      } else {
        forgotLink.classList.add('hidden');
      }
      errorMessage.classList.add('hidden');
    });