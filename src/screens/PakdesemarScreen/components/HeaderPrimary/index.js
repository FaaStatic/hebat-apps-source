import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colorApp, fontsCustom } from '../../../../util/globalvar';

export default HeaderPrimary = ({ rute, onIcon, onPressIcon }) => {
  const [title, setTitle] = useState('..');
  useEffect(() => {
    var h = new Date().getHours();
    if (h >= 4 && h < 10) setTitle('Selamat pagi');
    if (h >= 10 && h < 15) setTitle('Selamat siang');
    if (h >= 15 && h < 18) setTitle('Selamat sore');
    if (h >= 18 || h < 4) setTitle('Selamat malam');
  }, []);
  let headerTitle =
    rute == 'Beranda'
      ? title
      : rute == 'Article'
        ? 'Ini beberapa'
        : rute == 'Hubungi'
          ? 'Butuh bantuan'
          : 'Halo para';
  let headerSubTitle =
    rute == 'Beranda'
      ? ''
      : rute == 'Article'
        ? 'Artikel'
        : rute == 'Hubungi'
          ? 'Orang'
          : 'Mitra';
  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            flex: 1,
            position: 'absolute',
            fontSize: 22,
            fontWeight: '400',
            color: colorApp.black,
            fontFamily: fontsCustom.primary.normal,
          }}
        >
          {headerTitle}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10 }}>
          <Text style={styles.titleLogo}>{headerSubTitle}</Text>
          <Image
            source={require('../../assets/img/logo.png')}
            resizeMode="cover"
            style={styles.avatar}
          />
        </View>
      </View>
      {onIcon !== undefined && (
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            backgroundColor: colorApp.primary,
            borderRadius: 11,
          }}
          activeOpacity={0.7}
          onPress={onPressIcon}
        >
          <View style={{ alignSelf: 'center' }}>
            <Ionicons name="md-notifications-outline" size={18} color={colorApp.button.primary} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 120,
    marginTop: 15,
    marginBottom: 10,
  },
  titleLogo: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 5,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: colorApp.black,
    fontFamily: fontsCustom.primary[700],
  },
});
