/* ============================================================
   PAGES — one function per route, returns HTML string.
   Content is intentionally minimal per current instructions.
   ============================================================ */

const Pages = {};

/* ── HOME ── */
Pages.home = async () => {
  const [products, freebies, posts] = await Promise.all([
    Data.products(),
    Data.freebies(),
    Data.posts(),
  ]);

  const featured = products.filter(p => p.featured).slice(0, 3);
  const latestFree = freebies.slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return `
    <section class="hero">
      <h1>for the thoughts you never said out loud.</h1>
      <p>quiet, honest work for the inner voice most people silence.</p>
      <a href="/shop" data-link class="btn btn-primary">explore the shop</a>
    </section>

    ${featured.length ? `
    <section class="section">
      <h2 class="section-title">featured</h2>
      <p class="section-sub">start here.</p>
      <div class="grid grid-3">
        ${featured.map(cardProduct).join('')}
      </div>
    </section>` : ''}

    ${latestFree.length ? `
    <section class="section">
      <h2 class="section-title">free</h2>
      <p class="section-sub">no cost. no catch.</p>
      <div class="grid grid-3">
        ${latestFree.map(cardFree).join('')}
      </div>
    </section>` : ''}

    <section class="section">
      <h2 class="section-title">blog</h2>
      <p class="section-sub">longer thoughts, when there are some to share.</p>
      ${latestPosts.length
        ? `<div class="grid grid-3">${latestPosts.map(cardPost).join('')}</div>`
        : `<p style="color:var(--muted);font-style:italic;font-size:13px;">nothing published yet. check back soon.</p>`}
    </section>
  `;
};

/* ── SHOP (list) ── */
Pages.shop = async () => {
  const products = await Data.products();
  return `
    <section class="section">
      <h2 class="section-title">shop</h2>
      <p class="section-sub">things worth keeping.</p>
      <div class="grid grid-3">
        ${products.map(cardProduct).join('') || emptyState('nothing here yet.')}
      </div>
    </section>
  `;
};

/* ── PRODUCT (detail) ── */
Pages.product = async ({ slug }) => {
  const p = await Data.product(slug);
  if (!p) return notFoundHTML();

  return `
    <section class="section">
      <a href="/shop" data-link style="font-size:12px;color:var(--sepia);font-style:italic;">&larr; back to shop</a>
      <div class="mt-1">
        <p class="card-tag">product</p>
        <h1>${p.title}</h1>
        <p class="section-sub">${p.tagline}</p>
        <p style="color:var(--cream);font-size:14px;line-height:1.85;max-width:520px;margin-bottom:24px;">${p.excerpt}</p>
        <p style="font-size:20px;color:var(--gold);margin-bottom:20px;">
          $${p.price}
          ${p.originalPrice ? `<span style="text-decoration:line-through;color:var(--muted);font-size:14px;margin-left:8px;">$${p.originalPrice}</span>` : ''}
        </p>
        <a href="${p.gumroadUrl}" target="_blank" class="btn btn-primary">get it now</a>
      </div>
    </section>
  `;
};

/* ── FREE (list) ── */
Pages.free = async () => {
  const freebies = await Data.freebies();
  return `
    <section class="section">
      <h2 class="section-title">free</h2>
      <p class="section-sub">no email. no catch.</p>
      <div class="grid grid-3">
        ${freebies.map(cardFree).join('') || emptyState('nothing here yet.')}
      </div>
    </section>
  `;
};

/* ── FREE (detail) ── */
Pages.freeDetail = async ({ slug }) => {
  const f = await Data.freebie(slug);
  if (!f) return notFoundHTML();

  return `
    <section class="section">
      <a href="/free" data-link style="font-size:12px;color:var(--sepia);font-style:italic;">&larr; back to free</a>
      <div class="mt-1">
        <p class="card-tag">${f.type}</p>
        <h1>${f.title}</h1>
        <p class="section-sub">${f.tagline}</p>
        <p style="color:var(--cream);font-size:14px;line-height:1.85;max-width:520px;">${f.excerpt}</p>
      </div>
    </section>
  `;
};

/* ── BLOG (list) ── */
Pages.blog = async () => {
  const posts = await Data.posts();
  return `
    <section class="section">
      <h2 class="section-title">blog</h2>
      <p class="section-sub">longer thoughts.</p>
      <div class="grid grid-3">
        ${posts.map(cardPost).join('') || emptyState('nothing published yet. check back soon.')}
      </div>
    </section>
  `;
};

/* ── BLOG (detail) ── */
Pages.blogDetail = async ({ slug }) => {
  const post = await Data.post(slug);
  if (!post) return notFoundHTML();

  return `
    <section class="section">
      <a href="/blog" data-link style="font-size:12px;color:var(--sepia);font-style:italic;">&larr; back to blog</a>
      <div class="mt-1">
        <h1>${post.title}</h1>
        <p class="section-sub">${post.date || ''}</p>
        <div style="color:var(--cream);font-size:14px;line-height:1.9;max-width:600px;">${post.content || post.excerpt}</div>
      </div>
    </section>
  `;
};

/* ── 404 ── */
Pages.notFound = async () => notFoundHTML();

function notFoundHTML() {
  return `
    <section class="section text-center">
      <h1>page not found.</h1>
      <p class="section-sub">this one does not exist. yet.</p>
      <a href="/" data-link class="btn">back home</a>
    </section>
  `;
}

/* ── CARD PARTIALS ── */
function cardProduct(p) {
  return `
    <a href="/product/${p.slug}" data-link class="card">
      <p class="card-tag">product</p>
      <p class="card-title">${p.title}</p>
      <p class="card-excerpt">${p.tagline}</p>
    </a>
  `;
}

function cardFree(f) {
  return `
    <a href="/free/${f.slug}" data-link class="card">
      <p class="card-tag">${f.type}</p>
      <p class="card-title">${f.title}</p>
      <p class="card-excerpt">${f.tagline}</p>
    </a>
  `;
}

function cardPost(post) {
  return `
    <a href="/blog/${post.slug}" data-link class="card">
      <p class="card-tag">blog</p>
      <p class="card-title">${post.title}</p>
      <p class="card-excerpt">${post.excerpt || ''}</p>
    </a>
  `;
}

function emptyState(text) {
  return `<p style="color:var(--muted);font-style:italic;font-size:13px;">${text}</p>`;
}
