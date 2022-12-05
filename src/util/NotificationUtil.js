import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export const NotificationUtil = {
  createChannel: () => {
    PushNotification.createChannel(
      {
        channelId: 'Bapenda-Apps',
        channelName: 'Bapenda Apps Channel Notification',
        channelDescription: 'A channel to categorize your notifications',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => {
        console.log('Channel Status : ', created);
      }
    );
  },
  initLocalNotificationForeground: (notification) => {
    PushNotification.localNotification({
      channelId: 'Bapenda-Apps',
      autoCancel: true,
      title: notification.title,
      message: notification.message,
      smallIcon: 'ic_launcher',
      largeIcon: 'ic_launcher',
      bigLargeIcon: 'ic_launcher',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      ignoreInForeground: false,
      importance: Importance.HIGH,
      invokeApp: true,
      allowWhileIdle: true,
      priority: 'high',
      visibility: 'public',
    });
    return Promise.resolve();
  },
  initLocalNotificationBackground: (remoteMessage) => {
    PushNotification.localNotification({
      channelId: 'Bapenda-Apps',
      autoCancel: true,
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.message,
      smallIcon: 'ic_launcher',
      largeIcon: 'ic_launcher',
      bigLargeIcon: 'ic_launcher',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      ignoreInForeground: false,
      importance: Importance.HIGH,
      invokeApp: true,
      allowWhileIdle: true,
      priority: 'high',
      visibility: 'public',
    });
    return Promise.resolve();
  },
  channelExistCheck: () => {
    PushNotification.channelExists('Bapenda-Apps', function (exists) {
      if (exists) {
        console.log('Channel Exist? :', exists);
      } else {
        NotificationUtil.createChannel();
      } // true/false
    });
  },
  notificationConfigure: () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        NotificationUtil.onRemoteNotification(notification);
        NotificationUtil.initLocalNotificationForeground(notification);
        if(Platform.OS === 'ios'){
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,

      requestPermissions: true,
    });
  },
  onRemoteNotification: (notification) => {
    console.log('tesnotif', notification);
    if (notification.data) {
      if (notification.userInteraction == true) {
        console.log('testestes');
      }
    } else {
      if (notification.foreground == false) {
        //navigate
      } else {
        //navigate
      }
    }
  },
  notificationHandler: () => {
    messaging().onMessage(async (remoteMessage) => {
      NotificationUtil.initLocalNotificationBackground(remoteMessage);
    });
  },
  firebaseBackgroundHandlerNotification: () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      NotificationUtil.initLocalNotificationBackground(remoteMessage);
    });
  },
};
