// Article Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeShareButtons();
    initializeNewsletterForm();
    initializeScrollEffects();
    initializeImageLazyLoading();
    initializeReadingProgress();
    initializeTooltips();
    initializeSmoothScrolling();
});

// Share functionality
function initializeShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const toast = document.getElementById('toast');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.dataset.platform;
            const url = window.location.href;
            const title = document.querySelector('.hero-title').textContent;
            const description = document.querySelector('.author-bio-hero')?.textContent || '';
            
            switch(platform) {
                case 'twitter':
                    shareOnTwitter(url, title);
                    break;
                case 'facebook':
                    shareOnFacebook(url, title, description);
                    break;
                case 'linkedin':
                    shareOnLinkedIn(url, title, description);
                    break;
                case 'copy':
                    copyToClipboard(url);
                    break;
            }
        });
    });
}

function shareOnTwitter(url, title) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    openShareWindow(twitterUrl, 'Twitter Share');
}

function shareOnFacebook(url, title, description) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    openShareWindow(facebookUrl, 'Facebook Share');
}

function shareOnLinkedIn(url, title, description) {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
    openShareWindow(linkedinUrl, 'LinkedIn Share');
}

function openShareWindow(url, title) {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
        url,
        title,
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Link copied to clipboard!', 'success');
        }).catch(err => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Link copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Update message
    toastMessage.textContent = message;
    
    // Update icon based on type
    if (type === 'success') {
        toastIcon.innerHTML = '<polyline points="20,6 9,17 4,12"/>';
        toast.style.background = '#10b981';
    } else {
        toastIcon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
        toast.style.background = '#ef4444';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');
    const submitButton = form.querySelector('.newsletter-submit');
    const submitText = submitButton.querySelector('.submit-text');
    const submitIcon = submitButton.querySelector('.submit-icon');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitText.textContent = 'Subscribing...';
        submitIcon.innerHTML = '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>';
        
        // Simulate API call
        setTimeout(() => {
            // Reset form
            emailInput.value = '';
            
            // Show success state
            submitText.textContent = 'Subscribed!';
            submitIcon.innerHTML = '<polyline points="20,6 9,17 4,12"/>';
            
            showToast('Successfully subscribed to newsletter!', 'success');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                submitButton.disabled = false;
                submitText.textContent = 'Subscribe';
                submitIcon.innerHTML = '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/>';
            }, 2000);
        }, 1500);
    });
    
    // Real-time email validation
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll effects
function initializeScrollEffects() {
    const heroSection = document.querySelector('.article-hero');
    const sidebar = document.querySelector('.article-sidebar');
    const sidebarCards = document.querySelectorAll('.sidebar-card');
    
    if (!heroSection) return;
    
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollY = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        const scrollPercent = Math.min(scrollY / heroHeight, 1);
        
        // Parallax effect for hero background
        const heroBackground = heroSection.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
        
        // Fade hero content as user scrolls
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = 1 - scrollPercent;
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        
        // Animate sidebar cards on scroll
        if (sidebar && window.innerWidth > 1024) {
            const sidebarTop = sidebar.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            sidebarCards.forEach((card, index) => {
                const cardTop = card.getBoundingClientRect().top;
                const isVisible = cardTop < windowHeight && cardTop > -card.offsetHeight;
                
                if (isVisible) {
                    const delay = index * 100;
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, delay);
                }
            });
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial setup for sidebar cards
    sidebarCards.forEach(card => {
        // card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Reading progress indicator
function initializeReadingProgress() {
    const progressBar = createProgressBar();
    const article = document.querySelector('.article-content-wrapper');
    
    if (!article) return;
    
    let ticking = false;
    
    function updateProgress() {
        const articleTop = article.getBoundingClientRect().top;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollableDistance = articleHeight - windowHeight;
        
        if (articleTop <= 0) {
            const scrolled = Math.abs(articleTop);
            const progress = Math.min((scrolled / scrollableDistance) * 100, 100);
            progressBar.style.width = `${progress}%`;
        } else {
            progressBar.style.width = '0%';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(99, 102, 241, 0.1);
        z-index: 1000;
        pointer-events: none;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #6366f1, #06b6d4);
        transition: width 0.3s ease;
    `;
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    return progressBar;
}

// Image lazy loading
function initializeImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Tooltips
function initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.dataset.tooltip;
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.textContent = text;
    tooltip.className = 'tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: #1e293b;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = `${rect.left + (rect.width - tooltipRect.width) / 2}px`;
    tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    const tooltip = e.target._tooltip;
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 200);
        delete e.target._tooltip;
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Close modals/tooltips with Escape key
    if (e.key === 'Escape') {
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            tooltip.remove();
        });
    }
    
    // Navigate with arrow keys when focus is on share buttons
    if (e.target.classList.contains('share-btn')) {
        const shareButtons = Array.from(document.querySelectorAll('.share-btn'));
        const currentIndex = shareButtons.indexOf(e.target);
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % shareButtons.length;
            shareButtons[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + shareButtons.length) % shareButtons.length;
            shareButtons[prevIndex].focus();
        }
    }
});

// Performance optimization: Debounce resize events
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalculate layouts on resize
        initializeScrollEffects();
    }, 250);
});

// Analytics tracking (placeholder functions)
function trackEvent(category, action, label) {
    // Replace with your analytics implementation
    console.log('Event tracked:', { category, action, label });
}

// Track social shares
document.querySelectorAll('.share-btn').forEach(button => {
    button.addEventListener('click', function() {
        const platform = this.dataset.platform;
        trackEvent('Social Share', 'Click', platform);
    });
});

// Track newsletter subscription
document.getElementById('newsletterForm')?.addEventListener('submit', function() {
    trackEvent('Newsletter', 'Subscribe', 'Article Page');
});

// Track reading progress milestones
let readingMilestones = [25, 50, 75, 100];
let trackedMilestones = [];

function trackReadingProgress() {
    const article = document.querySelector('.article-content-wrapper');
    if (!article) return;
    
    const articleTop = article.getBoundingClientRect().top;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = articleHeight - windowHeight;
    
    if (articleTop <= 0) {
        const scrolled = Math.abs(articleTop);
        const progress = Math.min((scrolled / scrollableDistance) * 100, 100);
        
        readingMilestones.forEach(milestone => {
            if (progress >= milestone && !trackedMilestones.includes(milestone)) {
                trackEvent('Reading Progress', 'Milestone', `${milestone}%`);
                trackedMilestones.push(milestone);
            }
        });
    }
}

// Add reading progress tracking to scroll handler
window.addEventListener('scroll', trackReadingProgress, { passive: true });