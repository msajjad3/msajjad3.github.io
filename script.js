// ===== DOM Elements =====
const themeSelect = document.getElementById('themeSelect');
const modeToggle = document.getElementById('modeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');

// ===== PUBLICATIONS DATA =====
let allPublications = [];
let currentSort = 'year';
let searchTerm = '';

// ===== INITIALIZATION =====
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
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
        });
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
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
            if (!card.style.animationDelay) {
                card.style.animationDelay = `${index * 0.05}s`;
            }
        });
    });
}

// ===== THEME SELECTOR =====
themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    
    document.body.classList.remove('theme-coffee', 'theme-retro');
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
    
    localStorage.setItem('sajjadLabTheme', theme);
});

// ===== DARK MODE TOGGLE =====
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

// ===== MOBILE MENU =====
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// ===== TAB NAVIGATION =====
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
        const defaultTab = document.getElementById('pi');
        if (defaultTab) defaultTab.classList.add('active');
        const defaultNav = document.querySelector('.nav-link[data-tab="pi"]');
        if (defaultNav) defaultNav.classList.add('active');
    }
    
    // Load publications if publications tab is opened
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
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function initTeamTab() {
    const currentBtn = document.querySelector('.team-tab-btn');
    if (currentBtn) {
        showTeamSection('current');
    }
}

// ===== BIBTEX-BASED PUBLICATIONS SYSTEM =====

// Load publications from BibTeX file
async function loadPublicationsFromBibTeX() {
    const container = document.getElementById('publications-container');
    if (!container) return;
    
    try {
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Loading publications from BibTeX...
            </div>
        `;
        
        const response = await fetch('data/publications.bib');
        
        if (!response.ok) {
            throw new Error(`Failed to load publications.bib (${response.status})`);
        }
        
        const bibtexContent = await response.text();
        allPublications = parseBibTeX(bibtexContent);
        
        displayPublications(allPublications);
        
        const pubCountEl = document.getElementById('pub-count');
        if (pubCountEl) {
            pubCountEl.textContent = allPublications.length;
        }
        
        const lastUpdatedEl = document.getElementById('last-updated');
        const updateDateEl = document.getElementById('update-date');
        if (lastUpdatedEl && updateDateEl) {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            updateDateEl.textContent = formattedDate;
            lastUpdatedEl.style.display = 'inline-flex';
        }
        
    } catch (error) {
        console.error('Error loading publications:', error);
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to load publications. Please make sure the publications.bib file exists in the data folder.</p>
                <p style="font-size: 0.85rem; margin-top: 10px;">Error: ${error.message}</p>
                <button onclick="refreshPublications()" class="btn" style="margin-top: 20px;">
                    <i class="fas fa-sync-alt"></i> Retry
                </button>
            </div>
        `;
    }
}

// Parse BibTeX content
function parseBibTeX(bibtexContent) {
    const publications = [];
    const entryRegex = /@(\w+)\{([^,]+),\s*([\s\S]*?)\n\}/g;
    let match;
    
    while ((match = entryRegex.exec(bibtexContent)) !== null) {
        const type = match[1];
        const citeKey = match[2];
        const fieldsStr = match[3];
        
        const pub = {
            type: type,
            citeKey: citeKey,
            title: extractField(fieldsStr, 'title'),
            author: extractField(fieldsStr, 'author'),
            journal: extractField(fieldsStr, 'journal') || extractField(fieldsStr, 'booktitle'),
            year: extractField(fieldsStr, 'year'),
            volume: extractField(fieldsStr, 'volume'),
            number: extractField(fieldsStr, 'number'),
            pages: extractField(fieldsStr, 'pages'),
            doi: extractField(fieldsStr, 'doi'),
            url: extractField(fieldsStr, 'url'),
            abstract: extractField(fieldsStr, 'abstract'),
            publisher: extractField(fieldsStr, 'publisher')
        };
        
        if (pub.author) {
            pub.author = pub.author.replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
            pub.authorFormatted = formatAuthors(pub.author);
        }
        
        if (pub.title) {
            pub.title = pub.title.replace(/[{}]/g, '').trim();
        }
        
        if (pub.journal) {
            pub.journal = pub.journal.replace(/[{}]/g, '').trim();
        }
        
        if (pub.doi && !pub.url) {
            pub.url = `https://doi.org/${pub.doi}`;
        }
        
        if (pub.journal) {
            pub.venue = pub.journal;
            if (pub.volume) {
                pub.venue += `, ${pub.volume}`;
                if (pub.number) pub.venue += `(${pub.number})`;
            }
            if (pub.pages) pub.venue += `, ${pub.pages}`;
        } else if (pub.publisher) {
            pub.venue = pub.publisher;
        } else {
            pub.venue = 'Publication';
        }
        
        publications.push(pub);
    }
    
    publications.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    
    return publications;
}

// Extract field from BibTeX
function extractField(fieldsStr, fieldName) {
    const regex = new RegExp(`${fieldName}\\s*=\\s*[{"]((?:[^"{}]|\\{[^}]*\\})*)[}"]`, 'i');
    const match = fieldsStr.match(regex);
    if (match) {
        return match[1].trim();
    }
    return null;
}

// Format authors
function formatAuthors(authorStr) {
    if (!authorStr) return '';
    const authors = authorStr.split(/\sand\s/);
    const formatted = authors.map(author => {
        const parts = author.split(',').map(p => p.trim());
        if (parts.length >= 2) {
            return `${parts[1]} ${parts[0]}`;
        }
        return author;
    });
    
    if (formatted.length > 3) {
        return `${formatted[0]}, ${formatted[1]}, et al.`;
    }
    return formatted.join(', ');
}

