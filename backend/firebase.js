const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const serviceAccount = require('./task-tracker-firebase-adminsdk.json');

initializeApp({
  credential: cert(serviceAccount)
});

const sendNotification = async (token, title, body) => {
  const message = {
    notification: { title, body },
    token
  };
  try {
    await getMessaging().send(message);
    console.log('Notification sent ✅');
  } catch (err) {
    console.error('Notification error:', err);
  }
};

module.exports = { sendNotification };