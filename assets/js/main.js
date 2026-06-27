/* =====================================================
   EVERMONT — Main JavaScript
   ===================================================== */

/* ── Convoy: Brand-split intro animation ── */
(function () {
  const curtain = document.createElement('div');
  curtain.className = 'convoy-intro';
  curtain.innerHTML =
    '<div class="convoy-intro__left"><span class="convoy-intro__word" style="color:#fff;">EVER</span></div>' +
    '<div class="convoy-intro__right"><span class="convoy-intro__word" style="font-style:italic;font-weight:300;color:#e8b89a;">mont</span></div>';
  document.body.prepend(curtain);

  // Hold 900ms then split apart
  setTimeout(function () {
    curtain.classList.add('split');
    // Remove from DOM after split transition completes
    setTimeout(function () { curtain.classList.add('gone'); }, 600);
  }, 400);
})();

/* ── Convoy: Hero heading word-by-word reveal ── */
(function () {
  const heading = document.querySelector('.hero__heading');
  if (!heading) return;

  function splitNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(function (w) {
        if (!w.trim()) {
          frag.appendChild(document.createTextNode(w));
        } else {
          const outer = document.createElement('span');
          outer.className = 'word';
          const inner = document.createElement('span');
          inner.className = 'word-inner';
          inner.textContent = w;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
      });
      return frag;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      node.childNodes.forEach(function (child) {
        clone.appendChild(splitNode(child));
      });
      return clone;
    }
    return node.cloneNode(true);
  }

  const frag = document.createDocumentFragment();
  heading.childNodes.forEach(function (child) {
    frag.appendChild(splitNode(child));
  });
  heading.innerHTML = '';
  heading.appendChild(frag);

  // Stagger each word-inner delay
  var delay = 0.02;
  heading.querySelectorAll('.word-inner').forEach(function (el) {
    el.style.animationDelay = delay + 's';
    delay += 0.05;
  });
})();

/* ── Navigation ── */
(function () {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close mobile nav when any link or CTA inside it is clicked
    nav.querySelectorAll('.nav__mobile .nav__link, .nav__mobile .btn').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight active nav link
  const links = nav.querySelectorAll('.nav__link');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === current || (current === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
})();

/* ── Scroll Reveal ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ── Insights Slider ── */
(function () {
  const slider = document.querySelector('.insights');
  if (!slider) return;

  const track = slider.querySelector('.insights__slides');
  const dots = slider.querySelectorAll('.insights__dot');
  const pauseBtn = slider.querySelector('.insights__pause');
  const total = slider.querySelectorAll('.insights__slide').length;

  let current = 0;
  let paused = false;
  let timer;

  const wrapper = document.querySelector('.insights-wrapper');
  const slides = slider.querySelectorAll('.insights__slide');

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    track.style.transform = `translateY(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const top = wrapper.offsetTop + (i / total) * wrapper.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', () => {
    if (!wrapper) return;
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    const scrolled = window.scrollY - wrapperTop;
    const sectionHeight = wrapper.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
    const idx = Math.min(total - 1, Math.floor(progress * total));
    if (idx !== current) goTo(idx);
  }, { passive: true });

  // Hero bg fade-in (image or video)
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    if (heroBg.tagName === 'VIDEO') {
      heroBg.addEventListener('canplay', () => heroBg.classList.add('loaded'), { once: true });
      // Fallback: show after 2s even if canplay doesn't fire
      setTimeout(() => heroBg.classList.add('loaded'), 2000);
    } else {
      setTimeout(() => heroBg.classList.add('loaded'), 80);
    }
  }
})();

/* ── Hero Parallax ── */
(function () {
  const heroBg = document.querySelector('.hero__bg');
  const hero   = document.querySelector('.hero');
  if (!heroBg || !hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  function applyParallax () {
    const sy = window.scrollY;
    if (sy <= hero.offsetHeight) {
      heroBg.style.transform = 'translateY(' + (sy * 0.25) + 'px)';
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(applyParallax); ticking = true; }
  }, { passive: true });
})();

/* ── Counter Animation ── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1800;
      const start = performance.now();
      const isDecimal = target % 1 !== 0;

      function update(now) {
        const elapsed = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - elapsed, 3);
        const value = target * ease;
        el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
        if (elapsed < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── Contact Form ── */
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled = true;

    const action = form.getAttribute('action');
    if (action && action.includes('formspree.io')) {
      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const success = document.querySelector('.form-success');
          if (success) { form.style.display = 'none'; success.classList.add('visible'); }
        } else {
          btn.innerHTML = 'Something went wrong — please email us directly.';
          setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; }, 4000);
        }
      } catch (err) {
        btn.innerHTML = 'Network error — please try again.';
        setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; }, 4000);
      }
    } else {
      // No backend configured yet — show success state so UX is visible
      setTimeout(() => {
        const success = document.querySelector('.form-success');
        if (success) { form.style.display = 'none'; success.classList.add('visible'); }
        else { btn.innerHTML = originalHTML; btn.disabled = false; form.reset(); }
      }, 1200);
    }
  });
})();

/* ── CTA Banner Form ── */
(function () {
  const form = document.querySelector('.cta-banner form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    if (!input || !input.value.includes('@')) {
      input.style.borderColor = 'rgba(255,100,100,.5)';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
      return;
    }
    const original = btn.innerHTML;
    btn.textContent = 'Subscribed ✓';
    btn.style.background = 'var(--peach-dark)';
    input.value = '';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
    }, 3000);
  });
})();

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});

/* ── Service card hover text ── */
(function () {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.service-card__img').style.transform = 'scale(1.06)';
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.service-card__img').style.transform = '';
    });
  });
})();

/* ── Capabilities Deck Modal ── */
function openCapabilitiesModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('deckModal');
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  const form = document.getElementById('deckForm');
  const success = document.getElementById('deckSuccess');
  const error = document.getElementById('deckError');
  if (form) { form.reset(); form.style.display = ''; }
  if (success) success.style.display = 'none';
  if (error) error.style.display = 'none';
  modal.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  setTimeout(() => {
    const first = modal.querySelector('input');
    if (first) first.focus();
  }, 80);
}

function closeCapabilitiesModal() {
  const modal = document.getElementById('deckModal');
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCapabilitiesModal();
});

(function () {
  const form = document.getElementById('deckForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('deckName');
    const email = document.getElementById('deckEmail');
    const confirm = document.getElementById('deckConfirm');
    const errorEl = document.getElementById('deckError');
    const successEl = document.getElementById('deckSuccess');

    let valid = true;
    [name, email].forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim() || (field.type === 'email' && !field.value.includes('@'))) {
        field.classList.add('error');
        valid = false;
      }
    });
    if (!confirm.checked) valid = false;

    if (!valid) {
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';

    const btn = form.querySelector('.deck-modal__submit');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      successEl.style.display = 'block';
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }, 1400);
  });
})();
