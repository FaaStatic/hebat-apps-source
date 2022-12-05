import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import { colorApp } from '../../../util/globalvar';
import { HeaderWithoutHistory } from '../../Komponen/HeaderWithoutHistory';

const { height: ViewHeight } = Dimensions.get('window');
const AdminScreen = ({ navigation, route }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <HeaderWithoutHistory
        Title={'Daftar Wajib Pajak'}
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
          height: ViewHeight / 3.5,
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DataPetugasList',{
              type:"survey"
            });
          }}
          style={{
            flexDirection: 'column',
            backgroundColor: colorApp.btnColor1,
            justifyContent: 'center',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Tugas Untuk Pendaftaran
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DataPetugasList',{
              type:"monitoring"
            });
          }}
          style={{
            flexDirection: 'column',
            backgroundColor: colorApp.btnColor3,
            justifyContent: 'center',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Tugas Untuk Monitoring
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DataPetugasList',{
              type:"contact"
            });
          }}
          style={{
            flexDirection: 'column',
            backgroundColor: colorApp.btnColor2,
            justifyContent: 'center',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Hubungi Petugas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminScreen;
