/* ==========================================================================
   Dr. Mohammad Harris - site-wide behaviour
   Loaded by every page. Every block is guarded so a page can omit any feature.
   ========================================================================== */
(function () {
    'use strict';

    var root = document.documentElement;

    /* --- Theme ---------------------------------------------------------- */
    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
        document.querySelectorAll('[data-theme-icon]').forEach(function (i) {
            i.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // Light (teal) is the default for everyone. Dark mode is opt-in via the
    // toggle only, and is remembered per browser once chosen. We deliberately
    // do NOT follow prefers-color-scheme, so first-time visitors always see
    // the brand palette.
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) { /* private mode */ }
    applyTheme(stored === 'dark' ? 'dark' : 'light');

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
    });

    /* --- Mobile menu ---------------------------------------------------- */
    var menuBtn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (menuBtn && menu) {
        var menuIcon = menuBtn.querySelector('i');
        var setMenu = function (open) {
            menu.classList.toggle('open', open);
            menu.classList.toggle('hidden', !open);
            menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (menuIcon) menuIcon.className = open ? 'fas fa-times' : 'fas fa-bars';
        };
        menuBtn.addEventListener('click', function () {
            setMenu(!menu.classList.contains('open'));
        });
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { setMenu(false); });
        });
    }

    /* --- Smooth scroll for same-page anchors ---------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id = anchor.getAttribute('href');
            if (!id || id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* --- Reveal on scroll, progress bars, counters ---------------------- */
    function animateProgressBars(scope) {
        scope.querySelectorAll('.progress-bar').forEach(function (bar) {
            var fill = bar.querySelector('.progress-fill');
            if (!fill) return;
            var value = bar.getAttribute('data-progress');
            setTimeout(function () { fill.style.width = value + '%'; }, 100);
        });
    }

    function animateCounters(scope) {
        scope.querySelectorAll('.counter').forEach(function (counter) {
            if (counter.dataset.done) return;
            counter.dataset.done = '1';
            counter.classList.add('visible');
            var target = parseInt(counter.getAttribute('data-target'), 10);
            var isCurrency = counter.getAttribute('data-format') === 'currency';
            var increment = target / 200;
            var current = 0;
            var timer = setInterval(function () {
                current += increment;
                if (current >= target) { current = target; clearInterval(timer); }
                counter.textContent = isCurrency
                    ? '£' + Math.floor(current).toLocaleString() + '+'
                    : Math.floor(current) + '+';
            }, 10);
        });
    }

    var revealables = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                animateProgressBars(entry.target);
                animateCounters(entry.target);
            });
        }, { threshold: 0.1 });
        revealables.forEach(function (el) { observer.observe(el); });
    } else {
        revealables.forEach(function (el) {
            el.classList.add('visible');
            animateProgressBars(el);
            animateCounters(el);
        });
    }

    /* --- Active section highlighting on the home page ------------------- */
    var sectionLinks = document.querySelectorAll('.nav-link[href^="#"], .nav-link-mobile[href^="#"]');
    var backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (sectionLinks.length) {
            var current = '';
            document.querySelectorAll('main section[id]').forEach(function (section) {
                if (window.scrollY >= section.offsetTop - 150) current = section.getAttribute('id');
            });
            sectionLinks.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
        }
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 250);
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --- Preloader ------------------------------------------------------ */
    var preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                preloader.classList.add('hidden');
                setTimeout(function () { preloader.style.display = 'none'; }, 500);
            }, 500);
        });
        // Safety net: never let the preloader trap the page.
        setTimeout(function () {
            preloader.classList.add('hidden');
            preloader.style.display = 'none';
        }, 4000);
    }

    /* --- FAQ accordion -------------------------------------------------- */
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.closest('.faq-item');
            if (!item) return;
            var answer = item.querySelector('.faq-answer');
            var wasOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item').forEach(function (i) {
                i.classList.remove('open');
                var a = i.querySelector('.faq-answer');
                var q = i.querySelector('.faq-question');
                if (a) a.classList.remove('open');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            if (!wasOpen) {
                item.classList.add('open');
                if (answer) answer.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
})();
