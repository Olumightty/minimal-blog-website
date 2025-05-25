// profile.js
document.addEventListener('DOMContentLoaded', function () {
  // let avatar=''
  // Function to collect profile data from the form
  function collectProfileData() {
    // Create the profile data object following the schema structure
    const form = document.getElementById('form');
    const formData = new FormData(form);
    formData.set('social_links', JSON.stringify(collectSocialLinks()));
    const profileData = {
      username: formData.get('username'),
      // email: formData.get('email'),
      phone: formData.get('phone'),
      bio: formData.get('bio'),
      extendedBio: formData.get('extended-bio'),
      location: formData.get('location'),
      website: formData.get('website'),
      birthdate: formData.get('birthday'),
      gender: formData.get('gender'),
      social_links: formData.get('social_links'),
      recovery_email: formData.get('recovery-email'),
      avatar: formData.get('avatar'),
    };

    return profileData;
  }

  // Function to collect social links
  function collectSocialLinks() {
    const socialLinks = [];

    // Get all social input fields
    // This assumes social media inputs follow the pattern shown in the HTML
    // where each social platform has its own input field with the platform name as ID
    const socialSection = document.querySelector(
      '.profile-section:nth-of-type(4)'
    );
    const socialLabels = document.querySelectorAll('#social-name');
    const socialInputs = document.querySelectorAll('#social-url');

    socialLabels.length === socialInputs.length &&
      socialInputs.forEach((input, i) => {
        if (input.value.trim() !== '') {
          socialLinks.push({
            platform: socialLabels[i].value,
            url: input.value,
          });
        }
      });

    return socialLinks;
  }

  // Event listener for the save button
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  saveProfileBtn.addEventListener('click', async function (event) {
    event.preventDefault();

    saveProfileBtn.innerHTML = 'Saving...';
    saveProfileBtn.disabled = true;
    const profileData = collectProfileData();
    console.log('Profile data collected:', profileData);

    // Here you would typically send this data to your server
    // Example using fetch:

    try {
      const response = await axios.patch('/user/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;
      if (data.error) {
        showError(data.error);
        throw new Error(data.error);
      }
      if (data.message) {
        showSuccess(data.message);
        window.location.reload();
      }
    } catch (error) {
      showError('Could not update profile');
    }
    saveProfileBtn.innerHTML = 'Save Changes';
    saveProfileBtn.disabled = false;
  });

  // Upload Photo Button Functionality
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
  const profilePhotoInput = document.getElementById('profilePhotoInput');
  const profilePhoto = document.getElementById('profilePhoto');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  if (uploadPhotoBtn) {
    uploadPhotoBtn.addEventListener('click', function () {
      if (profilePhotoInput) {
        profilePhotoInput.click();
      }
    });
  }

  profilePhotoInput.addEventListener('change', function () {
    if (this.files.length > 0) {
      const file = this.files[0];
      // avatar = file
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePhoto.setAttribute('src', e.target.result);
        profilePhoto.setAttribute('alt', file.name);
      };
      reader.readAsDataURL(file);
    } else {
      profilePhoto.setAttribute('src', '');
      profilePhoto.setAttribute('alt', '');
    }
  });

  // Form validation
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', function () {
      validateEmail(this);
    });
  }

  // Add more social links button
  const addMoreBtn = document.querySelector('.add-more-btn');
  if (addMoreBtn) {
    addMoreBtn.addEventListener('click', function () {
      const socialFormsContainer = this.closest('.profile-form');
      const newRow = document.createElement('div');
      newRow.className = 'form-row';

      newRow.innerHTML = `
          <div class="form-group">
            <label for="social-name">Social Platform</label>
            <input type="text" id="social-name" placeholder="Platform name">
          </div>
          <div class="form-group">
            <label for="social-url">URL</label>
            <input type="url" id="social-url" placeholder="https://">
          </div>
        `;

      // Insert before the "Add more" button
      socialFormsContainer.insertBefore(newRow, this);
    });
  }

  // Danger Zone - Delete Account Confirmation
  const deleteBtn = document.querySelector('.danger-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
      if (
        confirm(
          'Are you sure you want to delete your account? This action cannot be undone.'
        )
      ) {
        alert(
          'Account deletion initiated. You will receive a confirmation email.'
        );
      }
    });
  }

  // Form field validation functions
  function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      input.classList.add('error');

      // Add error message if it doesn't exist
      let errorMessage = input.nextElementSibling;
      if (!errorMessage || !errorMessage.classList.contains('error-message')) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Please enter a valid email address';
        input.parentNode.insertBefore(errorMessage, input.nextSibling);
      }
    } else {
      input.classList.remove('error');

      // Remove error message if it exists
      const errorMessage = input.nextElementSibling;
      if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.remove();
      }
    }
  }

  // Add CSS for notifications and error handling
  const style = document.createElement('style');
  style.textContent = `
      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 8px;
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease forwards;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .notification.success .notification-icon {
        color: #28a745;
      }
      
      .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--gray-600);
        cursor: pointer;
      }
      
      .notification.fade-out {
        animation: fadeOut 0.3s ease forwards;
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      input.error {
        border-color: var(--danger-color);
      }
      
      .error-message {
        color: var(--danger-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    `;
  document.head.appendChild(style);
});
