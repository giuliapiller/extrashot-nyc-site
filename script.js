(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Typewriter (hero) ----------
  const typeEl = document.getElementById('typewriter');
  const subEl = document.getElementById('heroSub');
  const ctaEl = document.getElementById('heroCta');
  const fullText = 'Everyone you need to meet is just two coffees away.';

  if (typeEl) {
    if (reduceMotion) {
      typeEl.textContent = fullText;
      subEl?.classList.add('is-shown');
      ctaEl?.classList.add('is-shown');
    } else {
      let i = 0;
      const startDelay = 600;
      const charDelay = 45;

      setTimeout(function tick() {
        if (i <= fullText.length) {
          typeEl.textContent = fullText.slice(0, i);
          i++;
          setTimeout(tick, charDelay);
        } else {
          // typing done — fade in subline + CTA
          setTimeout(() => subEl?.classList.add('is-shown'), 200);
          setTimeout(() => ctaEl?.classList.add('is-shown'), 600);
        }
      }, startDelay);
    }
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- DM bubble (in What We Do) ----------
  const dm = document.getElementById('dmBubble');
  const whatSection = document.getElementById('what');
  if (dm && whatSection && 'IntersectionObserver' in window) {
    const dmObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => dm.classList.add('is-shown'), 350);
          dmObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    dmObserver.observe(whatSection);
  } else if (dm) {
    dm.classList.add('is-shown');
  }

  // ---------- Counter animation ----------
  const counterEl = document.getElementById('counterNum');
  if (counterEl && 'IntersectionObserver' in window) {
    const target = parseInt(counterEl.dataset.target, 10) || 0;

    const animateCount = () => {
      if (reduceMotion) {
        counterEl.textContent = String(target);
        return;
      }
      const duration = 1600;
      const start = performance.now();
      const startVal = 0;

      const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

      const step = (now) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const value = Math.round(startVal + (target - startVal) * ease(t));
        counterEl.textContent = String(value);
        if (t < 1) requestAnimationFrame(step);
        else counterEl.textContent = String(target);
      };
      requestAnimationFrame(step);
    };

    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount();
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counterObs.observe(counterEl);
  } else if (counterEl) {
    counterEl.textContent = counterEl.dataset.target;
  }

  // ---------- Smooth scroll for in-page nav (extra polish on older Safari) ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
})();
