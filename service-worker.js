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
