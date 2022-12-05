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
  StatusBar
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

const { width: viewWidth, height: viewHeight } = Dimensions.get('window');

export default function Beranda({ navigation, route }) {
  const [userView, setUserView] = useState([]);

useFocusEffect(useCallback(()=>{
  const task = InteractionManager.runAfterInteractions(()=>{
    getUser();
  });
  return()=> task.cancel();
},[]));

  const menuItem = useCallback(({ item }) => {
    return (
      <MainMenu
        item={item}
        action={() => {
          navigation.navigate(item.nextPage);
        }}
      />
    );
  });

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
      colors={[colorApp.gradientSatu, colorApp.gradientSatu,]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style.container}
    >
      <View style={{
        flexDirection:'row',
        justifyContent:'space-around'
      }}>
        <View style={{
           flexDirection:'row',
           width:'20%',
           justifyContent:'flex-start'
        }}>
          <TouchableOpacity>
          <Icon name="arrowleft" size={24} color={'black'} />
          </TouchableOpacity>
          <Text>Menu Mitra</Text>
        </View>
        
      </View>
    
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop:94,
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
