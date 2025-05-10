// script.js
document.addEventListener('DOMContentLoaded', async function () {
  const avatarBtn = document.getElementById('avatarBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const avatarImage = document.querySelector('.avatar-img');

  // Toggle dropdown menu when avatar is clicked
  avatarBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
  });

  // Close dropdown when clicking elsewhere on the page
  document.addEventListener('click', function (e) {
    if (
      profileDropdown.classList.contains('show') &&
      !avatarBtn.contains(e.target)
    ) {
      profileDropdown.classList.remove('show');
    }
  });

  // Prevent dropdown from closing when clicking inside it
  profileDropdown.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // Highlight navbar link based on current route
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/')[1]; // Get the first part of the path
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === `/${currentPath}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  try {
    const response = await fetch('/user/avatar', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data.avatar);
    if (data.avatar) avatarImage.setAttribute('src', data.avatar);
  } catch (error) {
    showError('Failed to load avatar');
  }
});
