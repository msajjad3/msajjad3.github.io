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
        switchTab('about');
    }
    // Scroll to top of page
    window.scrollTo(0, 0);
}

// Add CUHK Map Functionality
function initCUHKMap() {
    const mapContainer = document.getElementById('cuhk-map');
    
    if (!mapContainer) return;
    
    // Create map placeholder with CUHK coordinates
    const cuhkCoords = { lat: 22.4195, lng: 114.2062 }; // CUHK coordinates
    
    // Create a simple SVG map (no external API needed)
    mapContainer.innerHTML = `
        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); position: relative;">
            <!-- Map background -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: 
                radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 2px, transparent 2px),
                radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 2px, transparent 2px),
                radial-gradient(circle at 40% 70%, rgba(255,255,255,0.1) 2px, transparent 2px);
                background-size: 50px 50px;">
            </div>
            
            <!-- Hong Kong Island outline -->
            <div style="position: absolute; top: 60%; left: 40%; width: 40%; height: 30%; 
                background: rgba(42, 157, 143, 0.6); border-radius: 50% 50% 30% 30%; 
                transform: rotate(-10deg);"></div>
            
            <!-- Kowloon outline -->
            <div style="position: absolute; top: 50%; left: 50%; width: 30%; height: 25%; 
                background: rgba(231, 111, 81, 0.6); border-radius: 40% 40% 30% 30%; 
                transform: rotate(5deg);"></div>
            
            <!-- CUHK Marker -->
            <div style="position: absolute; top: 45%; left: 55%; transform: translate(-50%, -50%);">
                <div style="position: relative;">
                    <div style="width: 20px; height: 20px; background: white; border-radius: 50%; 
                        border: 3px solid var(--accent-color); box-shadow: 0 0 0 5px rgba(231, 111, 81, 0.3); 
                        animation: pulse 2s infinite;"></div>
                    <div style="position: absolute; top: 25px; left: -40px; width: 100px; 
                        background: white; padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; 
                        color: var(--text-color); box-shadow: var(--shadow); text-align: center;">
                        <strong>CUHK</strong>
                    </div>
                </div>
            </div>
            
            <!-- Compass -->
            <div style="position: absolute; bottom: 15px; right: 15px; background: rgba(255,255,255,0.9); 
                padding: 5px; border-radius: 4px; font-size: 0.8rem;">
                <i class="fas fa-compass"></i> N
            </div>
            
            <!-- Scale -->
            <div style="position: absolute; bottom: 15px; left: 15px; background: rgba(255,255,255,0.9); 
                padding: 5px 10px; border-radius: 4px; font-size: 0.8rem;">
                <i class="fas fa-ruler"></i> 5 km
            </div>
        </div>
    `;
    
// Initialize map when page loads
document.addEventListener('DOMContentLoaded', () => {
    initCUHKMap();
});

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
