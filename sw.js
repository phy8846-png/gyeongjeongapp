// 서비스워커 캐시 문제(배포한 새 코드가 계속 가려지는 문제)로 인해 이 앱은 서비스워커를 쓰지 않기로 했다.
// 혹시 예전에 설치된 서비스워커가 남아있는 브라우저를 위해, 뜨자마자 스스로를 해제하고 캐시를 비운다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then((clients) => clients.forEach((c) => c.navigate(c.url)))
  );
});
