document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('main');
  const form = document.getElementById('signup-form');
  const togglePasswordButton = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  const signUpButton = document.getElementById('signUpButton');
  const strengthBar = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');

  // Enhanced password visibility toggle with icon changes
  togglePasswordButton.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = togglePasswordButton.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    
    // Add animation effect
    togglePasswordButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
      togglePasswordButton.style.transform = 'scale(1)';
    }, 100);
  });

  // Password strength indicator
  passwordInput.addEventListener('input', function() {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    
    updatePasswordStrength(strength);
  });

  // Calculate password strength
  function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = 'Enter password';
    
    if (password.length === 0) {
      return { score: 0, feedback: 'Enter password', color: '#e5e7eb' };
    }
    
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[!@#$%^&*]/.test(password)) score += 25;
    
    if (score < 50) {
      feedback = 'Weak';
      return { score, feedback, color: '#ef4444' };
    } else if (score < 75) {
      feedback = 'Fair';
      return { score, feedback, color: '#f59e0b' };
    } else if (score < 100) {
      feedback = 'Good';
      return { score, feedback, color: '#10b981' };
    } else {
      feedback = 'Strong';
      return { score, feedback, color: '#10b981' };
    }
  }

  // Update password strength display
  function updatePasswordStrength(strength) {
    if (strengthBar && strengthText) {
      strengthBar.style.width = strength.score + '%';
      strengthBar.style.backgroundColor = strength.color;
      strengthText.textContent = strength.feedback;
      strengthText.style.color = strength.color;
    }
  }

  // Add input animation effects
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'translateY(0)';
    });
  });

  // Form validation with enhanced UX
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    let isValid = true;

    // Clear previous error messages with animation
    document.querySelectorAll('.error-message').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        el.textContent = '';
      }, 300);
    });

    // Validate first name
    const firstName = document.getElementById('first-name');
    if (!firstName.value.trim()) {
      showError('first-name-error', 'First name is required');
      addFieldError(firstName);
      isValid = false;
    } else {
      removeFieldError(firstName);
    }

    // Validate last name
    const lastName = document.getElementById('last-name');
    if (!lastName.value.trim()) {
      showError('last-name-error', 'Last name is required');
      addFieldError(lastName);
      isValid = false;
    } else {
      removeFieldError(lastName);
    }

    // Validate email
    const email = document.getElementById('email');
    if (!email.value.trim()) {
      showError('email-error', 'Email is required');
      addFieldError(email);
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError('email-error', 'Please enter a valid email address');
      addFieldError(email);
      isValid = false;
    } else {
      removeFieldError(email);
    }

    // Validate password
    if (!passwordInput.value) {
      showError('password-error', 'Password is required');
      addFieldError(passwordInput);
      isValid = false;
    } else if (!isValidPassword(passwordInput.value)) {
      showError('password-error', 'Password must be at least 8 characters with a number, a capital letter and special character');
      addFieldError(passwordInput);
      isValid = false;
    } else {
      removeFieldError(passwordInput);
    }

    // Validate terms agreement
    const terms = document.getElementById('terms');
    if (!terms.checked) {
      showError('terms-error', 'You must agree to the terms');
      isValid = false;
    }

    // Submit form if valid
    if (isValid) {
      // Add loading state
      signUpButton.classList.add('loading');
      signUpButton.disabled = true;
      
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
        
        if (data.created) {
          showSuccessMessage();
        } else {
          throw new Error('Failed to create account');
        }
      } catch (error) {
        showError('Could Not Create User');
        signUpButton.classList.remove('loading');
        signUpButton.disabled = false;
      }
    }
  });

  // Enhanced error display with animation
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      setTimeout(() => {
        errorElement.style.opacity = '1';
        errorElement.style.transform = 'translateY(0)';
      }, 50);
    }
  }

  // Add error styling to field
  function addFieldError(field) {
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    // Shake animation
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      field.style.animation = '';
    }, 500);
  }

  // Remove error styling from field
  function removeFieldError(field) {
    field.style.borderColor = '#10b981';
    field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation helper
  function isValidPassword(password) {
    // At least 8 characters, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  }

  // Enhanced success message with animations
  function showSuccessMessage() {
    main.className = 'container success-view';
    main.innerHTML = `
      <div class="success-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h3>Account Created Successfully!</h3>
        <p>Welcome to Minimal Blog. Check your email for confirmation and start your journey with us.</p>
        <a href="/verify-email" class="return-home">
          <i class="fas fa-envelope"></i>
          Verify Email
        </a>
      </div>
    `;

    // Add success styles dynamically
    const successStyles = document.createElement('style');
    successStyles.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
      
      .success-view {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .success-message {
        text-align: center;
        padding: 3rem 2rem;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 2rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.3);
        max-width: 400px;
        animation: successSlideIn 0.8s ease-out;
      }
      
      @keyframes successSlideIn {
        0% {
          opacity: 0;
          transform: translateY(30px) scale(0.9);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .success-icon {
        color: #10b981;
        margin-bottom: 1.5rem;
        animation: successBounce 0.6s ease-out 0.3s;
        animation-fill-mode: both;
      }
      
      @keyframes successBounce {
        0%, 20%, 40%, 60%, 80% {
          transform: translateY(0);
        }
        10%, 30% {
          transform: translateY(-10px);
        }
        50%, 70% {
          transform: translateY(-5px);
        }
      }
      
      .success-message h3 {
        margin-bottom: 1rem;
        font-weight: 600;
        color: #1f2937;
        font-size: 1.5rem;
      }
      
      .success-message p {
        color: #6b7280;
        margin-bottom: 2rem;
        line-height: 1.6;
      }
      
      .return-home {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-decoration: none;
        border-radius: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
      }
      
      .return-home:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
    `;
    document.head.appendChild(successStyles);
  }

  // Add floating label effect
  inputs.forEach(input => {
    const label = input.parentElement.querySelector('label');
    
    input.addEventListener('focus', function() {
      if (label) {
        label.style.transform = 'translateY(-2px)';
        label.style.color = '#6366f1';
      }
    });
    
    input.addEventListener('blur', function() {
      if (label && !input.value) {
        label.style.transform = 'translateY(0)';
        label.style.color = '#1f2937';
      }
    });
  });

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('button, .social-button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add ripple effect styles
  const rippleStyles = document.createElement('style');
  rippleStyles.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: rippleEffect 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes rippleEffect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    button, .social-button {
      position: relative;
      overflow: hidden;
    }
  `;
  document.head.appendChild(rippleStyles);
});