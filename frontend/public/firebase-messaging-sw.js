importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDciP19G4whhVn1zr8oecGW0727wquvJ30",
  authDomain: "task-tracker-46dba.firebaseapp.com",
  projectId: "task-tracker-46dba",
  storageBucket: "task-tracker-46dba.firebasestorage.app",
  messagingSenderId: "621804578008",
  appId: "1:621804578008:web:fb262d744e589b387463ad"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    tag: 'task-notification',
    renotify: true,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Dismiss' }
    ]
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('http://localhost:3000')
    );
  }
});