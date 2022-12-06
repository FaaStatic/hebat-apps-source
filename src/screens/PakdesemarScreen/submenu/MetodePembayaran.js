import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text, ScrollView } from 'react-native';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { BgPembayaran } from '../assets';
import { Gap } from '../components';
export default MetodePembayaran = ({ data, onPressMenu }) => {
  const renderDetail = (menu) => {
    return menu.map((item) => {
      return (
        <>
          <TouchableOpacity key={item.name} onPress={() => onPressMenu(item)}>
            <View
              style={{
                height: 46,
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: 19,
                backgroundColor: colorApp.secondary,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1,
                elevation: 3,
              }}
            >
              <Gap width={40} />
              <Image style={{ width: 21, height: 21 }} source={item.logo} resizeMode="contain" />
              <Gap width={30} />
              <View style={{ width: item.list.length > 0 ? '29%' : '100%' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fontsCustom.primary[700],
                    color: colorApp.black,
                  }}
                >
                  {item.name}
                </Text>
              </View>
              <Gap width={10} />
              {renderLogo(item.list)}
            </View>
          </TouchableOpacity>
          <Gap height={10} />
        </>
      );
    });
  };
  const renderLogo = (item) => {
    if (item.length > 0) {
      return (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colorApp.primary,
            padding: 5,
            borderRadius: 15,
          }}
        >
          {item.slice(0, 4).map((it) => {
            return (
              <>
                <Image
                  source={{ uri: it.image }}
                  style={{ width: 25, height: 10, resizeMode: 'contain' }}
                />
                <Gap width={5} />
              </>
            );
          })}
        </View>
      );
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Gap height={30} />
        <Image
          source={BgPembayaran}
          style={{ width: '100%', height: 188, resizeMode: 'contain' }}
        />
        <Gap height={10} />

        {data.map((item) => {
          return (
            <>
              <Gap height={10} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fontsCustom.primary[400],
                  color: colorApp.black,
                }}
              >
                {item.status}
              </Text>
              <Gap height={10} />
              {renderDetail(item.detail)}
            </>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardView: {
    borderRadius: 19,
    marginBottom: 10,
    width: '100%',
    height: 98,
    marginEnd: 16,
  },
  imgCardView: {
    position: 'absolute',
    height: 110,
    width: 120,
    borderRadius: 19,
    opacity: 0.1,
  },
  cardViewIn: {
    width: 64,
    height: 64,
    backgroundColor: colorApp.primary,
    borderRadius: 19,
    padding: 15,
  },
});
