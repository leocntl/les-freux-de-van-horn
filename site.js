(() => {

  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.hero').forEach((hero) => {
    const brume = document.createElement('div');
    brume.className = 'hero__brume';
    brume.setAttribute('aria-hidden', 'true');
    brume.innerHTML = '<span></span><span></span><span></span>';
    hero.prepend(brume);
    if (calme) return;
    const spores = document.createElement('div');
    spores.className = 'spores';
    spores.setAttribute('aria-hidden', 'true');
    const nombre = hero.classList.contains('hero--page') ? 14 : 26;
    for (let k = 0; k < nombre; k++) {
      const s = document.createElement('i');
      const taille = (Math.random() * 3 + 1.5).toFixed(1);
      s.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      s.style.setProperty('--t', taille + 'px');
      s.style.setProperty('--d', (Math.random() * 14 + 12).toFixed(1) + 's');
      s.style.setProperty('--r', (-Math.random() * 26).toFixed(1) + 's');
      s.style.setProperty('--dx', ((Math.random() - .5) * 90).toFixed(0) + 'px');
      spores.appendChild(s);
    }
    hero.appendChild(spores);
  });
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

  const photos = document.querySelectorAll('[data-zoom]');
  if (photos.length && typeof HTMLDialogElement === 'function') {
    const boite = document.createElement('dialog');
    boite.className = 'visionneuse';
    boite.innerHTML = '<img alt=""><div class="visionneuse__bas"><span></span>'
      + '<button class="visionneuse__fermer" type="button" aria-label="Fermer">✕</button></div>';
    document.body.appendChild(boite);
    const image = boite.querySelector('img');
    const legende = boite.querySelector('span');
    boite.querySelector('button').addEventListener('click', () => boite.close());
    boite.addEventListener('click', (e) => { if (e.target === boite) boite.close(); });
    photos.forEach((lien) => lien.addEventListener('click', (e) => {
      e.preventDefault();
      const vignette = lien.querySelector('img');
      image.src = lien.getAttribute('href');
      image.alt = vignette ? vignette.alt : '';
      const texte = lien.querySelector('.galerie__legende');
      legende.textContent = texte ? texte.textContent : '';
      boite.showModal();
    }));
  }
})();
