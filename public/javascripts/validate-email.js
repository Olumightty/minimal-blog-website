document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('verification-form');
  const otpInputs = document.querySelectorAll('.otp-input');
  const resendButton = document.getElementById('resend-button');
  const timerElement = document.getElementById('timer');
  const errorElement = document.getElementById('otp-error');
  const submitButton = document.querySelector('.verify-button');
  const buttonText = submitButton.querySelector('.button-text');
  const buttonLoader = submitButton.querySelector('.button-loader');

  // Set up OTP input behavior
  setupOtpInputs();

  // Start countdown timer - preserved original logic
  const initialTime = timerElement?.textContent.trim() || null;
  if (initialTime) {
    startCountdown(Number(initialTime)); // Convert MM:SS to seconds
  }

  // Show initial toast and setup resend countdown - preserved original logic
  showToast('A verification code has been sent to your email', 'success');
  resendButton.disabled = true;
  let resendCountdown = 30; // 30 seconds
  const resendCountdownInterval = setInterval(() => {
    const resendText = resendButton.querySelector('span');
    resendText.textContent = `Resend (${resendCountdown})`;
    resendCountdown -= 1;
    if (resendCountdown <= 0) {
      clearInterval(resendCountdownInterval);
      resendButton.disabled = false;
      resendText.textContent = 'Resend Code';
    }
  }, 1000);

  // Form submission - preserved original logic
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    console.log('Form submitted');
    const otpValue = Array.from(otpInputs)
      .map((input) => input.value)
      .join('');

    // Validate OTP - preserved original validation
    if (otpValue.length !== 4) {
      showError('Please enter the 4-digit code');
      return;
    }

    if (!/^\d{4}$/.test(otpValue)) {
      showError('Code should contain only numbers');
      return;
    }

    // Clear any previous error
    hideError();

    // Submit verification - preserved original API call
    await verifyEmail(otpValue);
  });

  // Resend button action - preserved original logic
  resendButton.addEventListener('click', async function () {
    if (resendButton.disabled) return;

    // Simulate resending code - preserved original logic
    resendButton.disabled = true;
    const resendText = resendButton.querySelector('span');
    const originalText = resendText.textContent;
    resendText.textContent = 'Sending...';

    // Reset OTP inputs - preserved original behavior
    otpInputs.forEach((input) => (input.value = ''));
    otpInputs[0].focus();
    checkInputsCompletion();

    try {
      // AJAX call - preserved original endpoint and logic
      const response = await fetch('/resend-otp', {
        method: 'GET',
      });
      const data = await response.json();
      if (!data.sent) throw new Error('Could not send email');
      
      showToast('Email successfully sent', 'success');
      resendText.textContent = 'Code sent!';
      
      // Preserved original redirect logic
      if (data.sent) window.location.href = '/validate-email';
    } catch (error) {
      showToast('Failed to resend code', 'error');
      resendButton.disabled = false;
      resendText.textContent = originalText;
    }
  });

  // Function to handle OTP input behavior - enhanced UX while preserving functionality
  function setupOtpInputs() {
    otpInputs.forEach((input, index) => {
      // Enhanced input event - preserved original logic with UX improvements
      input.addEventListener('input', function () {
        // Only proceed if input is a number - preserved original validation
        if (!/^\d*$/.test(this.value)) {
          this.value = '';
          return;
        }

        // Auto-focus next input - preserved original logic
        if (this.value && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }

        // Check if all inputs are filled - preserved original logic
        checkInputsCompletion();
      });

      // Handle backspace - preserved original logic
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !this.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });

      // Handle pasting OTP - preserved original logic
      input.addEventListener('paste', function (e) {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');

        // Check if pasted content is a 4-digit number - preserved original validation
        if (/^\d{4}$/.test(pasteData)) {
          // Distribute the 4 digits across inputs - preserved original logic
          otpInputs.forEach((input, idx) => {
            input.value = pasteData[idx] || '';
          });

          // Focus last input - preserved original behavior
          otpInputs[otpInputs.length - 1].focus();

          // Check completion - preserved original logic
          checkInputsCompletion();
        }
      });

      // Enhanced focus and blur events for better UX
      input.addEventListener('focus', function () {
        this.select();
      });
    });
  }

  // Check if all OTP inputs are filled - preserved original logic
  function checkInputsCompletion() {
    const allFilled = Array.from(otpInputs).every(
      (input) => input.value.length === 1
    );

    submitButton.disabled = !allFilled;

    if (allFilled) {
      submitButton.focus();
    }
  }

  // Timer countdown function - preserved original logic with enhanced display
  function startCountdown(seconds) {
    let remainingSeconds = seconds;
    const interval = setInterval(() => {
      remainingSeconds--;

      if (remainingSeconds <= 0) {
        clearInterval(interval);
        timerElement.innerHTML = '00:00';
        return;
      }

      const minutes = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      timerElement.innerHTML = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  }

  // Function to verify email - preserved original API logic with enhanced UI
  async function verifyEmail(otp) {
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'flex';

    try {
      // Preserved original API call
      const response = await fetch('/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();
      
      if (data.verified) {
        showSuccessMessage();
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      showToast('Failed to verify email', 'error');
      submitButton.disabled = false;
      buttonText.style.display = 'block';
      buttonLoader.style.display = 'none';
      buttonText.textContent = 'Verify Email';
    }
  }

  // Show success message - preserved original logic with enhanced design
  function showSuccessMessage() {
    form.innerHTML = `
      <div class="success-container">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <h3>Email Verified!</h3>
        <p>Your email has been successfully verified. You can now continue using Minimal Blog.</p>
        <a href="/" class="verify-button">Continue to Blog</a>
      </div>
    `;
  }

  // Enhanced toast notification system
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    // Remove existing toasts
    toastContainer.innerHTML = '';
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    // Add to container
    toastContainer.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
          if (toast.parentNode) {
            toastContainer.removeChild(toast);
          }
        }, 300);
      }
    }, 3000);
  }

  // Error handling functions
  function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Add shake animation to OTP inputs
    otpInputs.forEach(input => {
      input.style.borderColor = '#ef4444';
      input.style.animation = 'shake 0.3s ease-in-out';
    });
    
    // Reset animation and border color after animation
    setTimeout(() => {
      otpInputs.forEach(input => {
        input.style.animation = '';
        input.style.borderColor = '';
      });
    }, 300);
  }

  function hideError() {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    otpInputs.forEach(input => {
      input.style.borderColor = '';
    });
  }

  // Initialize - preserved original initialization
  otpInputs[0].focus();
  submitButton.disabled = true;
});