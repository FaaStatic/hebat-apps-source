import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { Platform, DeviceEventEmitter, Linking } from 'react-native';

export const NotificationUtil = {
  createChannel: () => {
    PushNotification.createChannel(
      {
        channelId: 'hebat',
        channelName: 'Hebat Channel Notification',
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
  initLocalNotification: (notification) => {
    let title = notification.title;
    let message = notification.body;
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'hebat',
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigLargeIcon: 'ic_launcher',
      bigText: message, // (optional) default: "message" prop
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
      subtitle: message, // (optional) smaller title below notification title
      playSound: true,
      importance: Importance.HIGH,
      allowWhileIdle: true,
      priority: 'high',
      visibility: 'public',
      soundName: 'default',
      /* iOS and Android properties */
      title: title, // (optional)
      message: message, // (required)
    });
  },
  channelExistCheck: () => {
    PushNotification.channelExists('hebat', function (exists) {
      if (exists) {
        console.log('Channel Exist? :', exists);
      } else {
        NotificationUtil.createChannel();
      } // true/false
    });
  },
  getTokenIOS: async () => {
    var apns = await messaging().getToken();
    return apns;
  },
  notificationConfigure: () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        NotificationUtil.onRemoteNotification(notification);
        NotificationUtil.initLocalNotification(notification);
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
  notificationConfigureIos: () => {
    PushNotification.configure({
      onRegister: function (token) {
        let tokenApns = NotificationUtil.getTokenIOS();
        tokenApns
          .then((value) => {
            console.log(`TOKEN IOS: ${value}`);
          })
          .catch((err) => {
            console.log('====================================');
            console.log(`${err}`);
            console.log('====================================');
          });
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        NotificationUtil.onRemoteIosNotification(notification);
        NotificationUtil.localNotificationInitIos(notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
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
      requestPermissions: Platform.OS === 'ios',
    });
  },
  localNotificationInitIos: (notification) => {
    //NotificationUtil.sendSilentNotification();
    let title = notification.title;
    let message = notification.body;
    PushNotificationIOS.addNotificationRequest({
      id: 'hebat',
      title: title,
      subtitle: title,
      body: message,
      sound: 'default',
      badge: 1,
    });
  },
  sendSilentNotification: () => {
    DeviceEventEmitter.emit('remoteNotificationReceived', {
      remote: true,
      aps: {
        category: 'Hebat Notification',
        'content-available': 1,
      },
    });
  },
  onRemoteNotification: (notification) => {
    console.log('tesnotif', notification);
    if (notification.data) {
      if (notification.userInteraction == true) {
        // console.log('====================================');
        // console.log(notification.data.id_berita);
        // console.log('====================================');
        // const data = {
        //   id: 77,
        // };
        Linking.openURL(`hebatapp://MainNotification`);
      }
    } else {
      if (notification.foreground == false) {
        //navigate
      } else {
        //navigate
      }
    }
  },
  onRemoteIosNotification: (notification) => {
    if (notification.data) {
      if (notification.userInteraction == true) {
        
        // const data = {
        //   id: notification.data.id_berita,
        // };
        Linking.openURL(`hebatapp://MainNotification`);
      }
    } else {
      if (notification.foreground == false) {
        //navigate
      } else {
        //navigate
      }
    }
    const result = PushNotificationIOS.FetchResult.NoData;
    notification.finish(result);
  },
  notificationHandler: () => {
    messaging().onMessage(async (remoteMessage) => {
      if (Platform.OS === 'ios') {
        NotificationUtil.localNotificationInitIos(remoteMessage);
      } else {
        NotificationUtil.initLocalNotification(remoteMessage);
      }
    });
  },

  firebaseBackgroundHandlerNotification: async () => {
    await messaging()
      .subscribeToTopic('bapenda')
      .then(() => console.log('Subscribed to topic!'));
    if (Platform.OS === 'android') {
      await messaging().registerDeviceForRemoteMessages();
    }
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (Platform.OS === 'ios') {
        NotificationUtil.localNotificationInitIos(remoteMessage);
      }
      NotificationUtil.initLocalNotification(remoteMessage);
    });
  },
};
