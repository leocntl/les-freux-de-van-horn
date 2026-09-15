(() => {
  const barre = document.querySelector('.barre');
  const menu = document.querySelector('.barre__menu');

  if (barre) {
    const majBarre = () => barre.classList.toggle('est-defile', window.scrollY > 16);
    majBarre();
    window.addEventListener('scroll', majBarre, { passive: true });
  }

  if (barre && menu) {
    const fermer = () => {
      barre.classList.remove('est-ouvert');
      menu.setAttribute('aria-expanded', 'false');
    };
    menu.addEventListener('click', () => {
      const ouvert = barre.classList.toggle('est-ouvert');
      menu.setAttribute('aria-expanded', String(ouvert));
    });
    barre.querySelectorAll('.barre__liens a').forEach((a) => a.addEventListener('click', fermer));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fermer(); });
  }

  const jauge = document.querySelector('.progression span');
  if (jauge) {
    const cible = document.querySelector('[data-progression]') || document.body;
    const majJauge = () => {
      const r = cible.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      jauge.style.transform = `scaleX(${p})`;
    };
    majJauge();
    window.addEventListener('scroll', majJauge, { passive: true });
    window.addEventListener('resize', majJauge);
  }

  const aReveler = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('est-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    aReveler.forEach((el) => io.observe(el));
  } else {
    aReveler.forEach((el) => el.classList.add('est-visible'));
  }

  const liens = document.querySelectorAll('.sommaire a[href^="#"]');
  if (liens.length && 'IntersectionObserver' in window) {
    const parId = new Map([...liens].map((a) => [a.getAttribute('href').slice(1), a]));
    const espion = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        liens.forEach((l) => l.classList.remove('est-actif'));
        const lien = parId.get(e.target.id);
        if (lien) lien.classList.add('est-actif');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    parId.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) espion.observe(section);
    });
  }

  document.querySelectorAll('[data-imprimer]').forEach((b) => b.addEventListener('click', () => window.print()));
})();
