 // Load users from localStorage
        if (localStorage.getItem('velinUsers')) {
            window.VELIN = { users: JSON.parse(localStorage.getItem('velinUsers')), currentUser: null };
        } else {
            window.VELIN = { users: [], currentUser: null };
        }

        // Toggle Password Visibility
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleBtn = document.querySelector('.toggle-btn');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = 'HIDE';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = 'SHOW';
            }
        }

        // Email or Username validation
        function isValidEmailOrUsername(value) {
            return value.trim().length > 0; // Simple check for now, can be enhanced
        }

        // Find user by email or username
        function findUser(identifier) {
            return window.VELIN.users.find(user =>
                user.email.toLowerCase() === identifier.toLowerCase() ||
                (user.username && user.username.toLowerCase() === identifier.toLowerCase())
            );
        }

        // Handle Login
        function handleLogin(event) {
            event.preventDefault();

            const identifier = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');

            // Reset errors
            document.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));

            // Validation
            if (!identifier || !isValidEmailOrUsername(identifier)) {
                document.getElementById('email').classList.add('error');
                showAlert('Please enter a valid email or username', 'error');
                return;
            }

            if (!password) {
                document.getElementById('password').classList.add('error');
                showAlert('Please enter your password', 'error');
                return;
            }

            // Loading state
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                try {
                    const user = findUser(identifier);

                    if (!user) {
                        loginBtn.classList.remove('loading');
                        loginBtn.disabled = false;
                        document.getElementById('email').classList.add('error');
                        showAlert('No account found with this email or username. Please sign up first.', 'error');
                        return;
                    }

                    if (user.password !== password) {
                        loginBtn.classList.remove('loading');
                        loginBtn.disabled = false;
                        document.getElementById('password').classList.add('error');
                        showAlert('Incorrect password. Please try again.', 'error');
                        return;
                    }

                    // Login successful
                    window.VELIN.currentUser = { ...user, lastLogin: new Date().toISOString() };
                    localStorage.setItem('velinCurrentUser', JSON.stringify(window.VELIN.currentUser));
                    localStorage.setItem('velinUsers', JSON.stringify(window.VELIN.users));

                    loginBtn.classList.remove('loading');
                    loginBtn.disabled = false;

                    showAlert('Login successful! Redirecting to main page...', 'success');
                    setTimeout(() => {
                        window.location.href = 'main.html';
                    }, 1000);
                } catch (error) {
                    console.error('Login error:', error);
                    loginBtn.classList.remove('loading');
                    loginBtn.disabled = false;
                    showAlert('Login error occurred. Please try again.', 'error');
                }
            }, 1000);
        }

        // Handle Forgot Password
        function handleForgotPassword(event) {
            event.preventDefault();
            const email = prompt('Enter your email address:');
            if (email && isValidEmailOrUsername(email)) {
                const user = findUser(email);
                if (user) {
                    showAlert('Password reset link sent to ' + email, 'success');
                } else {
                    showAlert('No account found with this email', 'error');
                }
            } else if (email) {
                showAlert('Please enter a valid email address', 'error');
            }
        }

        // Show Alert
        function showAlert(message, type) {
            const alertError = document.getElementById('alertError');
            const alertSuccess = document.getElementById('alertSuccess');
            alertError.style.display = 'none';
            alertSuccess.style.display = 'none';
            if (type === 'error') {
                alertError.textContent = message;
                alertError.style.display = 'block';
                alertError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                alertSuccess.textContent = message;
                alertSuccess.style.display = 'block';
                alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            setTimeout(() => {
                alertError.style.display = 'none';
                alertSuccess.style.display = 'none';
            }, 5000);
        }

        // Load from URL params
        window.addEventListener('load', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const isNew = urlParams.get('new');
            const emailParam = urlParams.get('email');
            if (isNew && emailParam) {
                document.getElementById('email').value = decodeURIComponent(emailParam);
                document.getElementById('password').focus();
                showAlert('Account created successfully! Please login.', 'success');
            }
        });

        // Attach event listener
        document.getElementById('loginForm').addEventListener('submit', handleLogin);