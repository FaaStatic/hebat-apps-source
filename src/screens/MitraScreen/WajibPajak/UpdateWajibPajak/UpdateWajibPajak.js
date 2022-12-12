import React, { useState, useCallback,  useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Dimensions,
  ScrollView,
  StyleSheet,
  InteractionManager
} from 'react-native';
import { Image, Input, Dialog, BottomSheet } from '@rneui/themed';
import MapView, { Marker } from 'react-native-maps';
import { Header } from '../../../Komponen/Header';
import { colorApp, fontsCustom, stringApp } from '../../../../util/globalvar';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { Api } from '../../../../util/ApiManager';
import { MessageUtil } from '../../../../util/MessageUtil';
import GapList from '../../../Komponen/GapList';
import { launchCamera,launchImageLibrary  } from 'react-native-image-picker';
import { PermissionUtil } from '../../../../util/PermissionUtil';
import { SessionManager } from '../../../../util/SessionUtil/SessionManager';
import Geolocation from 'react-native-geolocation-service';
import RNFetchBlob from 'rn-fetch-blob';
import { useFocusEffect } from '@react-navigation/native';

var count = 0;
const limit = 10;
var firstload = true;
var latitude = -6.966667;
var longitude = 110.416664;
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;
const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');

const UpdateWajibPajak = ({ navigation, route }) => {
  const [keyword, setKeyword] = useState('');
  const [responseItem, setResponseItem] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [extraData, setExtraData] = useState(true);
  const [emptyData, setEmptyData] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingFooter, setLoadingFooter] = useState(false);
  const inputText = useRef();
  const mapsLayout = useRef();
  const [mapState, setMapState] = useState({
    latitude: -6.966667,
    longitude: 110.416664,
    latitudeDelta: limitlatitudeDelta,
    longitudeDelta: limitLongitudeDelta,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [savingFileData, setSavingFileData] = useState([]);
  const [openBottom,setOpenBottom] = useState(false);

  const fs = RNFetchBlob.fs;

  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      count = 0;
      firstLoad = true;
      setResponseItem([]);
      getApi();
    });
    return()=> task.cancel();
  },[]));



  const keywordChange = () => {
    count = 0;
    firstload = true;
    setResponseItem([]);
    getApi();
  };

  const itemSelect = (item) => {
    setSelectedItem(item);
    setFileList(item.image);
    item.image.map((item) => {
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', item.image) // the file is now downloaded at local storage
        .then((resp) => {
          imagePath = resp.path(); // to get the file path
          return resp.readFile('base64'); // to get the base64 string
        })
        .then((base64) => {
          setSavingFileData((current) => [...current, base64]);
          return fs.unlink(item.image); // to remove the file from local storage
        });
    });

    setMapState({
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      latitudeDelta: limitlatitudeDelta,
      longitudeDelta: limitLongitudeDelta,
    });

    setTimeout(() => {
      setOpenModal(true);
    }, 1000);
  };

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const getLocation = async () => {
    const locationPermission = await PermissionUtil.accessLocation();
    if (locationPermission === true) {
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
      console.log('Error On Permission!');
    }
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
  const getApi = async () => {
    if (firstload) {
      setLoadingScreen(true);
    }

    const params = {
      start: count,
      count: limit,
      keyword: keyword,
    };
    await Api.post('MerchantTutup/view_merchant_buka/', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          if (firstload) {
            setResponseItem(response);
            firstload = false;
          } else {
            setResponseItem(responseItem.concat(response));
          }
          setEmptyData(false);
          if (response.length < limit) {
            setHasNextPage(false);
            setExtraData(false);
          } else {
            setHasNextPage(true);
            setExtraData(true);
          }
          setLoadingScreen(false);
          setLoadingFooter(false);
        } else {
          setEmptyData(true);
          setHasNextPage(false);
          setEmptyData(false);
          setLoadingScreen(false);
          setLoadingFooter(false);
          MessageUtil.warningMessage(message);
        }
      })
      .catch((err) => {
        setEmptyData(true);
        setHasNextPage(false);
        setEmptyData(false);
        setLoadingScreen(false);
        setLoadingFooter(false);
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const updateLocationMerchant = async () => {
    setOpenModal(false);
    setLoadingScreen(true);
    count = 0;
    firstload = true;
    setResponseItem([]);
    var sesi = SessionManager.GetAsObject(stringApp.session);
    console.log('====================================');
    console.log(sesi.nama);
    console.log('====================================');
    const params = {
      id_user: sesi.id,
      id: selectedItem.id,
      latitude: mapState.latitude,
      longitude: mapState.longitude,
      user_update: sesi.nama,
      flag: selectedItem.flag,
      foto: savingFileData,
    };
    await Api.post('MerchantTutup/update_tempat/', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          MessageUtil.successMessage(message);
          setSavingFileData([]);
          setFileList([]);
          getApi();
        } else {
          setSavingFileData([]);
          setFileList([]);
          setLoadingScreen(false);
          MessageUtil.errorMessage(message);
        }
      })
      .catch((err) => {
        setSavingFileData([]);
        setFileList([]);
        setLoadingScreen(false);
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

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

  const pickImage = async () => {
    setOpenDialog2(true);
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
          setOpenDialog2(false);
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
          setTimeout(() => {
            setOpenDialog2(false);
            console.log(fileList);
          }, 1000);
        }
      });
    }
  };

  const pickLibrary = async () => {
    setOpenDialog2(true);
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
          setOpenDialog2(false);
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
          setTimeout(() => {
            setOpenDialog2(false);
            console.log(fileList);
          }, 1000);
        }
      });
    }
  };

  const loadMore = () => {
    if (hasNextPage == true && firstload == false && emptyData == false && extraData == true) {
      setLoadingFooter(true);
      count += limit;
      getApi();
    }
  };

  const itemList = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          itemSelect(item);
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          padding: 16,
        }}
      >
        <Image
          source={
            item.image.length > 0
              ? { uri: item.image[0].image }
              : require('../../../../../assets/images/store.png')
          }
          style={{
            height: 75,
            width: 75,
          }}
          containerStyle={{
            height: 75,
            width: 75,
            marginEnd: 16,
            borderRadius: 8,
            backgroundColor: 'white',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          placeholderStyle={{
            height: 75,
            width: 75,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          resizeMode={'stretch'}
          PlaceholderContent={
            <ActivityIndicator
              size={'large'}
              color={colorApp.button.primary}
              style={{ alignSelf: 'center' }}
            />
          }
        />

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily:fontsCustom.primary[700],

              color: 'black',
              marginBottom: 16,
              width: 200,
            }}
          >
            {item.nama}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[400],

              color: 'black',
              marginBottom: 16,
              width: 200,
            }}
          >
            {item.alamat}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);
  const itemFooter = useCallback(() => {
    if (loadingFooter) {
      return (
        <View
          style={{
            justifyContent: 'center',
            marginTop: 16,
            height: 100,
            backgroundColor: 'white',
            flexDirection: 'column',
            marginBottom: 16,
            width: '100%',
          }}
        >
          <ActivityIndicator color={colorApp.button.primary} size={'small'} style={{ alignSelf: 'center' }} />
        </View>
      );
    } else {
      return (
        <View
          Style={{
            height: 100,
            width: '100%',
          }}
        />
      );
    }
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
      }}
    >
      <Header
        Title={'Wajib Pajak Tutup'}
        back={() => {
          navigation.goBack();
        }}
        action={() => {
          navigation.navigate('RiwayatUpdatePajak');
        }}
      />
      <View
        style={{
          backgroundColor: colorApp.backgroundView,
          paddingEnd: 16,
          paddingStart: 16,
          height: 60,
        }}
      >
        <Input
          onChangeText={(txt) => {
            setKeyword(txt);
          }}
          onChange={() => {
            keywordChange();
          }}
          ref={inputText}
          value={keyword}
          leftIcon={<Icon name="search" size={24} color={'black'} />}
          placeholder={'Cari Nama Wajib Pajak'}
          inputStyle={{
            textAlign: 'center',
            borderWidth: 0,
          }}
          containerStyle={{
            margin: 0,
          }}
        />
      </View>
      {loadingScreen ? (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <ActivityIndicator
            color={colorApp.button.primary}
            size={'large'}
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
      ) : (
        <FlatList
          data={responseItem}
          extraData={extraData}
          onEndReached={loadMore}
          ItemSeparatorComponent={<GapList />}
          renderItem={itemList}
          ListFooterComponent={itemFooter}
          keyExtractor={(item) => item.id}
        />
      )}

      <Dialog
        isVisible={openModal}
        overlayStyle={{
          height: ViewHeight / 1.05,
          width: ViewWidth / 1.15,
          padding: 0,
          borderRadius: 8,
        }}
        onBackdropPress={() => {
          setOpenModal(false);
        }}
      >
        {selectedItem === null ? (
          <></>
        ) : (
          <>
            <Image
              source={
                selectedItem.image.length > 0
                  ? { uri: selectedItem.image[0].image }
                  : require('../../../../../assets/images/store.png')
              }
              style={{
                height: ViewHeight / 3.5,
              }}
              resizeMode={'stretch'}
              containerStyle={{
                height: ViewHeight / 3.5,
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
              }}
              placeholderStyle={{
                height: ViewHeight / 5,
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
                justifyContent: 'center',
                backgroundColor: colorApp.backgroundView,
              }}
              PlaceholderContent={
                <ActivityIndicator
                  style={{ alignSelf: 'center' }}
                  size={'large'}
                  color={colorApp.button.primary}
                />
              }
            />
            <ScrollView
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingStart: 8,
                paddingEnd: 8,
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: '#290736',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontFamily:fontsCustom.primary[700],

                  marginBottom: 4,
                  marginTop: 8,
                }}
              >
                {selectedItem.nama}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontFamily:fontsCustom.primary[400],

                  marginBottom: 16,
                }}
              >
                {selectedItem.alamat}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'black',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontFamily:fontsCustom.primary[400],

                  marginBottom: 8,
                }}
              >
                Apakah wajib pajak tersebut telah berhenti beroperasi?
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily:fontsCustom.primary[700],
                  marginBottom: 4,
                  marginStart: 16,
                }}
              >
                Unggah Gambar
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'grey',
                  fontFamily:fontsCustom.primary[500],

                  marginStart: 16,
                  marginBottom: 16,
                }}
              >
                Tekan ikon kamera untuk menambahkan foto
              </Text>
              {fileList.length > 0 ? (
                <FlatList
                  nestedScrollEnabled={true}
                  ListHeaderComponent={() => {
                    return (
                      <TouchableOpacity
                        onPress={()=>{
                          setOpenBottom(true);
                        }}
                        style={{
                          width: 150,
                          height: 150,
                          backgroundColor: '#e1e1e1',
                          justifyContent: 'center',
                          marginLeft: 16,
                        }}
                      >
                        <Icon2
                          name="camera-alt"
                          size={100}
                          color={'white'}
                          style={{ alignSelf: 'center' }}
                        />
                      </TouchableOpacity>
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
                    if (item.image.includes('https')) {
                      image = item.image;
                    } else {
                      image = `data:image/png;base64,${item.image}`;
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
                          PlaceholderContent={<ActivityIndicator />}
                          containerStyle={{
                            width: 150,
                            height: 150,
                            flex: 1,
                          }}
                          resizeMode={'cover'}
                        />
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
                          <Icon name="trash" size={14} color={'red'} />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              ) : (
                <TouchableOpacity
                onPress={()=>{
                  setOpenBottom(true);
                }}
                  style={{
                    width: 150,
                    height: 150,
                    backgroundColor: '#e1e1e1',
                    justifyContent: 'center',
                    marginLeft: 16,
                    marginBottom: 16,
                  }}
                >
                  <Icon2
                    name="camera-alt"
                    size={100}
                    color={'white'}
                    style={{ alignSelf: 'center' }}
                  />
                </TouchableOpacity>
              )}
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily:fontsCustom.primary[700],

                  marginBottom: 4,
                  marginStart: 16,
                }}
              >
                Lokasi Saat Ini
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
                  ref={mapsLayout}
                  style={{
                    flex: 1,
                  }}
                  provider={MapView.PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: limitlatitudeDelta,
                    longitudeDelta: limitLongitudeDelta,
                  }}
                  region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: limitlatitudeDelta,
                    longitudeDelta: limitLongitudeDelta,
                  }}
                  onRegionChangeComplete={(region) => {
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
                  <Icon2
                    name="my-location"
                    size={24}
                    color={'black'}
                    style={{ alignSelf: 'center' }}
                  />
                </TouchableOpacity>
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
                    fontFamily:fontsCustom.primary[700],

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
                    fontFamily:fontsCustom.primary[700],

                    alignSelf: 'center',
                  }}
                >
                  Longitude : {mapState.longitude.toFixed(4)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setOpenDialog(true);
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
                    fontFamily:fontsCustom.primary[700],
                    alignSelf: 'center',
                  }}
                >
                  Simpan Lokasi
                </Text>
              </TouchableOpacity>
              <BottomSheet
        isVisible={openBottom}
        onBackdropPress={() => {
          setOpenBottom(false);
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
              setOpenBottom(false);
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
              setOpenBottom(false);
              pickLibrary();
            }}
          >
            <Text style={style.textBtn}>Ambil dari Galeri</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
            </ScrollView>
          </>
        )}

        <Dialog
          isVisible={openDialog}
          overlayStyle={{
            width: ViewWidth / 1.5,
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 8,
          }}
          onBackdropPress={() => {
            setOpenDialog(false);
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontFamily:fontsCustom.primary[400],

              color: 'black',
              marginTop: 8,
              marginBottom: 8,
            }}
          >
            Apakah anda yakin ingin mengubah lokasi wajib pajak?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setOpenModal(false);
              }}
              style={{
                borderRadius: 8,

                backgroundColor: 'white',
                elevation: 3,
                paddingTop: 8,
                padding: 8,
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 14,
                  fontFamily:fontsCustom.primary[700],

                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLocationMerchant();
              }}
              style={{
                borderRadius: 8,
                padding: 8,

                backgroundColor: colorApp.primaryGaspoll,
                elevation: 3,
              }}
            >
              <Text>Simpan Data</Text>
            </TouchableOpacity>
          </View>
        </Dialog>
        <Dialog
          isVisible={openDialog2}
          overlayStyle={{
            height: 200,
            width: 200,
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <ActivityIndicator
            size={'large'}
            color={colorApp.primaryGaspoll}
            style={{ alignSelf: 'center' }}
          />
        </Dialog>
      </Dialog>
    </View>
  );
};
const style = StyleSheet.create({
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
    fontFamily:fontsCustom.primary[700],

    textAlign: 'center',
  },
});
export default UpdateWajibPajak;
