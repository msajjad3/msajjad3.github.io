// DOM Elements
const themeSelect = document.getElementById('themeSelect');
const modeToggle = document.getElementById('modeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize theme from localStorage or default
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('sajjadLabTheme') || 'default';
    const savedMode = localStorage.getItem('sajjadLabMode') || 'light';
    
    // Apply saved theme
    document.body.classList.remove('theme-coffee', 'theme-retro');
    if (savedTheme !== 'default') {
        document.body.classList.add(`theme-${savedTheme}`);
    }
    themeSelect.value = savedTheme;
    
    // Apply saved mode
    if (savedMode === 'dark') {
        document.body.classList.add('dark-mode');
        modeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    }
    
    // Set active tab from URL hash or default
    const hash = window.location.hash.substring(1) || 'about';
    switchTab(hash);
});

// Theme Selector
themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    
    // Remove all theme classes
    document.body.classList.remove('theme-coffee', 'theme-retro');
    
    // Add selected theme class
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
    
    // Save to localStorage
    localStorage.setItem('sajjadLabTheme', theme);
});

// Dark/Light Mode Toggle
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        modeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
        localStorage.setItem('sajjadLabMode', 'dark');
    } else {
        modeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
        localStorage.setItem('sajjadLabMode', 'light');
    }
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Tab Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = item.getAttribute('data-tab');
        
        // Update URL hash without scrolling
        history.pushState(null, null, `#${tabId}`);
        
        // Switch tab
        switchTab(tabId);
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'about';
    switchTab(hash);
});

// Tab switching function
function switchTab(tabId) {
    // Hide all tabs
    tabContents.forEach(tab => tab.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));
    
    // Show selected tab
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Activate corresponding nav link
    const activeNavLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
    
    // If tab doesn't exist, default to about
    if (!activeTab) {
        switchTab('pi');
    }
    // Scroll to top of page
    window.scrollTo(0, 0);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Check if it's a tab navigation link
        const isTabLink = this.classList.contains('nav-link') || 
                         this.getAttribute('data-tab');
        
        // If it's a tab link, prevent scrolling
        if (isTabLink) {
            e.preventDefault();
            // Just switch tabs without scrolling
            const tabId = href.substring(1);
            switchTab(tabId);
        } 
        // For other anchor links (like footer, within page), allow smooth scroll
        else if (href !== '#' && href.startsWith('#') && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Update copyright year
document.addEventListener('DOMContentLoaded', () => {
    const footerText = document.querySelector('footer p:last-of-type');
    if (footerText) {
        footerText.innerHTML = `The Chinese University of Hong Kong • © ${new Date().getFullYear()}`;
    }
});
