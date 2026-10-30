/**
 * Traffic Marble Puzzle — project showcase + details page.
 * Loaded on index.html and traffic-marble-puzzle.html, after script.js.
 * servicehub.html also loads it for the reveal-on-scroll and screenshot lightbox.
 */
(function () {
    'use strict';

    // ============================================
    // Publish links
    // ============================================
    // Buttons marked data-tm-link="..." stay hidden until their URL is set here.
    // Fill these in only with real, published links:
    //   gameplayVideo: e.g. a YouTube link to a gameplay video
    //   apk:           e.g. 'downloads/TrafficMarblePuzzle.apk' (a release-signed build you choose to share)
    //   playStore:     'https://play.google.com/store/apps/details?id=com.trafficmarble.puzzle' once the listing is live
    const TM_LINKS = {
        gameplayVideo: '',
        apk: '',
        playStore: ''
    };

    document.querySelectorAll('[data-tm-link]').forEach((el) => {
        const url = TM_LINKS[el.dataset.tmLink];
        if (url) {
            el.href = url;
            el.hidden = false;
        } else {
            el.remove();
        }
    });

    // Note shown on the details page while nothing is published yet
    const pendingNote = document.getElementById('tm-links-pending');
    if (pendingNote && Object.values(TM_LINKS).some(Boolean)) {
        pendingNote.hidden = true;
    }

    // ============================================
    // Reveal on scroll
    // ============================================
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = document.querySelectorAll('.tm-showcase, .tm-reveal');

    if (!prefersReducedMotion && 'IntersectionObserver' in window && revealTargets.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('tm-visible');
                    revealObserver.unobserve(el);
                    // Once revealed, hand control back to the element's own hover/transition styles
                    setTimeout(() => el.classList.remove('tm-will-reveal', 'tm-visible'), 700);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach((el) => {
            el.classList.add('tm-will-reveal');
            revealObserver.observe(el);
        });
    }

    // ============================================
    // Screenshot lightbox (details page)
    // ============================================
    const dialog = document.getElementById('tm-lightbox');
    const shots = Array.from(document.querySelectorAll('[data-tm-shot]'));
    if (!dialog || !shots.length || typeof dialog.showModal !== 'function') return;

    const dialogImg = dialog.querySelector('.tm-lightbox-img');
    const dialogCaption = dialog.querySelector('.tm-lightbox-caption');
    const dialogCount = dialog.querySelector('.tm-lightbox-count');
    let current = 0;

    function show(index) {
        current = (index + shots.length) % shots.length;
        const shot = shots[current];
        const img = shot.querySelector('img');
        dialogImg.src = shot.getAttribute('href');
        dialogImg.alt = img ? img.alt : '';
        dialogCaption.textContent = shot.dataset.caption || '';
        dialogCount.textContent = `${current + 1} / ${shots.length}`;
    }

    shots.forEach((shot, i) => {
        shot.addEventListener('click', (e) => {
            e.preventDefault();
            show(i);
            dialog.showModal();
            document.body.style.overflow = 'hidden';
        });
    });

    dialog.querySelector('[data-tm-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-tm-prev]').addEventListener('click', () => show(current - 1));
    dialog.querySelector('[data-tm-next]').addEventListener('click', () => show(current + 1));

    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });

    // Click on the dimmed backdrop closes the viewer
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', () => {
        document.body.style.overflow = '';
    });
})();
