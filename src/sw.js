self.oninstall = function () {
    caches.open('tmtCache').then(function (cache) {
        cache.addAll([
            'index.html',
            '/',
            'index.js'
        ])
    });
};

self.onfetch = (event) => {
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
};