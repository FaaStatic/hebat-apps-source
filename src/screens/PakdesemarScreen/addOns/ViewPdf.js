import React, { useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import PDFView from 'react-native-view-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import { colorApp } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';
import { CustomModal, Gap, HeaderSubMenu, Input } from '../components';
const ViewPdf = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const { file } = route.params;

  const resources = {
    url: file,
  };

  const downloadData = () => {
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

    return config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
      },
    })
      .fetch('GET', resources.url)
      .then((res) => {
        setLoading(false);
        MessageUtil.successMessage('File berhasil di download, mohon periksa ' + filePath);
      });
  };
  const resourceType = 'url';
  return (
    <>
      <View style={{ flex: 1 }}>
        <HeaderSubMenu
          title="Hasil Cetak"
          background={colorApp.primary}
          type="icon-only"
          icon="black"
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            position: 'absolute',
            top: 60,
            right: 15,
          }}
        >
          <Input
            isReadOnly={true}
            backgroundColor={colorApp.primary}
            borderColor={colorApp.primary}
            onPressIcon={() => {
              setLoading(true);
              downloadData();
            }}
            icon="download"
            positionIconStart={true}
            backgroundColorInInput={colorApp.button.primary}
            textIcon="Dwonload"
          />
        </View>
        <Gap height={60} />
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1, marginTop: 50 }}
          resource={resources[resourceType]}
          resourceType={resourceType}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
          onError={(error) => console.log('Cannot render PDF', error)}
        />
        <CustomModal loading={loading} message={'Loading'} />
      </View>
    </>
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
});
