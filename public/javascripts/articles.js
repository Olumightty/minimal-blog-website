// Enhanced Articles Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all components
  initializeFilters();
  initializeCategoryPills();
  initializeAnimations();
  initializeSearchEnhancements();
  initializeCardInteractions();
});

// Filter functionality
function initializeFilters() {
  const categoryFilter = document.getElementById('category-filter');

  if (!categoryFilter) return;

  // Set initial filter value based on search params
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';
  categoryFilter.value = initialCategory;

  // Update active pill based on initial category
  updateActivePill(initialCategory);

  // Filter select change handler
  categoryFilter.addEventListener('change', function () {
    const selectedCategory = this.value;
    navigateToCategory(selectedCategory);
  });
}

// Category pills functionality
function initializeCategoryPills() {
  const categoryPills = document.querySelectorAll('.category-pill');

  categoryPills.forEach((pill) => {
    pill.addEventListener('click', function () {
      const category = this.dataset.category;

      // Update active state immediately for better UX
      updateActivePill(category);

      // Update select dropdown
      const categoryFilter = document.getElementById('category-filter');
      if (categoryFilter) {
        categoryFilter.value = category;
      }

      navigateToCategory(category);
    });

    // Add hover effects
    pill.addEventListener('mouseenter', function () {
      if (!this.classList.contains('active')) {
        this.style.transform = 'translateY(-3px) scale(1.05)';
      }
    });

    pill.addEventListener('mouseleave', function () {
      if (!this.classList.contains('active')) {
        this.style.transform = '';
      }
    });
  });
}

// Navigate to category with smooth transition
function navigateToCategory(category) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('category', category);
  urlParams.set('page', 1);

  // Add loading state
  showLoadingState();

  // Navigate with slight delay for smooth transition
  setTimeout(() => {
    window.location.search = urlParams.toString();
  }, 300);
}

// Update active pill styling
function updateActivePill(category) {
  const categoryPills = document.querySelectorAll('.category-pill');

  categoryPills.forEach((pill) => {
    pill.classList.remove('active');
    if (pill.dataset.category === category) {
      pill.classList.add('active');
      pill.style.transform = 'translateY(-2px)';
    } else {
      pill.style.transform = '';
    }
  });
}

// Show loading state during navigation
function showLoadingState() {
  const articleCards = document.querySelectorAll('.article-card');
  const filterContainer = document.querySelector('.filter-container');
  const categoryPills = document.querySelectorAll('.category-pill');

  // Add loading class to filter container
  if (filterContainer) {
    filterContainer.style.opacity = '0.6';
    filterContainer.style.pointerEvents = 'none';
  }

  // Disable category pills
  categoryPills.forEach((pill) => {
    pill.style.pointerEvents = 'none';
    pill.style.opacity = '0.6';
  });

  // Fade out article cards with stagger effect
  articleCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '0.3';
      card.style.transform = 'translateY(10px) scale(0.98)';
    }, index * 50);
  });
}

// Initialize scroll animations and interactions
function initializeAnimations() {
  // Only initialize if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show all cards
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
    return;
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements that need scroll animations
  const elementsToAnimate = document.querySelectorAll(
    '.article-card, .filter-container'
  );
  elementsToAnimate.forEach((element) => {
    observer.observe(element);
  });
}

// Initialize card interactions
function initializeCardInteractions() {
  const articleCards = document.querySelectorAll('.article-card');

  articleCards.forEach((card) => {
    // Add smooth hover animations
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-8px) scale(1.02)';

      // Animate the image overlay
      const overlay = this.querySelector('.image-overlay');
      if (overlay) {
        overlay.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = '';

      // Hide the image overlay
      const overlay = this.querySelector('.image-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
      }
    });

    // Add click ripple effect
    card.addEventListener('click', function (e) {
      // Don't trigger if clicking on a link
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        return;
      }

      createRippleEffect(this, e);

      // Navigate to article after ripple
      setTimeout(() => {
        const titleLink = this.querySelector('.title-link');
        if (titleLink) {
          window.location.href = titleLink.href;
        }
      }, 200);
    });
  });
}

// Create ripple effect on card click
function createRippleEffect(element, event) {
  const ripple = document.createElement('div');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(99, 102, 241, 0.3)';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'ripple 0.6s ease-out';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '1';

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  // Remove ripple after animation
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Initialize search enhancements
function initializeSearchEnhancements() {
  // Add keyboard navigation for category pills
  const categoryPills = document.querySelectorAll('.category-pill');

  categoryPills.forEach((pill, index) => {
    pill.setAttribute('tabindex', '0');
    pill.setAttribute('role', 'button');

    pill.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }

      // Arrow key navigation
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const direction = e.key === 'ArrowRight' ? 1 : -1;
        const nextIndex =
          (index + direction + categoryPills.length) % categoryPills.length;
        categoryPills[nextIndex].focus();
      }
    });
  });

  // Add smooth scrolling to pagination links
  const paginationLinks = document.querySelectorAll('.pagination a');
  paginationLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      // Add loading animation
      this.style.opacity = '0.6';
      this.style.pointerEvents = 'none';

      // Scroll to top smoothly before navigation
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  });
}

// Add CSS animations via JavaScript (fallback)
function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .article-card {
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .category-pill:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        .pagination a:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
    `;
  document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    // Handle responsive adjustments if needed
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach((card) => {
      // Reset any inline styles that might interfere with responsive design
      if (window.innerWidth <= 768) {
        card.style.transform = '';
      }
    });
  }, 250);
});

// Handle browser back/forward navigation
window.addEventListener('popstate', function () {
  // Refresh the page state when user navigates back/forward
  const urlParams = new URLSearchParams(window.location.search);
  const currentCategory = urlParams.get('category') || 'all';

  // Update filter and pills without triggering navigation
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.value = currentCategory;
  }

  updateActivePill(currentCategory);
});

// Accessibility improvements
function initializeAccessibility() {
  // Add ARIA labels to interactive elements
  const categoryPills = document.querySelectorAll('.category-pill');
  categoryPills.forEach((pill) => {
    const category = pill.dataset.category;
    pill.setAttribute('aria-label', `Filter articles by ${category}`);
  });

  // Add live region for dynamic content updates
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-10000px';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';
  document.body.appendChild(liveRegion);

  // Announce filter changes to screen readers
  const originalNavigateToCategory = navigateToCategory;
  navigateToCategory = function (category) {
    liveRegion.textContent = `Filtering articles by ${category}`;
    originalNavigateToCategory(category);
  };
}

// Initialize accessibility features
initializeAccessibility();
