import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colorApp } from '../../../../util/globalvar';
const IconOnly = ({ onPress, icon }) => {
  const Icon = () => {
    if (icon === 'black') {
      return (
        <AntDesign
          style={{ marginStart: 15, paddingTop: 7 }}
          name="arrowleft"
          color={colorApp.black}
          size={20}
        />
      );
    }
  };
  return (
    <TouchableOpacity activeOpacity={0.2} onPress={onPress} >
      <Icon />
    </TouchableOpacity>
  );
};

export default IconOnly;

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  },
});
