export const CookieConsent = (() => {
  const STORAGE_KEY = 'nordtech_cookie_consent';
  const GA_ID = 'G-CPDGM98L2Q';

  function getConsent() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function setConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
  }

  function hasBanner() {
    return document.getElementById('cookie-banner');
  }

  function injectStyles() {
    if (document.getElementById('cookie-banner-styles')) return;

    const style = document.createElement('style');
    style.id = 'cookie-banner-styles';
    style.textContent = `
      .cookie-banner {
        position: fixed;
        left: 20px;
        right: 20px;
        bottom: 20px;
        max-width: 720px;
        margin: 0 auto;
        padding: 24px;
        background: #111;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        z-index: 2147483647;
        font-family: inherit;
      }

      .cookie-banner__title {
        margin: 0 0 12px;
        font-size: 1.2rem;
        line-height: 1.3;
      }

      .cookie-banner__text {
        margin: 0 0 20px;
        font-size: 0.95rem;
        line-height: 1.6;
        color: rgba(255,255,255,0.85);
      }

      .cookie-banner__actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .cookie-banner__btn {
        appearance: none;
        border: none;
        border-radius: 10px;
        padding: 12px 18px;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .cookie-banner__btn--accept {
        background: #2563eb;
        color: #fff;
      }

      .cookie-banner__btn--accept:hover {
        opacity: 0.92;
      }

      .cookie-banner__btn--decline {
        background: transparent;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
      }

      .cookie-banner__btn--decline:hover {
        background: rgba(255,255,255,0.08);
      }

      @media (max-width: 600px) {
        .cookie-banner {
          left: 12px;
          right: 12px;
          bottom: 12px;
          padding: 20px;
        }

        .cookie-banner__actions {
          flex-direction: column;
        }

        .cookie-banner__btn {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function loadGoogleAnalytics() {
    if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') {
      console.warn('CookieConsent: missing valid GA_ID');
      return;
    }

    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

    script.onload = () => {
      window.gtag('js', new Date());
      window.gtag('config', GA_ID);
    };

    document.head.appendChild(script);
  }

  function removeBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.remove();
  }

  function createBanner() {
    if (hasBanner()) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Informasjon om informasjonskapsler');

    banner.innerHTML = `
      <h3 class="cookie-banner__title">Vi bruker informasjonskapsler</h3>
      <p class="cookie-banner__text">
        Vi bruker informasjonskapsler og lignende teknologier for å sikre at nettsiden fungerer som den skal,
        analysere trafikk og forbedre innhold og brukeropplevelse. Du kan velge å godta eller avslå.
      </p>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__btn cookie-banner__btn--accept" type="button" data-cookie-action="accept">
          Godta
        </button>
        <button class="cookie-banner__btn cookie-banner__btn--decline" type="button" data-cookie-action="decline">
          Avslå
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    banner.addEventListener('click', (event) => {
      const button = event.target.closest('[data-cookie-action]');
      if (!button) return;

      const action = button.dataset.cookieAction;

      if (action === 'accept') {
        setConsent('accepted');
        loadGoogleAnalytics();
        removeBanner();
      }

      if (action === 'decline') {
        setConsent('declined');
        removeBanner();
      }
    });
  }

  function init() {
    injectStyles();

    const consent = getConsent();

    if (consent === 'accepted') {
      loadGoogleAnalytics();
      return;
    }

    if (consent === 'declined') {
      return;
    }

    createBanner();
  }

  return { init };
})();
