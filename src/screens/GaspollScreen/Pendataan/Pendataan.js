import React, {  useState, useRef,useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  FlatList,
  ActivityIndicator,
  InteractionManager
} from 'react-native';
import { Image, Dialog } from '@rneui/themed';
import { Header } from '../../Komponen/Header';
import MapView, { Marker } from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { Api } from '../../../util/ApiManager';
import { launchCamera } from 'react-native-image-picker';
import { PermissionUtil } from '../../../util/PermissionUtil';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { colorApp, stringApp } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';
import { useFocusEffect } from '@react-navigation/native';

const { height: viewHeight, width: viewWidth } = Dimensions.get('window');

var latitude = 0;
var longitude = 0;
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;

export default function Pendataan({ navigation, route }) {
  const [merchantName, setMerchantNama] = useState('');
  const [owner, setOwner] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [open, setOpen] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [listData, setListData] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [responseExist, setResponseExist] = useState([]);
  const [loadDialog, setLoadDialog] = useState(false);
  const [savingFileData, setSavingFileData] = useState([]);
  const [mapState, setMapState] = useState({
    latitude: -6.966667,
    longitude: 110.416664,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapsLayout = useRef();

  useFocusEffect(useCallback(()=>{
    clearData();
    getCategory();
    setMapState({
      latitude: -6.966667,
      longitude: 110.416664,
      latitudeDelta: limitlatitudeDelta,
      longitudeDelta: limitLongitudeDelta,
    });
    getLocation();
    const task = InteractionManager.runAfterInteractions(()=>{
      clearData();
      getCategory();
      setMapState({
        latitude: -6.966667,
        longitude: 110.416664,
        latitudeDelta: limitlatitudeDelta,
        longitudeDelta: limitLongitudeDelta,
      });
      getLocation();
    });
    return()=> task.cancel();
  },[]));


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

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const clearData = () => {
    setMerchantNama('');
    setOwner('');
    setValueCategory(null);
    setAddress('');
    latitude = -6.966667;
    longitude = 110.416664;
    setFileList([]);
    setListData([]);
    setSavingFileData([]);
  };

  const addMerchant = async () => {
    setLoadDialog(true);
    var sesi = SessionManager.GetAsObject(stringApp.session);
    console.log('====================================');
    console.log(sesi.id);
    console.log('====================================');
    const paramsAdd = {
      id_user: sesi.id,
      nama: merchantName,
      alamat: address,
      telp_usaha: '',
      bidang_usaha: '',
      pemilik: owner,
      alamat_pemilik: '',
      nik_pemilik: '',
      latitude: mapState.latitude,
      kategori: valueCategory,
      longitude: mapState.longitude,
      no_telp: phone,
      kelurahan: '',
      kecamatan: '',
      kota: '',
      ttd: '',
      image: savingFileData,
    };

    // await fetch('https://gmedia.bz/bapenda/api/Survey/add_merchant/', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'Client-Service': 'monitoring-bapeda',
    //     'Auth-Key': 'gmedia',
    //   },
    //   body: JSON.stringify({
    //     id_user: sesi.id,
    //     nama: merchantName,
    //     pemilik: owner,
    //     alamat: address,
    //     no_telp: phone,
    //     latitude: mapState.latitude,
    //     longitude: mapState.longitude,
    //     kategori: valueCategory,
    //     image: savingFileData,
    //   }),
    // })
    //   .then((response) => {
    //     console.log('====================================');
    //     console.log(JSON.stringify(response.json()));
    //     console.log('====================================');
    //   })
    //   .catch((err) => {
    //     console.log('====================================');
    //     console.log(err);
    //     console.log('====================================');
    //   });

    await Api.post('Survey/add_merchant', paramsAdd)
      .then((res) => {
        var body = res.data;
        var status = body.metadata.status;
        var message = body.metadata.message;
        var response = body.response;
        console.log('====================================');
        console.log(response);
        console.log('====================================');
        if (status === 200) {
          setMerchantNama('');
          setOwner('');
          setAddress('');
          setPhone('');
          setFileList([]);
          setSavingFileData([]);
          setValueCategory(null);
          MessageUtil.successMessage(message);
          setTimeout(() => {
            setModalConfirm(false);
            setLoadDialog(false);
            moveFormPotensi(response.id_merchant);
            clearTimeout();
          }, 1000);
        } else {
          MessageUtil.errorMessage(message);
          setModalConfirm(false);
          setLoadDialog(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        MessageUtil.errorMessage(err);
        console.log('====================================');
      });
  };

  const moveFormPotensi = (id) => {
    var sesi = SessionManager.GetAsObject(stringApp.session);

    const paramsAdd = {
      id_user: sesi.id,
      nama: merchantName,
      pemilik: owner,
      alamat: address,
      no_telp: phone,
      latitude: mapState.latitude,
      longitude: mapState.longitude,
      kategori: valueCategory,
      image: savingFileData,
    };

    navigation.navigate('FormPotensi', {
      id: id,
      dataModel: paramsAdd,
      id_potensi: null,
    });
  };

  const checkStatus = async () => {
    if (
      merchantName.length == 0 &&
      owner.length == 0 &&
      address.length == 0 &&
      phone.length == 0 &&
      valueCategory == null &&
      fileList.length == 0
    ) {
      MessageUtil.errorMessage('The form cannot be empty, please fill it in first!');
      return;
    }
    setModalConfirm(true);
    setLoadDialog(true);
    var sesi = SessionManager.GetAsObject(stringApp.session);
    console.log('====================================');
    console.log(sesi.id);
    console.log('====================================');
    const params = {
      name_merchant: merchantName,
    };
    // await fetch('https://gmedia.bz/bapenda/api/Survey/check_merchant/', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'Client-Service': 'monitoring-bapeda',
    //     'Auth-Key': 'gmedia',
    //   },
    //   body: JSON.stringify({
    //     id_user: sesi.id,
    //     nama: merchantName,
    //     pemilik: owner,
    //     alamat: address,
    //     no_telp: phone,
    //     latitude: mapState.latitude,
    //     longitude: mapState.longitude,
    //     kategori: valueCategory,
    //     image: savingFileData,
    //   }),
    // })
    //   .then((response) => {
    //     response.json();
    //   })
    //   .then((data) => {
    //     console.log('====================================');
    //     console.log(data);
    //     console.log('====================================');
    //   })
    //   .catch((err) => {
    //     console.log('====================================');
    //     console.log(err);
    //     console.log('====================================');
    //   });
    await Api.post('Survey/check_merchant', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var message = body.metadata.message;
        var status = body.metadata.status;

        if (status === 200) {
          setLoadDialog(false);
          setResponseExist(response);
        } else {
          addMerchant();
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const getCategory = async () => {
    Api.get('Survey/kategori')
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var status = body.metadata.status;
        if (status == 200) {
          convertResponse(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      console.log('Error On Permission!');
    }
  };

  const convertResponse = async (data) => {
    var i = 0;
    var temp = [];

    while (i < data.length) {
      var dataSet = {
        label: data[i].kategori,
        value: data[i].id,
      };
      temp.push(dataSet);
      i++;
    }
    setListData(temp);
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

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}
    >
      <Header
        Title={'Pendataan'}
        back={() => navigation.goBack()}
        action={() => {
          navigation.navigate('RiwayatSurvey');
        }}
      />

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'white',
          height: viewHeight,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'column',
            marginEnd: 16,
            marginStart: 16,
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          <Text style={style.textInput}>Taxpayer's name</Text>
          <View style={style.textInputContainer}>
            <TextInput
              style={style.styleInput}
              value={merchantName}
              keyboardType={'default'}
              onChangeText={(value) => {
                setMerchantNama(value);
              }}
            />
          </View>
          <Text style={style.textInput}>Name of the owner</Text>

          <View style={style.textInputContainer}>
            <TextInput
              style={style.styleInput}
              keyboardType={'default'}
              value={owner}
              onChangeText={(value) => {
                setOwner(value);
              }}
            />
          </View>
          <Text style={style.textInput}>Taxpayer Address</Text>

          <View style={style.textInputContainer}>
            <TextInput
              style={style.styleInput}
              value={address}
              onChangeText={(value) => {
                setAddress(value);
              }}
              keyboardType={'default'}
            />
          </View>
          <Text style={style.textInput}>Phone number</Text>

          <View style={style.textInputContainer}>
            <TextInput
              style={style.styleInput}
              value={phone}
              keyboardType={'number-pad'}
              onChangeText={(value) => {
                setPhone(value);
              }}
            />
          </View>
          <Text
            style={[
              style.textInput,
              {
                marginBottom: 16,
                fontWeight: '800',
                fontSize: 16,
              },
            ]}
          >
            Category
          </Text>

          {listData.length > 0 ? (
            <DropDownPicker
              open={open}
              value={valueCategory}
              items={listData}
              setOpen={setOpen}
              setValue={setValueCategory}
              listMode={'SCROLLVIEW'}
            />
          ) : (
            <Text
              style={[
                style.textInput,
                {
                  marginBottom: 16,
                  fontWeight: '500',
                  fontSize: 12,
                },
              ]}
            >
              Please wait ...
            </Text>
          )}
        </View>
        <View style={style.gap} />
        <Text
          style={[
            style.textInput,
            {
              marginBottom: 8,
              fontWeight: '800',
              fontSize: 16,
              marginLeft: 24,
            },
          ]}
        >
          Maps
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
            onRegionChange={(region) => {
              latitude = region.latitude;
              longitude = region.longitude;
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
            <Icon name="my-location" size={24} color={'black'} style={{ alignSelf: 'center' }} />
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
              );
            }}
            horizontal={true}
            style={{
              marginBottom: 16,
            }}
            data={fileList}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            extraData={true}
            renderItem={({ item }) => {
              const base64 = `data:image/png;base64,${item.image}`;
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
                    source={{ uri: base64 }}
                    PlaceholderContent={
                      <ActivityIndicator
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    }
                    placeholderStyle={{
                      flex: 1,
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      flexDirection: 'column',
                    }}
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
                    <Icon2 name="trash" size={14} color={'red'} />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        ) : (
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
            <Icon name="camera-alt" size={100} color={'white'} style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            checkStatus();
          }}
          style={{
            backgroundColor: colorApp.gradientSatu,
            justifyContent: 'center',
            flexDirection: 'column',
            borderRadius: 4,
            marginLeft: 16,
            marginEnd: 16,
            marginBottom: 24,
            padding: 8,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 18,
              color: 'white',
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Dialog isVisible={modalConfirm} onBackdropPress={() => {}}>
        <View
          style={{
            backgroundColor: 'white',
            marginRight: 24,
            marginLeft: 24,
            paddingBottom: 16,
            paddingTop: 16,
            height: loadDialog ? viewHeight / 3 : viewHeight / 4,
            flexDirection: 'column',
          }}
        >
          {loadDialog ? (
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
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
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>
                This data has been registered with name {responseExist.nama} and address{' '}
                {responseExist.alamat}, are you sure you want to save it?
              </Text>
              <View
                style={{
                  marginTop: 16,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    setModalConfirm(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginEnd: 16,
                      color: 'gray',
                      textAlign: 'center',
                    }}
                  >
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    addMerchant();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginEnd: 16,
                      color: 'black',
                      textAlign: 'center',
                    }}
                  >
                    Yes, Save the Data
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Dialog>
    </View>
  );
}

const style = StyleSheet.create({
  inner: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  textInput: {
    marginTop: 16,
    fontSize: 16,
    color: 'black',
    fontWeight: '700',
    width: '100%',
  },
  textInputContainer: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'space-around',
    backgroundColor: '#dadce0',
    borderRadius: 8,
    marginTop: 4,
  },
  gap: {
    color: 'grey',
    height: 0.8,
    backgroundColor: 'grey',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  styleInput: {
    marginStart: 8,
    marginEnd: 8,
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
  },
});
