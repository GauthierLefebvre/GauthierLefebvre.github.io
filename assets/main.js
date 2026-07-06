(function () {
    'use strict';

    const hamburger = document.getElementById('hamburger');
    const menuOverlay = document.getElementById('menuOverlay');

    if (hamburger && menuOverlay) {
        let menuOpen = false;
        const setOpen = (open) => {
            menuOpen = open;
            hamburger.classList.toggle('open', menuOpen);
            hamburger.setAttribute('aria-expanded', String(menuOpen));
            menuOverlay.classList.toggle('open', menuOpen);
            document.body.style.overflow = menuOpen ? 'hidden' : '';
        };
        hamburger.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!menuOpen); });
        menuOverlay.addEventListener('click', (e) => { if (e.target === menuOverlay) setOpen(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) setOpen(false); });
        menuOverlay.querySelectorAll('.menu-link').forEach(link => link.addEventListener('click', () => setOpen(false)));
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const root = document.getElementById('snapContainer') || null;
    const revealEls = document.querySelectorAll('.reveal, [data-reveal]');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px', root });
        revealEls.forEach(el => observer.observe(el));
    }
})();
