import { View, TouchableOpacity, StatusBar, StyleSheet, Text, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { colorApp,fontsCustom } from '../../util/globalvar';

export const HeaderWithoutHistory = ({ Title, back }) => {
  return (
    <LinearGradient
      colors={[colorApp.gradientSatu,colorApp.gradientSatu]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style.container}
    >
      <View
        style={{
          flexDirection: 'row',
          marginStart: 16,
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
              fontFamily: fontsCustom.primary[700],
            },
          ]}
        >
          {Title}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}
      ></View>
    </LinearGradient>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop:Platform.OS === "ios" ? 28 : 0,
    height: Platform.OS === "ios" ? StatusBar.currentHeight+100 :StatusBar.currentHeight + 30,
  },
  textTitle: {
    fontSize: 20,
    color: 'white',
    fontFamily:fontsCustom.primary[700],
    width:250,
  },
  buttonRiwayat: {
    borderRadius: 8,
    height: StatusBar.currentHeight,
    width: Platform.OS === "ios" ?  115 : 125,
    marginEnd: 16,
    padding: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'white',
    justifyContent: 'center',
  },
});
