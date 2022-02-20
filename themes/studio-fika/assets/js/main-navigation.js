window.addEventListener('DOMContentLoaded', () => {
    const REVEAL_THRESHOLD = 32;
    const HIDE_THRESHOLD = window.innerHeight / 4;
    const WILD_THRESHOLD = 16;

    const nav = document.querySelector('#main-navigation');
    const navToggle = document.querySelector('#main-navigation-toggle');
    const navItems = document.querySelector('#main-navigation-items');

    let lastScrollPos = window.pageYOffset;
    let lastUpPos = 0;
    let lastDownPos = 0;
    let ticking = false;

    const toggleNavigationVisibility = () => {
        const navHeight = nav.offsetHeight;
        const currentlyHidden = nav.getAttribute('data-hidden') === 'true';

        if (
            currentlyHidden &&
            (lastScrollPos <= navHeight ||
                lastScrollPos <= lastDownPos - REVEAL_THRESHOLD)
        ) {
            nav.setAttribute('data-hidden', false);
        } else if (
            !currentlyHidden &&
            lastScrollPos > navHeight &&
            lastScrollPos > lastUpPos + HIDE_THRESHOLD
        ) {
            nav.setAttribute('data-hidden', true);
        }

        if (lastScrollPos > WILD_THRESHOLD) {
            nav.setAttribute('data-wild', true);
        } else {
            nav.setAttribute('data-wild', false);
        }
    };

    const throttledToggleNavigationVisibility = () => {
        const { pageYOffset } = window;

        if (pageYOffset < lastScrollPos) {
            lastUpPos = pageYOffset;
        } else if (pageYOffset > lastScrollPos) {
            lastDownPos = pageYOffset;
        }

        lastScrollPos = pageYOffset;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                toggleNavigationVisibility();
                ticking = false;
            });

            ticking = true;
        }
    };

    const toggleNavigationItems = () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            navToggle.setAttribute('aria-expanded', false);
            navItems.setAttribute('data-open', false);
            document.body.style.overflow = null;
        } else {
            navToggle.setAttribute('aria-expanded', true);
            navItems.setAttribute('data-open', true);
            document.body.style.overflow = 'hidden';
        }
    };

    toggleNavigationVisibility();

    document.addEventListener('scroll', throttledToggleNavigationVisibility);
    navToggle.addEventListener('click', toggleNavigationItems);
});
