// Ibrahim Khalil Shuvo — portfolio interactions
// Configurable options (originally artifact props).
const CONFIG = {
  accentColor: '#f5a524',   // brand accent; also set --ik-accent in style.css
  monochromeProjects: true, // grayscale project images until hover
  enableAnimations: true,   // scroll reveals + count-up
  enableParallax: true      // subtle hero parallax on scroll
};

document.addEventListener('DOMContentLoaded', function () {
  const root = document.getElementById('ikroot');
      if (!root) return;
      const p = CONFIG;

      if (p.accentColor) document.documentElement.style.setProperty('--ik-accent', p.accentColor);
      const mono = p.monochromeProjects === false ? false : true;
      document.documentElement.style.setProperty('--ik-projfilter', mono ? 'grayscale(1)' : 'none');
      const anim = p.enableAnimations === false ? false : true;

      // Reveal on scroll
      const reveals = root.querySelectorAll('[data-reveal]');
      if (anim) {
        reveals.forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          el.style.transition = 'opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1)';
          el.style.willChange = 'opacity, transform';
        });
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              const d = parseInt(e.target.getAttribute('data-delay') || '0', 10);
              setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = 'none'; }, d);
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        reveals.forEach(el => io.observe(el));
        }

      // Count-up stats
      const nums = root.querySelectorAll('[data-count]');
      const animateCount = (el) => {
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const dur = 1500;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
      };
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.6 });
      nums.forEach(n => cio.observe(n));
      // Nav + progress + parallax on scroll
      const nav = document.getElementById('iknav');
      const prog = document.getElementById('ikprog');
      const heroImg = document.getElementById('ikhero-img');
      const parallax = p.enableParallax === false ? false : true;
      const onScroll = () => {
        const y = window.scrollY;
        if (nav) {
          const on = y > 40;
          nav.style.background = on ? 'rgba(10,10,10,.82)' : 'transparent';
          nav.style.backdropFilter = on ? 'blur(16px)' : 'none';
          nav.style.webkitBackdropFilter = on ? 'blur(16px)' : 'none';
          nav.style.borderBottomColor = on ? 'rgba(255,255,255,.08)' : 'transparent';
          nav.style.padding = on ? '14px 8vw' : '20px 8vw';
        }
        if (prog) {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
        }
        if (heroImg && parallax && y < window.innerHeight) heroImg.style.transform = 'translateY(' + (y * 0.14) + 'px)';
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      // Nav links: animated underline + hover + active state
      const links = {};
      document.querySelectorAll('#iknav > div a[data-navlink]').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#')) links[href.slice(1)] = a;
        a.style.position = 'relative';
        a.style.paddingBottom = '5px';
        const u = document.createElement('span');
        u.style.cssText = 'position:absolute;left:0;bottom:0;height:1.5px;width:100%;background:var(--ik-accent,#f5a524);transform:scaleX(0);transform-origin:right center;transition:transform .38s cubic-bezier(.16,1,.3,1);pointer-events:none;';
        a.appendChild(u);
        a._ul = u;
        a.addEventListener('mouseenter', () => {
          u.style.transformOrigin = 'left center';
          u.style.transform = 'scaleX(1)';
          a.style.color = '#f4f1ea';
        });
        a.addEventListener('mouseleave', () => {
          const on = a.dataset.active === '1';
          u.style.transformOrigin = on ? 'left center' : 'right center';
          u.style.transform = on ? 'scaleX(1)' : 'scaleX(0)';
          a.style.color = on ? '#f4f1ea' : 'rgba(244,241,234,.55)';
        });
      });
      const setActive = (id) => {
        Object.keys(links).forEach(k => {
          const a = links[k];
          const on = k === id;
          a.dataset.active = on ? '1' : '0';
          a.style.color = on ? '#f4f1ea' : 'rgba(244,241,234,.55)';
          if (a._ul) { a._ul.style.transformOrigin = 'left center'; a._ul.style.transform = on ? 'scaleX(1)' : 'scaleX(0)'; }
        });
      };
      const sio = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
      ['home', 'projects', 'experience', 'contact'].forEach(id => {
        const s = document.getElementById(id);
        if (s) sio.observe(s);
      });

      // Mobile nav toggle
      const navToggle = document.getElementById('iknavtoggle');
      const navLinks = document.getElementById('iknavlinks');
      if (navToggle && navLinks) {
        const setMenu = (open) => {
          navLinks.classList.toggle('ik-open', open);
          navToggle.classList.toggle('ik-open', open);
          navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
          document.body.style.overflow = open ? 'hidden' : '';
        };
        navToggle.addEventListener('click', () => {
          setMenu(!navLinks.classList.contains('ik-open'));
        });
        // Close when a link is tapped
        navLinks.querySelectorAll('a').forEach(a => {
          a.addEventListener('click', () => setMenu(false));
        });
        // Close when resizing back up to desktop
        window.addEventListener('resize', () => {
          if (window.innerWidth > 700) setMenu(false);
        });
      }

});
