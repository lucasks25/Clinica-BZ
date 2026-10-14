const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('open', expanded);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = button.dataset.filter !== 'Todos' && card.dataset.category !== button.dataset.filter;
    });
  });
});
const dialog = document.querySelector('#gallery-dialog');
let galleryTrigger;
document.querySelectorAll('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => {
    galleryTrigger = button;
    const caption = button.dataset.caption;
    dialog.querySelector('img').src = button.dataset.gallery;
    dialog.querySelector('img').alt = 'Resultado publicado pela Clínica BZ: ' + caption;
    dialog.querySelector('p').textContent = caption + ' · Imagem do site da Clínica BZ. Resultados individuais.';
    dialog.showModal();
  });
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => galleryTrigger?.focus());
document.querySelectorAll('.comparison-control').forEach(control => {
  const frame = control.closest('.comparison-frame');
  const update = () => {
    const value = Number(control.value);
    frame.style.setProperty('--position', value + '%');
    control.setAttribute('aria-valuetext', value + '% da imagem antes, ' + (100 - value) + '% da imagem depois');
  };
  control.addEventListener('input', update);
  update();
});
if (['127.0.0.1', 'localhost'].includes(location.hostname)) {
  let previewRevision;
  setInterval(async () => {
    try {
      const response = await fetch('/__revision', { cache: 'no-store' });
      if (!response.ok) return;
      const { version } = await response.json();
      if (previewRevision && previewRevision !== version && !document.querySelector('dialog[open]')) {
        const blocks = [...document.querySelector('main').children];
        const block = blocks.find(el => el.getBoundingClientRect().top <= innerHeight * .4 && el.getBoundingClientRect().bottom > innerHeight * .4);
        if (block) sessionStorage.setItem('bz-preview-position', JSON.stringify({ id: block.id, index: blocks.indexOf(block), top: block.getBoundingClientRect().top }));
        location.reload();
      }
      previewRevision = version;
    } catch { /* The local preview may be restarting. */ }
  }, 2500);
}

const resultsToggle = document.querySelector('.results-toggle');
if (resultsToggle) {
  const preview = document.getElementById(resultsToggle.getAttribute('aria-controls'));
  const root = resultsToggle.closest('.results-reveal');
  const panel = preview.querySelector('.real-results-panel');
  resultsToggle.addEventListener('click', () => {
    const expanded = resultsToggle.getAttribute('aria-expanded') !== 'true';
    preview.style.height = preview.getBoundingClientRect().height + 'px';
    void preview.offsetHeight;
    resultsToggle.setAttribute('aria-expanded', String(expanded));
    root.classList.toggle('is-expanded', expanded);
    panel.inert = !expanded;
    preview.setAttribute('aria-hidden', String(!expanded));
    requestAnimationFrame(() => {
      preview.style.height = expanded ? panel.scrollHeight + 'px' : getComputedStyle(preview).getPropertyValue('--results-preview-height');
    });
    resultsToggle.innerHTML = (expanded ? 'Recolher resultados' : 'Mostrar resultados reais') + '<span aria-hidden="true">' + (expanded ? '↑' : '↓') + '</span>';
  });
  preview.addEventListener('transitionend', event => {
    if (event.propertyName !== 'height') return;
    preview.style.height = resultsToggle.getAttribute('aria-expanded') === 'true' ? 'auto' : '';
  });
}
// Keep the original three-card layout, revealing verified excerpts in place.
document.querySelectorAll('[data-animated-reviews]').forEach(grid => {
  const cards = [...grid.querySelectorAll('.google-review-card')];
  const templates = cards.map(card => card.innerHTML);
  const pause = grid.closest('section').querySelector('.review-pause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false, paused = false, offset = 0, timer;
  const clear = () => { clearTimeout(timer); timer = undefined; };
  const schedule = () => {
    clear();
    if (!visible || paused || reduced.matches || document.hidden || grid.contains(document.activeElement)) return;
    timer = setTimeout(() => {
      offset = (offset + 1) % templates.length;
      cards.forEach((card, index) => {
        card.innerHTML = templates[(index + offset) % templates.length];
        card.animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], {
          duration: 700, delay: index * 160, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards'
        });
      });
      schedule();
    }, 5000);
  };
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.35 });
  observer.observe(grid);
  window.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { cards.forEach(card => card.getAnimations().forEach(animation => animation.cancel())); schedule(); });
  grid.addEventListener('focusin', clear);
  grid.addEventListener('focusout', () => queueMicrotask(schedule));
  pause.addEventListener('click', () => {
    paused = !paused;
    pause.textContent = paused ? 'Retomar animação' : 'Pausar animação';
    pause.setAttribute('aria-pressed', String(paused));
    if (paused) cards.forEach(card => card.getAnimations().forEach(animation => animation.cancel()));
    schedule();
  });
});
