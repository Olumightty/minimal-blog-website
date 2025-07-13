document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signin-form');
  const togglePasswordButton = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');

  // Password visibility toggle with enhanced UX
  togglePasswordButton.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordButton.classList.toggle('active');
    
    // Add subtle animation
    togglePasswordButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
      togglePasswordButton.style.transform = 'scale(1)';
    }, 100);
  });

  // Enhanced form validation with real-time feedback
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const signinError = document.getElementById('signin-error');

  // Real-time email validation
  emailInput.addEventListener('blur', function() {
    validateEmail(false);
  });

  emailInput.addEventListener('input', function() {
    if (emailError.classList.contains('show')) {
      validateEmail(false);
    }
  });

  // Real-time password validation
  passwordInput.addEventListener('blur', function() {
    validatePassword(false);
  });

  passwordInput.addEventListener('input', function() {
    if (passwordError.classList.contains('show')) {
      validatePassword(false);
    }
  });

  // Form submission with enhanced UX
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    let isValid = true;

    // Clear previous error messages
    clearErrors();

    // Validate email
    if (!validateEmail(true)) {
      isValid = false;
    }

    // Validate password
    if (!validatePassword(true)) {
      isValid = false;
    }

    // Submit form if valid
    if (isValid) {
      simulateAuthentication(emailInput.value, passwordInput.value);
    } else {
      // Add shake animation to form for invalid submission
      form.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        form.style.animation = '';
      }, 500);
    }
  });

  // Enhanced email validation
  function validateEmail(showError = true) {
    const email = emailInput.value.trim();
    
    if (!email) {
      if (showError) {
        showErrorMessage(emailError, 'Email is required');
      }
      return false;
    } else if (!isValidEmail(email)) {
      if (showError) {
        showErrorMessage(emailError, 'Please enter a valid email address');
      }
      return false;
    } else {
      hideErrorMessage(emailError);
      return true;
    }
  }

  // Enhanced password validation
  function validatePassword(showError = true) {
    const password = passwordInput.value;
    
    if (!password) {
      if (showError) {
        showErrorMessage(passwordError, 'Password is required');
      }
      return false;
    } else {
      hideErrorMessage(passwordError);
      return true;
    }
  }

  // Error message helpers
  function showErrorMessage(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Add error styling to input
    const inputWrapper = errorElement.previousElementSibling;
    if (inputWrapper && inputWrapper.classList.contains('input-wrapper')) {
      const input = inputWrapper.querySelector('input');
      input.style.borderColor = '#ef4444';
      input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }
  }

  function hideErrorMessage(errorElement) {
    errorElement.classList.remove('show');
    
    // Remove error styling from input
    const inputWrapper = errorElement.previousElementSibling;
    if (inputWrapper && inputWrapper.classList.contains('input-wrapper')) {
      const input = inputWrapper.querySelector('input');
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }
  }

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach((el) => {
      hideErrorMessage(el);
    });
  }

  // Email validation helper (unchanged)
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Enhanced authentication simulation with better loading states
  async function simulateAuthentication(email, password) {
    const submitButton = document.querySelector('.signin-button');
    const buttonText = submitButton.querySelector('.button-text');
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    buttonText.textContent = 'Signing in...';

    // Clear any previous errors
    clearErrors();

    try {
      // Simulate API call delay with actual fetch
      const response = await fetch('/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (data.authenticated) {
        // Success state
        submitButton.classList.remove('loading');
        submitButton.classList.add('success');
        buttonText.textContent = 'Success!';
        
        // Small delay before redirect for better UX
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        throw new Error('Invalid Username or Password');
      }
    } catch (error) {
      // Error state
      submitButton.disabled = false;
      submitButton.classList.remove('loading');
      buttonText.textContent = 'Sign In';
      
      // Show error message
      showErrorMessage(signinError, 'Invalid Username or Password');
      
      // Add shake animation to button
      submitButton.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        submitButton.style.animation = '';
      }, 500);
      
      // Show error using toaster if available
      if (typeof showError === 'function') {
        showError('Failed to sign in');
      }
    }
  }

  // Add input focus animations
  const inputs = document.querySelectorAll('.input-wrapper input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateY(-1px)';
      this.parentElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = '';
      this.parentElement.style.boxShadow = '';
    });
  });

  // Add social button hover effects
  const socialButtons = document.querySelectorAll('.social-button');
  socialButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  // Add CSS for shake animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
      20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
    
    .signin-button.success {
      background: linear-gradient(135deg, #10b981, #059669) !important;
    }
    
    .input-wrapper {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .social-button {
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
  `;
  document.head.appendChild(style);
});