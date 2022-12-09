import react, { useEffect, useState,useCallback } from 'react';
import {
  View,
  Alert,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  ScrollView,
  InteractionManager,
  Linking
} from 'react-native';
import { Button, CustomModal, Gap, HeaderPrimary, Input } from './PakdesemarScreen/components';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { storeUsername, storePassword, loginProcess } from '../statemanager/LoginState/LoginSlicer';
import { SessionManager } from '../util/SessionUtil/SessionManager';
import { colorApp, fontsCustom, stringApp } from '../util/globalvar';
import { BackgroundLocationServices } from '../util/BackgroundLocationServices';
import { stylesheet } from './PakdesemarScreen/assets';
import { MessageUtil } from '../util/MessageUtil';
import { useFocusEffect } from '@react-navigation/native';

const { height: ViewPortHeight, width: ViewPortWidth } = Dimensions.get('window');

export default function Login({ navigation, route }) {
  const dispatch = useDispatch();
  const [userName, setUsername] = useState('');
  const [passWord, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const supportedURL = "https://register.nexa.net.id/bapenda/";

  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      setLoading(true);
      sessionCheck();
    });
    return()=> task.cancel();
  },[]));

  const openUrlRegister = async () => {
    await Linking.openURL(supportedURL);
  }

  const sessionCheck = () => {
    setFirst(true);
    var data = SessionManager.GetAsObject(stringApp.session);
    if (data !== null) {
      BackgroundLocationServices.startBackgroundServices();
      navigation.navigate('BerandaMitra');
      setFirst(false);
      setLoading(false);
    } else {
      setFirst(false);
      setLoading(false);
    }
  };

  const loginResponse = async () => {
    if(userName.length === 0 && passWord.length === 0){
      MessageUtil.errorMessage("Username dan password kosong! mohon diisi terlebih dahulu");
      return;
    }else if(userName.length === 0 || passWord.length === 0){
      MessageUtil.errorMessage("Username atau password masih kosong! mohon diisi terlebih dahulu");

      return;
    }
    dispatch(storeUsername(userName));
    dispatch(storePassword(passWord));
    setLoading(true);

    setTimeout(() => {
      const params = {
        username: userName,
        password: passWord,
      };
      dispatch(loginProcess(params, navigation));
      setLoading(false);
      clearTimeout();
    }, 6000);
  };
  const resetPassword = () => {
    Alert.alert('Hebat!', 'No Action!!');
  };

 
  return (
    <View style={style.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={true}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            colors={[colorApp.gradientSatu, colorApp.gradientDua]}
            start={{ x: -1, y: 0 }}
            end={{ x: 1, y: -1 }}
            style={style.inner}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                }}
              >
                <Gap height={40} />
                <HeaderPrimary rute="Mitra" />
                <View style={[stylesheet.content]}>
                  <View style={{ height: ViewPortHeight / 5 }} />
                  <Input
                    label="Username"
                    placeholder={"Username"}
                    icon="user"
                    type="label"
                    onChangeText={(val) => setUsername(val)}
                    borderColor={colorApp.primary}
                    backgroundColor={colorApp.primary}
                    backgroundColorInInput={colorApp.button.primary}
                  />
                  <Gap height={30} />
                  <Input
                    label="Password"
                    placeholder={"Password"}
                    type="label"
                    keyboardType="password"
                    onChangeText={(val) => setPassword(val)}
                    isSecure={isSecure}
                  
                    onPress={() => setIsSecure(!isSecure)}
                    borderColor={colorApp.primary}
                    backgroundColor={colorApp.primary}
                    backgroundColorInInput={colorApp.button.primary}
                  />
                  <Gap height={20} />
                  <View style={{ flexDirection: 'row', justifyContent:'flex-end' }}>
                   
                    <Button
                      height={35}
                      title="MASUK"
                      type="primary"
                      width="30%"
                      onPress={() => loginResponse()}
                    />
                  </View>
                  <Gap height={40} />
                </View>
                <View style={{
                  flexDirection:'row',
                  justifyContent:'center',
                  alignSelf:'center',
                }}>
                  <Text style={{
                      color: colorApp.black,
                      fontFamily: fontsCustom.primary[400],
                      fontSize: 12,
                  }}>Belum Memiliki Akun ? </Text>
                  <TouchableOpacity 
                  onPress={()=>{openUrlRegister()}}
                  style={{
                    padding:0,
                    
                    flexDirection:'column',
                    justifyContent:'flex-end',
                    paddingBottom:1,
                  }}>
                    <Text style={{
                      color: colorApp.button.primary, fontSize: 12, 
                    }}>Daftar Disini!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <CustomModal loading={loading} message={'Loading'} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  styleInput: {
    textAlign: 'center',
    marginStart: 8,
    marginEnd: 8,
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
  },
  textInputContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'space-around',
    backgroundColor: 'red',
    borderRadius: 8,
    marginTop: 16,
    marginEnd: 24,
    marginStart: 24,
  },
  buttonLogin: {
    marginEnd: 24,
    padding: 8,
    marginStart: 24,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
  },
  textLogin: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
  },
});
