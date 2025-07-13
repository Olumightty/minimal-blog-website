// Simple toast function
function showToast(message, duration = 3000) {
  const toaster = document.getElementById('toaster');

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast-failed';
  toast.textContent = message;

  // Add to container
  toaster.appendChild(toast);

  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';

    setTimeout(() => {
      toaster.removeChild(toast);
    }, 300);
  }, duration);
}

function showError(message) {
  showToast(message);
}


function showSuccess(message, duration = 3000) {
  const toaster = document.getElementById('toaster');

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast-success';
  toast.textContent = message;

  // Add to container
  toaster.appendChild(toast);

  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';

    setTimeout(() => {
      toaster.removeChild(toast);
    }, 300);
  }, duration);
}

// Error handler


// // Global error handler
// window.addEventListener('error', function(event) {
//   showError('Error: ' + event.error.message || 'Unknown error occurred');
// });

// // Example error function
// function someErrorFunction() {
//   try {
//     // Simulate an error
//     nonExistentFunction();
//   } catch (error) {
//     showError(error.message);
//   }
// }
