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

    const revealEls = document.querySelectorAll('.reveal, [data-reveal]');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => observer.observe(el));
    }

    // ==== PAGE SWIPE TRANSITION ====
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const docEl = document.documentElement;

    // Entrance: the direction is set on <html> by the inline head script,
    // before first paint, so the page never flashes at its final position.
    // The attribute is kept: the project pages use it to stagger their content.
    if (reduceMotion) docEl.removeAttribute('data-nav');

    // A page left mid-exit can be restored from the bfcache: reset it.
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            docEl.removeAttribute('data-nav-out');
            docEl.removeAttribute('data-nav');
        }
    });

    const isHome = (path) => /\/index\.html?$/i.test(path) || /\/$/.test(path);

    let leaving = false;
    document.addEventListener('click', (e) => {
        if (leaving || reduceMotion) return;
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const link = e.target.closest('a[href]');
        if (!link) return;
        if (link.target && link.target !== '_self') return;
        if (link.hasAttribute('download')) return;

        let url;
        try { url = new URL(link.href, location.href); } catch (err) { return; }
        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname && url.search === location.search) return;
        if (!/\.html?$/i.test(url.pathname)) return;

        const dir = isHome(url.pathname) ? 'back' : 'forward';
        e.preventDefault();
        leaving = true;
        try { sessionStorage.setItem('navSwipe', dir); } catch (err) { /* private mode */ }

        docEl.setAttribute('data-nav-out', dir);
        const go = () => { window.location.href = url.href; };
        document.body.addEventListener('animationend', function onEnd(ev) {
            if (ev.target !== document.body) return;
            document.body.removeEventListener('animationend', onEnd);
            go();
        });
        window.setTimeout(go, 600);
    });
})();
