import React, { useState,useEffect,useCallback } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions,InteractionManager, Platform } from 'react-native';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { HeaderWithoutHistory } from '../../Komponen/HeaderWithoutHistory';
import Icon from 'react-native-vector-icons/dist/Entypo';
import { PermissionUtil } from '../../../util/PermissionUtil';
import { useFocusEffect } from '@react-navigation/native';
const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');

const Absensi = ({ navigation, route }) => {


  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      if(Platform.OS === "ios"){
        PermissionUtil.accessIosCameraPhotoLibrary();
      }else{
        PermissionUtil.requestCameraPermission();
        PermissionUtil.requestExternalWritePermission();
      }
     
    });
    return()=> task.cancel();
  },[]));
 

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
          justifyContent: 'space-evenly',
          height: ViewHeight / 5,
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
    </View>
  );
};

export default Absensi;
