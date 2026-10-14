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
      if (previewRevision && previewRevision !== version && !document.querySelector('dialog[open]')) location.reload();
      previewRevision = version;
    } catch { /* The local preview may be restarting. */ }
  }, 2500);
}
