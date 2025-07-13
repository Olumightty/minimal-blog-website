// Home Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scrolling for hero scroll indicator
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function () {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  }

  // Newsletter form submission
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (email) {
        // Show loading state
        const button = this.querySelector('button');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        // Simulate API call (replace with actual implementation)
        setTimeout(() => {
          // Show success message
          showToast('Thank you for subscribing!', 'success');
          emailInput.value = '';

          // Reset button
          button.innerHTML = originalHTML;
          button.disabled = false;
        }, 1500);
      }
    });
  }

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe post cards
  const postCards = document.querySelectorAll('.post-card');
  postCards.forEach((card, index) => {
    // Initial state
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

    observer.observe(card);
  });

  // Observe sidebar cards
  const sidebarCards = document.querySelectorAll('.sidebar-card');
  sidebarCards.forEach((card, index) => {
    // Initial state
    card.style.opacity = '0';
    card.style.transform = 'translateX(50px)';
    card.style.transition = `opacity 0.6s ease ${(index + 1) * 0.2}s, transform 0.6s ease ${(index + 1) * 0.2}s`;

    observer.observe(card);
  });

  // Parallax effect for hero
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');

    if (hero && heroVisual) {
      const rate = scrolled * -0.5;
      heroVisual.style.transform = `translateY(${rate}px)`;
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);

  // Add hover effects to category links
  const categoryLinks = document.querySelectorAll('.category-link');
  categoryLinks.forEach((link) => {
    link.addEventListener('mouseenter', function () {
      this.style.transform = 'translateX(8px)';
    });

    link.addEventListener('mouseleave', function () {
      this.style.transform = 'translateX(0)';
    });
  });

  // Calculate and display reading time for posts
  const articles = document.querySelectorAll('.post-card');
  articles.forEach((article) => {
    const excerpt = article.querySelector('.post-excerpt');
    const readingTimeEl = article.querySelector('.reading-time');

    if (excerpt && readingTimeEl) {
      const wordCount = excerpt.textContent.trim().split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
      readingTimeEl.textContent = `${readTime} min read`;
    }
  });

  // Add dynamic loading animation to CTA button
  const ctaButtons = document.querySelectorAll('.cta-button');
  ctaButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      // Add a subtle loading effect
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // Enhanced scroll effects for hero elements
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroStats = document.querySelector('.hero-stats');

    if (heroTitle) {
      const rate = scrolled * 0.3;
      heroTitle.style.transform = `translateY(${rate}px)`;
      heroTitle.style.opacity = Math.max(0, 1 - scrolled / 400);
    }

    if (heroSubtitle) {
      const rate = scrolled * 0.4;
      heroSubtitle.style.transform = `translateY(${rate}px)`;
      heroSubtitle.style.opacity = Math.max(0, 1 - scrolled / 350);
    }

    if (heroStats) {
      const rate = scrolled * 0.5;
      heroStats.style.transform = `translateY(${rate}px)`;
      heroStats.style.opacity = Math.max(0, 1 - scrolled / 300);
    }
  });

  // Add ripple effect to buttons
  function addRippleEffect(element) {
    element.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  // Apply ripple effect to buttons
  const buttons = document.querySelectorAll('.cta-button, .input-group button');
  buttons.forEach(addRippleEffect);

  // Add CSS for ripple animation
  const style = document.createElement('style');
  style.textContent = `
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Toast notification function (fallback if not defined elsewhere)
  if (typeof showToast === 'undefined') {
    window.showToast = function (message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
      toast.textContent = message;

      document.body.appendChild(toast);

      // Animate in
      setTimeout(() => {
        toast.style.transform = 'translateX(0)';
      }, 10);

      // Animate out and remove
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    };
  }

  // Lazy loading for images
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  // Add stagger animation to elements with same class
  function staggerElements(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * delay}ms`;
    });
  }

  // Apply stagger animation to floating cards
  staggerElements('.card', 200);

  console.log('Home page scripts loaded successfully');
});
