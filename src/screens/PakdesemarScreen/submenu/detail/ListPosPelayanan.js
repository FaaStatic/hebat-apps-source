import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import { Gap } from '../../components';
import { IcMapsWhite } from '../../assets';

export default ListPosPelayanan = ({ data, onPressMenu }) => {
  return data.map((item) => {
    return (
      <View style={styles.cardView}>
        <View
          style={{
            justifyContent: 'center',
            height: 133,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <View style={{ width: '53%', paddingEnd: 20 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fontsCustom.primary[700],
                color: colorApp.black,
              }}
            >
              {item.judul}
            </Text>
            <Gap height={7} />
            <Text
              style={{
                fontSize: 10,
                fontFamily: fontsCustom.primary[400],
                color: colorApp.black,
                textAlign: 'justify',
              }}
            >
              {item.deskripsi}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onPressMenu(item)} style={styles.cardViewIn}>
            <View
              style={{
                flexDirection: 'row',
                height: 33,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colorApp.primary, fontSize: 14, fontFamily: fontsCustom.primary[700] }}>
                Petunjuk
              </Text>
              <Gap width={5} />
              <Image
                style={{ width: 17, height: 17, tintColor: colorApp.primary }}
                source={IcMapsWhite}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  });
};

const styles = StyleSheet.create({
  cardView: {
    borderRadius: 19,
    marginBottom: 10,
    width: '100%',
    backgroundColor: colorApp.secondary,
    height: 133,
  },
  imgCardView: {
    position: 'absolute',
    height: 110,
    width: 120,
    borderRadius: 19,
    opacity: 0.1,
  },
  cardViewIn: {
    height: 33,
    width: 113,
    backgroundColor: colorApp.header.primary,
    borderRadius: 19,
  },
});
