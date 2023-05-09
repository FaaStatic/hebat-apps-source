import React, { useState,useEffect,useCallback } from 'react';
import { TouchableOpacity, View, Text, Modal, Dimensions,InteractionManager, Platform, Image } from 'react-native';
import { colorApp, fontsCustom, stringApp } from '../../../util/globalvar';
import { HeaderWithoutHistory } from '../../Komponen/HeaderWithoutHistory';
import Icon from 'react-native-vector-icons/dist/Entypo';
import { PermissionUtil } from '../../../util/PermissionUtil';
import { useFocusEffect } from '@react-navigation/native';
import { InstalledApps, RNLauncherKitHelper } from 'react-native-launcher-kit';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import ServiceHelper from '../../PakdesemarScreen/addOns/ServiceHelper';
import { BgLacakLayanan } from '../../PakdesemarScreen/assets';
const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');
const Absensi = ({ navigation, route }) => {

  const [modal,setModal] = useState(false);

  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      if(Platform.OS === "ios"){
        PermissionUtil.accessIosCameraPhotoLibrary();
      }else{
        checkAppsInstalledUser();
        PermissionUtil.requestCameraPermission();
        PermissionUtil.requestExternalWritePermission();
      }
     
    });
    return()=> task.cancel();
  },[]));
 
  const checkAppsInstalledUser = async () => {
    const result = await InstalledApps.getSortedApps();
    let dataArray = [];
    for (let index = 0; index < result.length; index++) {
      const element = result[index].packageName;
      dataArray.push(element);
    }
    checkWithAPI(dataArray);
    checkForbiddenApps();
  };

  const checkForbiddenApps = async () => {
    const res = await ServiceHelper.actionServiceGet('Master/get_forbidden_app');
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      for (let index = 0; index < response.length; index++) {
        const element = response[index].package;
        const result = await RNLauncherKitHelper.checkIfPackageInstalled(
          element,
        );
        console.log(result);
        if(result == true){
          setModal(true);
        }
      }
    } else {
      console.log(metadata.message);
    }
  };

  const checkWithAPI = async (data) => {
    const session = await SessionManager.GetAsObject(stringApp.session)
    const params = {
      id_user : session.id,
      package : data,
    }
    const res = await ServiceHelper.actionServicePost('Master/forbidden_app', params);
    var metadata = res.data.metadata;
    if (metadata.status === 200) {
      setModal(true)
      console.log(metadata.message);
    } else {
      console.log(metadata.message);
    }
  }

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
          <Icon name="location" size={24} color={'white'} style={{
            alignSelf:'flex-start',
          }} />

          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              width:'100%',
              color: 'white',
              fontSize: 16,
              
              fontFamily:fontsCustom.primary[700],
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
          <Icon name="location" size={24} color={'white'}  tyle={{
            alignSelf:'flex-start',
          }} />
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              width:'100%',
              fontFamily:fontsCustom.primary[700],
            }}
          >
            Absen Pulang
          </Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={{
            overflow: 'hidden',
            height : ViewHeight,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
            <View
              style={{
                marginTop : ViewHeight / 3,
                alignSelf: 'center',
                backgroundColor : 'white',
                borderRadius : 20
              }}
            >
              <View style={{justifyContent: 'center', alignItems: 'center', padding : 12 }}>
                <Image
                  source={BgLacakLayanan}
                  style={{ width: ViewWidth / 2, height: ViewHeight / 4, resizeMode : 'contain' }}
                />
                <Text
                  style={{
                    fontFamily: fontsCustom.primary[700],
                    fontSize: 20,
                    textAlign: 'center',
                    marginTop: 16,
                    paddingHorizontal: 16,
                  }}
                >
                  Mohon maaf aplikasi kami mendeteksi ada aplikasi Fake GPS di Smartphone anda!
                </Text>
              </View>
            </View>
          </View>
        </Modal>
    </View>
  );
};

export default Absensi;
