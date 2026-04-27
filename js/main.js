/* ═══════════════════════════════════════════════════════════
   ELAMRAM MCHJ — Main JavaScript
   Bolalar Klinikasi va Dorixonasi | elamram.uz
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────
   1. STICKY NAVBAR: transparent → white on scroll
────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const THRESHOLD = 40;

  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ──────────────────────────────────────
   2. MOBILE HAMBURGER MENU
────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ──────────────────────────────────────
   3. SCROLL REVEAL (Intersection Observer)
────────────────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Respect user preference for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────
   4. CERTIFICATE MODAL / LIGHTBOX
   Supports both image (JPG/PNG) and PDF files
────────────────────────────────────── */
(function initCertModal() {
  const modal         = document.getElementById('certModal');
  const modalImg      = document.getElementById('modalImg');
  const modalPdf      = document.getElementById('modalPdf');
  const modalTitle    = document.getElementById('modalTitle');
  const modalClose    = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalFooter   = document.getElementById('modalFooter');
  const modalDownload = document.getElementById('modalDownload');
  const modalNewTab   = document.getElementById('modalNewTab');
  const openButtons   = document.querySelectorAll('.cert-modal-open');

  if (!modal || !openButtons.length) return;

  function openModal(type, fileSrc, title) {
    modalTitle.textContent = title;

    if (type === 'pdf') {
      // Show PDF in iframe
      modalImg.style.display = 'none';
      modalPdf.style.display = 'block';
      modalPdf.src = fileSrc;
      // Footer buttons for PDF
      modalDownload.href = fileSrc;
      modalNewTab.href   = fileSrc;
      modalFooter.style.display = 'flex';
    } else {
      // Show image
      modalPdf.style.display = 'none';
      modalImg.style.display = 'block';
      modalImg.src = fileSrc;
      modalImg.alt = title;
      // Footer buttons for image
      modalDownload.href = fileSrc;
      modalNewTab.href   = fileSrc;
      modalFooter.style.display = 'flex';
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      modalImg.src = '';
      modalPdf.src = '';
    }, 300);
  }

  // Open on button click
  openButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.dataset.type, btn.dataset.file, btn.dataset.title);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // Trap Tab focus inside modal
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
})();


/* ──────────────────────────────────────
   5. SMOOTH SCROLL (fallback for older browsers)
      Modern browsers already handle scroll-behavior: smooth in CSS,
      but this JS implementation covers anchor links with hash changes.
────────────────────────────────────── */
(function initSmoothScroll() {
  if (CSS.supports('scroll-behavior', 'smooth')) return; // CSS handles it

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ──────────────────────────────────────
   6. ACTIVE NAV LINK on scroll
────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const OFFSET = 120;

  function updateActive() {
    let current = '';
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - OFFSET) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


/* ──────────────────────────────────────
   7. NAVBAR LINK ACTIVE STYLE (CSS injection)
      Add underline for active link via class
────────────────────────────────────── */
(function addActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .navbar__links a.active {
      color: var(--primary);
    }
    .navbar__links a.active::after {
      transform: scaleX(1);
    }
  `;
  document.head.appendChild(style);
})();
