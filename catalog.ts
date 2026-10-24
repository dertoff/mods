import catalog from './data/games.json';

type Game = (typeof catalog)[number];
const games: Game[] = catalog;
const main = document.querySelector<HTMLElement>('#main')!;
let query = '';
let category = 'All';
let sort = 'featured';
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
  const filtered = games.filter(g => (category === 'All' || g.category === category) && `${g.name} ${g.description} ${g.category}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  if (sort === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));
  document.querySelector('#game-list')!.innerHTML = filtered.map(card).join('');
  document.querySelector('#result-count')!.textContent = `${filtered.length} ${filtered.length === 1 ? 'game' : 'games'}`;
  document.querySelector<HTMLElement>('#empty')!.hidden = filtered.length > 0;
  document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
}
function discover() {
  document.title = 'Game MODs — Discover your next game';
  main.innerHTML = `<section class="hero"><span class="eyebrow">YOUR NEXT ADVENTURE STARTS HERE</span><h1>Big games.<br><span>Endless possibilities.</span></h1><p>Explore the catalog, find your favorite, and get all the details in one place.</p><a class="primary-link" href="#catalog">Explore games <span aria-hidden="true">↓</span></a><div class="hero-orb" aria-hidden="true">✦</div></section><section id="catalog" aria-labelledby="catalog-heading"><div class="search"><div class="inp"><label class="sr-only" for="inp">Search games</label><span class="icon" aria-hidden="true">⌕</span><input id="inp" type="search" placeholder="Search your next favorite game…" value="${escape(query)}" autocomplete="off"></div></div><div class="catalog-toolbar"><div class="filters" aria-label="Game categories">${['All','Action','Racing','Simulation'].map(c => `<button data-category="${c}" aria-pressed="${c === category}">${c}</button>`).join('')}</div><label class="sort-label">Sort <select id="sort"><option value="featured">Featured</option><option value="name">Name A–Z</option></select></label></div><div class="the-title"><h2 class="name" id="catalog-heading">Featured MODs</h2><span id="result-count" role="status" aria-live="polite"></span></div><div class="game"><div id="game-list" class="catalog-grid"></div><div id="empty" class="empty-state" hidden><span aria-hidden="true">⌕</span><h3>No games found</h3><p>Try another title or explore all categories.</p><button id="reset" class="secondary-button">Reset filters</button></div></div></section><section id="about" class="about-panel"><div><span class="eyebrow">A LITTLE MORE ABOUT US</span><h2>Discover. Explore. Play.</h2></div><p>A simple place to explore games and check release information. Downloads will appear on each app page when a file is available. No sign-up required to browse.</p></section>`;
  main.querySelector('#inp')!.addEventListener('input', e => { query = (e.target as HTMLInputElement).value; renderResults(); });
  main.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(button => button.addEventListener('click', () => { category = button.dataset.category!; renderResults(); }));
  const select = main.querySelector<HTMLSelectElement>('#sort')!; select.value = sort;
  select.addEventListener('change', () => { sort = select.value; renderResults(); });
  main.querySelector('#reset')!.addEventListener('click', () => { query = ''; category = 'All'; main.querySelector<HTMLInputElement>('#inp')!.value = ''; renderResults(); main.querySelector<HTMLInputElement>('#inp')!.focus(); });
  renderResults();
}
function details(game: Game) {
  document.title = `${game.name} — Game MODs`;
  main.innerHTML = `<a class="back-link" href="#catalog">← Back to games</a><article class="detail-page"><div class="detail-heading"><div class="detail-art">${image(game)}</div><div><span class="eyebrow">${game.category} · GAME DETAILS</span><h1>${escape(game.name)}</h1><span class="status-badge">Download coming soon</span></div></div><div class="detail-columns"><section><h2>About this game</h2><p>${escape(game.description)}</p><div class="release-info"><h3>Release information</h3><dl><div><dt>Category</dt><dd>${game.category}</dd></div><div><dt>Platforms</dt><dd>Not confirmed</dd></div><div><dt>Version &amp; file size</dt><dd>Not published</dd></div><div><dt>Availability</dt><dd>No file available yet</dd></div></dl></div><h2>Before you download</h2><p>Check the platform and system requirements when a release is published. This catalog does not currently host a downloadable file for this game.</p></section><aside class="download-panel" aria-labelledby="download-heading"><span class="download-icon" aria-hidden="true">↓</span><h2 id="download-heading">Get ${escape(game.name)}</h2><p>A download link hasn’t been added yet. Check back for availability.</p><button class="primary-button" disabled>Download unavailable</button><button id="share" class="secondary-button">Copy page link ↗</button><p id="share-feedback" role="status" class="share-feedback"></p><small>No file, registration, or verification required to view this page.</small></aside></div></article><section class="related"><div class="the-title"><h2 class="name">Keep exploring</h2></div><div class="game catalog-grid">${games.filter(g => g.id !== game.id).map(card).join('')}</div></section>`;
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
  if (hash === 'catalog' || hash === 'about') document.getElementById(hash)?.scrollIntoView();
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
