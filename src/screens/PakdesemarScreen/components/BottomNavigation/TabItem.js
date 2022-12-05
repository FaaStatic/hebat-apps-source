import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import Gap from '../Gap';
import {
  IcBnArticle,
  IcBnArticleActive,
  IcBnHome,
  IcBnHomeActive,
  IcBnLogin,
  IcBnLoginActive,
  IcBnSupport,
  IcBnSupportActive,
} from '../../assets';
const TabItem = ({ title, active, onPress, onRead }) => {
  const Icon = () => {
    let iconName;
    let icon =
      title == 'Beranda'
        ? IcBnHome
        : title == 'Artikel'
          ? IcBnArticle
          : title == 'Bantuan'
            ? IcBnSupport
            : IcBnLogin;
    let iconActive =
      title == 'Beranda'
        ? IcBnHomeActive
        : title == 'Artikel'
          ? IcBnArticleActive
          : title == 'Bantuan'
            ? IcBnSupportActive
            : IcBnLoginActive;
    if ((iconName = active)) {
      return (
        <View style={{ width: 126, height: 35, borderRadius: 18, backgroundColor: 'red' }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              height: 35,
            }}
          >
            <Image
              source={iconActive}
              style={{ width: 25, height: 25, tintColor: colorApp.primary, resizeMode: 'contain' }}
            />
            <Gap width={5} />
            <Text
              style={{
                size: 14,
                fontFamily: fontsCustom.primary[700],
                color: colorApp.primary,
              }}
            >
              {title}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Image
            source={icon}
            style={{ width: 25, height: 25, tintColor: 'red', resizeMode: 'contain' }}
          />
        </View>
      );
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.2} style={styles.container} onPress={onPress}>
      <Icon />
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: (active) => ({
    fontSize: 10,
    color: active ? colorApp.header.primary : colorApp.black,
    fontFamily: fontsCustom.primary[400],
    marginTop: 4,
  }),
  icon: {
    width: 22,
    height: 22,
  },
});
