import React, { useEffect } from 'react';
import { StatusBar, View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { NotificationUtil } from './util/NotificationUtil';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import firebase from '@react-native-firebase/app';
import RouteManager from './util/RouterManager';
import FlashMessage from 'react-native-flash-message';
import { stringApp, firebaseConfig } from './util/globalvar';
import { Provider } from 'react-redux';
import { Store } from './statemanager/Store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  useEffect(() => {
    if(Platform.OS === 'ios'){
      PushNotificationIOS.requestPermissions();
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    NotificationUtil.channelExistCheck();
    NotificationUtil.notificationConfigure();
    NotificationUtil.firebaseBackgroundHandlerNotification();
    if (Platform.OS === 'ios') {
      NotificationUtil.notificationConfigure();
      PushNotificationIOS.addEventListener(
        stringApp.typeNotif,
        NotificationUtil.onRemoteNotification
      );
     let handler = NotificationUtil.notificationHandler();

      return () => {
        PushNotificationIOS.removeEventListener(stringApp.typeNotif);
        handler;
      };
    } else {
      NotificationUtil.notificationHandler();
    }
    
  }, []);

  return (
    <GestureHandlerRootView style={style.container}>
      <Provider store={Store}>
        <StatusBar animated={true} />
        <SafeAreaProvider>
        <View style={style.container}>
            <RouteManager />
          </View>
        </SafeAreaProvider>

        <FlashMessage
          style={{ zIndex: 1000 }}
          position={'bottom'}
          floating={true}
          animated={true}
        />
      </Provider>
    </GestureHandlerRootView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
   
  },
});

export default App;
