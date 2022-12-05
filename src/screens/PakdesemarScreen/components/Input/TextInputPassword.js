import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Image } from 'react-native';
import { ImgInputTime, ImgInputCalendar, IcInVisible, IcVisible } from '../../assets';
import { colorApp, fontsCustom } from '../../../../util/globalvar';

const TextInputPassword = ({
  label,
  type,
  value,
  onChangeText,
  onPress,
  isSecure,
  height,
  icon,
  backgroundColor,
  borderColor,
}) => {
  const [border, setBorder] = useState(borderColor == undefined ? '#E6ECF6' : borderColor);

  const Label = () => {
    if (type === 'label') {
      return <Text style={styles.label}>{label}</Text>;
    }
    return <></>;
  };

  const onFocusForm = () => {
    setBorder(colorApp.input);
  };

  const onBlurForm = () => {
    setBorder(borderColor == undefined ? '#E6ECF6' : borderColor);
  };

  const Icon = () => {
    if (icon == 'date') {
      return <Image source={ImgInputCalendar} style={{ width: 30, height: 30 }} />;
    }
    if (icon == 'time') {
      return <Image source={ImgInputTime} style={{ width: 30, height: 30 }} />;
    }
    return <></>;
  };

  return (
    <View>
      <Label />
      <View style={styles.wrapper(border, height, icon, backgroundColor)}>
        {icon != undefined && <Icon />}
        <TextInput
          style={styles.input(height, icon)}
          placeholder={label}
          secureTextEntry={isSecure}
          value={value}
          // onFocus={onFocusForm}
          placeholderTextColor={colorApp.secondary}
          onBlur={onBlurForm}
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={onPress} style={styles.touachableButton}>
          {isSecure ? (
            <Image
              style={{ width: 32, height: 32, tintColor: colorApp.button.primary }}
              source={IcVisible}
            />
          ) : (
            <Image
              style={{ width: 32, height: 32, tintColor: colorApp.button.primary }}
              source={IcInVisible}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TextInputPassword;

const styles = StyleSheet.create({
  wrapper: (border, height, icon, backgroundColor) => ({
    borderRadius: 19,
    borderWidth: 1,
    borderColor: border,
    paddingHorizontal: icon != undefined ? 12 : 12,
    flexDirection: 'row',
    textAlignVertical: 'top',
    alignItems: 'center',
    height: height,
    backgroundColor: backgroundColor == undefined ? '#E6ECF6' : backgroundColor,
  }),
  input: (height, icon) => ({
    flex: 1,
    height: height ? height : 50,
    fontSize: 15,
    color: colorApp.inputText,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: icon == undefined ? 0 : 6,
  }),
  label: {
    fontSize: 16,
    color: colorApp.black,
    marginBottom: 4,
    justifyContent: 'flex-start',
    fontFamily: fontsCustom.primary[700],
  },
  picker: {
    borderWidth: 1,
    borderColor: colorApp.border,
    borderRadius: 4,
    paddingHorizontal: 4,
    backgroundColor: '#f9f9f9',
  },
  wrapperCounter: (border) => ({
    borderRadius: 4,
    borderWidth: 1,
    borderColor: border,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  inputCounter: {
    flex: 1,
    paddingLeft: 4,
    height: 36,
    fontSize: 16,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  select2: {
    backgroundColor: colorApp.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorApp.border,
  },
  touachableButton: {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    paddingRight: 12,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
});
