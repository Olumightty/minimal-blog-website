// Modern Navbar JavaScript
document.addEventListener('DOMContentLoaded', async function () {
  // DOM Elements
  const navbar = document.querySelector('.navbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const avatarBtn = document.getElementById('avatarBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const avatarImage = document.querySelector('.avatar-img');
  const dropdownAvatar = document.querySelector('.dropdown-avatar');
  const signInBtn = document.querySelector('.sign-in-btn');
  const usernameWelcome = document.querySelector('.username-welcome');
  const dropdownUsername = document.querySelector('.dropdown-username');
  const avatarDropdown = document.querySelector('.avatar-dropdown');

  // Navbar scroll effect
  let lastScrollY = window.scrollY;
  
  function handleScroll() {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
          navbar.classList.add('scrolled');
      } else {
          navbar.classList.remove('scrolled');
      }
      
      lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleScroll);

  // Mobile menu toggle
  if (mobileMenuToggle && navMenu) {
      mobileMenuToggle.addEventListener('click', function() {
          mobileMenuToggle.classList.toggle('active');
          navMenu.classList.toggle('active');
          
          // Prevent body scroll when menu is open
          document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      });

      // Close mobile menu when clicking on nav links
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
          link.addEventListener('click', () => {
              mobileMenuToggle.classList.remove('active');
              navMenu.classList.remove('active');
              document.body.style.overflow = '';
          });
      });
  }

  // Sign in button functionality
  if (signInBtn) {
      signInBtn.addEventListener('click', () => {
          window.location.href = '/signin';
      });
  }

  // Avatar dropdown functionality
  if (avatarBtn && profileDropdown) {
      avatarBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          profileDropdown.classList.toggle('show');
          avatarBtn.classList.toggle('active');
      });

      // Close dropdown when clicking elsewhere
      document.addEventListener('click', function (e) {
          if (profileDropdown.classList.contains('show') && 
              !avatarBtn.contains(e.target) && 
              !profileDropdown.contains(e.target)) {
              profileDropdown.classList.remove('show');
              avatarBtn.classList.remove('active');
          }
      });

      // Prevent dropdown from closing when clicking inside it
      profileDropdown.addEventListener('click', function (e) {
          e.stopPropagation();
      });
  }

  // Active link highlighting
  function highlightActiveLink() {
      const navLinks = document.querySelectorAll('.nav-link');
      const currentPath = window.location.pathname;
      
      navLinks.forEach((link) => {
          link.classList.remove('active');
          
          const linkPath = link.getAttribute('href');
          
          // Handle home page
          if (currentPath === '/' && linkPath === '/') {
              link.classList.add('active');
          }
          // Handle other pages
          else if (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath)) {
              link.classList.add('active');
          }
      });
  }

  // User authentication state management
  async function loadUserData() {
      try {
          const response = await fetch('/user/avatar', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          
          const data = await response.json();
          
          if (data.avatar && data.name) {
              // User is logged in
              showLoggedInState(data);
          } else {
              // User is not logged in
              showLoggedOutState();
          }
      } catch (error) {
          console.error('Failed to load user data:', error);
          showLoggedOutState();
      }
  }

  function showLoggedInState(userData) {
      if (signInBtn) signInBtn.style.display = 'none';
      if (avatarDropdown) avatarDropdown.style.display = 'block';
      
      // Set avatar images
      if (avatarImage && userData.avatar) {
          avatarImage.src = userData.avatar;
      }
      if (dropdownAvatar && userData.avatar) {
          dropdownAvatar.src = userData.avatar;
      }
      
      // Set username
      if (usernameWelcome && userData.name) {
          usernameWelcome.textContent = `Hello, ${userData.name}`;
          usernameWelcome.style.display = 'inline';
      }
      if (dropdownUsername && userData.name) {
          dropdownUsername.textContent = userData.name;
      }
  }

  function showLoggedOutState() {
      if (signInBtn) signInBtn.style.display = 'flex';
      if (avatarDropdown) avatarDropdown.style.display = 'none';
      if (usernameWelcome) usernameWelcome.style.display = 'none';
  }

  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach(link => {
          link.addEventListener('click', function(e) {
              e.preventDefault();
              const targetId = this.getAttribute('href').substring(1);
              const targetElement = document.getElementById(targetId);
              
              if (targetElement) {
                  const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                  window.scrollTo({
                      top: offsetTop,
                      behavior: 'smooth'
                  });
              }
          });
      });
  }

  // Keyboard navigation support
  function initKeyboardNavigation() {
      document.addEventListener('keydown', function(e) {
          // Close dropdown with Escape key
          if (e.key === 'Escape' && profileDropdown && profileDropdown.classList.contains('show')) {
              profileDropdown.classList.remove('show');
              if (avatarBtn) avatarBtn.classList.remove('active');
          }
          
          // Toggle mobile menu with Escape key
          if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
              mobileMenuToggle.classList.remove('active');
              navMenu.classList.remove('active');
              document.body.style.overflow = '';
          }
      });
  }

  // Resize handler
  function handleResize() {
      // Close mobile menu on resize to desktop
      if (window.innerWidth > 768) {
          if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
          if (navMenu) navMenu.classList.remove('active');
          document.body.style.overflow = '';
      }
  }

  window.addEventListener('resize', handleResize);

  // Animation utilities
  function addLoadAnimation() {
      const navElements = document.querySelectorAll('.nav-link, .new-article-btn, .sign-in-btn, .avatar-btn');
      navElements.forEach((element, index) => {
          element.style.opacity = '0';
          element.style.transform = 'translateY(-20px)';
          
          setTimeout(() => {
              element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
          }, index * 100);
      });
  }

  // Error handling utility
  function showError(message) {
      console.error(message);
      // You can implement a toast notification system here
  }

  // Initialize all functionality
  async function init() {
      highlightActiveLink();
      await loadUserData();
      initSmoothScrolling();
      initKeyboardNavigation();
      addLoadAnimation();
  }

  // Start the application
  init();

  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
      document.body.style.overflow = '';
  });

  // Intersection Observer for navbar animation (optional enhancement)
  if ('IntersectionObserver' in window) {
      const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (!entry.isIntersecting) {
                  navbar.classList.add('scrolled');
              } else {
                  navbar.classList.remove('scrolled');
              }
          });
      }, observerOptions);

      // Observe a element at the top of the page
      const sentinel = document.createElement('div');
      sentinel.style.position = 'absolute';
      sentinel.style.top = '0';
      sentinel.style.height = '1px';
      sentinel.style.width = '1px';
      document.body.prepend(sentinel);
      observer.observe(sentinel);
  }
});