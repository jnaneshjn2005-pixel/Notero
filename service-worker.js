self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("notes-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./dashboard.html",
        "./admin.html",
        "./style.css",
        "./script.js"
      ]);
    })
  );
});
