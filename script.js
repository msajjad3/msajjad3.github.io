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
    const hash = window.location.hash.substring(1) || 'pi';
    switchTab(hash);
    if (window.location.hash === '#pi' || window.location.hash === '') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }
    
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Add staggered animation delays to cards
    addStaggeredDelays();
    
    // Load latest updates
    loadLatestUpdates();
});

// ===== SCROLL REVEAL ANIMATION =====
function initScrollReveal() {
    // Add reveal class to all elements that should animate on scroll
    const elementsToReveal = [
        '.content-card',
        '.team-member',
        '.project-card',
        '.publication-item',
        '.news-item',
        '.contact-item',
        '.alumni-member',
        '.section-header',
        '.about-text',
        '.about-grid > div'
    ];
    
    elementsToReveal.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
        });
    });
    
    // Set up Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });
    
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// ===== ADD STAGGERED DELAYS TO CARDS =====
function addStaggeredDelays() {
    const cardGroups = [
        '.team-member',
        '.project-card',
        '.publication-item',
        '.news-item',
        '.alumni-member'
    ];
    
    cardGroups.forEach(selector => {
        document.querySelectorAll(selector).forEach((card, index) => {
            card.style.animationDelay = `${index * 0.05}s`;
        });
    });
}

// Theme Selector
themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    
    document.body.classList.remove('theme-coffee', 'theme-retro');
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
    
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
        
        history.pushState(null, null, `#${tabId}`);
        switchTab(tabId);
        
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'pi';
    switchTab(hash);
});

