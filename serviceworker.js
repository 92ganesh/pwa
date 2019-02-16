const staticAssets = [
    './',
    './style.css',
    './app.js'
];

var mode;

self.addEventListener('install', async event => {
    const cache = await caches.open('static-def');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const {request} = event;
    const url = new URL(request.url);
    if(mode==false)
    event.respondWith(cacheData(request));
    else{
        if(url.origin === location.origin) {
            event.respondWith(cacheData(request));
        } else {
            event.respondWith(networkFirst(request));
        }
    }

});

self.addEventListener('message', function(event){
    if(event.data=="offline")
    mode=false
    else
    mode=true
    console.log("message: "+mode);
});

// self.addEventListener('notificationclick', function(event){
//     var notification = event.notification;
//     var primaryKey = notification.data.primaryKey;
//     var action = event.action;
//     notification.close();
// });

async function cacheData(request) 
{
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function networkFirst(request) 
{
    const cache = await caches.open('dynamic-def');

    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch (error){
        return await cache.match(request);
    }

}

/*
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
*/
