// tabs.js - Simple tab functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-tab');
            
            // Hide all tabs
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active from all links
            tabLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Show target tab
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                this.classList.add('active');
                window.location.hash = targetId;
            }
        });
    });
    
    // Check URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetTab = document.querySelector(`.tab-link[data-tab="${hash}"]`);
        if (targetTab) targetTab.click();
    }
});
