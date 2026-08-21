/* ============================================================
   DATA — fetches and caches JSON content
   Products, free resources, blog posts all live in /data/*.json
   Edit those files to add/change content. No code changes needed.
   ============================================================ */

const Data = (() => {
  const cache = {};

  async function load(name) {
    if (cache[name]) return cache[name];
    const res = await fetch(`/data/${name}.json`);
    if (!res.ok) throw new Error(`Failed to load ${name}.json`);
    const json = await res.json();
    cache[name] = json;
    return json;
  }

  async function products() {
    return load('products');
  }

  async function product(slug) {
    const all = await products();
    return all.find(p => p.slug === slug) || null;
  }

  async function freebies() {
    return load('free');
  }

  async function freebie(slug) {
    const all = await freebies();
    return all.find(f => f.slug === slug) || null;
  }

  async function posts() {
    return load('blog');
  }

  async function post(slug) {
    const all = await posts();
    return all.find(p => p.slug === slug) || null;
  }

  return { products, product, freebies, freebie, posts, post };
})();
