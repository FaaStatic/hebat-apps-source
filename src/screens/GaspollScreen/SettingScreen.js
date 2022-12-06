import React, { useEffect, useState } from 'react';
import { BottomSheet, Image } from '@rneui/themed';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/dist/Entypo';
import GapList from '../Komponen/GapList';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Header } from '../Komponen/Header';
import { SessionManager } from '../../util/SessionUtil/SessionManager';
import { colorApp, stringApp } from '../../util/globalvar';
import { Api } from '../../util/ApiManager';
import { BackgroundLocationServices } from '../../util/BackgroundLocationServices';
import { PermissionUtil } from '../../util/PermissionUtil';
import { MessageUtil } from '../../util/MessageUtil';

const SettingScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState([]);
  const [openBottom1, setOpenBottom1] = useState(false);
  const [openBottom2, setOpenBottom2] = useState(false);
  const [openBottom3, setOpenBottom3] = useState(false);
  const [openBottom4, setOpenBottom4] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [nama, setNama] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [oldPw, setOldPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [secure3, setSecure3] = useState(true);

  useEffect(() => {
    console.log('====================================');
    console.log(userData);
    console.log('====================================');
    const unsubscribe = navigation.addListener('focus', () => {
      sesi();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const changeName = async () => {
    setOpenBottom1(false);
    var session = SessionManager.GetAsObject(stringApp.session);
    setLoadingScreen(true);
    const params = {
      id_user: session.id,
      nama: nama,
      kontak: userData.no_telp,
    };
    await Api.post('User/prosess_user', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        if (status === 200) {
          sesi();
          MessageUtil.successMessage(message);
          setLoadingScreen(false);
        } else {
          sesi();
          MessageUtil.errorMessage(message);
          setLoadingScreen(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        setLoadingScreen(false);
      });
  };

  const changeKontak = async () => {
    setOpenBottom2(false);

    var session = SessionManager.GetAsObject(stringApp.session);
    setLoadingScreen(true);
    const params = {
      id_user: session.id,
      nama: userData.nama,
      kontak: noTelp,
    };
    await Api.post('User/prosess_user', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        if (status === 200) {
          sesi();
          MessageUtil.successMessage(message);
          setLoadingScreen(false);
        } else {
          sesi();
          MessageUtil.errorMessage(message);
          setLoadingScreen(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        setLoadingScreen(false);
      });
  };

  const changePass = async () => {
    setOpenBottom3(false);

    if (newPw !== confirmPw) {
      MessageUtil.errorMessage('Konfirmasi kata sandi salah mohon di cek kembali!');
      return;
    }
    var session = SessionManager.GetAsObject(stringApp.session);
    setLoadingScreen(true);
    const params = {
      id_user: session.id,
      password_lama: oldPw,
      password_baru: newPw,
    };
    await Api.post('Authentication/update_password', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        if (status === 200) {
          sesi();
          MessageUtil.successMessage(message);
          setLoadingScreen(false);
        } else {
          sesi();
          MessageUtil.errorMessage(message);
          setLoadingScreen(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        setLoadingScreen(false);
      });
  };

  const changeFromCamera = async () => {
    const permissionCamera = await PermissionUtil.requestCameraPermission();
    let options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      cameraType: 'back',
      includeBase64: true,
      quality: 0.7,
      storageOptions: {
        skipBackup: true,
        path: 'Pictures',
      },
      saveToPhotos: true,
    };
    if (permissionCamera === true) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('Canceled By User');
        } else {
          changePic(response.assets[0].base64);
        }
      });
    }
  };

  const changeFromGallery = async () => {
    const permissionStorage = await PermissionUtil.requestExternalWritePermission();
    let options = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.7,
      storageOptions: {
        skipBackup: true,
        path: 'Pictures',
      },
    };
    if (permissionStorage === true) {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('Canceled By User');
        } else {
          console.log('====================================');
          console.log(response.assets);
          console.log('====================================');
          changePic(response.assets[0].base64);
        }
      });
    }
  };

  const changePic = async (base64) => {
    setOpenBottom4(false);
    setLoadingScreen(true);
    var session = SessionManager.GetAsObject(stringApp.session);
    const params = { id_user: session.id, foto: base64 };

    await Api.post('User/update_gambar_user', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        if (status === 200) {
          sesi();
          MessageUtil.successMessage(message);
          setLoadingScreen(false);
        } else {
          sesi();
          MessageUtil.warningMessage(message);
          setLoadingScreen(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const Logout = () => {
    SessionManager.ClearAllKeys();
    BackgroundLocationServices.stopBackroundServices();
    navigation.replace('Home');
  };

  const sesi = async () => {
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
          setUserData(response);
          setNama(response.nama);
          setNoTelp(response.no_telp);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <Header
        Title={'Setelan Akun'}
        back={() => {
          navigation.goBack();
        }}
      />

      {loadingScreen ? (
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator
            size={'large'}
            color={colorApp.button.primary}
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
      ) : (
        <View>
          <View
            style={{
              alignSelf: 'center',
              width: 200,
              marginTop: 8,
              marginBottom: 8,
              height: 200,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Image
              placeholderStyle={{
                width: 175,
                height: 175,
                backgroundColor: 'white',
              }}
              PlaceholderContent={
                <ActivityIndicator
                  size={'large'}
                  color={colorApp.button.secondary}
                  style={{
                    alignSelf: 'center',
                  }}
                />
              }
              resizeMode={'cover'}
              containerStyle={{
                width: 175,
                height: 175,
                alignSelf: 'center',
                backgroundColor: 'grey',
                justifyContent: 'center',
                borderRadius: 175 / 2,
              }}
              source={{ uri: userData.foto_profil }}
            />
            <TouchableOpacity
              onPress={() => {
                setOpenBottom4(true);
              }}
              style={{
                height: 50,
                width: 50,
                borderRadius: 75 / 2,
                backgroundColor: 'blue',
                position: 'absolute',
                bottom: 0,
                right: 0,
                marginBottom: 16,
                justifyContent: 'center',
                flexDirection: 'column',
                marginEnd: 16,
              }}
            >
              <Icon
                name="camera"
                size={18}
                color={'white'}
                style={{
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          <GapList />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginEnd: 8,
              marginTop: 16,
              marginBottom: 16,
              marginStart: 8,
            }}
          >
            <Icon
              name="user"
              size={28}
              color={'black'}
              style={{
                alignSelf: 'center',
              }}
            />

            <View
              style={{
                flexDirection: 'column',
                paddingStart: 16,
                flex: 1,
              }}
            >
              <Text
                style={[
                  style.textTitle,
                  {
                    fontSize: 18,
                    fontWeight: '600',
                  },
                ]}
              >
                Nama
              </Text>
              <Text
                style={[
                  style.textTitle,
                  {
                    fontSize: 16,
                    fontWeight: '400',
                  },
                ]}
              >
                {userData.nama}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setOpenBottom1(true);
              }}
            >
              <Icon
                name="pencil"
                size={28}
                color={'black'}
                style={{
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginEnd: 8,
              marginTop: 16,
              marginBottom: 16,
              marginStart: 8,
            }}
          >
            <Icon
              name="old-phone"
              size={28}
              color={'black'}
              style={{
                alignSelf: 'center',
              }}
            />

            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                paddingStart: 16,
              }}
            >
              <Text
                style={[
                  style.textTitle,
                  {
                    fontSize: 18,
                    fontWeight: '600',
                  },
                ]}
              >
                Kontak
              </Text>
              <Text
                style={[
                  style.textTitle,
                  {
                    fontSize: 16,
                    fontWeight: '400',
                  },
                ]}
              >
                {userData.no_telp}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setOpenBottom2(true);
              }}
            >
              <Icon
                name="pencil"
                size={28}
                color={'black'}
                style={{
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginEnd: 8,
              marginTop: 16,
              marginBottom: 16,
              marginStart: 8,
            }}
          >
            <Icon
              name="key"
              size={28}
              color={'black'}
              style={{
                alignSelf: 'center',
              }}
            />

            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                paddingStart: 16,
              }}
            >
              <Text
                style={[
                  style.textTitle,
                  {
                    fontSize: 18,
                    fontWeight: '600',
                  },
                ]}
              >
                Kata Sandi
              </Text>
              <Text
                style={[
                  style.textTitle,
                  {
                    fontSize: 16,
                    fontWeight: '400',
                  },
                ]}
              >
                .....
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setOpenBottom3(true);
              }}
            >
              <Icon
                name="pencil"
                size={28}
                color={'black'}
                style={{
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          <GapList />
          <TouchableOpacity
            onPress={() => {
              Logout();
            }}
            style={{
              marginTop: 16,
              padding: 8,
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
          >
            <Icon
              name="log-out"
              size={28}
              color={'black'}
              style={{
                alignSelf: 'flex-start',
                marginEnd: 8,
              }}
            />
            <Text
              style={[
                style.textTitle,
                {
                  fontWeight: '600',
                  alignSelf: 'center',
                },
              ]}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <BottomSheet
        isVisible={openBottom4}
        onBackdropPress={() => {
          setOpenBottom4(false);
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              changeFromCamera();
            }}
            style={{
              backgroundColor: '#fb9c3e',
              marginBottom: 16,
              height: 55,
              justifyContent: 'center',
              flexDirection: 'column',
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              Ambil Kamera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              changeFromGallery();
            }}
            style={{
              backgroundColor: '#669beb',
              marginBottom: 16,
              height: 55,
              justifyContent: 'center',
              flexDirection: 'column',
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              Galeri
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <BottomSheet
        isVisible={openBottom1}
        onBackdropPress={() => {
          setOpenBottom1(false);
        }}
      >
        <View
          style={{
            borderTopStartRadius: 16,
            borderTopEndRadius: 16,
            flexDirection: 'column',
            backgroundColor: 'white',
            justifyContent: 'space-around',
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              color: 'black',
            }}
          >
            Masukan Nama Anda
          </Text>
          <TextInput
            underlineColorAndroid={'black'}
            value={nama}
            onChangeText={(txt) => {
              setNama(txt);
            }}
            style={{
              borderRadius: 8,
              marginBottom: 8,
              fontSize: 14,
              color: 'black',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setOpenBottom1(false);
              }}
              style={{
                padding: 8,
                marginEnd: 16,
              }}
            >
              <Text
                textAlign={'center'}
                style={{
                  fontSize: 14,
                  color: 'black',
                }}
              >
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                changeName();
              }}
              style={{
                padding: 8,
                marginEnd: 16,
              }}
            >
              <Text
                textAlign={'center'}
                style={{
                  fontSize: 14,
                  color: '#FC572C',
                }}
              >
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
      <BottomSheet
        isVisible={openBottom2}
        onBackdropPress={() => {
          setOpenBottom2(false);
        }}
      >
        <View
          style={{
            borderTopStartRadius: 16,
            borderTopEndRadius: 16,
            flexDirection: 'column',
            backgroundColor: 'white',
            justifyContent: 'space-around',
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              color: 'black',
            }}
          >
            Masukan Kontak Anda
          </Text>
          <TextInput
            underlineColorAndroid={'black'}
            value={noTelp}
            onChangeText={(txt) => {
              setNoTelp(txt);
            }}
            style={{
              borderRadius: 8,
              marginBottom: 8,
              fontSize: 14,
              color: 'black',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setOpenBottom2(false);
              }}
              style={{
                padding: 8,
                marginEnd: 16,
              }}
            >
              <Text
                textAlign={'center'}
                style={{
                  fontSize: 14,
                  color: 'black',
                }}
              >
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                changeKontak();
              }}
              style={{
                padding: 8,
                marginEnd: 16,
              }}
            >
              <Text
                textAlign={'center'}
                style={{
                  fontSize: 14,
                  color: '#FC572C',
                }}
              >
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
      <BottomSheet
        isVisible={openBottom3}
        onBackdropPress={() => {
          setOpenBottom3(false);
        }}
      >
        <View
          style={{
            borderTopStartRadius: 16,
            borderTopEndRadius: 16,
            flexDirection: 'column',
            backgroundColor: 'white',
            justifyContent: 'space-around',
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              color: 'black',
            }}
          >
            Masukan Kata Sandi Lama
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <TextInput
              value={oldPw}
              onChangeText={(txt) => {
                setOldPw(txt);
              }}
              underlineColorAndroid={'black'}
              secureTextEntry={secure1}
              style={{
                borderRadius: 8,
                marginBottom: 8,
                flex: 1,
                fontSize: 14,
                color: 'black',
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setSecure1(!secure1);
              }}
              style={{
                marginStart: 16,
                marginEnd: 16,
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Icon name={secure1 ? 'eye-with-line' : 'eye'} size={20} color={'black'} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              color: 'black',
            }}
          >
            Masukan Kata Sandi Baru
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <TextInput
              value={newPw}
              onChangeText={(txt) => {
                setNewPw(txt);
              }}
              secureTextEntry={secure2}
              underlineColorAndroid={'black'}
              style={{
                borderRadius: 8,
                marginBottom: 8,
                flex: 1,
                fontSize: 14,
                color: 'black',
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setSecure2(!secure2);
              }}
              style={{
                marginStart: 16,
                marginEnd: 16,
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Icon name={secure2 ? 'eye-with-line' : 'eye'} size={20} color={'black'} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              color: 'black',
            }}
          >
            Masukan Konfirmasi Kata Sandi Baru
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <TextInput
              value={confirmPw}
              onChangeText={(txt) => {
                setConfirmPw(txt);
              }}
              secureTextEntry={secure3}
              underlineColorAndroid={'black'}
              style={{
                borderRadius: 8,
                marginBottom: 8,
                flex: 1,
                fontSize: 14,
                color: 'black',
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setSecure3(!secure3);
              }}
              style={{
                marginStart: 16,
                marginEnd: 16,
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Icon name={secure3 ? 'eye-with-line' : 'eye'} size={20} color={'black'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setOpenBottom3(false);
              }}
              style={{
                padding: 8,
                marginEnd: 16,
              }}
            >
              <Text
                textAlign={'center'}
                style={{
                  fontSize: 14,
                  color: 'black',
                }}
              >
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                changePass();
              }}
              style={{
                padding: 8,
                marginEnd: 16,
              }}
            >
              <Text
                textAlign={'center'}
                style={{
                  fontSize: 14,
                  color: '#FC572C',
                }}
              >
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const style = StyleSheet.create({
  textTitle: {
    fontSize: 16,
    color: 'black',
  },
});

export default SettingScreen;
