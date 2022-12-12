import React, { useRef } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { Header } from '../Komponen/Header';
const supportedURL = 'https://register.nexa.net.id/bapenda/';
const RegisterMitra = ({ navigation, route }) => {
  const webViewRef = useRef();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Header
        back={() => {
          navigation.goBack();
        }}
        Title={'Register Mitra Hebat'}
      />
      <WebView
        ref={webViewRef}
        showsVerticalScrollIndicator={false}
        source={{ uri: supportedURL }}
        javaScriptEnabled={true}
        allowUniversalAccessFromFileURLs={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        scalesPageToFit={Platform.OS === 'ios'}
        scrollEnabled={true}
        allowsBackForwardNavigationGestures={true}
      />
    </View>
  );
};

export default RegisterMitra;
