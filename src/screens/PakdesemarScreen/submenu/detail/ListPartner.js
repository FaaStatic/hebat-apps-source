import React from 'react';
import { View, TouchableOpacity, Image, Text, Platform } from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Gap } from '../../components';

export default ListPartner = ({ status, title, data, onPressMenu }) => {
  const renderList = (list) => {
    return list.map((item) => {
      return (
        <>
          <Gap height={5} />
          <View
            key={item.name}
            style={{
              flexDirection: 'row',
              borderRadius: 19,
              padding: 15,
              backgroundColor: colorApp.secondary,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: Platform.OS == 'android' ? 2 : 0,
              shadowRadius: 19,
              shadowColor: colorApp.black,
              elevation: 2,
            }}
          >
            <View style={{ width: 54, height: 54, borderRadius: 10, backgroundColor: colorApp.primary, justifyContent: 'center' }}>
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 54,
                  height: 13,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <Gap width={20} />
            <Text style={{ fontSize: 14, fontFamily: fontsCustom.primary[700], color: colorApp.black, alignSelf: 'center' }}>{item.judul}</Text>
            <TouchableOpacity
              style={{ flex: 0.97, alignItems: 'flex-end', justifyContent: 'center' }}
              onPress={() => onPressMenu(item)}
            >
              <MaterialCommunityIcons
                name={'arrow-collapse-right'}
                size={22}
                color={colorApp.button.primary}
              />
            </TouchableOpacity>
          </View>
          <Gap height={7} />
        </>
      );
    });
  }
  return <View>
    <Text style={{ fontSize: 14, fontFamily: fontsCustom.primary[400], color: colorApp.black }}>
      {title}
    </Text>
    {renderList(data)}
  </View>
};