// Display publications with sorting and filtering
function displayPublications(publications) {
    const container = document.getElementById('publications-container');
    if (!container) return;
    
    let filtered = publications;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = publications.filter(pub => 
            (pub.title && pub.title.toLowerCase().includes(term)) ||
            (pub.author && pub.author.toLowerCase().includes(term)) ||
            (pub.year && pub.year.includes(term)) ||
            (pub.journal && pub.journal.toLowerCase().includes(term))
        );
    }
    
    filtered.sort((a, b) => {
        if (currentSort === 'year') {
            return parseInt(b.year) - parseInt(a.year);
        } else if (currentSort === 'title') {
            return (a.title || '').localeCompare(b.title || '');
        } else if (currentSort === 'author') {
            return (a.author || '').localeCompare(b.author || '');
        }
        return 0;
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No publications found matching "${searchTerm}"</p>
                <button onclick="clearPublicationSearch()" class="btn" style="margin-top: 15px;">
                    <i class="fas fa-times"></i> Clear Search
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    filtered.forEach((pub, index) => {
        const hasAbstract = pub.abstract && pub.abstract.length > 0;
        
        html += `
            <div class="publication-item" data-year="${pub.year || 0}" style="animation-delay: ${index * 0.03}s">
                <div class="pub-title">${escapeHtml(pub.title || 'Untitled')}</div>
                <div class="pub-authors">${escapeHtml(pub.authorFormatted || pub.author || 'Authors not specified')}</div>
                <div class="pub-venue">${escapeHtml(pub.venue || pub.journal || '')}${pub.year ? ` (${pub.year})` : ''}</div>
                ${pub.doi ? `<div class="pub-doi"><i class="fas fa-digital-object-identifier"></i> DOI: ${escapeHtml(pub.doi)}</div>` : ''}
                ${hasAbstract ? `
                    <div class="pub-abstract-preview" onclick="toggleAbstract('${pub.citeKey}')">
                        <i class="fas fa-quote-left"></i> Show abstract
                    </div>
                    <div id="abstract-${pub.citeKey}" class="pub-abstract-full">
                        ${escapeHtml(pub.abstract).replace(/\n/g, '<br>')}
                    </div>
                ` : ''}
                <div class="pub-links">
                    ${pub.doi ? `
                        <a href="https://doi.org/${escapeHtml(pub.doi)}" class="pub-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i> DOI
                        </a>
                    ` : ''}
                    ${pub.url ? `
                        <a href="${escapeHtml(pub.url)}" class="pub-link" target="_blank">
                            <i class="fas fa-file-alt"></i> View Article
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Toggle abstract visibility
function toggleAbstract(citeKey) {
    const abstractDiv = document.getElementById(`abstract-${citeKey}`);
    if (abstractDiv) {
        abstractDiv.classList.toggle('show');
        const previewDiv = abstractDiv.previousElementSibling;
        if (abstractDiv.classList.contains('show')) {
            previewDiv.innerHTML = '<i class="fas fa-quote-right"></i> Hide abstract';
        } else {
            previewDiv.innerHTML = '<i class="fas fa-quote-left"></i> Show abstract';
        }
    }
}

// Initialize publication search
function initPublicationSearch() {
    const searchInput = document.getElementById('pub-search-input');
    if (searchInput) {
        searchInput.removeEventListener('input', handleSearchInput);
        searchInput.addEventListener('input', handleSearchInput);
    }
}

function handleSearchInput(e) {
    searchTerm = e.target.value;
    displayPublications(allPublications);
}

// Initialize sort buttons
function initSortButtons() {
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach(btn => {
        btn.removeEventListener('click', handleSortClick);
        btn.addEventListener('click', handleSortClick);
    });
}

function handleSortClick(e) {
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentSort = e.target.dataset.sort;
    displayPublications(allPublications);
}

// Clear publication search
function clearPublicationSearch() {
    const searchInput = document.getElementById('pub-search-input');
    if (searchInput) {
        searchInput.value = '';
        searchTerm = '';
        displayPublications(allPublications);
    }
}

// Refresh publications
function refreshPublications() {
    loadPublicationsFromBibTeX();
}

// Initialize publications tab
function initPublicationsTab() {
    if (allPublications.length === 0) {
        loadPublicationsFromBibTeX();
    }
    initPublicationSearch();
    initSortButtons();
    
    const refreshLink = document.getElementById('refresh-pubs-link');
    if (refreshLink) {
        refreshLink.removeEventListener('click', handleRefreshClick);
        refreshLink.addEventListener('click', handleRefreshClick);
    }
}

function handleRefreshClick(e) {
    e.preventDefault();
    refreshPublications();
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
                <span class="update-date">${escapeHtml(date)}</span>
                <a href="#" class="update-title" data-news-title="${escapeHtml(title)}">${escapeHtml(title)}</a>
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
    if (nav) {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        }
        lastScroll = currentScroll;
    }
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

// ===== UPDATE COPYRIGHT YEAR =====
document.addEventListener('DOMContentLoaded', () => {
    const footerText = document.querySelector('footer p:last-of-type');
    if (footerText && !footerText.innerHTML.includes('©')) {
        footerText.innerHTML = `The Chinese University of Hong Kong • © ${new Date().getFullYear()}`;
    }
});

// ===== EXPOSE FUNCTIONS FOR GLOBAL USE =====
window.switchTab = switchTab;
window.showTeamSection = showTeamSection;
window.toggleAbstract = toggleAbstract;
window.clearPublicationSearch = clearPublicationSearch;
window.refreshPublications = refreshPublications;
