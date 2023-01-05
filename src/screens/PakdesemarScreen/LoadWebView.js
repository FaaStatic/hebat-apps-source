import React, { useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { colorApp } from '../../util/globalvar';
import { HeaderSubMenu } from './components';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 120 : 100;
const LoadWebView = ({ navigation, route }) => {
  const { url } = route.params;
  const [isVisible, setIsVisible] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const webViewRef = useRef(null);
  const backButtonHandler = () => {
    console.log(currentUrl);
    if (webViewRef.current) {
      if (
        currentUrl == 'https://esumpah.semarangkota.go.id/pemakais/sign_in' ||
        currentUrl == 'https://esptpd.semarangkota.go.id/' ||
        currentUrl == 'https://bimaqris.bankjateng.co.id/' ||
        currentUrl == 'https://eretribusi.semarangkota.go.id/' ||
        currentUrl == 'http://e-spptpbb.semarangkota.go.id/'
      ) {
        navigation.goBack();
      }
      webViewRef.current.goBack();
    }
  };
  return (
    <>
      <StatusBar backgroundColor={colorApp.header.primary} />
      <View style={{ flex: 1, backgroundColor: colorApp.primary }}>
        {isVisible ? (
          <View style={styles.wrapper}>
            <ActivityIndicator size="large" color={colorApp.input} />
            <Text style={styles.text}>Please wait!...</Text>
          </View>
        ) : null}
        <View style={{ height: APPBAR_HEIGHT }} />
        <WebView
          ref={webViewRef}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            setCurrentUrl(navState.url);
          }}
          source={{
            uri: url,
          }}
          onLoad={() => setIsVisible(!isVisible)}
          onLoadStart={() => setIsVisible(true)}
          javaScriptEnabled={true}
          useWebKit={Platform.OS === 'ios'}
          allowUniversalAccessFromFileURLs
          domStorageEnabled={true}
          startInLoadingState={true}
          showsVerticalScrollIndicator={false}
          allowFileAccess={true}
          cacheEnabled={true}
          cacheMode="LOAD_DEFAULT"
          ignoreSslError={true}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=1.0, maximum-scale=1.0,  user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
          originWhitelist={['*']}
          scalesPageToFit={Platform.OS === 'ios'}
          useWebView2={true}
          scrollEnabled={true}
          allowsBackForwardNavigationGestures
        />
        <HeaderSubMenu
          title=""
          gapCustom={true}
          background={colorApp.primary}
          type="icon-only"
          icon="black"
          onPress={() => backButtonHandler()}
        />
      </View>
    </>
  );
};

export default LoadWebView;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorApp.colorBlackLoading,
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 18,
    color: colorApp.colorBlackLoading,
    marginTop: 6,
  },
  tabBarContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#b43757',
  },
  button: {
    color: 'white',
    fontSize: 24,
  },
});
