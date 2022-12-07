import React from 'react';
import { StyleSheet, Text, View, Platform, Dimensions, Image } from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import { Button } from '../index';
const APPBAR_HEIGHT = Platform.OS == 'android' ? 200 : 250;
const height = Dimensions.get('window').height;
const HeaderSubMenuDetail = ({
  imageNoUri,
  logo,
  title,
  onPress,
  icon,
  type,
  color,
  background,
}) => {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          backgroundColor: background,
          paddingTop: height / 12,
          width: '100%',
          paddingHorizontal: 16,
          height: APPBAR_HEIGHT,
        }}
      >
        {title !== '' ? (
          <View style={{ flexDirection: 'row' }}>
            {icon != undefined && <Button type={type} icon={icon} onPress={onPress} />}
            <Text style={styles.title(color, icon)}>{title}</Text>
          </View>
        ) : (
          icon != undefined && <Button type={type} icon={icon} onPress={onPress} />
        )}

        <View style={{ flex: 1, alignItems: 'center' }}>
          {imageNoUri !== undefined ? (
            <Image source={logo} style={{ width: 175, height: 55, resizeMode: 'contain' }} />
          ) : (
            <Image
              source={{ uri: logo }}
              style={{ width: 175, height: 55, resizeMode: 'contain' }}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default HeaderSubMenuDetail;

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
