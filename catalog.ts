import catalog from './data/games.json';
import { openContentLocker } from './services/contentLocker';

type Game = (typeof catalog)[number];
const games: Game[] = catalog;
const main = document.querySelector<HTMLElement>('#main')!;
let query = '';
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const image = (game: Game) => `<img src="${escape(game.image)}" alt="${escape(game.name)} artwork" width="130" height="130" loading="lazy" data-fallback>`;
const card = (game: Game) => `<a class="item" href="#app/${game.id}" aria-label="View ${escape(game.name)} details"><div class="image">${image(game)}<span class="mod">MOD</span></div><h3 class="name">${escape(game.name)}</h3><p class="card-category">${game.category}</p><div class="more"><span>Download</span><span aria-hidden="true">↓</span></div></a>`;
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
  main.innerHTML = `<a class="back-link" href="#catalog">← All apps</a><article class="quick-download" aria-labelledby="app-name"><div class="quick-art">${image(game)}</div><span class="status-badge">${game.category} · MOD</span><h1 id="app-name">${escape(game.name)}</h1><p class="quick-description">${escape(game.description)}</p><button id="download" class="primary-button">Download <span aria-hidden="true">↓</span></button><p class="offer-note">Opens an offer window. Complete the provider’s requirements to continue.</p><p id="download-feedback" role="status" aria-live="polite"></p></article>`;
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
