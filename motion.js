(() => {
  const root = document.documentElement;
  const motion = root.classList.contains('motion');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Header state + scrollspy (useful even without motion)
  const header = $('.site-header');
  const links = $$('.main-nav a');
  const spy = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id));
    links.forEach(a => { if (a.getAttribute('aria-current') !== null) a.setAttribute('aria-current', 'true'); });
  }), { rootMargin: '-40% 0px -50% 0px' });
  $$('#games,#about').forEach(s => spy.observe(s));

  const bar = motion ? Object.assign(document.createElement('div'), { className: 'scroll-progress' }) : null;
  if (bar) document.body.prepend(bar);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      header.classList.toggle('scrolled', scrollY > 8);
      if (bar) bar.style.setProperty('--p', Math.min(1, scrollY / Math.max(1, root.scrollHeight - innerHeight)).toFixed(4));
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!motion) return;

  // Scroll reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('.section-heading,.section-description,.about-doodle,.about-copy,.about-tag').forEach(el => { el.classList.add('reveal'); io.observe(el); });
  const grid = $('#game-grid'); grid.classList.add('stagger'); io.observe(grid);

  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (finePointer) {
    // Hero parallax
    const hero = $('.hero'), visual = $('.hero-visual');
    let raf = 0, x = 0, y = 0;
    const apply = () => { raf = 0; visual.style.setProperty('--px', x.toFixed(3)); visual.style.setProperty('--py', y.toFixed(3)); };
    hero.addEventListener('pointermove', e => {
      const r = visual.getBoundingClientRect();
      x = (e.clientX - r.left - r.width / 2) / r.width; y = (e.clientY - r.top - r.height / 2) / r.height;
      raf ||= requestAnimationFrame(apply);
    });
    hero.addEventListener('pointerleave', () => { x = y = 0; apply(); });

    // Card tilt + glow (delegated, so it survives language re-render)
    grid.addEventListener('pointermove', e => {
      const card = e.target.closest('.game-card'); if (!card) return;
      const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((px - .5) * 9).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((.5 - py) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%'); card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
    grid.addEventListener('pointerout', e => {
      const card = e.target.closest('.game-card');
      if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
    });
  }

  // Tiny confetti burst on the hero button
  const colors = ['#ff595f', '#ffc957', '#43cbbb', '#ff8e89', '#9fe6d8'];
  $('.hero .button.primary').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect(), cx = e.clientX || r.left + r.width / 2, cy = e.clientY || r.top + r.height / 2;
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('i'); p.className = 'spark';
      p.style.cssText = `left:${cx}px;top:${cy}px;background:${colors[i % colors.length]}`;
      document.body.append(p);
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 70;
      p.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d + 36}px)) rotate(${Math.random() * 360}deg) scale(.2)`, opacity: 0 }
      ], { duration: 650 + Math.random() * 350, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => p.remove();
    }
  });

  // Smooth language swap: crossfade instead of a hard text/direction jump
  if (document.startViewTransition && typeof setLanguage === 'function') {
    const original = setLanguage;
    window.setLanguage = next => document.startViewTransition(() => original(next));
  }
})();
