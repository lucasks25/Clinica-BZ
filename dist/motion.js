// A sticky scene driven by normal document scrolling; no wheel trapping.
document.querySelectorAll('[data-pinned-specialties]').forEach(scene => {
  const sticky = scene.querySelector('.specialties-sticky');
  const stage = scene.querySelector('.specialties-stage');
  const track = scene.querySelector('.specialties-track');
  const cards = [...track.querySelectorAll('.individual-card')];
  const status = scene.querySelector('.specialties-status');
  const progressBar = scene.querySelector('.specialties-progress > span');
  const previous = scene.querySelector('.specialties-prev');
  const next = scene.querySelector('.specialties-next');
  let pinned = false, start = 0, distance = 1, entry = 0, travel = 0, queued = false;
  let keyboardNavigation = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.min(1, Math.max(0, value));
  const update = () => {
    queued = false;
    if (!pinned) return;
    const progress = clamp((window.scrollY - start) / distance);
    document.body.classList.toggle('specialties-active', window.scrollY >= start && window.scrollY <= start + distance);
    const offset = entry - progress * travel;
    track.style.transform = 'translate3d(' + offset + 'px,0,0)';
    progressBar.style.transform = 'scaleX(' + progress + ')';
    const stride = cards[0].getBoundingClientRect().width + 24;
    const first = Math.min(cards.length, Math.max(1, Math.floor(Math.max(0, -offset) / stride) + 1));
    const label = first + ' / ' + cards.length + ' tratamentos · role para explorar';
    if (status.textContent !== label) status.textContent = label;
  };
  const measure = () => {
    pinned = window.innerWidth > 900 && window.innerHeight > 690 && !reducedMotion.matches;
    scene.classList.toggle('is-pinned', pinned);
    if (!pinned) {
      scene.style.height = '';
      document.body.classList.remove('specialties-active');
      track.style.transform = '';
      progressBar.style.transform = 'scaleX(0)';
      status.textContent = 'Deslize para explorar os tratamentos';
      previous.disabled = stage.scrollLeft < 5;
      next.disabled = stage.scrollLeft >= stage.scrollWidth - stage.clientWidth - 5;
      return;
    }
    const naturalImageHeight = cards[0].getBoundingClientRect().width / 1.22;
    scene.style.setProperty('--pin-image-height', naturalImageHeight + 'px');
    const textHeight = Math.max(...cards.map(card => card.querySelector('.individual-copy').getBoundingClientRect().height));
    const reserved = scene.querySelector('.pinned-heading').getBoundingClientRect().height + scene.querySelector('.specialties-navigation').getBoundingClientRect().height + textHeight + 120;
    const availableImageHeight = window.innerHeight - reserved;
    if (availableImageHeight < 170) {
      pinned = false;
      scene.classList.remove('is-pinned');
      scene.style.height = '';
      document.body.classList.remove('specialties-active');
      track.style.transform = '';
      status.textContent = 'Deslize para explorar os tratamentos';
      return;
    }
    scene.style.setProperty('--pin-image-height', Math.min(naturalImageHeight, availableImageHeight) + 'px');
    entry = window.innerWidth * 0.92;
    const ending = Math.max(0, track.scrollWidth - window.innerWidth + 80);
    travel = entry + ending;
    distance = Math.max(window.innerHeight, travel / 2.35);
    scene.style.height = (window.innerHeight + distance) + 'px';
    start = scene.getBoundingClientRect().top + window.scrollY;
    update();
  };
  window.addEventListener('scroll', () => {
    if (!queued && pinned) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', measure);
  reducedMotion.addEventListener('change', measure);
  window.addEventListener('load', measure);
  document.fonts?.ready.then(measure);
  document.addEventListener('keydown', event => { if (event.key === 'Tab') keyboardNavigation = true; });
  document.addEventListener('pointerdown', () => { keyboardNavigation = false; }, { passive: true });
  track.addEventListener('focusin', event => {
    if (!pinned || !keyboardNavigation) return;
    const index = cards.findIndex(card => card.contains(event.target));
    if (index < 0) return;
    const stride = cards[0].getBoundingClientRect().width + 24;
    const targetProgress = clamp((entry + index * stride - 40) / travel);
    window.scrollTo({ top: start + targetProgress * distance, behavior: 'auto' });
  });
  const move = direction => {
    const stride = cards[0].getBoundingClientRect().width + 20;
    stage.scrollBy({ left: direction * stride, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  stage.addEventListener('scroll', () => {
    if (pinned) return;
    const ratio = stage.scrollLeft / Math.max(1, stage.scrollWidth - stage.clientWidth);
    progressBar.style.transform = 'scaleX(' + clamp(ratio) + ')';
    previous.disabled = stage.scrollLeft < 5;
    next.disabled = stage.scrollLeft >= stage.scrollWidth - stage.clientWidth - 5;
  }, { passive: true });
  measure();
});
document.querySelectorAll('[data-results-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-results-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-results-group]').forEach(group => {
      group.hidden = group.dataset.resultsGroup !== button.dataset.resultsFilter;
    });
  });
});
