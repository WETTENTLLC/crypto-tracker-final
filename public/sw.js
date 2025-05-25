// Service Worker for PWA functionality and offline caching
const CACHE_NAME = 'cryptotracker-v1.0.0'
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/alerts',
  '/premium',
  '/manifest.json',
  '/og-image.svg',
  '/favicon.ico'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseClone = response.clone()
          
          // Cache successful API responses for 5 minutes
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          
          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request)
        })
    )
    return
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
      })
      .catch(() => {
        // Fallback for offline scenarios
        if (request.destination === 'document') {
          return caches.match('/')
        }
      })
  )
})

// Background sync for price alerts
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-alerts') {
    event.waitUntil(syncPriceAlerts())
  }
})

// Push notifications for price alerts
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Price alert triggered!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('CryptoTracker Alert', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  }
})

// Sync price alerts in background
async function syncPriceAlerts() {
  try {
    const response = await fetch('/api/mcp/analytics')
    const data = await response.json()
    
    // Process price alerts and send notifications if needed
    if (data.alerts && data.alerts.length > 0) {
      data.alerts.forEach(alert => {
        if (alert.triggered) {
          self.registration.showNotification('Price Alert!', {
            body: `${alert.coin} has reached ${alert.targetPrice}`,
            icon: '/icons/icon-192x192.png',
            tag: `alert-${alert.id}`
          })
        }
      })
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}
