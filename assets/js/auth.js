
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email && password) {
                // Use the global Auth object defined in main.js
                Auth.login(email);
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const name = document.getElementById('name').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            if (email && password && name) {
                // Simulate Signup then login
                alert(`Account created for ${name}!`);
                Auth.login(email);
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
});
