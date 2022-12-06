import React, { useState, useEffect, useCallback } from 'react';
import {
  TouchableOpacity,
  Dimensions,
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  InteractionManager,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Image } from '@rneui/themed';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import { colorApp, menuMain, stringApp } from '../../util/globalvar';
import { MainMenu } from '../ListScreen/MainMenu';
import { Api } from '../../util/ApiManager';
import { SessionManager } from '../../util/SessionUtil/SessionManager';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const { width: viewWidth, height: viewHeight } = Dimensions.get('window');

export default function Beranda({ navigation, route }) {
  const [userView, setUserView] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const backHome = BackHandler.addEventListener('hardwareBackPress', backHandler);
      const task = InteractionManager.runAfterInteractions(() => {
        getUser();
      });
      return () => {
        task.cancel();
        backHome.remove();
      };
    }, [backHandler])
  );

  const backHandler = () => {
    if (navigation.isFocused()) {
      navigation.navigate('Home');
      return true;
    }
    return false;
  };

  const getUser = async () => {
    var data = SessionManager.GetAsObject(stringApp.session);
    const param = {
      id_user: data.id,
    };
    await Api.post('/User/view_user_by_id', param)
      .then((res) => {
        var body = res.data;
        var response = res.data.response;
        var status = res.data.metadata.status;
        var message = res.data.metadata.message;
        if (status === 200) {
          setUserView(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginStart: 28,

            alignItems: 'center',
            flex: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Home');
            }}
          >
            <Icon name="arrowleft" size={24} color={'black'} />
          </TouchableOpacity>
          <Text
            style={{
              marginStart: 30,
              fontSize: 22,
              fontWeight: '700',
              color: 'black',
            }}
          >
            Menu Mitra
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Notification');
          }}
          style={{
            justifyContent: 'center',
            flexDirection: 'column',
            height: 30,
            marginEnd: 30,
            width: 30,
            alignSelf: 'flex-end',
            backgroundColor: 'white',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../../assets/images/ic_bell.png')}
            style={{
              width: 20,
              height: 20,
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          borderTopStartRadius: 45,
          borderTopEndRadius: 45,
          backgroundColor: 'white',
          marginTop: 20,
        }}
      >
        <View
          style={{
            borderTopStartRadius: 45,
            borderTopEndRadius: 45,
            backgroundColor: 'white',
            height: 65,
          }}
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{
            flexGrow: 1,
          }}
        >
          <Image
            source={require('../../../assets/images/illustration_mitra.png')}
            style={{
              height: 250,
              marginStart: viewWidth / 10,
            }}
            resizeMode={'contain'}
            containerStyle={{
              height: 250,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          />
          <Text
            style={{
              color: 'black',
              marginStart: 14,
              fontSize: 14,
              marginTop: 14,
              marginBottom: 16,
            }}
          >
            Pilih fitur yang ingin kamu gunakan
          </Text>
          {menuMain.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(item.nextPage);
                }}
                style={{
                  marginEnd: 24,
                  marginStart: 24,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingStart: 32,
                  backgroundColor: '#F2F2F2',
                  height: 46,
                  borderRadius: 20,
                  marginBottom: 16,
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    height: 25,
                    width: 25,
                  }}
                  resizeMode={'contain'}
                  containerStyle={{
                    height: 25,
                    width: 25,
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={{
                    fontWeight: '700',
                    color: 'black',

                    fontSize: 14,
                    alignSelf: 'center',
                    marginStart: 30,
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}

          <Text
            style={{
              color: 'black',
              marginStart: 14,
              fontSize: 14,
              marginTop: 14,
              marginBottom: 16,
            }}
          >
            Menu Lainnya
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SettingScreen');
            }}
            style={{
              marginEnd: 24,
              marginStart: 24,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingStart: 32,
              backgroundColor: '#F2F2F2',
              height: 46,
              borderRadius: 20,
              marginBottom: 16,
            }}
          >
            <Image
              source={require('../../../assets/images/ic_setting.png')}
              style={{
                height: 25,
                width: 25,
              }}
              resizeMode={'contain'}
              containerStyle={{
                height: 25,
                width: 25,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                fontWeight: '700',
                fontSize: 14,
                color: 'black',
                alignSelf: 'center',
                marginStart: 30,
              }}
            >
              Pengaturan
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: Platform.OS === 'ios' ? 150 : 140,
  },
  heading: {
    flex: 1,
    flexDirection: 'row',
  },
  textTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: '400',
  },
});
