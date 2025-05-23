// Footer JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');
    const newsletterStatus = document.getElementById('newsletterStatus');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            if (!email) return;
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNewsletterStatus('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.newsletter-btn');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate API call (replace with actual implementation)
            setTimeout(() => {
                // Simulate random success/failure for demo
                const isSuccess = Math.random() > 0.2; // 80% success rate
                
                if (isSuccess) {
                    showNewsletterStatus('Successfully subscribed! Welcome to our community.', 'success');
                    emailInput.value = '';
                    
                    // Animate subscriber count increase
                    const subscriberCount = document.querySelector('[data-target="12000"]');
                    if (subscriberCount) {
                        const currentCount = parseInt(subscriberCount.textContent) || 12000;
                        animateCounter(subscriberCount, currentCount, currentCount + 1);
                    }
                } else {
                    showNewsletterStatus('Subscription failed. Please try again later.', 'error');
                }
                
                // Reset button
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Newsletter status display function
    function showNewsletterStatus(message, type) {
        if (!newsletterStatus) return;
        
        newsletterStatus.textContent = message;
        newsletterStatus.className = `newsletter-status ${type}`;
        newsletterStatus.style.display = 'block';
        newsletterStatus.style.opacity = '1';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            newsletterStatus.style.opacity = '0';
            setTimeout(() => {
                newsletterStatus.style.display = 'none';
            }, 300);
        }, 5000);
    }
    
    // Animate counter numbers
    function animateCounter(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    // Initialize counter animations on scroll
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, 0, target, 2000);
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
    
    // Language selector functionality
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    
    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Language selection
        const languageOptions = languageDropdown.querySelectorAll('a[data-lang]');
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedLang = this.textContent;
                const langCode = this.dataset.lang;
                
                // Update button text
                const langSpan = languageBtn.querySelector('span');
                if (langSpan) {
                    langSpan.textContent = selectedLang;
                }
                
                // Close dropdown
                languageDropdown.classList.remove('active');
                languageBtn.classList.remove('active');
                
                // Save preference
                localStorage.setItem('preferredLanguage', langCode);
                
                // You can add actual language switching logic here
                console.log('Language changed to:', langCode);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            languageDropdown.classList.remove('active');
            languageBtn.classList.remove('active');
        });
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('light-theme', savedTheme === 'light');

        themeToggle.addEventListener('click', function() {
            const isLight = document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
    
    function updateThemeIcon(theme) {
        const darkIcon = themeToggle?.querySelector('.dark-icon');
        const lightIcon = themeToggle?.querySelector('.light-icon');
        
        if (theme === 'dark') {
            darkIcon?.style.setProperty('display', 'none');
            lightIcon?.style.setProperty('display', 'inline-block');
        } else {
            darkIcon?.style.setProperty('display', 'inline-block');
            lightIcon?.style.setProperty('display', 'none');
        }
    }
    
    // Back to top button functionality
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Social links hover effects and analytics
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add ripple effect
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
            
            // Track social media clicks (replace with actual analytics)
            const platform = this.getAttribute('aria-label') || 'Unknown';
            console.log('Social link clicked:', platform);
        });
    });
    
    // Footer links tracking
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track footer link clicks
            const linkText = this.textContent;
            const section = this.closest('.footer-section')?.querySelector('.footer-title')?.textContent || 'Unknown';
            console.log('Footer link clicked:', section, '-', linkText);
        });
    });
    
    // Add loading animation to newsletter stats on page load
    setTimeout(() => {
        statNumbers.forEach(stat => {
            if (!stat.classList.contains('animated')) {
                const target = parseInt(stat.dataset.target);
                animateCounter(stat, 0, target, 3000);
                stat.classList.add('animated');
            }
        });
    }, 1000);
    
    // Add CSS for animations if not already present
    if (!document.querySelector('#footer-animations')) {
        const style = document.createElement('style');
        style.id = 'footer-animations';
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
            
            .newsletter-status {
                margin-top: 0.5rem;
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.875rem;
                transition: opacity 0.3s ease;
            }
            
            .newsletter-status.success {
                background-color: #dcfce7;
                color: #166534;
                border: 1px solid #bbf7d0;
            }
            
            .newsletter-status.error {
                background-color: #fef2f2;
                color: #dc2626;
                border: 1px solid #fecaca;
            }
            
            .back-to-top {
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }
            
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .language-dropdown {
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            }
            
            .language-dropdown.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .language-btn.active .fa-chevron-down {
                transform: rotate(180deg);
            }
            
            .theme-btn .light-icon {
                display: none;
            }
            
            body.dark-theme .theme-btn .dark-icon {
                display: none;
            }
            
            body.dark-theme .theme-btn .light-icon {
                display: inline-block;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize tooltips for social links
    socialLinks.forEach(link => {
        const platform = link.getAttribute('aria-label');
        if (platform) {
            link.setAttribute('title', `Follow us on ${platform}`);
        }
    });
    
    // Performance optimization: Throttle scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Your scroll-based logic here
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 10);
    });
    
    console.log('Footer scripts loaded successfully');
});