const copy = {
  fa: { title: 'Median Games | دنیاهای کوچک، ماجراجویی‌های بزرگ', description: 'مدین گیمز؛ بازی‌های مستقل، ساخته‌شده با عشق به بازی.', skip: 'رفتن به محتوا', nav: 'ناوبری اصلی', language: 'زبان', games: 'بازی‌ها', about: 'دربارهٔ ما', eyebrow: 'یک دنیا بازی، یک عالمه خیال', heroLine1: 'دنیاهای کوچک،', heroLine2: 'ماجراجویی‌های بزرگ', heroDescription: 'بازی‌های مستقل، ساخته‌شده با عشق به بازی.\nاینجا هر بازی، شروع یک قصهٔ تازه است.', discover: 'کشف بازی‌ها', heroNote: 'از کنجکاوی شروع کن. با لبخند ادامه بده.', heroAlt: 'جزیره‌ای رنگارنگ در آسمان، با یک ماجراجوی کوچک', playful: 'کمی خیال، کلی بازی!', gamesKicker: 'ماجراجویی بعدی‌ات', ourGames: 'بازی‌های ما', previewNotice: 'فنجون را همین حالا بازی کن؛ کارت‌های دیگر نمونه‌های نمایشی هستند.', viewGame: 'مشاهدهٔ بازی', aboutKicker: 'پشت این دنیاهای کوچک', aboutTitle: 'ما با خیال بازی می‌کنیم.', aboutDescription: 'مدین گیمز خانهٔ بازی‌های مستقل ماست. از یک ایدهٔ کوچک تا یک تجربهٔ تازه؛ اینجا می‌توانی بازی‌ها و مسیر ساختشان را دنبال کنی.', footerLine: 'بازی‌های مستقل، برای آدم‌های بازی‌دوست.', footerNote: 'دنیاهای تازه در راه‌اند.', close: 'بستن', dialogNote: 'این کارت یک نمونهٔ نمایشی است. اطلاعات و لینک رسمی بازی پس از معرفی آن اضافه می‌شود.' },
  en: { title: 'Median Games | Little worlds, big adventures', description: 'Median Games — Independent games, made with a love of play.', skip: 'Skip to content', nav: 'Main navigation', language: 'Language', games: 'Games', about: 'About us', eyebrow: 'A world of play. A little imagination.', heroLine1: 'Little worlds,', heroLine2: 'big adventures.', heroDescription: 'Independent games, made with a love of play.\nEvery game is the beginning of a new story.', discover: 'Explore our games', heroNote: 'Start with curiosity. Keep going with a smile.', heroAlt: 'A colorful floating island and a little explorer', playful: 'A little wonder. A lot of play!', gamesKicker: 'Your next adventure', ourGames: 'Our games', previewNotice: 'Play Fenjoon now. The other cards are illustrative concepts.', viewGame: 'View game', aboutKicker: 'Behind these little worlds', aboutTitle: 'We play with imagination.', aboutDescription: 'Median Games is the home of our independent games. From a little idea to a new experience, follow our games and the journey of making them here.', footerLine: 'Independent games, for people who love to play.', footerNote: 'New worlds are on the way.', close: 'Close', dialogNote: 'This card is an illustrative preview. Official game details and links will be added when it is announced.' }
};
const dialog = document.querySelector('#game-dialog');
let selectedGame = null;
let language = 'fa';
const localized = value => typeof value === 'string' ? value : value?.[language] || value?.en || '';
function makeElement(tag, className, text) { const element = document.createElement(tag); if (className) element.className = className; if (text) element.textContent = text; return element; }
function renderGames() {
  const grid = document.querySelector('#game-grid'); grid.replaceChildren();
  for (const game of window.MEDIAN_GAMES) {
    const card = makeElement('article', 'game-card');
    card.dataset.game = game.id;
    const image = makeElement('img', 'game-art'); image.src = game.image; image.alt = localized(game.title); image.loading = 'lazy'; image.width = 600; image.height = 400;
    if (game.imageFit === 'contain') { image.classList.add('game-icon'); card.classList.add('released-game'); }
    const info = makeElement('div', 'game-info');
    info.append(makeElement('h3', 'game-title', localized(game.title)), makeElement('span', 'status', localized(game.status)), makeElement('p', 'game-summary', localized(game.summary)));
    const button = makeElement('button', 'game-link'); button.type = 'button'; button.append(makeElement('span', '', copy[language].viewGame), makeElement('span', 'arrow', '←')); button.lastElementChild.setAttribute('aria-hidden', 'true'); button.setAttribute('aria-label', `${copy[language].viewGame}: ${localized(game.title)}`); button.addEventListener('click', () => openGame(game));
    if (game.links.length) {
      const link = game.links[0]; let url; try { url = new URL(link.url); } catch {}
      if (url?.protocol === 'https:') { const store = makeElement('a', 'game-link store-link', localized(link.label)); store.href = url.href; store.target = '_blank'; store.rel = 'noopener noreferrer'; info.append(store); button.classList.add('details-link'); }
    }
    info.append(button); card.append(image, info); grid.append(card);
  }
}
function fillDialog(game) {
  document.querySelector('#dialog-image').src = game.image;
  document.querySelector('#dialog-image').alt = localized(game.title);
  document.querySelector('#dialog-title').textContent = localized(game.title);
  document.querySelector('#dialog-status').textContent = localized(game.status);
  document.querySelector('#dialog-description').textContent = localized(game.description);
  document.querySelector('#dialog-image').classList.toggle('dialog-icon', game.imageFit === 'contain');
  const features = document.querySelector('#dialog-features'); features.replaceChildren();
  for (const feature of localized(game.features) || []) features.append(makeElement('li', '', feature));
  features.hidden = !features.children.length;
  const gallery = document.querySelector('#dialog-gallery'); gallery.replaceChildren();
  for (const [index, source] of (game.screenshots || []).entries()) { const image = makeElement('img'); image.src = source; image.alt = `${localized(game.title)} — ${language === 'fa' ? 'تصویر بازی' : 'Game screenshot'} ${index + 1}`; image.width = 530; image.height = 949; image.loading = 'lazy'; gallery.append(image); }
  gallery.hidden = !gallery.children.length;
  document.querySelector('.dialog-note').hidden = game.links.length > 0;
  const links = document.querySelector('#dialog-links'); links.replaceChildren();
  for (const link of game.links) { let url; try { url = new URL(link.url); } catch { continue; } if (url.protocol !== 'https:') continue; const anchor = makeElement('a', 'button primary', localized(link.label)); anchor.href = url.href; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; links.append(anchor); }
}
function openGame(game) { selectedGame = game; fillDialog(game); dialog.showModal(); document.body.classList.add('dialog-open'); }
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); selectedGame = null; });
dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });
function setLanguage(next) {
  language = next === 'en' ? 'en' : 'fa';
  document.documentElement.lang = language; document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  document.title = copy[language].title; document.querySelector('meta[name=description]').content = copy[language].description;
  document.querySelectorAll('[data-i18n]').forEach(element => { const value = copy[language][element.dataset.i18n]; if (value) { element.textContent = value; if (value.includes('\n')) element.style.whiteSpace = 'pre-line'; } });
  document.querySelectorAll('[data-label]').forEach(element => element.setAttribute('aria-label', copy[language][element.dataset.label]));
  document.querySelectorAll('[data-alt]').forEach(element => element.alt = copy[language][element.dataset.alt]);
  document.querySelectorAll('[data-language]').forEach(element => element.setAttribute('aria-pressed', String(element.dataset.language === language)));
  renderGames(); if (selectedGame) fillDialog(selectedGame);
  try { localStorage.setItem('median-language', language); } catch {}
  const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url);
}
document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
let savedLanguage; try { savedLanguage = localStorage.getItem('median-language'); } catch {}
const requestedLanguage = new URLSearchParams(location.search).get('lang');
setLanguage(requestedLanguage === 'en' || requestedLanguage === 'fa' ? requestedLanguage : savedLanguage || 'fa');
const requestedGame = new URLSearchParams(location.search).get('game');
const matchingGame = window.MEDIAN_GAMES.find(game => game.id === requestedGame);
if (matchingGame) openGame(matchingGame);
document.querySelector('#year').textContent = new Date().getFullYear();
