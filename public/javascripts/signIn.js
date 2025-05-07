document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signin-form');
    const togglePasswordButton = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    // Password visibility toggle
    togglePasswordButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordButton.textContent = type === 'password' ? 'Show' : 'Hide';
    });
    
    // Form validation
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        // Validate email
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            document.getElementById('email-error').textContent = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate password
        if (!passwordInput.value) {
            document.getElementById('password-error').textContent = 'Password is required';
            isValid = false;
        }
        
        // Submit form if valid
        if (isValid) {
            simulateAuthentication(email.value, passwordInput.value);
        }
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Authentication simulation
    async function simulateAuthentication(email, password) {
        // Show loading state
        const submitButton = document.querySelector('.signin-button');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Signing in...';
        
        // Simulate API call delay
        try {
            const response = await fetch('/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            const data = await response.json();
            if(data.authenticated){
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                window.location.href = '/';
            }
            else throw new Error('Invalid Username or Password');   
        } catch (error) {
            document.getElementById('signin-error').textContent = 'Invalid Username or Password';
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            showError("Failed to sign in");
        }
    }
});