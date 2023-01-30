if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + ".js", n).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, c) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let t = {};
    const r = (e) => a(e, i),
      f = { module: { uri: i }, exports: t, require: r };
    s[i] = Promise.all(n.map((e) => f[e] || r(e))).then((e) => (c(...e), t));
  };
}
define(["./workbox-7028bf80"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/252-936e832f3850803e.js",
          revision: "936e832f3850803e",
        },
        {
          url: "/_next/static/chunks/346.50df88f94c711086.js",
          revision: "50df88f94c711086",
        },
        {
          url: "/_next/static/chunks/366-1bff9ea148c8e25f.js",
          revision: "1bff9ea148c8e25f",
        },
        {
          url: "/_next/static/chunks/453-470cfdaaa9389f69.js",
          revision: "470cfdaaa9389f69",
        },
        {
          url: "/_next/static/chunks/477-711cd46ac7aac623.js",
          revision: "711cd46ac7aac623",
        },
        {
          url: "/_next/static/chunks/614.3c49f0584ced8f91.js",
          revision: "3c49f0584ced8f91",
        },
        {
          url: "/_next/static/chunks/625.2961688b437afa6d.js",
          revision: "2961688b437afa6d",
        },
        {
          url: "/_next/static/chunks/723-47f769ab7b878786.js",
          revision: "47f769ab7b878786",
        },
        {
          url: "/_next/static/chunks/753-47a22719152170a7.js",
          revision: "47a22719152170a7",
        },
        {
          url: "/_next/static/chunks/762-4baecadd776e5731.js",
          revision: "4baecadd776e5731",
        },
        {
          url: "/_next/static/chunks/830.d8313c760c0ce20b.js",
          revision: "d8313c760c0ce20b",
        },
        {
          url: "/_next/static/chunks/857.3f9c936b96d62063.js",
          revision: "3f9c936b96d62063",
        },
        {
          url: "/_next/static/chunks/873.f07a6cb3ec3d5f3b.js",
          revision: "f07a6cb3ec3d5f3b",
        },
        {
          url: "/_next/static/chunks/917-84bbc38cc792f2e3.js",
          revision: "84bbc38cc792f2e3",
        },
        {
          url: "/_next/static/chunks/918.58d3180e7f6a2c2a.js",
          revision: "58d3180e7f6a2c2a",
        },
        {
          url: "/_next/static/chunks/994-486cc124328d13f6.js",
          revision: "486cc124328d13f6",
        },
        {
          url: "/_next/static/chunks/framework-8d78bf989db74c8f.js",
          revision: "8d78bf989db74c8f",
        },
        {
          url: "/_next/static/chunks/main-9eb7c55ca04404fb.js",
          revision: "9eb7c55ca04404fb",
        },
        {
          url: "/_next/static/chunks/pages/_app-c7a6dc2282d4d92d.js",
          revision: "c7a6dc2282d4d92d",
        },
        {
          url: "/_next/static/chunks/pages/_error-0aba39871a1fa40a.js",
          revision: "0aba39871a1fa40a",
        },
        {
          url: "/_next/static/chunks/pages/h/%5Busername%5D-f5bb3401ed91e3a0.js",
          revision: "f5bb3401ed91e3a0",
        },
        {
          url: "/_next/static/chunks/pages/h/drift-9d854b3f0a72f132.js",
          revision: "9d854b3f0a72f132",
        },
        {
          url: "/_next/static/chunks/pages/h/events-9bb3140bfb7277b9.js",
          revision: "9bb3140bfb7277b9",
        },
        {
          url: "/_next/static/chunks/pages/h/feed-6f63d0c7b1a03952.js",
          revision: "6f63d0c7b1a03952",
        },
        {
          url: "/_next/static/chunks/pages/h/feed/%5Bid%5D-a8aed98cfed2c813.js",
          revision: "a8aed98cfed2c813",
        },
        {
          url: "/_next/static/chunks/pages/h/jobs-969d3e549a1754d1.js",
          revision: "969d3e549a1754d1",
        },
        {
          url: "/_next/static/chunks/pages/h/me-323651ed04ef3323.js",
          revision: "323651ed04ef3323",
        },
        {
          url: "/_next/static/chunks/pages/index-b67dabaed9096c7d.js",
          revision: "b67dabaed9096c7d",
        },
        {
          url: "/_next/static/chunks/pages/jobs/%5Bid%5D-019953576f6b7978.js",
          revision: "019953576f6b7978",
        },
        {
          url: "/_next/static/chunks/pages/login-5b14182e12bdf391.js",
          revision: "5b14182e12bdf391",
        },
        {
          url: "/_next/static/chunks/pages/p/%5Bid%5D-e82a628abe81ab5c.js",
          revision: "e82a628abe81ab5c",
        },
        {
          url: "/_next/static/chunks/pages/p/dashboard-36097f627c1e6008.js",
          revision: "36097f627c1e6008",
        },
        {
          url: "/_next/static/chunks/pages/p/events-9c1fbfe05b236a60.js",
          revision: "9c1fbfe05b236a60",
        },
        {
          url: "/_next/static/chunks/pages/p/jobs-8f1a645467ef73d4.js",
          revision: "8f1a645467ef73d4",
        },
        {
          url: "/_next/static/chunks/pages/p/me-1722da3cd39e30bf.js",
          revision: "1722da3cd39e30bf",
        },
        {
          url: "/_next/static/chunks/pages/privacynotes-761903ad0708bf3a.js",
          revision: "761903ad0708bf3a",
        },
        {
          url: "/_next/static/chunks/pages/register-f86f67c8d694e7ff.js",
          revision: "f86f67c8d694e7ff",
        },
        {
          url: "/_next/static/chunks/pages/register/hunter-b7984692e065fb6f.js",
          revision: "b7984692e065fb6f",
        },
        {
          url: "/_next/static/chunks/pages/register/provisioner-aaa6f65c2d3b19b3.js",
          revision: "aaa6f65c2d3b19b3",
        },
        {
          url: "/_next/static/chunks/pages/terms-f187f0847b73a8bb.js",
          revision: "f187f0847b73a8bb",
        },
        {
          url: "/_next/static/chunks/pages/test-aebafdc20c81fffb.js",
          revision: "aebafdc20c81fffb",
        },
        {
          url: "/_next/static/chunks/pages/util/about-us-297588f50d1d85ed.js",
          revision: "297588f50d1d85ed",
        },
        {
          url: "/_next/static/chunks/pages/util/recovery-8a07ee9dd01b3af3.js",
          revision: "8a07ee9dd01b3af3",
        },
        {
          url: "/_next/static/chunks/pages/util/recovery/confirm-1b52dbb3b040bdf2.js",
          revision: "1b52dbb3b040bdf2",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-f91f81f0c72f6b0e.js",
          revision: "f91f81f0c72f6b0e",
        },
        {
          url: "/_next/static/cjRpml0l1e5V4VJZZGxiT/_buildManifest.js",
          revision: "36f1c1130a53ad7460b4a884fd19431b",
        },
        {
          url: "/_next/static/cjRpml0l1e5V4VJZZGxiT/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/css/9a506692eed62944.css",
          revision: "9a506692eed62944",
        },
        { url: "/favicon.ico", revision: "c30c7d42707a47a3f4591831641e50dc" },
        {
          url: "/icons/icon-192x192.png",
          revision: "5ebfedcaf7bbac88b47c818e7a73dc16",
        },
        {
          url: "/icons/icon-256x256.png",
          revision: "ba11ce3f3d59782e3e58c0515a11171e",
        },
        {
          url: "/icons/icon-384x384.png",
          revision: "dc82a18ae6316fa20ec73fba2888f681",
        },
        {
          url: "/icons/icon-512x512.png",
          revision: "f0a1a5b9d0be998f3bd9e5336409ed6c",
        },
        {
          url: "/landing/Connected-world-cuate.svg",
          revision: "783e340748acd8aa7ff5aebc89e1d4bd",
        },
        {
          url: "/landing/Connecting-teams-cuate.svg",
          revision: "d4c5c0183ff3ebad7bba496558e31311",
        },
        {
          url: "/landing/Experts-cuate.svg",
          revision: "3538197193238078cf412c3815e4b6e7",
        },
        {
          url: "/landing/Marketing-cuate.svg",
          revision: "e7c37f59394584b69c7672c818aa75ba",
        },
        {
          url: "/landing/Online-dating-cuate.svg",
          revision: "50e018afe3834c4f0f3ebb423cd1e230",
        },
        { url: "/login.svg", revision: "2aecda92925de00e9c4b37c67757a0af" },
        { url: "/loginbg.svg", revision: "c6c36c4890232dc0bfb7c9f1767a92a8" },
        { url: "/mainbg.svg", revision: "56ac76fe1c0c5c912f1723ad544f2819" },
        { url: "/manifest.json", revision: "c802f4b1c689898a80fd96e3b129f55f" },
        { url: "/newlogo.svg", revision: "7ee9905b39098a44b601eff3aa39b98b" },
        {
          url: "/registrationbg.svg",
          revision: "163d242865e33dc645c9c275e276d020",
        },
        { url: "/vercel.svg", revision: "4b4f1876502eb6721764637fe5c41702" },
        { url: "/wicket.svg", revision: "151d65d8a5e42de98f06a7a675e352e5" },
        {
          url: "/wicket_short.svg",
          revision: "70d167f57b71b8c375bd6719f0fc6656",
        },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: n,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
