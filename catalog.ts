import catalog from './data/games.json';
import { openContentLocker } from './services/contentLocker';

type Game = (typeof catalog)[number];
const games: Game[] = catalog;
const main = document.querySelector<HTMLElement>('#main')!;
let query = '';
let toastTimer: ReturnType<typeof setTimeout>;
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const image = (game: Game) => `<img src="${escape(game.image)}" alt="${escape(game.name)} artwork" width="130" height="130" loading="lazy" data-fallback>`;
const card = (game: Game) => `<a class="item" href="#app/${game.id}" aria-label="View ${escape(game.name)} details"><div class="image">${image(game)}<span class="mod">MOD</span></div><h3 class="name">${escape(game.name)}</h3><p class="card-category">${game.category}</p><div class="more"><span>View details</span><span aria-hidden="true">↗</span></div></a>`;
function notify(message: string) {
  const toast = document.querySelector<HTMLElement>('#toast')!;
  clearTimeout(toastTimer); toast.textContent = message; toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}
function renderResults() {
  const filtered = games.filter(g => `${g.name} ${g.description} ${g.category}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  document.querySelector('#game-list')!.innerHTML = filtered.map(card).join('');
  document.querySelector('#result-count')!.textContent = `${filtered.length} ${filtered.length === 1 ? 'game' : 'games'}`;
  document.querySelector<HTMLElement>('#empty')!.hidden = filtered.length > 0;
}
function discover() {
  document.title = 'Mobile Game MODs';
  main.innerHTML = `<section id="catalog" aria-labelledby="catalog-heading"><div class="search"><div class="inp"><label class="sr-only" for="inp">Search apps</label><span class="icon" aria-hidden="true">⌕</span><input id="inp" type="search" placeholder="Search apps…" value="${escape(query)}" autocomplete="off"></div></div><div class="the-title"><h1 class="name" id="catalog-heading">Mobile games &amp; MODs</h1><span id="result-count" role="status" aria-live="polite"></span></div><div class="game"><div id="game-list" class="catalog-grid"></div><div id="empty" class="empty-state" hidden><h2>No apps found</h2><p>Try another name.</p><button id="reset" class="secondary-button">Clear search</button></div></div></section>`;
  main.querySelector('#inp')!.addEventListener('input', e => { query = (e.target as HTMLInputElement).value; renderResults(); });
  main.querySelector('#reset')!.addEventListener('click', () => { query = ''; main.querySelector<HTMLInputElement>('#inp')!.value = ''; renderResults(); main.querySelector<HTMLInputElement>('#inp')!.focus(); });
  renderResults();
}
function details(game: Game) {
  document.title = `${game.name} — Game MODs`;
  main.innerHTML = `<a class="back-link" href="#catalog">← Back to games</a><article class="detail-page"><div class="detail-heading"><div class="detail-art">${image(game)}</div><div><span class="eyebrow">${game.category} · GAME DETAILS</span><h1>${escape(game.name)}</h1><span class="status-badge">Mobile game / MOD</span></div></div><div class="detail-columns"><section><h2>About this game</h2><p>${escape(game.description)}</p><div class="release-info"><h3>Release information</h3><dl><div><dt>Category</dt><dd>${game.category}</dd></div><div><dt>Platforms</dt><dd>Not confirmed</dd></div><div><dt>Version &amp; file size</dt><dd>Not published</dd></div><div><dt>Availability</dt><dd>Through content locker</dd></div></dl></div><h2>Before you download</h2><p>Check device compatibility before installing. Tap Download to open the offer window. The provider handles offer completion and access to the download.</p></section><aside class="download-panel" aria-labelledby="download-heading"><span class="download-icon" aria-hidden="true">↓</span><h2 id="download-heading">Get ${escape(game.name)}</h2><p>Complete an offer in the content locker to continue to the download.</p><button id="download" class="primary-button">Download</button><p id="download-feedback" role="status" aria-live="polite"></p><button id="share" class="secondary-button">Copy page link ↗</button><p id="share-feedback" role="status" class="share-feedback"></p><small>Offer requirements and any costs are shown by the provider. Review them before continuing.</small></aside></div></article><section class="related"><div class="the-title"><h2 class="name">Keep exploring</h2></div><div class="game catalog-grid">${games.filter(g => g.id !== game.id).map(card).join('')}</div></section>`;
  const download = main.querySelector<HTMLButtonElement>('#download')!;
  const downloadFeedback = main.querySelector<HTMLElement>('#download-feedback')!;
  download.addEventListener('click', async () => {
    download.disabled = true;
    download.textContent = 'Opening offers…';
    downloadFeedback.textContent = '';
    try { await openContentLocker(); }
    catch (error) { downloadFeedback.textContent = error instanceof Error ? error.message : 'Could not open offers. Please try again.'; }
    finally { download.disabled = false; download.textContent = 'Download'; }
  });
  main.querySelector('#share')!.addEventListener('click', async () => {
    const feedback = main.querySelector<HTMLElement>('#share-feedback')!;
    try { await navigator.clipboard.writeText(location.href); feedback.textContent = 'Link copied!'; notify('Page link copied'); }
    catch { feedback.textContent = `Copy this address: ${location.href}`; }
  });
}
function route() {
  const hash = location.hash.slice(1);
  if (hash.startsWith('app/')) {
    const game = games.find(g => g.id === hash.slice(4));
    if (game) details(game);
    else { document.title = 'Game not found — Game MODs'; main.innerHTML = '<section class="empty-state"><h1>Game not found</h1><p>This link may be out of date.</p><a class="primary-link" href="#catalog">Browse all games</a></section>'; }
  } else {
    if (!main.querySelector('#catalog')) discover();
  }
  if (hash === 'catalog') document.getElementById(hash)?.scrollIntoView();
  else window.scrollTo(0, 0);
  main.focus({preventScroll: true});
}
document.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement && event.target.hasAttribute('data-fallback')) {
    event.target.removeAttribute('data-fallback'); event.target.src = '/images/game-placeholder.svg';
  }
}, true);
document.querySelector('#year')!.textContent = String(new Date().getFullYear());
window.addEventListener('hashchange', route);
route();
