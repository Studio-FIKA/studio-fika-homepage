const CONSENT_KEY = 'cookie-consent';

const getConsent = () => localStorage.getItem(CONSENT_KEY);

const setConsent = (value) => {
    localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(
        new CustomEvent('cookie-consent-changed', { detail: value })
    );
};

const hideBanner = () => {
    const banner = document.querySelector('#cookie-consent-banner');
    if (banner) {
        banner.setAttribute('data-hidden', 'true');
    }
};

const showBanner = () => {
    const banner = document.querySelector('#cookie-consent-banner');
    if (banner) {
        banner.setAttribute('data-hidden', 'false');
    }
};

const loadScriptsSequentially = (scripts, index = 0) => {
    if (index >= scripts.length) return;

    const script = scripts[index];
    const newScript = document.createElement('script');

    if (script.src) {
        newScript.src = script.src;
        newScript.onload = () => loadScriptsSequentially(scripts, index + 1);
        newScript.onerror = () => loadScriptsSequentially(scripts, index + 1);
    } else {
        newScript.textContent = script.textContent;
    }

    script.parentNode.replaceChild(newScript, script);

    // If inline script, continue immediately
    if (!script.src) {
        loadScriptsSequentially(scripts, index + 1);
    }
};

const loadConsentedContent = () => {
    // Find all elements waiting for consent and trigger their loading
    document.querySelectorAll('[data-consent-required]').forEach((element) => {
        const template = element.querySelector('template');
        if (template) {
            const content = template.content.cloneNode(true);
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(content);
            element.removeAttribute('data-consent-required');

            // Execute scripts sequentially (wait for external scripts to load)
            const scripts = Array.from(element.querySelectorAll('script'));
            loadScriptsSequentially(scripts);
        }
    });
};

const init = () => {
    const consent = getConsent();

    if (consent === 'accepted') {
        hideBanner();
        loadConsentedContent();
    } else if (consent === 'declined') {
        hideBanner();
    } else {
        showBanner();
    }

    // Accept button
    const acceptBtn = document.querySelector('#cookie-consent-accept');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            setConsent('accepted');
            hideBanner();
            loadConsentedContent();
        });
    }

    // Decline button
    const declineBtn = document.querySelector('#cookie-consent-decline');
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            setConsent('declined');
            hideBanner();
        });
    }

    // Settings link (to re-open banner)
    document.querySelectorAll('[data-cookie-settings]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showBanner();
        });
    });

    // Placeholder accept buttons (direct accept)
    document.querySelectorAll('.consent-placeholder__button').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            setConsent('accepted');
            hideBanner();
            loadConsentedContent();
        });
    });
};

window.addEventListener('DOMContentLoaded', init);

// Export for potential external use
window.cookieConsent = {
    getConsent,
    setConsent,
    loadConsentedContent,
};
