import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Image } from 'react-native';
import Select2 from './Selected2';
import TextInputPassword from './TextInputPassword';
import {
  ImgInputTextArea,
  ImgInputCalendar,
  IcRowsDown,
  ImgLocation,
  ImgInputTime,
  IcInputUser,
  IcQris,
} from '../../assets';
import { colorApp, fontsCustom } from '../../../../util/globalvar';

const Input = ({
  textIconBold,
  positionIconStart,
  title,
  label,
  type,
  value,
  placeholder,
  placeholderColor,
  onChangeText,
  height,
  textContentType,
  multiline,
  borderColor,
  backgroundColor,
  isSecure,
  keyboardType,
  dataDetectorTypes,
  icon,
  iconIos,
  onPress,
  isReadOnly,
  selectData,
  onSelect,
  onValueChange,
  colorTheme,
  showSearchBox,
  showTitleModal,
  textAlign,
  textAlignLabel,
  borderRadius,
  marginTop,
  onSubmitEditing,
  returnKeyType,
  iosSelected,
  selectedKeterangan,
  colorTextSelected,
  onPressIcon,
  backgroundColorInInput,
  textIcon,
}) => {
  const [border, setBorder] = useState(borderColor == undefined ? colorApp.input : borderColor);

  const Label = () => {
    if (type === 'label') {
      return (
        <Text
          style={[
            styles.label,
            { textAlign: textAlignLabel != undefined ? textAlignLabel : 'left' },
          ]}
        >
          {label}
        </Text>
      );
    }
    return <></>;
  };

  const Icon = () => {
    if (icon == 'date' || iconIos == 'date') {
      return <Image source={ImgInputCalendar} style={{ width: 30, height: 30 }} />;
    }
    if (icon == 'dateSmall' || iconIos == 'dateSmall') {
      return <Image source={ImgInputCalendar} style={{ width: 22, height: 22 }} />;
    }
    if (icon == 'time' || iconIos == 'time') {
      return <Image source={ImgInputTime} style={{ width: 30, height: 30 }} />;
    }
    if (icon == 'textarea' || iconIos == 'textarea') {
      return <Image source={ImgInputTextArea} style={{ width: 24, height: 24 }} />;
    }
    if (icon == 'user' || iconIos == 'user') {
      return (
        <Image
          source={IcInputUser}
          style={{ width: 30, height: 30, tintColor: colorApp.button.primary }}
        />
      );
    }
    if (icon == 'qris' || iconIos == 'qris') {
      return (
        <Image
          source={IcQris}
          style={{ width: 24, height: 24, tintColor: colorApp.button.primary }}
        />
      );
    }
    if (icon === 'location' || iconIos === 'location') {
      return <Image source={ImgLocation} style={{ width: 30, height: 30 }} />;
    }
    if (icon === 'login' || iconIos === 'login') {
      return <MaterialIcons name="login" size={20} color={colorApp.primary} />;
    }
    if (icon === 'info' || iconIos === 'info') {
      return <AntDesign name="infocirlceo" size={20} color={colorApp.primary} />;
    }
    if (icon === 'copy' || iconIos === 'copy') {
      return <MaterialIcons name="content-copy" size={20} color={colorApp.button.primary} />;
    }
    if (icon === 'close' || iconIos === 'close') {
      return <IonIcons name="close" size={20} color={colorApp.primary} />;
    }
    if (icon === 'download' || iconIos === 'download') {
      return <AntDesign name="download" size={20} color={colorApp.primary} />;
    }
    if (icon === 'external-link' || iconIos === 'external-link') {
      return <Feather name="external-link" size={25} color={colorApp.button.primary} />;
    }
    return <></>;
  };

  const onFocusForm = () => {
    setBorder(colorApp.input);
  };

  const onBlurForm = () => {
    setBorder(borderColor == undefined ? '#E6ECF6' : borderColor);
  };

  if (keyboardType == 'select2') {
    return (
      <>
        <Label />
        <View>
          <Select2
            isSelectSingle
            style={iosSelected === undefined ? styles.select2new : styles.select2}
            colorTheme={colorTheme == undefined ? 'blue' : colorTheme}
            selectKet={selectedKeterangan}
            popupTitle={placeholder}
            title={title}
            label={label}
            value={value}
            showSearchBox={showSearchBox == undefined ? false : showSearchBox}
            showTitleModal={showTitleModal == undefined ? false : showTitleModal}
            data={selectData}
            onSelect={onSelect}
            colorLabel={colorTextSelected == undefined ? undefined : colorTextSelected}
            onRemoveItem={(data) => {
              console.log(data);
            }}
          />
          <View pointerEvents="none" style={styles.position}>
            <AntDesign name="caretdown" size={18} color={colorApp.black} />
          </View>
        </View>
      </>
    );
  }

  if (keyboardType == 'password') {
    return (
      <TextInputPassword
        label={label}
        type={type}
        isSecure={isSecure}
        value={value}
        onChangeText={onChangeText}
        onPress={onPress}
        icon={icon}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
      />
    );
  }

  return (
    <View>
      <Label />
      {onPressIcon !== undefined ? (
        <View
          style={
            Platform.OS === 'android'
              ? styles.wrapper(
                borderColor == undefined ? colorApp.input : borderColor,
                !isReadOnly,
                height,
                icon,
                backgroundColor
              )
              : styles.wrapperTop(border, !isReadOnly, height, icon, backgroundColor)
          }
        >
          <TextInput
            returnKeyType={returnKeyType ? returnKeyType : 'default'}
            keyboardType={keyboardType ? keyboardType : 'default'}
            // onFocus={onFocusForm}
            onBlur={onBlurForm}
            style={[
              styles.input(height, !isReadOnly, icon, multiline),
              {
                textAlign: textAlign != undefined ? textAlign : 'left',
                fontFamily: fontsCustom.primary[400],
              },
            ]}
            placeholder={placeholder ? placeholder : label}
            placeholderTextColor={
              placeholderColor != undefined ? colorApp.placeholderColor : '#E6ECF6'
            }
            value={value}
            multiline={multiline}
            textContentType={textContentType ? textContentType : 'none'}
            dataDetectorTypes={dataDetectorTypes ? dataDetectorTypes : 'all'}
            onChangeText={onChangeText}
            editable={!isReadOnly}
            onSubmitEditing={onSubmitEditing}
          />
          <View style={Platform.OS === 'android' ? { marginTop: 0 } : { marginTop: 6 }}>
            <TouchableOpacity
              onPress={onPressIcon}
              style={styles.borderInInput(backgroundColorInInput)}
              activeOpacity={onPress != 'undefined' ? 0.9 : 0.2}
            >
              {textIcon !== undefined ? (
                <>
                  <View style={{ flexDirection: 'row' }}>
                    {positionIconStart == undefined ? (
                      <>
                        <Text
                          style={{
                            marginHorizontal: 2,
                            color: colorApp.primary,
                            fontSize: 12,
                            fontFamily: fontsCustom.primary[700],
                          }}
                        >
                          {textIcon}
                        </Text>
                        <Icon />
                      </>
                    ) : (
                      <>
                        <Icon />
                        <Text
                          style={{
                            marginHorizontal: 5,
                            color: colorApp.primary,
                            fontSize: 14,
                            fontFamily: fontsCustom.primary[700],
                          }}
                        >
                          {textIcon}
                        </Text>
                      </>
                    )}
                  </View>
                </>
              ) : (
                <Icon />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          style={
            Platform.OS === 'android'
              ? styles.wrapper(
                borderColor == undefined ? colorApp.input : borderColor,
                !isReadOnly,
                height,
                icon,
                backgroundColor
              )
              : styles.wrapperTop(borderColor == undefined ? colorApp.input : borderColor, !isReadOnly, height, icon, backgroundColor)
          }
          activeOpacity={onPress != 'undefined' ? 0.9 : 0.2}
        >
          <TextInput
            returnKeyType={returnKeyType ? returnKeyType : 'default'}
            keyboardType={keyboardType ? keyboardType : 'default'}
            // onFocus={onFocusForm}
            onBlur={onBlurForm}
            style={[
              styles.input(height, !isReadOnly, icon, multiline),
              {
                textAlign: textAlign != undefined ? textAlign : 'left',
              },
            ]}
            placeholder={placeholder ? placeholder : label}
            placeholderTextColor={
              placeholderColor != undefined ? colorApp.placeholderColor : '#E6ECF6'
            }
            value={value}
            multiline={multiline}
            textContentType={textContentType ? textContentType : 'none'}
            dataDetectorTypes={dataDetectorTypes ? dataDetectorTypes : 'all'}
            onChangeText={onChangeText}
            editable={!isReadOnly}
            onSubmitEditing={onSubmitEditing}
          />
          <View style={Platform.OS === 'android' ? { marginTop: 0 } : { marginTop: 6 }}>
            <Icon />
          </View>
        </TouchableOpacity>
      )
      }
    </View >
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: (border, isReadOnly, height, icon, backgroundColor) => ({
    borderRadius: 19,
    borderWidth: 1,
    borderColor: border,
    paddingHorizontal: icon != undefined ? 5 : 12,
    flexDirection: 'row',
    textAlignVertical: 'top',
    alignItems: 'center',
    height: height,
    backgroundColor: backgroundColor == undefined ? '#E6ECF6' : backgroundColor,
  }),
  wrapperTop: (border, isReadOnly, height, icon, backgroundColor) => ({
    borderRadius: 19,
    borderWidth: 1,
    borderColor: border,
    paddingHorizontal: icon != undefined ? 7 : 12,
    flexDirection: 'row',
    textAlignVertical: 'top',
    alignItems: 'flex-start',
    height: height,
    backgroundColor: backgroundColor == undefined ? '#E6ECF6' : backgroundColor,
  }),
  wrapperPicker: (height) => ({
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6ECF6',
    paddingHorizontal: 12,
    flexDirection: 'row',
    textAlignVertical: 'top',
    alignItems: 'center',
    height: height,
    backgroundColor: '#E6ECF6',
  }),
  input: (height, isReadOnly, icon, multiline) => ({
    flex: 1,
    height: height ? height : 50,
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: multiline == undefined ? 0 : 5,
    color: colorApp.inputText,
    marginLeft: Platform.OS === 'android' ? (icon == undefined ? 0 : 6) : 0,
    fontFamily: fontsCustom.primary[400],
  }),
  borderInInput: (backgroundColor) => ({
    borderRadius: Platform.OS == 'android' ? 19 : 30,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    alignItems: 'center',
    padding: 10,
    backgroundColor: backgroundColor !== undefined ? backgroundColor : null,
  }),
  input2: {
    alignItems: 'flex-start',
  },
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
    backgroundColor: colorApp.input,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorApp.input,
  },
  select2new: {
    backgroundColor: colorApp.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorApp.primary,
  },
  down: {
    width: 24,
    height: 24,
  },
  position: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    marginTop: 15,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
});
