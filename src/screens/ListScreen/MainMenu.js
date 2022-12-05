import React from 'react';
import { View, Image, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

const { height: viewHeight } = Dimensions.get('window');

export const MainMenu = ({ item, action }) => {
  return (
    <TouchableOpacity onPress={action} style={style.container}>
      <Image
        source={item.image}
        style={{
          alignSelf: 'center',
          height: 60,
          width: 50,
          resizeMode: 'contain',
        }}
      />
      <Text
        style={{
          alignSelf: 'center',
          marginTop: 16,
          color: 'black',
          fontWeight: '600',
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    width: viewHeight / 5,
    height: viewHeight / 5,
    flexDirection: 'column',
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.26,
    elevation:4,
  },
});
