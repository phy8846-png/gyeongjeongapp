const CACHE_NAME = "gyeongjeongapp-v2";
const CORE_ASSETS = ["./", "./index.html", "./bundle.js", "./styles.css", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크 우선: 항상 최신 배포본을 먼저 시도하고, 오프라인일 때만 캐시로 대체한다.
// (개발 중 배포한 새 코드가 옛 캐시에 가려 반영 안 되는 문제를 막기 위함)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
