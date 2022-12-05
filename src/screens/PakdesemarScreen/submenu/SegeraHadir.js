import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { IcIncoming } from '../assets';
import { Gap } from '../components';

export default SegeraHadir = ({ navigation, route }) => {
  return (
    <View style={{ marginHorizontal: 30 }}>
      <Gap height={20} />
      <Text
        style={{
          fontFamily: fontsCustom.primary[700],
          fontSize: 24,
          color: colorApp.black,
        }}
      >
        Segera Hadir !
      </Text>
      <Gap height={5} />
      <Text
        style={{
          fontFamily: fontsCustom.primary[400],
          fontSize: 14,
          color: colorApp.black,
        }}
      >
        Mohon maaf atas ketidaknyamanan yang dirasakan, saat ini kami tengah mengembangkan fitur
        ini.
      </Text>
      <Gap height={50} />
      <Image source={IcIncoming} style={{ width: '100%', height: 165, resizeMode: 'contain' }} />
    </View>
  );
};
