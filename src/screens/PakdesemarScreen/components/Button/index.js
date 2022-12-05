import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import IconOnly from './iconOnly';
const Button = ({
  title,
  fontSize,
  type,
  width,
  height,
  onPress,
  background,
  color,
  borderColor,
  icon,
}) => {
  if (type === 'icon-only') {
    return <IconOnly icon={icon} onPress={onPress} />;
  }

  if (type === 'approve') {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.containerApprove(background)}
        onPress={onPress}
      >
        <Text style={styles.titleApprove(color, fontSize)}>{title}</Text>
      </TouchableOpacity>
    );
  }

  if (type === 'custom') {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.containerCustom(width, height, background, borderColor)}
        onPress={onPress}
      >
        <Text style={styles.titleApprove(color, fontSize)}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.container(type, width, height)}
      onPress={onPress}
    >
      <Text style={styles.title(type, fontSize)}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: (type, width, height) => ({
    backgroundColor:
      type === 'primary'
        ? colorApp.button.primary
        : type === 'secondary'
          ? colorApp.button.secondary
          : null,
    borderRadius: 19,
    borderWidth: 1,
    borderColor:
      type === 'primary'
        ? colorApp.button.primary
        : type === 'secondary'
          ? colorApp.button.secondary
          : null,
    justifyContent: 'center',
    width: width ? width : '100%',
    height: height ? height : 59,
  }),
  title: (type, fontSize) => ({
    fontSize: fontSize == undefined ? 14 : fontSize,
    textAlign: 'center',
    color: colorApp.primary,
    fontFamily: fontsCustom.primary[700],
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  }),
  containerApprove: (background) => ({
    backgroundColor: background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: background,
    justifyContent: 'center',
    width: '100%',
    height: 40,
  }),
  titleApprove: (color, fontSize) => ({
    fontSize: fontSize == undefined ? 14 : fontSize,
    paddingVertical: 8,
    textAlign: 'center',
    color: color,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  }),
  containerCustom: (width, height, background, borderColor) => ({
    backgroundColor: background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: borderColor ? borderColor : background,
    justifyContent: 'center',
    width: width ? width : '100%',
    height: height ? height : 52,
  }),
});
