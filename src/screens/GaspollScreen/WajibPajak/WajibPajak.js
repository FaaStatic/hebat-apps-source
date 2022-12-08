import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import { colorApp } from '../../../util/globalvar';
import { HeaderWithoutHistory } from '../../Komponen/HeaderWithoutHistory';

const { height: ViewHeight } = Dimensions.get('window');
const WajibPajak = ({ navigation, route }) => {
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
          height: ViewHeight / 2.8,
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PajakSekitar');
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
            Wajib Pajak Sekitar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WajibPajakTutup');
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
            Wajib Pajak Tutup
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UpdateWajibPajak');
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
            Update Wajib Pajak
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Reklame');
          }}
          style={{
            flexDirection: 'column',
            backgroundColor: colorApp.button.primary,
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
            Reklame
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WajibPajak;
