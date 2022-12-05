import React from 'react';
import { View, SafeAreaView, Dimensions } from 'react-native';
import Button from '../Button';
const height = Dimensions.get('window').height;

const HeaderDetail = ({ onPress, icon, type, background }) => {
  return (
    <>
      <SafeAreaView>
        <View
          style={{
            backgroundColor: background,
            paddingTop: height / 12,
            paddingHorizontal: 16,
          }}
        >
          {icon != undefined && <Button type={type} icon={icon} onPress={onPress} />}
        </View>
      </SafeAreaView>
    </>
  );
};

export default HeaderDetail;
