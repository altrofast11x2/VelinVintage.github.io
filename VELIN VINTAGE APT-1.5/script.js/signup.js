// Load users from localStorage
if (localStorage.getItem('velinUsers')) {
    window.VELIN = { users: JSON.parse(localStorage.getItem('velinUsers')), currentUser: null };
} else {
    window.VELIN = { users: [], currentUser: null };
}

// Password strength checker
const passwordInput = document.getElementById('password');
const strengthBar = document.querySelector('.strength-fill');
const strengthText = document.querySelector('.strength-text');
const strengthContainer = document.querySelector('.password-strength');

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    strengthBar.className = 'strength-fill';
    strengthText.className = 'strength-text';

    if (password.length === 0) {
        strengthContainer.style.display = 'none';
    } else {
        strengthContainer.style.display = 'block';
        if (strength <= 1) {
            strengthBar.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'WEAK PASSWORD';
        } else if (strength <= 2) {
            strengthBar.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'MEDIUM PASSWORD';
        } else {
            strengthBar.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'STRONG PASSWORD';
        }
    }
});

// Toggle password visibility
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleBtn = passwordInput.nextElementSibling;
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'HIDE';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = 'SHOW';
    }
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Check if email exists
function emailExists(email) {
    return window.VELIN.users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value.trim();
    const terms = document.getElementById('terms').checked;
    const newsletter = document.getElementById('newsletter').checked;

    // Reset errors
    document.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));

    let hasError = false;

    if (!firstName) {
        document.getElementById('firstName').classList.add('error');
        hasError = true;
    }

    if (!lastName) {
        document.getElementById('lastName').classList.add('error');
        hasError = true;
    }

    if (!email || !isValidEmail(email)) {
        document.getElementById('email').classList.add('error');
        showAlert('Please enter a valid email address', 'error');
        hasError = true;
    } else if (emailExists(email)) {
        document.getElementById('email').classList.add('error');
        showAlert('This email is already registered. Please login instead.', 'error');
        hasError = true;
    }

    if (!password || password.length < 8) {
        document.getElementById('password').classList.add('error');
        showAlert('Password must be at least 8 characters', 'error');
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('error');
        showAlert('Passwords do not match', 'error');
        hasError = true;
    }

    if (!terms) {
        showAlert('You must agree to the Terms & Conditions', 'error');
        hasError = true;
    }

    if (hasError) return;

    const signupBtn = document.getElementById('signupBtn');
    signupBtn.classList.add('loading');
    signupBtn.disabled = true;

    setTimeout(() => {
        const users = window.VELIN.users;
        const newUser = {
            id: users.length + 1,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phone: phone,
            newsletter: newsletter,
            createdAt: new Date().toISOString(),
            wishlist: [],
            ownedProducts: []
        };

        users.push(newUser);
        window.VELIN.users = users;
        localStorage.setItem('velinUsers', JSON.stringify(users));

        signupBtn.classList.remove('loading');
        signupBtn.disabled = false;

        showAlert('Account created successfully! Redirecting to main page...', 'success');
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 1500);
    }, 1500);
}

// Show alert
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