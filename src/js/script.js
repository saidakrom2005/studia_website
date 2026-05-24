
// ========== SCROLL HANDLER FOR STICKY NAV ========== 

function initScrollHandler() {
    const headerFixed = document.querySelector('.header_fixed');
    let lastScrollPosition = 0;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Add scrolled class when user scrolls down
        if (scrollPosition > 63) {
            if (!headerFixed.classList.contains('scrolled')) {
                headerFixed.classList.add('scrolled');
            }
        } else {
            headerFixed.classList.remove('scrolled');
        }
        
        lastScrollPosition = scrollPosition;

        if (scrollPosition < lastScrollPosition) {
            headerFixed.classList.remove('scrolled');
        }
    });
}

// ========== VIDEO HOVER EFFECT FOR PROJECTS CARDS ==========

function initProjectsCardHover() {
    const projectCards = document.querySelectorAll('.projects_card');
    
    projectCards.forEach(card => {
        const video = card.querySelector('.projects_card_video');
        
        if (video) {
            card.addEventListener('mouseenter', () => {
                video.play();
            });
            
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
}

// ========== RECOGNITION COUNTER ANIMATION ==========

function initCounterAnimation() {
    const counterElement = document.getElementById('counterValue');
    if (!counterElement) return;

    const targetNumber = 2000000;
    let currentNumber = 0;
    const duration = 2000; // 2 seconds
    const steps = 60; // Number of animation frames
    const increment = targetNumber / steps;
    const stepDuration = duration / steps;

    // Use Intersection Observer to start animation when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && currentNumber === 0) {
                let step = 0;
                const animationInterval = setInterval(() => {
                    step++;
                    currentNumber = Math.floor(increment * step);
                    
                    // Format number with spaces
                    const formattedNumber = currentNumber.toLocaleString('ru-RU');
                    counterElement.textContent = formattedNumber;
                    
                    if (step >= steps) {
                        clearInterval(animationInterval);
                        // Set final value
                        counterElement.textContent = targetNumber.toLocaleString('ru-RU');
                        observer.unobserve(entry.target);
                    }
                }, stepDuration);
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(counterElement);
}

// ========== CAROUSEL INITIALIZATION ==========

function initCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;

    // Add touch event listeners for mobile pause/play
    let touchStartX = 0;
    let isTouching = false;

    carouselTrack.addEventListener('touchstart', () => {
        isTouching = true;
        carouselTrack.style.animationPlayState = 'paused';
    });

    carouselTrack.addEventListener('touchend', () => {
        isTouching = false;
        carouselTrack.style.animationPlayState = 'running';
    });

    // Also handle mouse enter/leave for better UX
    carouselTrack.addEventListener('mouseenter', () => {
        carouselTrack.style.animationPlayState = 'paused';
    });

    carouselTrack.addEventListener('mouseleave', () => {
        carouselTrack.style.animationPlayState = 'running';
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollHandler();
    initProjectsCardHover();
    initCounterAnimation();
    initCarousel();
    initContactForm();
    initPortfolioFilters();
});

// ========== CONTACT FORM HANDLER ==========

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userName = document.getElementById('userName').value.trim();
        const countryCode = document.getElementById('countryCode').value;
        const userPhone = document.getElementById('userPhone').value.trim();
        const privacyCheck = document.getElementById('privacyCheck').checked;

        // Validate form data
        if (!userName || !userPhone || !privacyCheck) {
            alert('Please fill in all fields and accept the privacy policy');
            return;
        }

        // Log the form data (in production, this would send to a server)
        console.log('Form submitted:', {
            name: userName,
            phone: `${countryCode} ${userPhone}`,
            timestamp: new Date().toISOString()
        });

        // Show success message
        alert(`Thank you, ${userName}! Our manager will contact you at ${countryCode} ${userPhone} soon.`);
        
        // Reset form
        contactForm.reset();
    });
}

// ========== PORTFOLIO FILTERS HANDLER ==========

function initPortfolioFilters() {
    const filterSelects = document.querySelectorAll('.filter_select');
    const filterInput = document.querySelector('.filter_input');
    const projectCards = document.querySelectorAll('.project_card');
    
    if (filterSelects.length === 0 || !projectCards.length) return;

    // Sample project data - in production, this would come from a database or API
    const projectsData = [
        {
            id: 1,
            title: 'Luxury interior design project of a residence in Repino',
            area: 750,
            type: 'interior-design',
            tone: 'Luxury',
            location: 'Repino'
        },
        {
            id: 2,
            title: 'Luxury interior design project of a residence in Repino',
            area: 750,
            type: 'interior-design',
            tone: 'Luxury',
            location: 'Repino'
        },
        {
            id: 3,
            title: 'Premium architectural project of a residence in Repino',
            area: 750,
            type: 'architecture',
            tone: 'Premium',
            location: 'Repino'
        },
        {
            id: 4,
            title: 'Premium architectural project of a residence in Repino',
            area: 750,
            type: 'architecture',
            tone: 'Premium',
            location: 'Repino'
        }
    ];

    // Get all filter elements
    const directionFilter = document.querySelector('[data-filter="direction"]');
    const squareFilter = document.querySelector('[data-filter="square"]');
    const toneFilter = document.querySelector('[data-filter="tone"]');
    const locationInput = document.querySelector('[data-filter="location"]');

    function filterProjects() {
        const direction = directionFilter?.value || 'all';
        const square = squareFilter?.value || 'all';
        const tone = toneFilter?.value || 'all';
        const location = locationInput?.value.toLowerCase().trim() || '';

        let visibleCount = 0;

        projectCards.forEach((card, index) => {
            const project = projectsData[index];
            if (!project) {
                card.classList.add('hidden');
                return;
            }

            let show = true;

            // Filter by direction/type
            if (direction !== 'all') {
                const directionMap = {
                    'residential': 'interior-design',
                    'commercial': 'architecture'
                };
                if (project.type !== directionMap[direction]) {
                    show = false;
                }
            }

            // Filter by square/area
            if (square !== 'all' && show) {
                const areaMap = {
                    '500-1000': { min: 500, max: 1000 },
                    '1000-1500': { min: 1000, max: 1500 },
                    '1500-plus': { min: 1500, max: Infinity }
                };
                const range = areaMap[square];
                if (!range || project.area < range.min || project.area > range.max) {
                    show = false;
                }
            }

            // Filter by tone
            if (tone !== 'all' && show) {
                if (project.tone.toLowerCase() !== tone.toLowerCase()) {
                    show = false;
                }
            }

            // Filter by location/search
            if (location && show) {
                if (!project.location.toLowerCase().includes(location)) {
                    show = false;
                }
            }

            if (show) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show "no results" message if needed
        const grid = document.querySelector('.projects_grid');
        let noResultsMsg = document.querySelector('.no_results');
        
        if (visibleCount === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no_results';
                noResultsMsg.textContent = 'No projects match your search criteria';
                grid.appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }

    // Add event listeners to all filters
    const allFilters = [directionFilter, squareFilter, toneFilter, locationInput];
    allFilters.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterProjects);
            filter.addEventListener('input', filterProjects);
        }
    });

    // Initial filter
    filterProjects();
}

