const CACHE='farmland-policy-map-app-v2';
const FILES=['./','./index.html','./assets/app.css','./assets/naver-ui.css','./src/naver-map.js','./src/map-utils.js','./assets/icon.svg','./src/app.js','./src/domain.js','./src/storage.js','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('farmland-policy-map-app-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// Only this application's same-origin static shell. Never cache external map tiles,
// VWorld results, private records, or other projects on softm.github.io.
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!FILES.some(p=>new URL(p,self.registration.scope).pathname===u.pathname))return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match(e.request).then(r=>r||new Response('오프라인: 아직 저장하지 않은 화면입니다.',{status:503}))));});
