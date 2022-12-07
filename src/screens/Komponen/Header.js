import { View, TouchableOpacity, StatusBar, StyleSheet, Text, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { colorApp } from '../../util/globalvar';

export const Header = ({ Title, back, action = null }) => {
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
          style={[
            style.textTitle,
            {
              fontWeight:'700',
              marginStart: 16,
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
      >
        {action === null ? (
          <></>
        ) : (
          <TouchableOpacity onPress={action} style={style.buttonRiwayat}>
            <Text
              style={[
                style.textTitle,
                {
                  fontWeight:'700',
                  fontSize: 14,
                  textAlign: 'center',
                },
              ]}
            >
              Riwayat
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    fontWeight: '400',
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
