import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { colorApp } from '../../../../util/globalvar';
import TabItem from './TabItem';
const BottomNavigation = ({ state, descriptors, navigation, onActive }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: route.name,
                  params: { name: route.name },
                },
              ],
            });
          }
        };

        return (
          <TabItem
            key={index}
            title={label}
            active={isFocused}
            onPress={onPress}
            onRead={onActive}
          />
        );
      })}
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: colorApp.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: Platform.OS === 'android' ? 0.4 : 0,
    shadowRadius: 0,
    elevation: 6,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
});
