// =============================================================================
// Main JavaScript - Dark Theme Enhanced
// =============================================================================

// Responsive video embeds
var videoEmbeds = [
  'iframe[src*="youtube.com"]',
  'iframe[src*="vimeo.com"]'
];
reframe(videoEmbeds.join(','));

// Mobile menu
var menuToggle = document.querySelectorAll('.menu-toggle');

for (var i = 0; i < menuToggle.length; i++) {
  menuToggle[i].addEventListener('click', function (e) {
    document.body.classList.toggle('menu--opened');
    e.preventDefault();
  }, false);
}

document.body.classList.remove('menu--opened');

window.addEventListener('resize', function () {
  if (menuToggle[0].offsetParent === null) {
    document.body.classList.remove('menu--opened');
  }
}, true);

// Accordion
var faqAccordions = document.querySelectorAll('.handorgel');
Array.from(faqAccordions).forEach((faqAccordion) => {
  var accordion = new handorgel(faqAccordion, {
    multiSelectable: true
  });
});

// =============================================================================
// Scroll Animations using Intersection Observer
// =============================================================================

(function () {
  // Elements to animate
  const animateElements = document.querySelectorAll(
    '.block-item, .post-feed .card, .block-header, .hero-block .block-content, .hero-block .block-preview'
  );

  // Add initial animation class
  animateElements.forEach((el, index) => {
    el.classList.add('animate-on-scroll');
    // Add staggered delay for items in a group
    if (el.classList.contains('block-item') || el.closest('.post-feed')) {
      el.style.transitionDelay = `${index * 0.1}s`;
    }
  });

  // Create Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optionally unobserve after animating
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animation elements
  animateElements.forEach((el) => {
    observer.observe(el);
  });
})();

// =============================================================================
// Header scroll effect
// =============================================================================

(function () {
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      document.body.classList.add('has--scrolled');
    } else {
      document.body.classList.remove('has--scrolled');
    }

    lastScrollY = scrollY;
  }

  // Initial check
  updateHeader();

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// =============================================================================
// Smooth scroll for anchor links
// =============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// =============================================================================
// Global Cosmic Canvas - Floating Stars Animation (Full Page)
// =============================================================================

(function () {
  const canvas = document.getElementById('global-cosmic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animationId;

  // Apply fixed positioning styles
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  `;

  // Star class with floating motion
  class Star {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial
        ? Math.random() * canvas.height
        : Math.random() * canvas.height;
      this.size = Math.random() * 1.2 + 0.3;
      this.baseOpacity = Math.random() * 0.4 + 0.15;
      this.opacity = this.baseOpacity;

      // Floating drift parameters - very gentle movement
      this.driftX = (Math.random() - 0.5) * 0.12;
      this.driftY = (Math.random() - 0.5) * 0.08;

      // Gentle opacity oscillation
      this.opacitySpeed = Math.random() * 0.0006 + 0.0002;
      this.opacityPhase = Math.random() * Math.PI * 2;
    }

    update(time) {
      // Floating drift movement
      this.x += this.driftX;
      this.y += this.driftY;

      // Gentle opacity breathing
      this.opacity = this.baseOpacity + Math.sin(time * this.opacitySpeed + this.opacityPhase) * 0.12;

      // Wrap around edges
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`;
      ctx.fill();
    }
  }

  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  // Initialize stars
  function initStars() {
    const starCount = Math.floor((canvas.width * canvas.height) / 5000);
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
  }

  // Animation loop
  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw stars
    stars.forEach(star => {
      star.update(time);
      star.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animate(0);
})();