function switchTab(tabId) {
    tabContents.forEach(tab => tab.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    const activeNavLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
    
    if (!activeTab) {
        switchTab('pi');
    }
    
    // Load publications if needed
    if (tabId === 'publications') {
        initPublicationsTab();
    }
    
    // Re-trigger scroll reveal for new content
    setTimeout(() => {
        initScrollReveal();
        addStaggeredDelays();
    }, 100);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== TEAM TAB FUNCTIONS =====
function showTeamSection(sectionId) {
    document.querySelectorAll('.team-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.team-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const section = document.getElementById(sectionId + '-team');
    if (section) {
        section.classList.add('active');
    }
    
    event.target.classList.add('active');
}

function initTeamTab() {
    showTeamSection('current');
}

// ===== DYNAMIC PUBLICATIONS =====
async function initPublicationsTab() {
    loadPublications();
}

async function loadPublications() {
    const container = document.getElementById('publications-container');
    const lastUpdatedEl = document.getElementById('last-updated');
    const updateDateEl = document.getElementById('update-date');
    
    try {
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Loading publications...
            </div>
        `;
        
        const response = await fetch('data/publications.json');
        
        if (!response.ok) {
            throw new Error('Failed to load publications');
        }
        
        const data = await response.json();
        displayPublications(data.publications);
        
        if (data.last_updated) {
            const date = new Date(data.last_updated);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            updateDateEl.textContent = formattedDate;
            lastUpdatedEl.style.display = 'inline-flex';
        }
        
        document.getElementById('pub-count').textContent = data.publications.length;
        
    } catch (error) {
        console.error('Error loading publications:', error);
        displayFallbackPublications();
    }
}

function displayPublications(publications) {
    const container = document.getElementById('publications-container');
    
    if (!publications || publications.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-light);">
                <i class="fas fa-book-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>No publications found.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="pub-controls">
            <div class="pub-sort">
                <span style="color: var(--text-light); margin-right: 10px;">Sort by:</span>
                <button class="active" onclick="sortPublications('date', this)">Latest</button>
                <button onclick="sortPublications('citations', this)">Most Cited</button>
                <button onclick="sortPublications('title', this)">Title</button>
            </div>
            <div class="pub-stats">
                <i class="fas fa-chart-line"></i>
                <span id="pub-count">${publications.length}</span> publications
            </div>
        </div>
    `;
    
    publications.forEach((pub, index) => {
        html += `
            <div class="publication-item" data-year="${pub.year}" data-citations="${pub.citations || 0}" style="animation-delay: ${index * 0.03}s">
                <div class="pub-title">${pub.title}</div>
                <div class="pub-authors">${pub.authors}</div>
                <div class="pub-venue">${pub.venue} (${pub.year})</div>
                ${pub.abstract ? `<div class="pub-abstract">${pub.abstract}</div>` : ''}
                <div class="pub-links">
                    <a href="${pub.url}" class="pub-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> DOI / View
                    </a>
                    ${pub.citations ? `
                        <span class="citation-count">
                            <i class="fas fa-quote-right"></i> ${pub.citations} citation${pub.citations !== 1 ? 's' : ''}
                        </span>
                    ` : ''}
                    ${pub.pdf_url ? `
                        <a href="${pub.pdf_url}" class="pub-link" target="_blank">
                            <i class="fas fa-file-pdf"></i> PDF
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function displayFallbackPublications() {
    const container = document.getElementById('publications-container');
    
    container.innerHTML = `
        <ul class="publication-list">
            <li class="publication-item">
                <div class="pub-title">Rethinking disaster resilience in high-density cities: Towards an urban resilience knowledge system</div>
                <div class="pub-authors">Sajjad, M., Chan, J.C.L., Chopra, S.S.</div>
                <div class="pub-venue">Sustainable Cities and Society, 69, 102850 (2021)</div>
                <div class="pub-links">
                    <a href="https://doi.org/10.1016/j.scs.2021.102850" class="pub-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> DOI
                    </a>
                </div>
            </li>
            <li class="publication-item">
                <div class="pub-title">Assessing hazard vulnerability, habitat conservation, and restoration for the enhancement of mainland China's coastal resilience</div>
                <div class="pub-authors">Sajjad, M., Li, Y., Tang, Z., Cao, L., Liu, X.</div>
                <div class="pub-venue">Earth's Future, 6(3), 326-338 (2018)</div>
                <div class="pub-links">
                    <a href="https://doi.org/10.1002/2017EF000676" class="pub-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> DOI
                    </a>
                </div>
            </li>
            <li class="publication-item">
                <div class="pub-title">Integration of machine learning and remote sensing for above ground biomass estimation</div>
                <div class="pub-authors">Anees, S.A., Mehmood, K., Khan, W.R., Sajjad, M., et al.</div>
                <div class="pub-venue">Ecological Informatics, 82, 102732 (2024)</div>
                <div class="pub-links">
                    <a href="https://doi.org/10.1016/j.ecoinf.2024.102732" class="pub-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> DOI
                    </a>
                </div>
            </li>
            <li class="publication-item">
                <div class="pub-title">Risk assessment for the sustainability of coastal communities: A preliminary study</div>
                <div class="pub-authors">Sajjad, M., Chan, J.C.L.</div>
                <div class="pub-venue">Science of the Total Environment, 671, 339-350 (2019)</div>
                <div class="pub-links">
                    <a href="https://doi.org/10.1016/j.scitotenv.2019.03.290" class="pub-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> DOI
                    </a>
                </div>
            </li>
        </ul>
    `;
}

// Sort publications function
function sortPublications(sortBy, button) {
    document.querySelectorAll('.pub-sort button').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    const container = document.getElementById('publications-container');
    const items = Array.from(container.querySelectorAll('.publication-item'));
    
    items.sort((a, b) => {
        if (sortBy === 'date') {
            const yearA = parseInt(a.dataset.year) || 0;
            const yearB = parseInt(b.dataset.year) || 0;
            return yearB - yearA;
        } else if (sortBy === 'citations') {
            const citesA = parseInt(a.dataset.citations) || 0;
            const citesB = parseInt(b.dataset.citations) || 0;
            return citesB - citesA;
        } else if (sortBy === 'title') {
            const titleA = a.querySelector('.pub-title').textContent.toLowerCase();
            const titleB = b.querySelector('.pub-title').textContent.toLowerCase();
            return titleA.localeCompare(titleB);
        }
        return 0;
    });
    
    items.forEach(item => container.appendChild(item));
}

// ===== LATEST UPDATES =====
function loadLatestUpdates() {
    const updatesContainer = document.querySelector('.updates-container');
    if (!updatesContainer) return;
    
    const newsItems = document.querySelectorAll('#news .news-item');
    
    if (!newsItems.length) {
        updatesContainer.innerHTML = '<p>No recent updates available.</p>';
        return;
    }
    
    updatesContainer.innerHTML = '';
    const recentItems = Array.from(newsItems).slice(0, 3);
    
    recentItems.forEach(item => {
        const dateElement = item.querySelector('.news-date');
        const date = dateElement ? dateElement.textContent.trim() : 'Recent';
        const titleElement = item.querySelector('h3');
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        if (title) {
            const updateItem = document.createElement('div');
            updateItem.className = 'update-item';
            updateItem.innerHTML = `
                <span class="update-date">${date}</span>
                <a href="#" class="update-title" data-news-title="${title}">${title}</a>
            `;
            updatesContainer.appendChild(updateItem);
        }
    });
    
    updatesContainer.querySelectorAll('.update-title').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const newsTabLink = document.querySelector('a[data-tab="news"]');
            if (newsTabLink) {
                newsTabLink.click();
                setTimeout(() => {
                    const newsSection = document.getElementById('news');
                    if (newsSection) {
                        newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 150);
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
    }
    lastScroll = currentScroll;
});

// ===== SMOOTH ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const isTabLink = this.classList.contains('nav-link') || this.getAttribute('data-tab');
        
        if (isTabLink) {
            e.preventDefault();
            const tabId = href.substring(1);
            switchTab(tabId);
        } else if (href !== '#' && href.startsWith('#') && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update copyright year
document.addEventListener('DOMContentLoaded', () => {
    const footerText = document.querySelector('footer p:last-of-type');
    if (footerText && !footerText.innerHTML.includes('©')) {
        footerText.innerHTML = `The Chinese University of Hong Kong • © ${new Date().getFullYear()}`;
    }
});
