/* ============================================================
   ROUTER — minimal client-side router with History API
   Routes are matched in order. First match wins.
   Supports static routes and dynamic [slug] routes.
   ============================================================ */

const Router = (() => {
  let routes = [];
  let notFoundHandler = null;
  const app = document.getElementById('app');

  function register(path, handler) {
    // Convert "/product/:slug" into a regex + param names
    const paramNames = [];
    const pattern = path
      .replace(/\/+$/, '') // strip trailing slash
      .split('/')
      .map(seg => {
        if (seg.startsWith(':')) {
          paramNames.push(seg.slice(1));
          return '([^/]+)';
        }
        return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/');

    routes.push({
      regex: new RegExp(`^${pattern || '/'}$`),
      paramNames,
      handler,
    });
  }

  function notFound(handler) {
    notFoundHandler = handler;
  }

  async function resolve() {
    const path = normalizePath(location.pathname);

    for (const route of routes) {
      const match = path.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(match[i + 1]);
        });
        await render(route.handler, params);
        return;
      }
    }

    if (notFoundHandler) {
      await render(notFoundHandler, {});
    }
  }

  function normalizePath(path) {
    if (path.length > 1 && path.endsWith('/')) {
      return path.slice(0, -1);
    }
    return path;
  }

  async function render(handler, params) {
    app.setAttribute('aria-busy', 'true');
    const html = await handler(params);
    app.innerHTML = html;
    app.setAttribute('aria-busy', 'false');
    window.scrollTo(0, 0);
    highlightNav();
    document.dispatchEvent(new CustomEvent('route:rendered', { detail: { params } }));
  }

  function highlightNav() {
    const path = normalizePath(location.pathname);
    document.querySelectorAll('[data-nav-link]').forEach(link => {
      const linkPath = normalizePath(new URL(link.href).pathname);
      const isRoot = linkPath === '/';
      const active = isRoot ? path === '/' : path.startsWith(linkPath);
      link.classList.toggle('is-active', active);
    });
  }

  function navigate(path, { replace = false } = {}) {
    if (normalizePath(location.pathname) === normalizePath(path)) return;
    if (replace) {
      history.replaceState({}, '', path);
    } else {
      history.pushState({}, '', path);
    }
    resolve();
  }

  function init() {
    // Intercept all internal link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-link]');
      if (!link) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      navigate(url.pathname + url.search);
    });

    window.addEventListener('popstate', resolve);
    resolve();
  }

  return { register, notFound, navigate, init };
})();
