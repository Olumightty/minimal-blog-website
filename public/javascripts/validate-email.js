document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('verification-form');
  const otpInputs = document.querySelectorAll('.otp-input');
  const resendButton = document.getElementById('resend-button');
  const timerElement = document.getElementById('timer');
  const errorElement = document.getElementById('otp-error');

  // Set up OTP input behavior
  setupOtpInputs();

  // Start countdown timer(fix this)
  startCountdown(Number(timerElement.textContent)); // 5 minutes in seconds
  showToast('A new verification code has been sent to your email');
  resendButton.disabled = true;
  let resendCountdown = 30; // 30 seconds
  const resendCountdownInterval = setInterval(() => {
    resendButton.textContent = `Resend (${resendCountdown})`;
    resendCountdown -= 1;
    if (resendCountdown <= 0) {
      clearInterval(resendCountdownInterval);
      resendButton.disabled = false;
      resendButton.textContent = 'Resend';
    }
  }, 1000);

  // Form submission
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const otpValue = Array.from(otpInputs)
      .map((input) => input.value)
      .join('');

    // Validate OTP
    if (otpValue.length !== 4) {
      errorElement.textContent = 'Please enter the 4-digit code';
      return;
    }

    if (!/^\d{4}$/.test(otpValue)) {
      errorElement.textContent = 'Code should contain only numbers';
      return;
    }

    // Clear any previous error
    errorElement.textContent = '';

    // Submit verification (normally would be an API call)
    await verifyEmail(otpValue);
  });

  // Resend button action (use this instead)
  resendButton.addEventListener('click', async function () {
    if (resendButton.disabled) return;

    // Simulate resending code
    resendButton.disabled = true;
    resendButton.textContent = 'Sending...';
    // Prevent spamming the resend button

    // Reset OTP inputs
    otpInputs.forEach((input) => (input.value = ''));
    otpInputs[0].focus();

    try {
      //ajax
      const response = await fetch('/resend-otp', {
        method: 'GET',
      });
      const data = await response.json();
      if (!data.sent) throw new Error('Could not send email');
      showToast('Email successfully sent');
      resendButton.textContent = 'Code sent!';
      if (data.sent) window.location.href = '/validate-email';
    } catch (error) {
      showError('Failed to resend code');
    }

    // Update UI

    // setTimeout(() => {
    //     resendButton.textContent = 'Resend';
    //     resendButton.disabled = false;
    // }, 3000);
  });

  // Function to handle OTP input behavior
  function setupOtpInputs() {
    // Auto-focus next input after entering a digit
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', function () {
        // Only proceed if input is a number
        if (!/^\d*$/.test(this.value)) {
          this.value = '';
          return;
        }

        // Auto-focus next input
        if (this.value && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }

        // Check if all inputs are filled
        checkInputsCompletion();
      });

      // Handle backspace
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !this.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });

      // Handle pasting OTP
      input.addEventListener('paste', function (e) {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');

        // Check if pasted content is a 4-digit number
        if (/^\d{4}$/.test(pasteData)) {
          // Distribute the 4 digits across inputs
          otpInputs.forEach((input, idx) => {
            input.value = pasteData[idx] || '';
          });

          // Focus last input
          otpInputs[otpInputs.length - 1].focus();

          // Check completion
          checkInputsCompletion();
        }
      });
    });
  }

  // Check if all OTP inputs are filled
  function checkInputsCompletion() {
    const allFilled = Array.from(otpInputs).every(
      (input) => input.value.length === 1
    );
    const submitButton = document.querySelector('.verify-button');

    submitButton.disabled = !allFilled;

    if (allFilled) {
      submitButton.focus();
    }
  }

  // Timer countdown function
  function startCountdown(seconds) {
    let remainingSeconds = seconds;
    const interval = setInterval(() => {
      remainingSeconds--;
      // Prevent spamming the resend button

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

  // Function to verify email (simulated)
  async function verifyEmail(otp) {
    const submitButton = document.querySelector('.verify-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Verifying...';

    // Simulate API verification delay

    try {
      const response = await fetch('/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();
      if (data.verified) showSuccessMessage();
    } catch (error) {
      showError('Failed to verify email');
      submitButton.disabled = false;
      submitButton.textContent = 'Verify Email';
    }
  }

  // Show success message
  function showSuccessMessage() {
    form.innerHTML = `
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h3>Email Verified!</h3>
            <p>Your email has been successfully verified. You can now continue using Minimal Blog.</p>
            <a href="/" class="verify-button" style="margin-top: 20px; text-decoration: none;">Continue to Blog</a>
        `;
  }

  // Toast notification
  function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Add styles
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '1000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-in-out';

    // Add to document
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Initialize
  otpInputs[0].focus();
  document.querySelector('.verify-button').disabled = true;
});
