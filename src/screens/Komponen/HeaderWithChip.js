import { View, TouchableOpacity, StatusBar, StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { colorApp, positionLevel,fontsCustom } from '../../util/globalvar';

var item = 0;
export const HeaderWithChip = ({ Title, back, selectedItem = null }) => {
  const [itemSelected, setItemSelected] = useState(0);
  return (
    <LinearGradient
      colors={[colorApp.gradientSatu, colorApp.gradientSatu]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style.container}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',

    height: Platform.OS === "ios" ? StatusBar.currentHeight+80 :StatusBar.currentHeight + 20,
          marginStart: 16,
          marginTop: 8,
        }}
      >
        <TouchableOpacity onPress={back} style={{ justifyContent: 'center' }}>
          <Icon name="arrowleft" size={24} color={'white'} />
        </TouchableOpacity>

        <Text
           numberOfLines={2}
           ellipsizeMode='tail'
          style={[
            style.textTitle,
            {
              marginStart: 16,
              alignSelf: 'center',
              fontFamily: fontsCustom.primary[700],
            },
          ]}
        >
          {Title}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <FlatList
          data={positionLevel}
          horizontal={true}
          contentContainerStyle={{
            height: 85,
            padding: 8,
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setItemSelected(item.id);
                  selectedItem(item.id);
                }}
                style={{
                  margin: 8,
                  padding: 8,
                  backgroundColor: itemSelected === item.id ? colorApp.button.primary : 'transparent',
                  borderColor: 'white',
                  borderWidth: itemSelected === item.id ? 0 : 0.5,
                  borderRadius: 8,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: 35,
                  width: 80,
                }}
              >
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 12,
                    color: 'white',
                    fontWeight: '600',
                  }}
                >
                  {item.position}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </LinearGradient>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop:Platform.OS === "ios" ? 28 : 0,
    height: Platform.OS === "ios" ? StatusBar.currentHeight+180 :StatusBar.currentHeight + 88,
  },
  textTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    width:200,
  },
  buttonRiwayat: {
    borderRadius: 8,
    height: StatusBar.currentHeight,
    width: 125,
    marginEnd: 16,
    padding: Platform.OS === 'ios' ? 8 : 0,

    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'white',
    justifyContent: 'center',
  },
});
