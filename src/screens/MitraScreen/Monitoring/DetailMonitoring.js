import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  StatusBar,
  FlatList,
  Dimensions,
  ActivityIndicator,
  UIManager,
  LayoutAnimation,
  InteractionManager,
  Platform,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import { Image, CheckBox, Dialog, BottomSheet, LinearProgress } from '@rneui/themed';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Header } from '../../Komponen/Header';
import { colorApp, fontsCustom, menuMain, stringApp } from '../../../util/globalvar';
import Geolocation from 'react-native-geolocation-service';
import { PermissionUtil } from '../../../util/PermissionUtil';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import SignatureScreen from 'react-native-signature-canvas';
import { MessageUtil } from '../../../util/MessageUtil';
import { Api, urlBapenda } from '../../../util/ApiManager';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import RNFetchBlob from 'rn-fetch-blob';
import { useFocusEffect } from '@react-navigation/native';

const { width: viewWidth, height: viewHeight } = Dimensions.get('window');
const MIN_HEIGHT_HEADER = StatusBar.currentHeight + 30;
const MAX_HEIGHT_HEADER = 250;
const DISTANCE = MAX_HEIGHT_HEADER - MIN_HEIGHT_HEADER;
var latitude = -6.966667;
var longitude = 110.416664;
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;

