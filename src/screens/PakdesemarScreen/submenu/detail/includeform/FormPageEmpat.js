import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import { colorApp, fontsCustom } from '../../../../../util/globalvar';
import { PermissionUtil } from '../../../../../util/PermissionUtil';
import { launchCamera } from 'react-native-image-picker';
import { IcAdd } from '../../../assets';
import { Button, Gap } from '../../../components';
import { MessageUtil } from '../../../../../util/MessageUtil';
export default FormPageEmpat = ({ data, active, onPressButton }) => {
  const [file, setFile] = useState([]);
  useEffect(() => {
    data.length !== 0 && setConditionDraft();
  }, []);
  const setConditionDraft = () => {
    setFile(data.file);
  };
  const pickImage = async () => {
    if (Platform.OS === 'android') {
      const access = await PermissionUtil.requestCameraPermission();
      if (access) {
        actionOpenCamera();
      } else {
        MessageUtil.warningMessage('Pengguna tidak memberi akses kamera!!');
      }
    } else {
      actionOpenCamera();
    }
  };
  const actionOpenCamera = async () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      cameraType: 'back',
      quality: 0.7,
      storageOptions: {
        skipBackup: true,
        path: 'Pictures',
      },
      saveToPhotos: true,
    };
    await launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('Canceled By User');
      } else {
        const item = {
          id: file.length,
          fileName: response.assets[0].fileName,
          uri: response.assets[0].uri,
          type: response.assets[0].type,
        };
        setFile([...file, item]);
      }
    });
  };
  const onAction = () => {
    const item = {
      file: file,
    };
    return onPressButton(active, item);
  };
  const actionDelete = (id) => {
    Alert.alert('Hebat!', 'Anda yakin akan menghapus foto ini ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Iya', onPress: () => processDelete(id) },
    ]);
  };
  const processDelete = (id) => {
    const dataNew = file.filter(function (item) {
      return item.id !== id;
    });
    setFile(dataNew);
  };
  return (
    <View>
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ color: colorApp.black, fontFamily: fontsCustom.primary[400] }}>Dokumentasi Usaha (Max. 3 Foto)</Text>
        <Gap height={15} />
        <View
          style={{
            backgroundColor: colorApp.secondary,
            borderRadius: 19,
            padding: 15,
            height: 214,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {file.length == 0 ? (
            <>
              <TouchableOpacity onPress={() => pickImage()}>
                <Image source={IcAdd} style={{ height: 50, width: 50 }} />
              </TouchableOpacity>
              <Gap height={15} />
              <Text
                style={{
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.placeholderColor,
                }}
              >
                Tekan untuk menambahkan gambar
              </Text>
            </>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {file.map((item) => {
                  return (
                    <>
                      <TouchableOpacity
                        onLongPress={() => {
                          actionDelete(item.id);
                        }}
                      >
                        <Image
                          key={item.id}
                          style={{ height: 150, width: 150 }}
                          source={{ uri: item.uri }}
                        />
                      </TouchableOpacity>
                      <Gap width={10} />
                    </>
                  );
                })}
                {file.length < 3 && (
                  <TouchableOpacity
                    style={{ justifyContent: 'center', marginStart: 20 }}
                    onPress={() => pickImage()}
                  >
                    <Image source={IcAdd} style={{ height: 50, width: 50 }} />
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
        </View>
        <Gap height={15} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <Button
            height={35}
            title={active == 5 ? 'Kirim Data' : 'Lanjutkan'}
            type="primary"
            width="30%"
            onPress={() => onAction()}
          />
        </View>
      </View>
    </View>
  );
};
