import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, Dimensions, View, Platform, InteractionManager, TouchableOpacity, Text } from 'react-native';
import PDFView from 'react-native-view-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';
import { CustomModal, Gap, HeaderSubMenu, Input } from '../components';
import WebView from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ViewPdf = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const { file } = route.params;
  const [uriDoc, setUriDoc] = useState("");
  const webViewRef = useRef();
  const resources = {
    url: file,
  };

  useFocusEffect(useCallback(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (Platform.OS === "ios") {
        setLoading(true);
        downloadDataios();
      }
    });
    return () => {
      task.cancel;
    }
  }, []));



  const downloadDataios = async () => {
    // send http request in a new thread (using native code)
    let date = new Date();
    const { config, fs } = RNFetchBlob;
    const document = fs.dirs.DocumentDir;
    var fileExtension = resources.url.split('.').pop();
    var filePathIos =
      document +
      '/pakdesemar_' +
      Math.floor(date.getTime() + date.getSeconds() / 2) +
      '.' +
      fileExtension;
    const configOption = {
      fileCache: true,
      notification: true,
      path: filePathIos,
    };
    const res = await config(configOption)
      .fetch('GET', resources.url);
    setLoading(false);
    console.log(res.data);
    setUriDoc(res.data);
  };

  const openDocument = () => {
    RNFetchBlob.ios.openDocument(uriDoc);
  }

  const downloadData = async () => {
    // send http request in a new thread (using native code)
    let date = new Date();
    const { config, fs } = RNFetchBlob;
    const downloads = fs.dirs.DownloadDir;
    var fileExtension = resources.url.split('.').pop();
    var filePath =
      downloads +
      '/pakdesemar_' +
      Math.floor(date.getTime() + date.getSeconds() / 2) +
      '.' +
      fileExtension;
    const configOption = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
      },
    }
    const res = await config(configOption)
      .fetch('GET', resources.url);
    setLoading(false);
    console.log(res.data);
    MessageUtil.successMessage('File berhasil di download, mohon periksa ' + filePath);
  };
  const resourceType = 'url';
  return (

    <View style={{ flex: 1, paddingTop: 16, backgroundColor: "white" }}>
      {/* <HeaderSubMenu
        title="Hasil Cetak"
        background={colorApp.primary}
        type="icon-only"
        icon="black"
        gapCustom={true}
        onPress={() => navigation.goBack()}
      /> */}

      <View style={{
        height: 75,
        paddingLeft: 16,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center"
      }}>
        <TouchableOpacity onPress={() => {
          navigation.goBack();
        }}>
          <AntDesign
            name="arrowleft"
            color={colorApp.black}
            size={20}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Hasil Cetak</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 30,
          right: 15,

          zIndex: 10,

        }}
      >
        <Input
          isReadOnly={true}
          backgroundColor={colorApp.primary}
          borderColor={colorApp.primary}
          onPressIcon={() => {
            if (Platform.OS === "ios") {
              openDocument();
            } else {
              setLoading(true);
              downloadData();
            }

          }}
          icon="download"
          positionIconStart={true}
          backgroundColorInInput={colorApp.button.primary}
          textIcon="Download"
        />
      </View>
      {Platform.OS === "ios" && uriDoc !== "" && <WebView
        ref={webViewRef}
        showsVerticalScrollIndicator={false}
        source={{
          uri: uriDoc,
          headers: {
            "content-type": "application/pdf"
          }
        }}
        javaScriptEnabled={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={["file://"]}
        domStorageEnabled={true}
        allowFileAccess={true}
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"

        scalesPageToFit={Platform.OS === 'ios'}
        scrollEnabled={true}
        allowsBackForwardNavigationGestures={true}
      />}
      {Platform.OS === "android" && <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1, marginTop: 30, width: Dimensions.get("window").width, height: Dimensions.get("window").height }}
        resource={resources.url}
        resourceType={resourceType}
        onLoad={() => console.log(`PDF rendered from ${resourceType} and url ${resources.url}`)}
        onError={(error) => console.log('Cannot render PDF', error)}
      />}

      <CustomModal loading={loading} message={'Loading'} />
    </View>

  );
};

export default ViewPdf;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  title: {
    fontSize: 22,
    fontFamily: fontsCustom.primary[700],
    marginLeft: 10,
    color: colorApp.black,
  },
});
