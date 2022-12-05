import React, {  useState, useRef,useCallback } from 'react';
import { MessageUtil } from '../../../util/MessageUtil';
import { Api } from '../../../util/ApiManager';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
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
  InteractionManager
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PermissionUtil } from '../../../util/PermissionUtil';
import { Image, CheckBox, Dialog, BottomSheet, LinearProgress } from '@rneui/themed';
import { launchCamera } from 'react-native-image-picker';
import { Header } from '../../Komponen/Header';
import { colorApp, menuMain, stringApp } from '../../../util/globalvar';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/dist/AntDesign';
import GapList from '../../Komponen/GapList';
import RNFetchBlob from 'rn-fetch-blob';
import { useFocusEffect } from '@react-navigation/native';


const { width: viewWidth, height: viewHeight } = Dimensions.get('window');
const MIN_HEIGHT_HEADER = StatusBar.currentHeight + 30;
const MAX_HEIGHT_HEADER = 250;
const DISTANCE = MAX_HEIGHT_HEADER - MIN_HEIGHT_HEADER;
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;
const FormReklame = ({ navigation, route }) => {
  const { modelData, status } = route.params;
  const fs = RNFetchBlob.fs;
  const [positionY, setPositionY] = useState(0);

  const [savingFileData, setSavingFileData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [deskripsi, setDeskripsi] = useState(null);
  const [openList, setOpenList] = useState(false);
  const [mapState, setMapState] = useState({
    latitude: Number(modelData.latitude),
    longitude: Number(modelData.longitude),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const mapsLayout = useRef();

  const headerHeight = scrollPosition.interpolate({
    inputRange: [0, MIN_HEIGHT_HEADER],
    outputRange: [MAX_HEIGHT_HEADER, MIN_HEIGHT_HEADER],
    extrapolate: 'clamp',
  });

  const opacityScroll = scrollPosition.interpolate({
    inputRange: [0, 20, 60],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const imageHeight = scrollPosition.interpolate({
    inputRange: [0, DISTANCE],
    outputRange: [MAX_HEIGHT_HEADER, MIN_HEIGHT_HEADER],
    extrapolateLeft: 'identity',
    extrapolateRight: 'clamp',
  });

  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      clearData();
      getCategoryReklame();
      addData();
    });
    return()=> task.cancel();
  },[]));


  const clearData = () => {
    setFileList([]);
    setSavingFileData([]);
  };

  const addData = () => {
    setFileList(modelData.image);
    modelData.image.map((item) => {
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', item.image) // the file is now downloaded at local storage
        .then((resp) => {
          imagePath = resp.path(); // to get the file path
          return resp.readFile('base64'); // to get the base64 string
        })
        .then((base64) => {
          var params = {
            id: item.id,
            image: base64,
          };
          // here base64 encoded file data is returned
          // if (fileList.length > 0) {
          //   setFileList((current) => [...current, params]);
          // } else {
          //   setFileList(params);
          // }
          setSavingFileData((current) => [...current, base64]);
          return fs.unlink(item.image); // to remove the file from local storage
        });
    });
    if (status !== null) {
      setDeskripsi(modelData.status_reklame);
    }
  };

  const getCategoryReklame = async () => {
    await Api.get('merchant/ms_ket_reklame')
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          var temp = [];
          response.map((item) => {
            var data = {
              label: item.ket,
              value: item.id,
            };
            temp.push(data);
          });
          setListCategory(temp);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
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
            longitude: datapos.latitude,
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

  const simpanData = async () => {
    setDialogOpen(false);
    console.log('====================================');
    console.log(savingFileData);
    console.log('====================================');

    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      id_reklame: modelData.id,
      status_reklame: deskripsi,
      latitude: mapState.latitude,
      longitude: mapState.longitude,
      id_user: sesi.id,
      foto: savingFileData,
    };

    await Api.post('merchant/monitor_reklame', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;

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
        MessageUtil.errorMessage(message);
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
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
            zIndex: 999,
            backgroundColor: 'transparent',
            height: headerHeight,
          },
        ]}
      >
        {positionY >= 20 ? (
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
                modelData.image.length === 0
                  ? require('../../../../assets/images/store.png')
                  : { uri: modelData.image[0].image }
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
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{ justifyContent: 'center' }}
              >
                <Icon3 name="arrowleft" size={24} color={'white'} />
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
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollPosition } } }], {
          useNativeDriver: false,
          listener: (event) => {
            setPositionY(event.nativeEvent.contentOffset.y);
          },
        })}
        scrollEventThrottle={24}
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
              fontWeight: '600',
              color: 'black',
              marginTop: 8,
            }}
          >
            {modelData.nama}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              color: 'black',
            }}
          >
            {modelData.alamat}
          </Text>
        </View>
        <Text
          style={{
            fonstSize: 16,
            fontWeight: '600',
            color: 'black',
            marginTop: 8,
            marginStart: 16,
          }}
        >
          Deskripsi
        </Text>

        <View
          style={{
            marginEnd: 16,
            marginStart: 16,
            padding: 4,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: colorApp.primary,
            borderRadius: 8,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {listCategory.length > 0 ? (
            <DropDownPicker
              open={openList}
              disabled={status === null ? false : true}
              value={deskripsi}
              closeAfterSelecting={true}
              placeholderStyle={{
                borderWidth: 0,
              }}
              items={listCategory}
              setOpen={setOpenList}
              setValue={setDeskripsi}
              listMode={'MODAL'}
              dropDownContainerStyle={{
                backgroundColor: 'white',
                borderWidth: 0,
              }}
              modalTitle="Select an item"
              modalProps={{
                animationType: 'fade',
              }}
              modalContentContainerStyle={{}}
              containerStyle={{
                backgroundColor: 'white',
                zIndex: 9999,
              }}
              modalTitleStyle={{
                fontWeight: 'bold',
              }}
            />
          ) : (
            <Text
              style={{
                marginTop: 16,
                color: 'black',
                width: '100%',
                marginBottom: 16,
                fontWeight: '500',
                fontSize: 12,
              }}
            >
              Please wait ...
            </Text>
          )}
        </View>

        <View />

        <GapList />
        <Text
          style={{
            fonstSize: 16,
            fontWeight: '600',
            color: 'black',
            marginTop: 8,
            marginStart: 16,
            marginBottom: 16,
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
            ref={mapsLayout}
            style={{
              flex: 1,
            }}
            initialRegion={{
              latitude: Number(modelData.latitude),
              longitude: Number(modelData.longitude),
              latitudeDelta: limitlatitudeDelta,
              longitudeDelta: limitLongitudeDelta,
            }}
            region={{
              latitude: mapState.latitude,
              longitude: mapState.longitude,
              latitudeDelta: limitlatitudeDelta,
              longitudeDelta: limitLongitudeDelta,
            }}
            onRegionChange={(region) => {
              if (status === null) {
                latitude = region.latitude;
                longitude = region.longitude;
              }
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
              onPointerEnter={() => {
                console.log('test');
              }}
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
              fontWeight: '700',
              alignSelf: 'center',
            }}
          >
            Latitude : {mapState.latitude}
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontSize: 12,
              color: 'black',
              fontWeight: '700',
              alignSelf: 'center',
            }}
          >
            Longitude : {mapState.longitude}
          </Text>
        </View>

        <Text
          style={[
            style.textInput,
            {
              fontWeight: '800',
              fontSize: 16,
              marginLeft: 24,
            },
          ]}
        >
          Upload Photo
        </Text>
        <Text
          style={[
            style.textInput,
            {
              marginBottom: 8,
              fontWeight: '500',
              fontSize: 14,
              marginLeft: 24,
            },
          ]}
        >
          Please Press Button Below to Upload Photo
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
              console.log(item.path);

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
            onPress={() => {
              setDialogOpen(true);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 16,
              marginBottom: 24,
              marginEnd: 24,
              marginStart: 24,
              borderRadius: 8,
              backgroundColor: '#FC572C',
            }}
          >
            <Text
              style={{
                color: 'white',
                alignSelf: 'center',
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              Simpan Data Monitoring
            </Text>
          </TouchableOpacity>
        )}
        {status !== null && (
          <View
            style={{
              height: 100,
            }}
          />
        )}
      </Animated.ScrollView>

      <Dialog isVisible={dialogOpen}>
        <View
          style={{
            flexDirection: 'column',
            paddingTop: 16,
            PaddingBottom: 16,
            height: 125,
            borderRadius: 16,
          }}
        >
          <Text
            style={[
              style.styleInput,
              {
                fontSize: 16,
                width: 200,
                textAlign: 'center',
                alignSelf: 'center',
                color: 'black',
                fontWeight: '700',
              },
            ]}
          >
            Apakah Anda yakin Ingin Menyimpan Data ini?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',

              marginTop: 24,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setDialogOpen(false);
              }}
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                height: 45,
                marginStart: 8,
                marginEnd: 4,
                backgroundColor: 'grey',
                padding: 4,
                width: viewWidth / 3.5,
                borderRadius: 4,
              }}
            >
              <Text
                style={[
                  style.styleInput,
                  {
                    fontWeight: '700',
                    color: 'black',
                    textAlign: 'center',
                  },
                ]}
              >
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                simpanData();
              }}
              style={{
                height: 45,
                marginStart: 4,
                marginEnd: 8,
                padding: 4,
                flexDirection: 'column',
                justifyContent: 'center',
                width: viewWidth / 3.5,

                backgroundColor: colorApp.primaryGaspoll,
                borderRadius: 4,
              }}
            >
              <Text
                style={[
                  style.styleInput,
                  {
                    fontWeight: '700',
                    color: 'white',
                    textAlign: 'center',
                  },
                ]}
              >
                Simpan Data
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
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
    fontWeight: '800',
    color: 'black',
    marginBottom: 8,
  },
});

export default FormReklame;
