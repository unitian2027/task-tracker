import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDciP19G4whhVn1zr8oecGW0727wquvJ30",
  authDomain: "task-tracker-46dba.firebaseapp.com",
  projectId: "task-tracker-46dba",
  storageBucket: "task-tracker-46dba.firebasestorage.app",
  messagingSenderId: "621804578008",
  appId: "1:621804578008:web:fb262d744e589b387463ad"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BPqfw76j3jgdgMHgz7OsQ5xLIQO_dhT_IFjfL5ksI3Wy_KTSOjn2AyFIv55EhZgD4TdvBTHQJyQLvYpWsZw4BUo'
      });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (err) {
    console.error('Permission error:', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });