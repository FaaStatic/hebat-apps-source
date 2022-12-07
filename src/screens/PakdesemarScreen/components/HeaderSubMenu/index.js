import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import { Button } from './../index';
const height = Dimensions.get('window').height;
const HeaderSubMenu = ({ absolute, gapCustom, title, onPress, icon, type, color, background }) => {
  const APPBAR_HEIGHT = Platform.OS == 'android' ? gapCustom == undefined ? 140 : 100 : gapCustom == undefined ? height / 5 : height / 9;
  return (
    <>
      <View
        style={{
          position: absolute != undefined ? null : 'absolute',
          backgroundColor: background,
          paddingTop: gapCustom == undefined ? height / 12 : height / 23,
          width: '100%',
          paddingHorizontal: 16,
          height: APPBAR_HEIGHT,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          {icon != undefined && <Button type={type} icon={icon} onPress={onPress} />}
          <Text style={styles.title(color, icon)}>{title}</Text>
        </View>
      </View>
    </>
  );
};

export default HeaderSubMenu;

const styles = StyleSheet.create({
  wrapper: (background) => ({
    backgroundColor: background == undefined ? colorApp.header.primary : background,
    width: '100%',
  }),
  title: (color, icon) => ({
    fontSize: 22,
    fontFamily: fontsCustom.primary[700],
    marginLeft: icon == undefined ? 0 : 10,
    color: color == undefined ? colorApp.black : color,
  }),
});
