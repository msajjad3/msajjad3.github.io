// tabs.js - Tab functionality for SAJJAD Lab website

// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initTabs();
    
    // Set first tab as active by default
    const firstTab = document.querySelector('.tab-link');
    if (firstTab) {
        firstTab.click();
    }
});

function initTabs() {
    // Get all tab links and tab contents
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Check if we have tabs
    if (tabLinks.length === 0) {
        console.log('No tabs found on this page');
        return;
    }
    
    // Add click event to each tab link
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target tab ID from data attribute
            const targetId = this.getAttribute('data-tab');
            console.log('Switching to tab:', targetId);
            
            // Remove active class from all tabs and contents
            tabLinks.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            } else {
                console.error('Tab content not found:', targetId);
            }
            
            // Update URL hash for bookmarking
            if (history.pushState) {
                history.pushState(null, null, '#' + targetId);
            } else {
                window.location.hash = targetId;
            }
        });
    });
    
    // Check URL hash on page load
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetTab = document.querySelector(`.tab-link[data-tab="${hash}"]`);
        if (targetTab) {
            // Wait a bit for the page to fully render
            setTimeout(() => {
                targetTab.click();
            }, 100);
        }
    }
}
