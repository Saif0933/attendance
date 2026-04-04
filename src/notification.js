import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

/**
 * Request Notification Permissions (Handles Android 13+ and iOS)
 */
export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  return enabled;
}

/**
 * Get FCM Token for the Device
 */
export const GetFCMToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.error('Error fetching FCM token:', error);
  }
};

/**
 * Listener for Foreground Notifications
 */
export const NotificationListener = () => {
  // Listen for messages while the app is in the foreground
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground Message received:', JSON.stringify(remoteMessage));
    Alert.alert(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body || 'You have a new message.'
    );
  });

  // Listen for background messages when the app is opened from a notification
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification
    );
  });

  // Check if the app was opened from a notification when it was totally closed (Killed state)
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification
        );
      }
    });

  return unsubscribe;
};
