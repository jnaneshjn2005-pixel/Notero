self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("notes-cache").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./dashboard.html",
        "./admin.html",
        "./style.css",
        "./script.js"
      ])
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
