/* ============================================================
   APP — registers routes and boots the router.
   ============================================================ */

Router.register('/', Pages.home);
Router.register('/shop', Pages.shop);
Router.register('/product/:slug', Pages.product);
Router.register('/free', Pages.free);
Router.register('/free/:slug', Pages.freeDetail);
Router.register('/blog', Pages.blog);
Router.register('/blog/:slug', Pages.blogDetail);

Router.notFound(Pages.notFound);

Router.init();
