document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('main');
  const form = document.getElementById('signup-form');
  const togglePasswordButton = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  const signUpButton = document.getElementById('signUpButton');

  // Password visibility toggle
  togglePasswordButton.addEventListener('click', function () {
    const type =
      passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordButton.textContent = type === 'password' ? 'Show' : 'Hide';
  });

  // Form validation
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    let isValid = true;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach((el) => {
      el.textContent = '';
    });

    // Validate first name
    const firstName = document.getElementById('first-name');
    if (!firstName.value.trim()) {
      document.getElementById('first-name-error').textContent =
        'First name is required';
      isValid = false;
    }

    // Validate last name
    const lastName = document.getElementById('last-name');
    if (!lastName.value.trim()) {
      document.getElementById('last-name-error').textContent =
        'Last name is required';
      isValid = false;
    }

    // Validate email
    const email = document.getElementById('email');
    if (!email.value.trim()) {
      document.getElementById('email-error').textContent = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      document.getElementById('email-error').textContent =
        'Please enter a valid email address';
      isValid = false;
    }

    // Validate password
    if (!passwordInput.value) {
      document.getElementById('password-error').textContent =
        'Password is required';
      isValid = false;
    } else if (!isValidPassword(passwordInput.value)) {
      document.getElementById('password-error').textContent =
        'Password must be at least 8 characters with a number, a capital letter and special character';
      isValid = false;
    }

    // Validate terms agreement
    const terms = document.getElementById('terms');
    if (!terms.checked) {
      document.getElementById('terms-error').textContent =
        'You must agree to the terms';
      isValid = false;
    }

    // Submit form if valid
    if (isValid) {
      // Here you would typically submit the form data to your server
      signUpButton.disabled = true;
      signUpButton.textContent = 'Creating...';
      try {
        const response = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: passwordInput.value,
          }),
        });
        const data = await response.json();
        if (data.created) showSuccessMessage();
      } catch (error) {
        showError('Could Not Create User');
        signUpButton.disabled = false;
        signUpButton.textContent = 'Create Account';
      }
    }
  });

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation helper
  function isValidPassword(password) {
    // At least 8 characters, 1 number, and 1 special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  }

  // Success message helper
  function showSuccessMessage() {
    main.innerHTML = `
            <div class="success-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Account Created Successfully!</h3>
                <p>Welcome to Minimal Blog. Check your email for confirmation.</p>
                <a href="/validate-email" class="return-home">Verify Email</a>
            </div>
        `;

    // Add success styles
    const successStyles = document.createElement('style');
    successStyles.textContent = `
            main{
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .success-message {
                text-align: center;
                padding: 20px;
            }
            .success-icon {
                color: var(--success-color);
                margin-bottom: 20px;
            }
            .success-message h3 {
                margin-bottom: 12px;
                font-weight: 500;
            }
            .return-home {
                display: inline-block;
                margin-top: 24px;
                padding: 10px 20px;
                background-color: var(--primary-color);
                color: white;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            .return-home:hover {
                background-color: var(--primary-hover);
            }
        `;
    document.head.appendChild(successStyles);
  }
});