const DetailMonitoring = ({ navigation, route }) => {
  const { modelData, status } = route.params;
  const fs = RNFetchBlob.fs;
  const [positionY, setPositionY] = useState(0);
  const [mapState, setMapState] = useState({
    latitude: Number(modelData.latitude),
    longitude: Number(modelData.longitude),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [ttd, setTtd] = useState('');
  const [savingFileData, setSavingFileData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [pendingCheck, setPendingCheck] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDownload, setDialogDownload] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [deskripsi, setDeskripsi] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const mapsLayout = useRef();
  const signatureRef = useRef();
  const [ttdYa, setTtdYa] = useState(false);
  const [ttdTidak, setTtdTidak] = useState(false);
  const [ttdKet, setTtdKet] = useState('');
  const [openBottom, setOpenBottom] = useState(false);
  const [openBottom1, setOpenBottom1] = useState(false);

  const headerHeight = scrollPosition.interpolate({
    inputRange: [0, DISTANCE - 100],
    outputRange: [MAX_HEIGHT_HEADER, MIN_HEIGHT_HEADER],
    extrapolate: 'clamp',
  });

  const opacityScroll = scrollPosition.interpolate({
    inputRange: [0, 100, DISTANCE - 50],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const imageHeight = scrollPosition.interpolate({
    inputRange: [0, DISTANCE - 100],
    outputRange: [MAX_HEIGHT_HEADER, MIN_HEIGHT_HEADER],
    extrapolateLeft: 'identity',
    extrapolateRight: 'clamp',
  });

  useFocusEffect(
    useCallback(() => {
      if (status === null) {
        getLocation();
      }
      const task = InteractionManager.runAfterInteractions(() => {
        clearData();
        if (status === null) {
          getLocation();
        }
        addData();
      });
      return () => task.cancel();
    }, [])
  );

  const addData = () => {
    console.log('yuhu : ', modelData);
    if (status !== null) {
      setDeskripsi(modelData.hasil_monitor);
      if (modelData.monitoring_image.length > 0) {
        modelData.monitoring_image.map((item) => {
          RNFetchBlob.config({
            fileCache: true,
          })
            .fetch('GET', item.path) // the file is now downloaded at local storage
            .then((resp) => {
              imagePath = resp.path(); // to get the file path
              return resp.readFile('base64'); // to get the base64 string
            })
            .then((base64) => {
              setSavingFileData((current) => [...current, base64]);

              return fs.unlink(item.path); // to remove the file from local storage
            });
          var params = {
            id: item.id,
            image: item.path,
          };
          setFileList((current) => [...current, item]);
        });
      }
    }
    if (modelData.image.length > 0) {
      setFileList(modelData.image);
      modelData.monitoring_image.map((item) => {
        setSavingFileData((current) => [...current, item.image]);
      });
    }
    setMapState({
      latitude: Number(modelData.latitude),
      longitude: Number(modelData.longitude),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const getLocation = async () => {
    var permissionStat = await PermissionUtil.accessLocation();
    if (permissionStat === true) {
      Geolocation.getCurrentPosition(
        async (pos) => {
          const datapos = pos.coords;
          latitude = datapos.latitude;
          longitude = datapos.longitude;
          var params = {
            latitude: datapos.latitude,
            longitude: datapos.longitude,
            latitudeDelta: limitlatitudeDelta,
            longitudeDelta: limitLongitudeDelta,
          };
          setMapState(params);
        },
        (err) => {
          console.log(err.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log('====================================');
      console.log(permissionStat);
      console.log('====================================');
    }
  };

  const clearData = () => {
    setSavingFileData([]);
    setFileList([]);
    latitude = -6.966667;
    longitude = 110.416664;
    setMapState({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: limitlatitudeDelta,
      longitudeDelta: limitLongitudeDelta,
    });
  };

  const saveData = async () => {
    const params = {
      id_monitor: modelData.id_monitor,
      deskripsi: deskripsi,
      lat: mapState.latitude,
      long: mapState.longitude,
      ttd: ttd,
      pending: pendingStatus,
      foto: savingFileData,
    };

    await Api.post('Monitoring/monitoring_merchant', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var status = body.metadata.status;
        var message = body.metadata.message;
        if (status === 200) {
          MessageUtil.successMessage(message);
          setTimeout(() => {
            navigation.goBack();
            clearTimeout();
          }, 1000);
        } else {
          MessageUtil.errorMessage(message);
        }
      })
      .catch((err) => {
        MessageUtil.errorMessage(err);
      });
  };

  const pickImage = async () => {
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
    let cameraPermission = await PermissionUtil.requestCameraPermission();
    let saveStorage = await PermissionUtil.requestExternalWritePermission();
    if (cameraPermission && saveStorage) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('Canceled By User');
        } else {
          var number = Math.floor(Math.random() * 100) + 1;
          var item = [
            {
              id: number,
              image: response.assets[0].base64,
            },
          ];
          setFileList(fileList.concat(item));
          setSavingFileData((current) => [...current, response.assets[0].base64]);
          console.log('====================================');
          console.log(savingFileData);
          console.log('====================================');
          console.log(fileList);
        }
      });
    }
  };

  const pickGalery = async () => {
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
    let cameraPermission = await PermissionUtil.requestCameraPermission();
    let saveStorage = await PermissionUtil.requestExternalWritePermission();
    if (cameraPermission && saveStorage) {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('Canceled By User');
        } else {
          var number = Math.floor(Math.random() * 100) + 1;
          var item = [
            {
              id: number,
              image: response.assets[0].base64,
            },
          ];
          if (fileList.length > 0) {
            setFileList(fileList.concat(item));
            setSavingFileData((current) => [...current, response.assets[0].base64]);
          } else {
            setFileList(item);
            setSavingFileData((current) => [...current, response.assets[0].base64]);
          }

          console.log('====================================');
          console.log(savingFileData);
          console.log('====================================');
          console.log(fileList);
        }
      });
    }
  };

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const removeItem = (value) => {
    let arr = fileList.filter((item) => {
      return item.id !== value.id;
    });
    var idx = 0;
    savingFileData.filter((element, index) => {
      if (element === value.image) {
        idx = index;
      }
    });
    let arrImage = savingFileData.splice(idx, 1);
    setSavingFileData(arrImage);
    setFileList(arr);
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const layoutAnimConfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const handleOK = (signature) => {
    var data = signature.replace('data:image/png;base64,', '');
    setTtd(data);
  };
  const clearSignature = () => {
    signatureRef.current.clearSignature();
  };

  const saveMonitoring = () => {
    signatureRef.current.readSignature();
    if (pendingCheck) {
      setPendingStatus('1');
    } else {
      setPendingStatus('0');
    }
    setTimeout(() => {
      if (deskripsi.length === 0 || ttd.length === 0) {
        setModalConfirm(false);
        MessageUtil('Mohon Isi tanda tangan dan deskripsi');
      } else {
        setModalConfirm(false);
        setDialogOpen(true);
      }
      clearTimeout();
    }, 2000);
  };

  const selectYa = () => {
    setTtdYa(true);
    setTtdTidak(false);
    setTtdKet('Ya');
  };

  const selectTidak = () => {
    setTtdYa(false);
    setTtdTidak(true);
    setTtdKet('Tidak');
  };

  const downloadFile = async () => {
    setTtdYa(false);
    setTtdTidak(false);
    setOpenBottom(false);
    setDialogDownload(true);
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const permission = await PermissionUtil.requestExternalWritePermission();
    if (permission) {
      const configOption = Platform.select({
        ios: {
          fileCache: true,
          notification: true,
          path: fs.dirs.DocumentDir + '/berita_acara_monitoring.pdf',
          appendExt: 'pdf',
        },
        android: {
          fileCache: true,
          appendExt: 'pdf',
          path: `/storage/emulated/0/Download/berita_acara_monitoring.pdf`,
          addAndroidDownloads: {
            useDownloadManager: false,
            title: `berita_acara_monitoring.pdf`,
            description: 'HEBAT! Apps Download',
            mime: 'application/pdf',
            mediaScannable: true,
            notification: true,
          },
        },
      });
      RNFetchBlob.config(configOption)
        .fetch(
          'GET',
          `${urlBapenda}api/Monitoring/pdf_berita_acara?monitoring_id=${modelData.id_monitoring}&tgl_monitor=${modelData.tgl_monitor}&petugas=${sesi.id}&ket_ttd=${ttdKet}`
        )
        .progress((received, total) => {
          var totalReceived = (received / total) * 100;
          var finalValue = Math.floor(totalReceived);
          if (finalValue < downloadProgress) {
          } else {
            setDownloadProgress(finalValue);
          }
        })
        .then(async (res) => {
          if (Platform.OS === 'ios') {
            var response = JSON.stringify(res);
            console.log(response);
            setDialogDownload(false);
            setTimeout(() => {
              RNFetchBlob.ios.openDocument(res.data);
            }, 1000);
            setTimeout(() => {
              MessageUtil.successMessage(`File Successfully Downloaded! ${configOption.path}`);
              clearTimeout();
            }, 5000);
          } else {
            setDialogDownload(false);
            RNFetchBlob.android.actionViewIntent;
            setTimeout(() => {
              MessageUtil.successMessage(`File Successfully Downloaded! ${configOption.path}`);
              clearTimeout();
            }, 5000);
          }
        })
        .catch((err) => {
          setDialogOpen(false);
          console.log('====================================');
          console.log(err);
          console.log('====================================');
          setTimeout(() => {
            MessageUtil.errorMessage(err);
            clearTimeout();
          }, 1000);
        });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <Animated.View
        style={[
          {
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: positionY >= MAX_HEIGHT_HEADER - 200 ? colorApp.gradientSatu : 'grey',
            zIndex: 999,
            height: headerHeight,
          },
        ]}
      >
        {positionY >= MAX_HEIGHT_HEADER - 200 ? (
          <Header
            Title={modelData.nama}
            back={() => {
              navigation.goBack();
            }}
          />
        ) : (
          <Animated.View
            style={{
              flexDirection: 'column',
            }}
          >
            <Animated.Image
              source={
                status === null
                  ? modelData.image.length === 0
                    ? require('../../../../assets/images/store.png')
                    : { uri: modelData.image[0].image }
                  : modelData.monitoring_image.length === 0
                  ? require('../../../../assets/images/store.png')
                  : { uri: modelData.monitoring_image[0].path }
              }
              resizeMode={'cover'}
              style={{
                height: imageHeight,
                width: '100%',
                alignSelf: 'center',
                opacity: opacityScroll,
              }}
            />
            <Animated.View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                marginStart: 16,
                marginTop: Platform.OS === 'ios' ? 35 : 8,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{ justifyContent: 'center' }}
              >
                <Icon name="arrowleft" size={24} color={'white'} />
              </TouchableOpacity>
              <Text
                style={[
                  style.textTitle,
                  {
                    marginStart: 16,
                    marginTop: 8,
                    color: 'white',
                    alignSelf: 'center',
                  },
                ]}
              >
                {modelData.nama}
              </Text>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollPosition } } }], {
          useNativeDriver: false,
          listener: (event) => {
            setPositionY(event.nativeEvent.contentOffset.y);
          },
        })}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View
          style={{
            backgroundColor: '#f5f5f5',
            flexDirection: 'column',

            justifyContent: 'space-around',
            padding: 8,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: fontsCustom.primary[700],
              color: 'black',
              marginTop: 8,
            }}
          >
            {modelData.nama}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontsCustom.primary[400],
              color: 'black',
            }}
          >
            {modelData.alamat}
          </Text>
        </View>
        {status !== null && (
          <TouchableOpacity
            onPress={() => {
              setOpenBottom(true);
            }}
            style={{
              backgroundColor: colorApp.button.primary,
              alignSelf: 'flex-end',
              borderRadius: 8,
              padding: 8,
              marginRight: 16,
              padding: 8,
              marginTop: 16,
              marginBottom: 16,
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: 'white',
                fontFamily: fontsCustom.primary[500],
                alignSelf: 'center',
              }}
            >
              Unduh Berita Acara
            </Text>
          </TouchableOpacity>
        )}
        <Text
          style={{
            fonstSize: 16,
            fontFamily: fontsCustom.primary[700],
            color: 'black',
            marginTop: 8,
            marginStart: 16,
          }}
        >
          Deskripsi
        </Text>
        <Text
          style={{
            fonstSize: 12,
            fontFamily: fontsCustom.primary[400],
            color: 'black',
            marginTop: 8,
            marginStart: 16,
          }}
        >
          Tulis Deskripsi Dibawah ini
        </Text>
        <View
          style={{
            marginEnd: 16,
            marginStart: 16,
            padding: 4,
            marginTop: 8,
            borderBottomColor: 'black',
            borderTopColor: 'black',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderEndWidth: 0,
            borderStartWidth: 0,
            marginBottom: 8,
            backgroundColor: 'white',
            borderRadius: 8,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <TextInput
            multiline={true}
            numberOfLines={15}
            textAlignVertical={'top'}
            style={{
              flex: 1,
              color: 'black',
            }}
            textAlign={'left'}
            value={deskripsi}
            onChangeText={(txt) => {
              setDeskripsi(txt);
            }}
          />
        </View>

        <View />
        <Text
          style={{
            marginBottom: 16,
            marginTop: 8,
            fontSize: 14,
            marginStart: 16,
            fontFamily: fontsCustom.primary[700],
          }}
        >
          Map
        </Text>
        <View
          style={{
            height: 250,
            marginEnd: 16,
            marginStart: 16,
            borderRadius: 8,
            overflow: 'hidden',
            flex: 1,
          }}
        >
          <MapView
            provider={MapView.PROVIDER_GOOGLE}
            ref={mapsLayout}
            style={{
              flex: 1,
            }}
            initialRegion={{
              latitude: mapState.latitude,
              longitude: mapState.longitude,
              latitudeDelta: limitlatitudeDelta,
              longitudeDelta: limitLongitudeDelta,
            }}
            region={{
              latitude: mapState.latitude,
              longitude: mapState.longitude,
              latitudeDelta: limitlatitudeDelta,
              longitudeDelta: limitLongitudeDelta,
            }}
            onRegionChangeComplete={(region) => {
              if (status === null) {
                latitude = region.latitude;
                longitude = region.longitude;
                latitudeDelta =
                  region.latitudeDelta < limitlatitudeDelta
                    ? limitlatitudeDelta
                    : region.latitudeDelta;
                longitudeDelta =
                  region.longitudeDelta < limitLongitudeDelta
                    ? limitLongitudeDelta
                    : region.longitudeDelta;

                setMapState(region);
              }
            }}
            onLayout={() => {
              mapsLayout.current.animateCamera({
                center: {
                  latitude: mapState.latitude,
                  longitude: mapState.longitude,
                },

                head: 0,
                pitch: 100,
              });
              mapsLayout.current.animateToRegion(mapState, 2500);
            }}
          >
            <Marker
              coordinate={{
                latitude: mapState.latitude,
                longitude: mapState.longitude,
              }}
              pinColor="blue"
              title="You are here"
            />
          </MapView>
          {status === null && (
            <TouchableOpacity
              onPress={() => {
                getLocation();
              }}
              style={{
                position: 'absolute',
                height: 45,
                width: 45,
                bottom: 0,
                right: 0,
                marginEnd: 16,
                marginBottom: 16,
                backgroundColor: 'white',
                borderRadius: 8,
                justifyContent: 'center',
              }}
            >
              <Icon name="my-location" size={24} color={'black'} style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            height: 55,
            marginTop: 4,
            marginEnd: 16,
            marginStart: 16,
            marginBottom: 16,
            backgroundColor: '#e1e1e1',
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}
        >
          <Text
            style={{
              marginTop: 4,
              fontSize: 12,
              color: 'black',
              fontFamily: fontsCustom.primary[700],
              alignSelf: 'center',
            }}
          >
            Latitude : {mapState.latitude.toFixed(4)}
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontSize: 12,
              color: 'black',
              fontFamily: fontsCustom.primary[700],
              alignSelf: 'center',
            }}
          >
            Longitude : {mapState.longitude.toFixed(4)}
          </Text>
        </View>
        {status === null && (
          <CheckBox
            title={'Pending'}
            checked={pendingCheck}
            style={{
              marginEnd: 8,
            }}
            onPress={() => {
              setPendingCheck(!pendingCheck);
            }}
          />
        )}
        {status === null && (
          <Text
            style={{
              fontSize: 14,
              color: 'black',
              marginStart: 16,
            }}
          >
            Monitoring belum diselesaikan dan bisa diulangi lagi
          </Text>
        )}

        <Text
          style={[
            style.textInput,
            {
              fontFamily: fontsCustom.primary[700],
              fontSize: 16,
              marginLeft: 24,
            },
          ]}
        >
          Unggah Gambar
        </Text>
        <Text
          style={[
            style.textInput,
            {
              marginBottom: 8,
              fontFamily: fontsCustom.primary[500],
              fontSize: 14,
              marginLeft: 24,
            },
          ]}
        >
          Mohon Tekan Tombol Dibawah Ini Untuk Unggah Gambar
        </Text>
        {fileList.length > 0 ? (
          <FlatList
            nestedScrollEnabled={true}
            ListHeaderComponent={() => {
              return (
                <>
                  {status === null && (
                    <TouchableOpacity
                      onPress={pickImage}
                      style={{
                        width: 150,
                        height: 150,
                        backgroundColor: '#e1e1e1',
                        justifyContent: 'center',
                        marginLeft: 16,
                      }}
                    >
                      <Icon
                        name="camera-alt"
                        size={100}
                        color={'white'}
                        style={{ alignSelf: 'center' }}
                      />
                    </TouchableOpacity>
                  )}
                </>
              );
            }}
            horizontal={true}
            style={{
              marginBottom: 16,
            }}
            data={fileList}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              var image = '';
              console.log(item.image);
              if (status !== null) {
                if (item.path.includes('https')) {
                  image = item.image;
                } else if (item.path.includes('http')) {
                  image = item.image;
                } else {
                  image = `data:image/png;base64,${item.image}`;
                }
              } else {
                if (item.image.includes('https')) {
                  image = item.image;
                } else {
                  image = `data:image/png;base64,${item.image}`;
                }
              }

              return (
                <View
                  style={{
                    backgroundColor: 'black',
                    width: 150,
                    height: 150,
                    marginLeft: 16,
                  }}
                >
                  <Image
                    source={{ uri: image }}
                    placeholderStyle={{
                      width: 150,
                      height: 150,
                      backgroundColor: 'grey',
                    }}
                    PlaceholderContent={
                      <ActivityIndicator
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    }
                    containerStyle={{
                      width: 150,
                      height: 150,
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      backgroundColor: 'grey',
                    }}
                    resizeMode={'cover'}
                  />
                  {status === null && (
                    <TouchableOpacity
                      onPress={() => {
                        removeItem(item);
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        marginTop: 4,
                        marginRight: 4,
                      }}
                    >
                      <Icon2 name="trash" size={14} color={'red'} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        ) : (
          <>
            {status === null && (
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  width: 150,
                  height: 150,
                  backgroundColor: '#e1e1e1',
                  justifyContent: 'center',
                  marginLeft: 16,
                  marginBottom: 16,
                }}
              >
                <Icon
                  name="camera-alt"
                  size={100}
                  color={'white'}
                  style={{ alignSelf: 'center' }}
                />
              </TouchableOpacity>
            )}
          </>
        )}
        {status === null && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 16,
              marginEnd: 24,
              marginStart: 24,
              borderRadius: 8,
              backgroundColor: colorApp.button.primary,
            }}
          >
            <Text
              style={{
                color: 'white',
                alignSelf: 'center',
                fontFamily: fontsCustom.primary[700],
                fontSize: 16,
              }}
            >
              Simpan Data Monitoring
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            height: 100,
            backgroundColor: 'white',
            marginTop: 16,
            marginBottom: 16,
          }}
        />
      </Animated.ScrollView>
      <Dialog
        isVisible={modalConfirm}
        onBackdropPress={() => {
          setModalConfirm(false);
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            paddingTop: 16,
            paddingBottom: 16,
            flexDirection: 'column',
            justifyContent: 'center',
            height: viewHeight / 1.8,
          }}
        >
          <Text
            numberOfLines={3}
            style={{
              alignSelf: 'center',
              marginEnd: 24,
              marginStart: 24,
              fontSize: 12,
              marginBottom: 8,
              fontFamily: fontsCustom.primary[400],
              color: 'black',
              textAlign: 'center',
            }}
          >
            Untuk melengkapi data mohon dicantumkan tanda tangan wajib pajak
          </Text>
          <SignatureScreen
            ref={signatureRef}
            onOK={handleOK}
            penColor={'black'}
            webStyle={`
            .m-signature-pad{box-shadow: none; border: none; }
            .m-signature-pad--body{border-left: none; border-right:none; border-top:1px solid black; border-bottom:1px solid black;}
            .m-signature-pad--footer{display: none; margin: 0px;}
            body,html {
              height: 220px;}`}
            descriptionText={'Tanda Tangan'}
          />
          <Text
            style={{
              alignSelf: 'center',
              color: colorApp.btnColor2,
              textAlign: 'center',
              fontSize: 16,
              marginBottom: 8,
              fontFamily: fontsCustom.primary[400],
            }}
          >
            Tanda Tangan Disini
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              color: 'black',
              textAlign: 'center',
              fontSize: 12,
              fontFamily: fontsCustom.primary[400],
            }}
          >
            (Wajib Pajak)
          </Text>

          <TouchableOpacity
            onPress={() => {
              saveMonitoring();
            }}
            style={{
              justifyContent: 'center',
              marginEnd: 8,
              marginStart: 8,
              marginBottom: 8,
              flexDirection: 'column',
              marginTop: 16,
              padding: 8,
              backgroundColor: colorApp.button.primary,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                fontFamily: fontsCustom.primary[700],
                alignSelf: 'center',
              }}
            >
              Simpan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              clearSignature();
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              marginEnd: 8,
              marginBottom: viewHeight / 5,
            }}
          >
            <Icon2
              name="undo"
              style={{
                margin: 8,
              }}
              color={'black'}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </Dialog>
      <Dialog
        overlayStyle={{
          flexDirection: 'column',
          padding: 24,
          backgroundColor: 'white',
          borderRadius: 8,
          justifyContent: 'center',
        }}
        isVisible={dialogOpen}
      >
        <Text
          style={[
            style.styleInput,
            {
              color: 'black',
              fontFamily: fontsCustom.primary[700],
              textAlign: 'center',
              marginBottom: 24,
            },
          ]}
        >
          Apakah Anda yakin Ingin Menyimpan Data ini?
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setDialogOpen(false);
            }}
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              height: 35,
              elevation: 2,
              padding: 8,
            }}
          >
            <Text
              style={[
                style.styleInput,
                {
                  color: 'gray',
                  fontFamily: fontsCustom.primary[700],
                },
              ]}
            >
              Batal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              saveData();
            }}
            style={{
              height: 35,
              backgroundColor: colorApp.button.primary,
              padding: 8,
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: 8,
            }}
          >
            <Text
              style={[
                style.styleInput,
                {
                  fontFamily: fontsCustom.primary[700],
                  color: 'white',
                },
              ]}
            >
              Simpan Data
            </Text>
          </TouchableOpacity>
        </View>
      </Dialog>
      <Dialog
        overlayStyle={{
          backgroundColor: 'white',
          flexDirection: 'column',
          padding: 24,
          borderRadius: 8,
          justifyContent: 'flex-start',
        }}
        isVisible={dialogDownload}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: fontsCustom.primary[700],
            color: 'black',
          }}
        >
          Pengunduhan Dalam Proses, Mohon Ditunggu...
        </Text>
        <View
          style={{
            marginTop: 8,
            marginBottom: 8,
            marginStart: 14,
            marginVertical: 16,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <LinearProgress
            style={{ alignSelf: 'center' }}
            value={downloadProgress}
            color={colorApp.button.primary}
            variant="determinate"
          />
          <Text
            style={{
              fontSize: 12,
              color: 'gray',
              marginStart: 36,
              fontFamily: fontsCustom.primary[500],
              textAlign: 'center',
              alignSelf: 'center',
            }}
          >{` ${downloadProgress}/100`}</Text>
        </View>

        <Text
          style={{
            fontSize: 12,
            fontFamily: fontsCustom.primary[400],
            color: 'gray',
            marginBottom: 8,
          }}
        >
          berita acara monitoring.pdf
        </Text>
      </Dialog>
      <BottomSheet isVisible={openBottom}>
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'column',
            borderTopStartRadius: 8,
            borderTopEndRadius: 8,
            padding: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: fontsCustom.primary[700],
              marginTop: 8,
              marginStart: 16,
              color: 'black',
            }}
          >
            Download Berita Acara
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontsCustom.primary[700],
              marginTop: 8,
              marginStart: 16,
              color: 'black',
            }}
          >
            Merchant
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontsCustom.primary[400],
              marginTop: 8,
              marginBottom: 8,
              marginStart: 16,
              color: 'black',
            }}
          >
            {modelData.nama}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontsCustom.primary[700],
              marginTop: 8,
              marginStart: 16,
              color: 'black',
            }}
          >
            Tanggal Monitoring
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontsCustom.primary[400],
              marginTop: 8,
              marginStart: 16,
              marginBottom: 8,
              color: 'black',
            }}
          >
            {modelData.tgl_monitor}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontsCustom.primary[700],
              marginTop: 8,
              marginStart: 16,
              color: 'black',
            }}
          >
            Tanda Tangan
          </Text>
          <CheckBox
            title={'Ya'}
            checked={ttdYa}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor={colorApp.button.primary}
            uncheckedColor={colorApp.button.primary}
            style={{
              marginEnd: 8,
              marginTop: 8,
            }}
            onPress={() => {
              selectYa();
            }}
          />
          <CheckBox
            title={'Tidak'}
            checked={ttdTidak}
            checkedColor={colorApp.button.primary}
            uncheckedColor={colorApp.button.primary}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            style={{
              marginEnd: 8,
              marginTop: 8,
              marginBottom: 16,
            }}
            onPress={() => {
              selectTidak();
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setOpenBottom(false);
              }}
              style={{
                padding: 8,
                width: viewWidth / 3,
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 8,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  alignSelf: 'center',
                  fontFamily: fontsCustom.primary[700],
                }}
              >
                Tutup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                downloadFile();
              }}
              style={{
                padding: 8,
                width: viewWidth / 3,
                flexDirection: 'column',
                justifyContent: 'center',
                elevation: 2,
                backgroundColor: colorApp.button.primary,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: fontsCustom.primary[700],
                }}
              >
                Unduh
              </Text>
            </TouchableOpacity>
          </View>
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
            backgroundColor: 'white',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setOpenBottom1(false);
              pickImage();
            }}
            style={[
              style.btnBottom,
              {
                backgroundColor: '#fb9c3e',
              },
            ]}
          >
            <Text style={style.textBtn}>Ambil dari Kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              style.btnBottom,
              {
                backgroundColor: '#669beb',
              },
            ]}
            onPress={() => {
              setOpenBottom1(false);
              pickGalery();
            }}
          >
            <Text style={style.textBtn}>Ambil dari Galeri</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  containerForm: {
    marginStart: 16,
    marginEnd: 16,
    marginBottom: 8,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  containerInput: {
    backgroundColor: '#dadce0',
    borderRadius: 8,
    marginBottom: 16,
  },
  inputStyle: {
    fontSize: 14,
    color: 'black',
  },
  textTitle: {
    fontSize: 16,
    fontFamily: fontsCustom.primary[700],
    color: 'black',
    marginBottom: 8,
  },
  btnBottom: {
    marginBottom: 16,
    height: 55,
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 8,
  },
  textBtn: {
    fontSize: 16,
    color: 'white',
    fontFamily: fontsCustom.primary[700],
    textAlign: 'center',
  },
});

export default DetailMonitoring;
