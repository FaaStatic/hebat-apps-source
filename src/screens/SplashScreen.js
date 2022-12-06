import react, { useEffect, useState } from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import { BackgroundLocationServices } from '../util/BackgroundLocationServices';
import { SessionManager } from '../util/SessionUtil/SessionManager';
import LinearGradient from 'react-native-linear-gradient';
import { colorApp } from '../util/globalvar';
import { BgSpleshScreen, IcBapendaSpleshScreen, YelSpleshScreen } from './PakdesemarScreen/assets';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function SplashScreen({ navigation, route }) {
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      sessionCheck();
    });
    return () => {
      subscribe;
    };
  }, [navigation]);

  const sessionCheck = async () => {
    setTimeout(() => {
      var sesi = SessionManager.GetAsObject('@session');
      console.log(sesi);
      if (sesi !== null) {
        navigation.replace('Home');
        BackgroundLocationServices.startBackgroundServices();
      } else {
        navigation.replace('Home');
      }
    }, 5000);
  };

  return (
    <View style={style.container}>
      <LinearGradient
        colors={[colorApp.gradientSatu, colorApp.gradientDua]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.3 }}
        style={style.container}
      >
        <View
          style={{
            flex: 0.8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../assets/images/splashscreen.png')}
            style={{
              resizeMode: 'contain',
              alignSelf: 'center',
              width: 200,
              height: 124,
            }}
          />
          <Image
            source={YelSpleshScreen}
            style={{
              height: 33,
              resizeMode: 'contain',
              width: 180,
            }}
          />
        </View>
        <Image
          source={BgSpleshScreen}
          style={{
            position: 'absolute',
            resizeMode: 'contain',
            width: width,
            marginTop: height / 3.3,
          }}
        />
        <View style={{ flex: 0.2, bottom: 0 }}>
          <Image
            source={IcBapendaSpleshScreen}
            style={{
              bottom: 0,
              position: 'absolute',
              alignSelf: 'center',
              resizeMode: 'contain',
              width: 74,
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
