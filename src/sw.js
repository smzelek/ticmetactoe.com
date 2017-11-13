self.oninstall = function () {
    caches.open('tmtCache').then(function(cache) {
        cache.addAll([
            'index.html', 
            '/',
            'index.js'
        ])
    });
};

self.onfetch = (event) => {
    event.respondWith(
        caches.match(event.request)
    );
};