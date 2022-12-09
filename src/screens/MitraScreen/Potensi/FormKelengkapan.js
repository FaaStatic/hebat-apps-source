import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import WebView from 'react-native-webview';
import { Header } from '../../Komponen/Header';

export default function FormKelengkapan({ navigation, route }) {
  const { modelData } = route.params;

  var urlForm = `https://gmedia.bz/bapenda/Form/form_kategori/?id=${modelData.id_merchant}&kategori=${modelData.id_kategori}&petugas=${modelData.id_user_potensi}&idp=&flag=${modelData.flag}&id_potensi=${modelData.id_potensi}&pendapatan=${modelData.pendapatan}&pajak=${modelData.pajak}&flag_sumber=${modelData.flag_sumber}`;

  useEffect(() => {
    // const preventingBack = navigation.addListener('beforeRemove', (e) => {
    //   e.preventDefault();
    // });
    const backActionHandler = () => {
      if (navigation.isFocused()) {
        Alert.alert(
          'Konfirmasi',
          'Anda Yakin ingin keluar? Pastikan anda menyelesaikan semua isian sebelum anda keluar.Anda tidak dapat kembali ke halaman ini setelah keluar.',
          [
            {
              text: 'Batal',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'Ya', onPress: () => navigation.goBack() },
          ]
        );
        return false;
      }
    };
    const backAction = BackHandler.addEventListener('hardwareBackPress', () => backActionHandler);

    return () => {
      // preventingBack();
      backAction.remove();
    };
  }, [navigation]);

  const webViewRef = useRef();

  const messageResponse = (event) => {
    var data = JSON.parse(event.nativeEvent.data);
    console.log('====================================');
    console.log(data.value);
    console.log('====================================');
  };

  const runFirst = `(function() {
    window.ReactNativeWebView.postMessage(JSON.stringify({value : "value"}));
})();`;

  const runBeforeFirst = `window.isNativeApp = true;`;
  return (
    <View style={Style.container}>
      <Header
        Title={'Isi Kelengkapan'}
        back={() => {
          navigation.navigate('BerandaMitra');
        }}
      />
      <WebView
        ref={webViewRef}
        source={{ uri: urlForm }}
        javaScriptEnabled={true}
        useWebKit={Platform.OS === 'ios'}
        allowUniversalAccessFromFileURLs={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        showsVerticalScrollIndicator={false}
        allowFileAccess={true}
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        ignoreSslError={true}
        injectedJavaScript={runFirst}
        injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
        originWhitelist={['*']}
        scalesPageToFit={Platform.OS === 'ios'}
        scrollEnabled={true}
        onMessage={(event) => {
          messageResponse(event);
        }}
        allowsBackForwardNavigationGestures={true}
        sharedCookiesEnabled={true}
        style={Style.webViewContainer}
        javaScriptCanOpenWindowsAutomatically={true}
      />
    </View>
  );
}

const Style = StyleSheet.create({
  webViewContainer: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
