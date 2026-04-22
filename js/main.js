import { CookieConsent } from './cookies.js';
import { toggleTheme } from './toggleMode.js';

toggleTheme();

document.addEventListener('DOMContentLoaded', () => {
  CookieConsent.init();

  const form = document.getElementById('contactForm');
  const successScreen = document.getElementById('successScreen');

  if (form && successScreen) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      fetch('/', {
        method: 'POST',
        body: formData,
      })
        .then(() => {
          form.reset();
          successScreen.classList.add('active');
        })
        .catch(() => {
          alert('Noe gikk galt. Prøv igjen.');
        });
    });
  }
});

(function () {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-btn');
  const overlay = document.getElementById('menu-overlay');
  const panel = overlay ? overlay.querySelector('.menu-panel') : null;

  if (!header || !menuButton || !overlay || !panel) return;

  function openMenu() {
    header.classList.add('is-menu-open');
    menuButton.classList.add('is-menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close menu');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-lock');
  }

  function closeMenu() {
    header.classList.remove('is-menu-open');
    menuButton.classList.remove('is-menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-lock');
  }

  function toggleMenu() {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  panel.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) closeMenu();
  });

  document.addEventListener('mousedown', (e) => {
    const isMenuOpen = menuButton.getAttribute('aria-expanded') === 'true';
    if (!isMenuOpen) return;
    if (!header.contains(e.target) && !overlay.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeMenu();
  });
})();
