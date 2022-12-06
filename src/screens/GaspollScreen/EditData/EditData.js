import React, { useState, useEffect, useRef,useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  InteractionManager,
  Platform
} from 'react-native';
import { Image, Dialog, BottomSheet } from '@rneui/themed';
import MapView, { Marker } from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Api } from '../../../util/ApiManager';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionUtil } from '../../../util/PermissionUtil';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { colorApp, stringApp } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';
import { HeaderWithoutHistory } from '../../Komponen/HeaderWithoutHistory';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import RNFetchBlob from 'rn-fetch-blob';
import { useFocusEffect } from '@react-navigation/native';

const { height: viewHeight, width: viewWidth } = Dimensions.get('window');

var latitude = 0;
var longitude = 0;
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;

export default function EditData({ navigation, route }) {
  const { id, item } = route.params;
  const fs = RNFetchBlob.fs;
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
  const [loadingField, setLoadingField] = useState(false);
  const [openBottom,setOpenBottom] = useState(false);

  const [mapState, setMapState] = useState({
    latitude: -6.966667,
    longitude: 110.416664,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapsLayout = useRef();


  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      setLoadingField(true);
      clearData();
      setTimeout(() => {
        getDataEdit();
        clearTimeout();
      }, 2000);
    });
    return()=> task.cancel();
  },[]));

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

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

  const getDataEdit = async () => {
    setLoadingField(true);
    const param = {
      id: id,
    };
    await Api.post('Survey/view_merchant_by_id', param)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var message = body.metadata.message;
        var status = body.metadata.status;
        console.log(body);

        if (status === 200) {
          //   console.log('====================================');
          //   console.log(response);
          //   console.log('====================================');
          addEditData(response);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log("err1");
        console.log(err);
        console.log('====================================');
      });
  };

  const addEditData = (item) => {
    setMerchantNama(item.nama);
    setOwner(item.pemilik);
    setFileList(item.img);
    console.log(item.img);
    item.img.map((item) => {
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', item.image) // the file is now downloaded at local storage
        .then((resp) => {
    
          return resp.readFile('base64'); // to get the base64 string
        })
        .then((base64) => {
          setSavingFileData((current) => [...current, base64]);
         // to remove the file from local storage
        });
    });

    longitude = parseFloat(item.longitude);
    latitude = parseFloat(item.latitude);
    setPhone(item.no_telp);
    getCategory(item.kategori);
    setAddress(item.alamat);
    setMapState({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: limitlatitudeDelta,
      longitudeDelta: limitLongitudeDelta,
    });
    setLoadingField(false);
  };

  const clearData = () => {
    setMerchantNama('');
    setOwner('');
    setValueCategory(null);
    setAddress('');
    setPhone('');
    latitude = -6.966667;
    longitude = 110.416664;
    setFileList([]);
    setListData([]);
    setSavingFileData([]);
    tempData = [];
  };

  const editMerchant = async () => {
    setLoadDialog(true);
    var sesi = SessionManager.GetAsObject(stringApp.session);

    const paramsEdit = {
      id: id,
      user_login: sesi.id,
      nama: merchantName,
      alamat: address,
      telp_usaha: phone,
      bidang_usaha: 'Dia dia',
      pemilik: owner,
      alamat_pemilik: "",
      nik_pemilik: '',
      latitude: mapState.latitude,
      longitude: mapState.longitude,
      kategori: valueCategory,
      no_telp: '',
      kelurahan: '',
      kecamatan: '',
      kota: '',
      keterangan: '',
      ttd: "",
      image: savingFileData,
    };

    await Api.post('Survey/edit_merchant', paramsEdit)
      .then((res) => {
        var body = res.data;
        var status = body.metadata.status;
        var message = body.metadata.message;
        if (status === 200) {
          clearData();
          MessageUtil.successMessage(message);
          setModalConfirm(false);
          setLoadDialog(false);
          navigation.goBack();
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

  const validationCheck = async () => {
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
  };

  const getCategory = async (data) => {
    Api.get('Survey/kategori')
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var status = body.metadata.status;
        if (status == 200) {
          convertResponse(response, data);
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

  const convertResponse = async (data, kategori) => {
    var i = 0;
    var temp = [];

    while (i < data.length) {
      var dataSet = {
        label: data[i].kategori,
        value: data[i].id,
      };
      if (data[i].kategori === kategori) {
        setValueCategory(data[i].id);
      }
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

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}
    >
      <HeaderWithoutHistory Title={'Ubah Data'} back={() => navigation.goBack()} />
      {loadingField ? (
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
            <Text style={style.textInput}>Nama Wajib Pajak</Text>
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
            <Text style={style.textInput}>Nama Pemilik</Text>

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
            <Text style={style.textInput}>Alamat Wajib Pajak</Text>

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
            <Text style={style.textInput}>Nomor Telepon</Text>

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
                Kategori Pajak
            </Text>

            {listData.length > 0 ? (
              <DropDownPicker
                open={open}
                value={valueCategory}
                items={listData}
                setOpen={setOpen}
                setValue={setValueCategory}
                placeholder={'Pilih Kategori Pajak'}
                containerStyle={{
                  backgroundColor:'white'
                }}
                dropDownContainerStyle={{
                  elevation:2,
                  backgroundColor:'white'
                }}
                dropDownDirection={'TOP'}
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
                    marginStart:16,
                  },
                ]}
              >
                 Tunggu Sebentar ...
              </Text>
            )}
          </View>
          <View style={style.gap} />
          <Text
            style={[
              style.textInput,
              {
                marginBottom: 16,
                fontWeight: '800',
                fontSize: 16,
                marginLeft: 24,
              },
            ]}
          >
            Peta
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
              Latitude : {mapState.latitude.toFixed(4)}
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
              Longitude : {mapState.longitude.toFixed(4)}
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
             Unggah Gambar
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
             Mohon Tekan Tombol Dibawah Ini Untuk Unggah Gambar
          </Text>
          {fileList.length > 0 ? (
            <FlatList
              nestedScrollEnabled={true}
              ListHeaderComponent={() => {
                return (
                  <TouchableOpacity
                    onPress={() => {
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
                      <Icon2 name="trash" size={14} color={'red'} />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          ) : (
            <TouchableOpacity
            onPress={() => {
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
              <Icon name="camera-alt" size={100} color={'white'} style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              validationCheck();
            }}
            style={{
              backgroundColor: colorApp.button.primary,
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
              Simpan
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Dialog isVisible={modalConfirm} onBackdropPress={() => {}}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 8,
            height: viewHeight / 6,
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>
            Anda yakin ingin mengubah data ini?
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
               Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                editMerchant();
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
                Iya, Ubah Data Ini
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
      <BottomSheet  isVisible={openBottom} onBackdropPress={()=>{
  setOpenBottom(false);
}}>
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
             pickImage()
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
             pickGalery();
            }}
          >
            <Text style={style.textBtn}>Ambil dari Galeri</Text>
          </TouchableOpacity>
         
        </View>

</BottomSheet>
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
    height:45,
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
    fontWeight: '600',
    textAlign: 'center',
  },
});
