/**
 * Portfolio Website JavaScript
 * Handles mobile menu toggle, scroll animations, and form submission
 */

// ============================================
// DOM Elements
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');

// ============================================
// Image Error Handling
// ============================================
/**
 * Handle image loading errors - hide image and show placeholder
 * @param {HTMLImageElement} img - The image element that failed to load
 */
function handleImageError(img) {
    console.log('❌ Image failed to load:', img.src);
    console.log('Make sure the file "profile.jpg" exists in the same folder as index.html');
    const wrapper = img.parentElement;
    if (wrapper) {
        wrapper.classList.remove('has-image');
    }
    // Keep placeholder visible (it's already visible by default)
}

/**
 * Handle successful image load - show image and hide placeholder
 * @param {HTMLImageElement} img - The image element that loaded successfully
 */
function handleImageLoad(img) {
    console.log('✅ Image loaded successfully:', img.src);
    const wrapper = img.parentElement;
    if (wrapper) {
        wrapper.classList.add('has-image');
    }
    const placeholder = img.nextElementSibling;
    if (placeholder && placeholder.classList.contains('image-placeholder')) {
        placeholder.style.display = 'none';
    }
}

// Check if image exists on page load
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.profile-image');
    images.forEach(function(img) {
        // Try to load the image
        if (img.src && img.src !== window.location.href) {
            const testImg = new Image();
            testImg.onload = function() {
                console.log('✅ Image file found:', img.src);
                handleImageLoad(img);
            };
            testImg.onerror = function() {
                console.log('❌ Image file NOT found:', img.src);
                console.log('📁 Current folder:', window.location.pathname);
                console.log('💡 Please add your image file as "profile.jpg" in the same folder as index.html');
                handleImageError(img);
            };
            testImg.src = img.src;
        }
    });
});

// ============================================
// Mobile Menu Toggle
// ============================================
/**
 * Toggle mobile menu visibility
 */
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Event listener for hamburger menu
if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (
        navMenu.classList.contains('active') &&
        !hamburger.contains(e.target) &&
        !navMenu.contains(e.target)
    ) {
        toggleMobileMenu();
    }
});

// ============================================
// Navbar Scroll Effect
// ============================================
/**
 * Add/remove scrolled class on navbar based on scroll position
 */
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Event listener for scroll (will be replaced with throttled version below)

// ============================================
// Scroll to Top Button
// ============================================
/**
 * Show/hide scroll to top button based on scroll position
 */
function handleScrollTop() {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

// Event listener for scroll (will be replaced with throttled version below)

// Scroll to top when button is clicked
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Smooth Scroll for Navigation Links
// ============================================
/**
 * Handle smooth scrolling for anchor links
 */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only handle anchor links
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// Scroll Animations
// ============================================
/**
 * Intersection Observer for fade-in animations
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    // Elements to animate
    const animateElements = document.querySelectorAll(`
        .about-content,
        .skill-card,
        .project-card,
        .contact-content,
        .section-header
    `);
    
    animateElements.forEach((element, index) => {
        // Add fade-in class
        element.classList.add('fade-in');
        
        // Add delay for staggered animation
        element.style.transitionDelay = `${index * 0.1}s`;
        
        // Observe element
        observer.observe(element);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ============================================
// Contact Form Handling
// ============================================
/**
 * Handle contact form submission
 */
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission (replace with actual API call)
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate API call (replace with actual implementation)
        setTimeout(() => {
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            contactForm.reset();
        }, 2000);
    });
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? '#10b981' : '#ef4444'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification i {
                font-size: 1.2rem;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Append to body
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ============================================
// Active Navigation Link Highlighting
// ============================================
/**
 * Highlight active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Event listener for scroll (will be replaced with throttled version below)

// ============================================
// Typing Animation for Hero Section (Optional Enhancement)
// ============================================
/**
 * Optional: Add typing animation to hero role
 * Uncomment to enable
 */
/*
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation
const heroRole = document.querySelector('.hero-role');
if (heroRole) {
    const originalText = heroRole.textContent;
    typeWriter(heroRole, originalText, 100);
}
*/

// ============================================
// Performance Optimization: Throttle Scroll Events
// ============================================
/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll events for better performance
const throttledNavbarScroll = throttle(handleNavbarScroll, 100);
const throttledScrollTop = throttle(handleScrollTop, 100);
const throttledActiveNav = throttle(updateActiveNavLink, 100);
const scrollProgressBar = document.getElementById('scroll-progress');
function handleScrollProgress() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = p + '%';
}
const throttledScrollProgress = throttle(handleScrollProgress, 50);

// Use throttled versions for scroll events
window.addEventListener('scroll', throttledNavbarScroll);
window.addEventListener('scroll', throttledScrollTop);
window.addEventListener('scroll', throttledActiveNav);
window.addEventListener('scroll', throttledScrollProgress);

// ============================================
// Initialize on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initial checks
    handleNavbarScroll();
    handleScrollTop();
    updateActiveNavLink();
    handleScrollProgress();
    
    console.log('Portfolio website loaded successfully!');
});

const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroSection = document.querySelector('.hero');
const heroShapes = document.querySelectorAll('.hero .shape');
if (!prefersReducedMotion && heroSection && heroShapes.length) {
    heroSection.addEventListener('mousemove', (e) => {
        const r = heroSection.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        heroShapes.forEach((shape, idx) => {
            const k = (idx + 1) * 8;
            shape.style.transform = `translate(${px * k}px, ${py * k}px)`;
        });
    });
    heroSection.addEventListener('mouseleave', () => {
        heroShapes.forEach((shape) => {
            shape.style.transform = '';
        });
    });
}

const heroRoleEl = document.querySelector('.hero-role');
if (!prefersReducedMotion && heroRoleEl) {
    const roles = heroRoleEl.dataset.roles ? heroRoleEl.dataset.roles.split('|').map(s => s.trim()).filter(Boolean) : [heroRoleEl.textContent.trim()];
    let i = 0;
    let j = 0;
    let removing = false;
    function step() {
        const t = roles[i] || '';
        if (!removing) {
            j = Math.min(j + 1, t.length);
            heroRoleEl.textContent = t.slice(0, j);
            if (j === t.length) {
                removing = true;
                setTimeout(step, 1200);
                return;
            }
            setTimeout(step, 90);
        } else {
            j = Math.max(j - 1, 0);
            heroRoleEl.textContent = t.slice(0, j);
            if (j === 0) {
                removing = false;
                i = (i + 1) % roles.length;
                setTimeout(step, 300);
                return;
            }
            setTimeout(step, 50);
        }
    }
    step();
}

const cards = document.querySelectorAll('.project-card');
if (!prefersReducedMotion && cards.length) cards.forEach((card) => {
    let raf = 0;
    function reset() {
        card.style.transform = '';
        card.style.boxShadow = '';
    }
    card.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const ry = ((x / r.width) - 0.5) * 16;
            const rx = ((y / r.height) - 0.5) * -16;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
            card.style.boxShadow = `0 20px 30px rgba(0,0,0,0.15)`;
        });
    });
    card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        reset();
    });
});

// Show the card's icon instead of a broken frame if a project screenshot fails to load
document.querySelectorAll('.project-shot img').forEach((img) => {
    const fallback = () => img.closest('.project-image').classList.add('is-shot-missing');
    if (img.complete && img.naturalWidth === 0) fallback();
    else img.addEventListener('error', fallback);
});

