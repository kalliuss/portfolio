/* ============================================================
   Kaan Bilgili — Portfolio · main.js
   Bottom nav active-state + smooth scroll + scroll reveal
   ============================================================ */

(function () {
  'use strict';

  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const chartImg = document.querySelector('.activity-img');

  const themeColorMeta = document.getElementById('themeColorMeta');

  // ghchart rengi moda göre değişsin (light'ta daha koyu indigo)
  const CHART_COLOR = { dark: '818cf8', light: '4f46e5' };
  const META_COLOR = { dark: '#1a1a20', light: '#e8eaf3' };

  function syncTheme(theme) {
    if (chartImg) {
      chartImg.src = 'https://ghchart.rshah.org/' + CHART_COLOR[theme] + '/kalliuss';
    }
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', META_COLOR[theme]);
    }
  }

  syncTheme(root.getAttribute('data-theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage yok */ }
      syncTheme(next);
    });
  }

  // Kullanıcı manuel seçim yapmadıysa OS tema değişimini takip et
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      let stored;
      try { stored = localStorage.getItem('theme'); } catch (err) { stored = null; }
      if (stored !== 'light' && stored !== 'dark') {
        const theme = e.matches ? 'light' : 'dark';
        root.setAttribute('data-theme', theme);
        syncTheme(theme);
      }
    });
  }

  /* ---------- Active section tracking ---------- */
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((item) => item.classList.remove('active'));
          const active = document.querySelector(
            `.nav-item[data-section="${entry.target.id}"]`
          );
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => navObserver.observe(s));

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- Copy to clipboard + toast ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2000);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Eski tarayıcı / güvenli olmayan bağlam fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }
  }

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const ok = await copyText(btn.dataset.copy || '');
      if (ok) {
        btn.classList.add('copied');
        showToast('E-posta adresi kopyalandı ✓');
        setTimeout(() => btn.classList.remove('copied'), 1600);
      } else {
        showToast('Kopyalanamadı — elle seçebilirsin');
      }
    });
  });

  /* ---------- Smooth scroll (nav + hero CTA) ---------- */
  function smoothScrollTo(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo(item.dataset.section);
    });
  });

  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo(el.dataset.scroll);
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.timeline-item, .project-card, .skill-group, .activity-card, .contact-item, .contact-heading'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // küçük stagger
          const delay = (entry.target.dataset.revealIndex || 0) * 60;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  // grup içi stagger index'i ata
  document.querySelectorAll('.projects-grid').forEach((grid) => {
    grid.querySelectorAll('.project-card').forEach((card, i) => {
      card.dataset.revealIndex = i % 3;
    });
  });

  document.querySelectorAll('.timeline').forEach((tl) => {
    tl.querySelectorAll('.timeline-item').forEach((item, i) => {
      item.dataset.revealIndex = i;
    });
  });

  revealTargets.forEach((el) => revealObserver.observe(el));
})();
