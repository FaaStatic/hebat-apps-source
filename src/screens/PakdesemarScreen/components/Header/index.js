import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import { Button, Border } from '../index';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 210 : 230;
const height = Dimensions.get('window').height;

const Header = ({
  title,
  onPress,
  icon,
  type,
  color,
  background,
  subtitle,
  onPressSubtitle,
  border,
  colorsub,
  colortextsub,
  logo,
}) => {
  return (
    <>
      <SafeAreaView>
        <View
          style={{
            backgroundColor: background,
            paddingTop: height / 11,
            paddingHorizontal: 16,
            height: APPBAR_HEIGHT,
            borderBottomEndRadius: 45,
            borderBottomStartRadius: 45,
          }}
        >
          {icon != undefined && <Button type={type} icon={icon} onPress={onPress} />}
          <View style={{ flexDirection: 'row' }}>
            {title == 'Lacak Pelayanan' ? (
              <>
                <View style={{ flex: 0.9 }}>
                  <Text style={styles.title1(color, icon, 'satu')}>Lacak</Text>
                  <Text style={styles.title1(color, icon)}>Pelayanan</Text>
                </View>
              </>
            ) : title == 'Status Bayar' ? (
              <>
                <View style={{ flex: 0.9 }}>
                  <Text style={styles.title1(color, icon, 'satu')}>Status</Text>
                  <Text style={styles.title1(color, icon)}>Bayar</Text>
                </View>
              </>
            ) : title == 'Bank Partner' ? (
              <>
                <View style={{ flex: 0.9 }}>
                  <Text style={styles.title1(color, icon, 'satu')}>Bank</Text>
                  <Text style={styles.title1(color, icon)}>Partner</Text>
                </View>
              </>
            ) : title == 'Agen Partner' ? (
              <>
                <View style={{ flex: 0.9 }}>
                  <Text style={styles.title1(color, icon, 'satu')}>Agen</Text>
                  <Text style={styles.title1(color, icon)}>Partner</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title(color, icon)}>{title}</Text>
              </>
            )}
            <Image
              style={{ width: 112, height: 112, resizeMode: 'contain', opacity: 0.3 }}
              source={logo}
            />
          </View>
          {subtitle != undefined && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPressSubtitle}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                backgroundColor: colorsub !== undefined ? colorsub : colorApp.header.primary,
                borderRadius: 13.5,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: colorApp.black,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.primary[400],
                  color: colortextsub !== undefined ? colortextsub : colorApp.black,
                  fontSize: 11,
                }}
              >
                {subtitle}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {border != undefined && <Border height={0.1} background={colorApp.black} />}
      </SafeAreaView>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrapper: (background) => ({
    backgroundColor: background == undefined ? colorApp.header.primary : background,
    width: '100%',
  }),
  title: (color, icon) => ({
    flex: 0.9,
    fontSize: 30,
    marginTop: 30,
    paddingEnd: 20,
    fontFamily: fontsCustom.primary[700],
    marginLeft: icon == undefined ? 0 : 10,
    color: color == undefined ? colorApp.black : color,
  }),
  title1: (color, icon, status) => ({
    fontSize: 30,
    marginTop: status !== undefined ? 20 : 0,
    fontFamily: fontsCustom.primary[700],
    marginLeft: icon == undefined ? 0 : 10,
    color: color == undefined ? colorApp.black : color,
  }),
});
