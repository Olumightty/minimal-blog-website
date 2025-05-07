document.addEventListener('DOMContentLoaded', function() {
    // Set current year in the footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Handle back button functionality
    document.getElementById('back-button').addEventListener('click', function() {
        window.history.length > 1 ? window.history.go(-1) : window.location.href = '/';
    });
    
    // Animate the suggestions with a slight delay for each item
    const suggestionItems = document.querySelectorAll('#suggestion-list li');
    suggestionItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100);
        }, index * 200);
    });
    
    // Sample blog posts for random suggestion
    // In a real implementation, you might fetch this from your API
    const samplePosts = [
        {
            title: "10 Creative Writing Prompts to Overcome Writer's Block",
            excerpt: "Struggling with writer's block? These creative prompts will help you get your creativity flowing again...",
            url: "/blog/creative-writing-prompts"
        },
        {
            title: "The Ultimate Guide to Sustainable Living",
            excerpt: "Learn how small changes in your daily habits can lead to a more sustainable and eco-friendly lifestyle...",
            url: "/blog/sustainable-living-guide"
        },
        {
            title: "How Mindfulness Can Transform Your Daily Routine",
            excerpt: "Discover the benefits of incorporating mindfulness practices into your everyday life and how it can reduce stress...",
            url: "/blog/mindfulness-daily-routine"
        },
        {
            title: "Essential Photography Tips for Beginners",
            excerpt: "Want to improve your photography skills? These fundamental tips will help you take better photos right away...",
            url: "/blog/photography-tips-beginners"
        },
        {
            title: "The Science Behind Effective Learning Techniques",
            excerpt: "Research-backed methods to enhance your learning efficiency and retain information longer...",
            url: "/blog/effective-learning-techniques"
        }
    ];
    
    // Display random post suggestion
    function displayRandomPost() {
        const randomIndex = Math.floor(Math.random() * samplePosts.length);
        const post = samplePosts[randomIndex];
        const randomPostContainer = document.getElementById('random-post-container');
        
        // Create post content
        randomPostContainer.innerHTML = `
            <h4>${post.title}</h4>
            <p>${post.excerpt}</p>
            <a href="${post.url}" class="post-link">Read this article →</a>
        `;
        
        // Add fade-in effect
        randomPostContainer.style.opacity = '0';
        setTimeout(() => {
            randomPostContainer.style.transition = 'opacity 0.5s ease';
            randomPostContainer.style.opacity = '1';
        }, 300);
    }
    
    // Add slight delay before showing random post to create a loading effect
    setTimeout(displayRandomPost, 1000);
    
    // Track 404 error (would connect to your analytics in a real implementation)
    function track404Error() {
        const path = window.location.pathname;
        const referrer = document.referrer;
        
        // In a real implementation, you might send this data to your analytics service
        console.log('404 Error tracked:', {
            path: path,
            referrer: referrer,
            timestamp: new Date().toISOString()
        });
        
        // Example of how you might send this to an analytics endpoint
        /*
        fetch('/api/analytics/404', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: path,
                referrer: referrer,
                timestamp: new Date().toISOString()
            })
        });
        */
    }
    
    // Run tracking after a short delay
    setTimeout(track404Error, 500);
    
    // Add event listener for search form
    document.getElementById('search-form').addEventListener('submit', function(e) {
        const searchInput = document.getElementById('search-input');
        if (!searchInput.value.trim()) {
            e.preventDefault();
            searchInput.classList.add('shake');
            setTimeout(() => {
                searchInput.classList.remove('shake');
            }, 500);
        }
    });
    
    // Easter egg: Konami code changes the page theme
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPosition = 0;
    
    document.addEventListener('keydown', function(e) {
        // Check if the key pressed matches the next key in the Konami code
        if (e.key === konamiCode[konamiPosition]) {
            konamiPosition++;
            
            // If the full code has been entered
            if (konamiPosition === konamiCode.length) {
                activateEasterEgg();
                konamiPosition = 0;
            }
        } else {
            konamiPosition = 0;
        }
    });
    
    function activateEasterEgg() {
        document.body.style.transition = 'background-color 1s ease';
        document.body.style.backgroundColor = '#222';
        
        const errorContainer = document.querySelector('.error-container');
        errorContainer.style.transition = 'all 1s ease';
        errorContainer.style.backgroundColor = '#333';
        errorContainer.style.color = '#fff';
        
        const errorCode = document.querySelector('.error-code');
        errorCode.style.transition = 'all 1s ease';
        errorCode.style.color = '#e74c3c';
        errorCode.innerHTML = 'W<span class="digit-animation">0</span>W';
        
        const paperPlane = document.querySelector('.paper-plane');
        paperPlane.style.transition = 'all 1s ease';
        paperPlane.style.backgroundColor = '#e74c3c';
        
        document.querySelector('.error-message').textContent = 'You found the secret!';
        document.querySelector('.error-description').textContent = 'The Konami code works even on 404 pages. How cool is that?';
    }
});