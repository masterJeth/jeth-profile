/* ============================================================
   main.js — Jethro Velasco Personal Site
   ============================================================ */

// ── NAV SCROLL ──────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── MOBILE MENU ─────────────────────────────────────────────
const menuBtn = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay = siblings.indexOf(entry.target) * 60;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── LAZY IMAGE LOADING ───────────────────────────────────────
// Uses IntersectionObserver for performance.
// Falls back gracefully if image file doesn't exist.
function lazyLoad() {
  const images = document.querySelectorAll('img.lazy');

  if (!images.length) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      const src = img.dataset.src;

      if (!src) return;

      // Create a test image to handle load/error
      const tempImg = new Image();

      tempImg.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        img.classList.remove('lazy');
      };

      tempImg.onerror = () => {
        // Show a styled placeholder if image not found
        img.src = generatePlaceholderSVG();
        img.classList.add('loaded', 'fallback');
        img.classList.remove('lazy');
      };

      tempImg.src = src;
      imageObserver.unobserve(img);
    });
  }, {
    rootMargin: '200px 0px', // Preload 200px before entering viewport
    threshold: 0
  });

  images.forEach(img => imageObserver.observe(img));
}

function generatePlaceholderSVG() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="#E4E4DC"/>
      <text x="50%" y="50%" font-family="monospace" font-size="13" fill="#7A7A72"
        text-anchor="middle" dominant-baseline="middle">
        📷  Add your photo here
      </text>
    </svg>
  `.trim();
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

lazyLoad();

// ── ACTIVE NAV LINK ──────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));

// Active nav style injection
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active:not(.nav-cta) { color: var(--green) !important; }
  .mobile-menu a.active { color: var(--green) !important; }
`;
document.head.appendChild(style);

// ── SMOOTH SCROLL OFFSET FIX ─────────────────────────────────
// Accounts for fixed nav height
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 64;

    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
