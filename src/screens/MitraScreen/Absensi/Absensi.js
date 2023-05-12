import React, { useState,useEffect,useCallback } from 'react';
import { TouchableOpacity, View, Text, Modal, Dimensions,InteractionManager, Platform, Image, AppState } from 'react-native';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { HeaderWithoutHistory } from '../../Komponen/HeaderWithoutHistory';
import Icon from 'react-native-vector-icons/dist/Entypo';
import { PermissionUtil } from '../../../util/PermissionUtil';
import { useFocusEffect } from '@react-navigation/native';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';
import ServiceHelper from '../../PakdesemarScreen/addOns/ServiceHelper';
import { BgLacakLayanan } from '../../PakdesemarScreen/assets';
import { Button, Gap } from '../../PakdesemarScreen/components';
const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');
const Absensi = ({ navigation, route }) => {
  const [modal, setModal] = useState(false);
  const [refresh, setRefresh] = useState('');
  const [listForbiddenApps, setListForbiddenApps] = useState([]);
  useEffect(() => {
    if (Platform.OS == 'android') {
      checkForbiddenApps();
    }
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      console.log('Next AppState is: ', nextAppState);
      setRefresh(nextAppState);
    });
    return () => {
      appStateListener.remove();
    };
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (Platform.OS === 'ios') {
          PermissionUtil.accessIosCameraPhotoLibrary();
        } else {
          PermissionUtil.requestCameraPermission();
        }
      });
      return () => task.cancel();
    }, [])
  );

  const checkForbiddenApps = async () => {
    const res = await ServiceHelper.actionServiceGet('Master/get_forbidden_app');
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      console.log(response);
      let data = [];
      let dataListTrue = [];
      for (let index = 0; index < response.length; index++) {
        const element = response[index].package;
        const result = await RNLauncherKitHelper.checkIfPackageInstalled(element);
        console.log(result);
        response[index].status = result;
        data.push(response[index]);
        if (result == true) {
          dataListTrue.push(response[index].nama);
        }
      }
      setListForbiddenApps(dataListTrue);
      let status = data.find((item) => item.status == true);
      if (status != undefined) {
        setModal(true);
      } else {
        setModal(false);
      }
    } else {
      console.log(metadata.message);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <HeaderWithoutHistory
        Title={'Absensi'}
        back={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          paddingBottom: 8,
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: 150,
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AbsenCheck', {
              status: 1,
            });
          }}
          style={{
            flexDirection: 'row',
            backgroundColor: colorApp.btnColor2,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Icon
            name="location"
            size={24}
            color={'white'}
            style={{
              alignSelf: 'flex-start',
            }}
          />

          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              width: '100%',
              color: 'white',
              fontSize: 16,

              fontFamily: fontsCustom.primary[700],
            }}
          >
            Absen Masuk
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AbsenCheck', {
              status: 2,
            });
          }}
          style={{
            flexDirection: 'row',
            backgroundColor: colorApp.btnColor3,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Icon
            name="location"
            size={24}
            color={'white'}
            tyle={{
              alignSelf: 'flex-start',
            }}
          />
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              width: '100%',
              fontFamily: fontsCustom.primary[700],
            }}
          >
            Absen Pulang
          </Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ borderRadius: 20, backgroundColor: 'white' }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', padding: 12 }}>
                <Image
                  source={BgLacakLayanan}
                  style={{ width: ViewWidth / 2, height: ViewHeight / 4, resizeMode: 'contain' }}
                />
                <Text
                  style={{
                    fontFamily: fontsCustom.primary[700],
                    fontSize: 16,
                    textAlign: 'center',
                    marginTop: 5,
                    paddingHorizontal: 16,
                  }}
                >
                  Mohon maaf aplikasi kami mendeteksi ada Aplikasi Manipulasi Lokasi di Smartphone
                  anda!
                </Text>
                <Gap height={5} />
                {listForbiddenApps.map((item) => {
                  return (
                    <Text
                      style={{
                        fontFamily: fontsCustom.primary[700],
                        fontSize: 14,
                        textAlign: 'center',
                        paddingHorizontal: 16,
                      }}
                    >
                      {item}
                    </Text>
                  );
                })}
                <Gap height={20} />
                <Button
                  title={'Tutup'}
                  onPress={() => navigation.goBack()}
                  width={100}
                  fontSize={14}
                  height={40}
                  type={'primary'}
                />
                <Gap height={10} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Absensi;
