// tabs.js - Tab functionality for SAJJAD Lab website

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
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Add click event to each tab link
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target tab ID from data attribute
            const targetId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabLinks.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Update URL hash for bookmarking
            window.location.hash = targetId;
        });
    });
    
    // Check URL hash on page load
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetTab = document.querySelector(`.tab-link[data-tab="${hash}"]`);
        if (targetTab) {
            targetTab.click();
        }
    }
}

// Make function available globally
window.switchTab = function(tabId) {
    const tab = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
    if (tab) {
        tab.click();
    }
};
