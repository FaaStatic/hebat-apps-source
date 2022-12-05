import React, { useState, useRef, useCallback } from 'react';
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
  InteractionManager
} from 'react-native';
import { Image, Dialog, CheckBox } from '@rneui/themed';
import MapView, { Marker } from 'react-native-maps';
import SignatureScreen from 'react-native-signature-canvas';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Api } from '../../../util/ApiManager';
import { launchCamera } from 'react-native-image-picker';
import { PermissionUtil } from '../../../util/PermissionUtil';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { colorApp, stringApp } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';
import { HeaderWithoutHistory } from '../../Komponen/HeaderWithoutHistory';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import GapList from '../../Komponen/GapList';
import { useFocusEffect } from '@react-navigation/native';

const { height: viewHeight, width: viewWidth } = Dimensions.get('window');

var latitude = 0;
var longitude = 0;
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;

export default function FormSurvey({ navigation, route }) {
  const { modelData, status } = route.params;
  const fs = RNFetchBlob.fs;
  const [namaUsaha, setNamaUsaha] = useState('');
  const [alamatUsaha, setAlamatUsaha] = useState('');
  const [kota, setKota] = useState(null);
  const [kecamatan, setKecamatan] = useState(null);
  const [kelurahan, setKelurahan] = useState(null);
  const [nik, setNik] = useState('');
  const [owner, setOwner] = useState('');
  const [ownerAdress, setOwnerAdress] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [merchantPhone, setMerchantPhone] = useState('');
  const [klasifikasiUsaha, setKlasifikasiUsaha] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [open, setOpen] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [listData, setListData] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [savingFileData, setSavingFileData] = useState([]);
  const [loadingField, setLoadingField] = useState(false);
  const [mapState, setMapState] = useState({
    latitude: Number(modelData.latitude),
    longitude: Number(modelData.longitude),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [checkBadanUsaha, setCheckBadanUsaha] = useState(false);
  const [checkBadanPribadi, setCheckBadanPribadi] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [selectCityId, setSelectCityId] = useState('');
  const [selectDistrictId, setSelectDictrictId] = useState('');
  const [selectVillageId, setSelectVillageId] = useState('');
  const [selectKtegoriId, setSelectKategoriId] = useState('');
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingVillage, setLoadingVillage] = useState(false);
  const [kategoriKota, setKategoriKota] = useState([]);
  const [kategoriKecamatan, setKategoriKecamatan] = useState([]);
  const [kategoriKelurahan, setKategoriKelurahan] = useState([]);
  const [ttd, setTtd] = useState('');
  const [openDialog4, setOpenDialog4] = useState(false);
  const [businessType, setBusinessType] = useState('');

  const signatureRef = useRef();
  const mapsLayout = useRef();

  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      clearData();
      loadData();
    });
    return()=> task.cancel();
  },[]));



  const loadData = () => {
    setNamaUsaha(modelData.nama);
    setAlamatUsaha(modelData.alamat);
    setKota(modelData.nama_kota);
    setKecamatan(modelData.nama_kecamatan);
    setKelurahan(modelData.nama_kelurahan);
    setOwner(modelData.pemilik);
    setOwnerAdress(modelData.alamat_pemilik);
    setOwnerPhone(modelData.no_telp);
    setFileList(modelData.image);
    modelData.image.map((item) => {
      console.log('====================================');
      console.log(item);
      console.log('====================================');

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
    listData.map((item) => {
      console.log('====================================');
      console.log(item);
      console.log('====================================');
      if (item.kategori === modelData.kategori) {
        setValueCategory(item.id);
      }
    });
    var loc = {
      latitude: Number(modelData.latitude),
      longitude: Number(modelData.longitude),
      latitudeDelta: limitlatitudeDelta,
      longitudeDelta: limitLongitudeDelta,
    };
    setMapState(loc);
    getCategory(modelData.kategori);
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

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const removeItem = (value) => {
    console.log('====================================');
    console.log(savingFileData);
    console.log('====================================');
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

  const checkBadanUsahaFunc = () => {
    setCheckBadanUsaha(true);
    setCheckBadanPribadi(false);
    setBusinessType('Badan Usaha');
  };

  const checkBadanPribadiFunc = () => {
    setCheckBadanPribadi(true);
    setCheckBadanUsaha(false);
    setBusinessType('Badan Pribadi');
  };

  const clearData = () => {
    latitude = -6.966667;
    longitude = 110.416664;
    setFileList([]);
    setListData([]);
    setSavingFileData([]);
    tempData = [];
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

  const convertResponse = async (data, kategori) => {
    var i = 0;
    var temp = [];

    while (i < data.length) {
      var dataSet = {
        label: data[i].kategori,
        value: data[i].id,
      };
      if (kategori === data[i].kategori) {
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

  const processCity = async () => {
    getKota();
  };

  const processDistrict = async () => {
    if (selectCityId === '') {
      MessageUtil.warningMessage('Pilih Kota terlebih Dahulu!');
    } else {
      getKecamatan(selectCityId);
    }
  };

  const processVillage = async () => {
    if (selectDistrictId === '') {
      MessageUtil.warningMessage('Pilih Kecamatan terlebih Dahulu!');
    } else {
      getKelurahan(selectDistrictId);
    }
  };

  const selectCity = (item) => {
    setSelectCityId(item.id);
    setKota(item.kota);
    setOpenDialog1(false);
  };

  const selectDistrict = (item) => {
    setSelectDictrictId(item.id);
    setKecamatan(item.kecamatan);
    setOpenDialog2(false);
  };

  const selectVillage = (item) => {
    setSelectVillageId(item.id);
    setKelurahan(item.kelurahan);
    setOpenDialog3(false);
  };

  const getKota = async () => {
    setLoadingCity(true);
    await Api.get('Master/kota')
      .then((res) => {
        var body = res.data;
        var status = body.metadata.status;
        var message = body.metadata.message;
        var response = body.response;
        console.log('====================================');
        console.log(response);
        console.log('====================================');
        if (status === 200) {
          setKategoriKota(response);
          setLoadingCity(false);
          setOpenDialog1(true);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log('err3', err);
        setLoadingCity(false);
        console.log('====================================');
      });
  };

  const getKecamatan = async (id) => {
    setLoadingDistrict(true);
    await Api.post('Master/kecamatan', { id_kota: id })
      .then((res) => {
        var body = res.data;
        var status = body.metadata.status;
        var message = body.metadata.message;
        var response = body.response;
        if (status === 200) {
          setKategoriKecamatan(response);
          setLoadingDistrict(false);
          setOpenDialog2(true);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log('err4', err);
        setLoadingDistrict(false);
        console.log('====================================');
      });
  };
  const getKelurahan = async (id) => {
    setLoadingVillage(true);
    await Api.post('Master/kelurahan', { id_kecamatan: id })
      .then((res) => {
        var body = res.data;
        var status = body.metadata.status;
        var message = body.metadata.message;
        var response = body.response;
        if (status === 200) {
          setKategoriKelurahan(response);
          setLoadingVillage(false);
          setOpenDialog3(true);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log('err5', err);
        setLoadingVillage(false);
        console.log('====================================');
      });
  };

  const renderItemCity = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 4,
          marginBottom: 4,
          borderRadius: 8,
          padding: 4,
          borderBottomWidth: 0.5,
          borderColor: 'black',
        }}
        onPress={() => {
          selectCity(item);
        }}
      >
        <Text style={style.styleInput}>{item.kota}</Text>
      </TouchableOpacity>
    );
  }, []);

  const renderItemDistrict = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 4,
          marginBottom: 4,
          borderRadius: 8,
          padding: 4,
          borderBottomWidth: 0.5,
          borderColor: 'black',
        }}
        onPress={() => {
          selectDistrict(item);
        }}
      >
        <Text style={style.styleInput}>{item.kecamatan}</Text>
      </TouchableOpacity>
    );
  }, []);

  const renderItemVillage = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 4,
          marginBottom: 4,
          borderRadius: 8,
          padding: 4,
          borderBottomWidth: 0.5,
          borderColor: 'black',
        }}
        onPress={() => {
          selectVillage(item);
        }}
      >
        <Text style={style.styleInput}>{item.kelurahan}</Text>
      </TouchableOpacity>
    );
  }, []);

  const handleOK = (signature) => {
    console.log(signature);
    var data = signature.replace('data:image/png;base64,', '');
    setTtd(data);
    console.log('====================================');
    console.log(data);
    console.log('====================================');
  };

  const clearSignature = () => {
    signatureRef.current.clearSignature();
  };

  const saveSurvey = () => {
    signatureRef.current.readSignature();
    setTimeout(() => {
      setModalConfirm(false);
      setOpenDialog4(true);
      clearTimeout();
    }, 1000);
  };

  const updateData = async () => {
    if (ttd.length === 0) {
      MessageUtil.errorMessage('tanda tangan diisi terlebih dahulu!');
      return;
    }
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      user_login: sesi.id,
      id: modelData.id,
      idp: modelData.idp,
      nama: namaUsaha,
      alamat: alamatUsaha,
      telp_usaha: merchantPhone,
      bidang_usaha: businessType,
      pemilik: owner,
      alamat_pemilik: ownerAdress,
      nik_pemilik: nik,
      latitude: mapState.latitude,
      longitude: mapState.longitude,
      kategori: valueCategory,
      no_telp: ownerPhone,
      kelurahan: selectVillageId,
      kecamatan: selectDistrictId,
      kota: selectCityId,
      ttd: ttd,
      image: savingFileData,
      keterangan: keterangan,
    };
    await Api.post('Survey/edit_merchant', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var message = body.metadata.message;
        var status = body.metadata.status;
        if (status === 200) {
          MessageUtil.successMessage(message);
          navigation.replace('BerandaGaspoll');
        } else {
          MessageUtil.warningMessage(message);
          // setOpenDialog4(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}
    >
      <HeaderWithoutHistory Title={'Input Data Survey'} back={() => navigation.goBack()} />
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
            <Text style={style.textInput}>Nama Usaha</Text>
            <View style={style.textInputContainer}>
              <TextInput
                editable={status === null ? true : false}
                style={style.styleInput}
                value={namaUsaha}
                keyboardType={'default'}
                onChangeText={(value) => {
                  setNamaUsaha(value);
                }}
              />
            </View>
            <Text style={style.textInput}>Alamat Usaha</Text>

            <View style={style.textInputContainer}>
              <TextInput
                editable={status === null ? true : false}
                style={style.styleInput}
                keyboardType={'default'}
                value={alamatUsaha}
                onChangeText={(value) => {
                  setAlamatUsaha(value);
                }}
              />
            </View>
            <Text style={style.textInput}>Kota</Text>

            <TouchableOpacity
              onPress={() => {
                if (status === null) {
                  processCity();
                }
              }}
              style={style.textInputContainer}
            >
              <Text
                style={[
                  style.styleInput,
                  {
                    fontSize: 14,
                    alignSelf: 'center',
                    fontWeight: '400',
                    marginTop: 4,
                    marginBottom: 4,
                  },
                ]}
              >
                {kota === '' ? '' : kota}
              </Text>
            </TouchableOpacity>

            <Text style={style.textInput}>Kecamatan</Text>
            <TouchableOpacity
              onPress={() => {
                if (status === null) {
                  processDistrict();
                }
              }}
              style={style.textInputContainer}
            >
              <Text
                style={[
                  style.styleInput,
                  {
                    fontSize: 14,
                    alignSelf: 'center',
                    fontWeight: '400',
                    marginTop: 4,
                    marginBottom: 4,
                  },
                ]}
              >
                {kecamatan == '' ? '' : kecamatan}
              </Text>
            </TouchableOpacity>

            <Text style={style.textInput}>Kelurahan</Text>
            <TouchableOpacity
              onPress={() => {
                if (status === null) {
                  processVillage();
                }
              }}
              style={style.textInputContainer}
            >
              <Text
                style={[
                  style.styleInput,
                  {
                    fontSize: 14,
                    alignSelf: 'center',
                    fontWeight: '400',
                    marginTop: 4,
                    marginBottom: 4,
                  },
                ]}
              >
                {kelurahan === '' ? '' : kelurahan}
              </Text>
            </TouchableOpacity>
            <Text style={style.textInput}>Telp Usaha</Text>
            <View style={style.textInputContainer}>
              <TextInput
                style={style.styleInput}
                editable={status === null ? true : false}
                keyboardType={'number-pad'}
                value={merchantPhone}
                onChangeText={(value) => {
                  setMerchantPhone(value);
                }}
              />
            </View>
            <Text style={style.textInput}>Bidang Usaha</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <CheckBox
                title={'Badan Usaha'}
                checked={checkBadanUsaha}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                style={{
                  marginEnd: 8,
                }}
                onPress={() => {
                  checkBadanUsahaFunc();
                }}
              />
              <CheckBox
                title={'Badan Pribadi'}
                checked={checkBadanPribadi}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                onPress={() => {
                  checkBadanPribadiFunc();
                }}
              />
            </View>
            <GapList />

            <Text style={style.textInput}>Nama Pemilik</Text>
            <View style={style.textInputContainer}>
              <TextInput
                style={style.styleInput}
                value={owner}
                keyboardType={'default'}
                onChangeText={(value) => {
                  setOwner(value);
                }}
              />
            </View>

            <Text style={style.textInput}>NIK</Text>
            <View style={style.textInputContainer}>
              <TextInput
                style={style.styleInput}
                value={nik}
                keyboardType={'number-pad'}
                onChangeText={(value) => {
                  setNik(value);
                }}
              />
            </View>
            <Text style={style.textInput}>Alamat Pemilik</Text>
            <View style={style.textInputContainer}>
              <TextInput
                style={style.styleInput}
                value={ownerAdress}
                keyboardType={'default'}
                onChangeText={(value) => {
                  setOwnerAdress(value);
                }}
              />
            </View>
            <Text style={style.textInput}>Telp</Text>
            <View style={style.textInputContainer}>
              <TextInput
                style={style.styleInput}
                value={ownerPhone}
                keyboardType={'number-pad'}
                onChangeText={(value) => {
                  setOwnerPhone(value);
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
              Klasifikasi Usaha
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
            <Text style={style.textInput}>Keterangan</Text>
            <View style={style.textInputContainer}>
              <TextInput
                style={style.styleInput}
                value={keterangan}
                keyboardType={'default'}
                multiline={true}
                numberOfLines={10}
                textAlign={'left'}
                textAlignVertical={'top'}
                onChangeText={(value) => {
                  setKeterangan(value);
                }}
              />
            </View>
          </View>

          <GapList />
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
            provider={MapView.PROVIDER_GOOGLE}
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

          {status === null && (
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
          )}
          {status === null && (
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
          )}

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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalConfirm(true);
                }}
                style={{
                  backgroundColor: 'white',
                  width: 100,
                  justifyContent: 'center',
                  borderRadius: 8,
                  height: 45,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    color: '#669beb',
                    fontSize: 14,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}
                >
                  Simpan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#669beb',
                  width: 100,
                  justifyContent: 'center',
                  borderRadius: 8,
                  height: 45,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}
                >
                  Preview
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

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
            height: viewHeight / 2,
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              alignSelf: 'center',
              marginEnd: 24,
              marginStart: 24,
              fontSize: 12,
              marginBottom: 8,
              fontWeight: '400',
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
              color: '#00FFFF',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '400',
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
              fontWeight: '400',
            }}
          >
            (Wajib Pajak)
          </Text>

          <TouchableOpacity
            onPress={() => {
              saveSurvey();
            }}
            style={{
              justifyContent: 'center',
              marginEnd: 8,
              marginStart: 8,
              marginBottom: 8,
              flexDirection: 'column',
              marginTop: 16,
              padding: 8,
              backgroundColor: '#669beb',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                fontWeight: '600',
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
        isVisible={openDialog1}
        onBackdropPress={() => {
          setOpenDialog1(false);
        }}
      >
        <View
          style={{
            marginStart: 4,
            marginEnd: 4,
            height: viewHeight / 2,
            backgroundColor: 'white',
            padding: 8,
            justifyContent: 'center',

            borderRadius: 8,
          }}
        >
          <Text
            style={[
              style.textInput,
              {
                alignSelf: 'center',
                fontWeight: '800',
                marginBottom: 8,
                textAlign: 'center',
              },
            ]}
          >
            Daftar Kota
          </Text>
          <FlatList
            data={kategoriKota}
            keyExtractor={(item) => item.id}
            renderItem={renderItemCity}
          />
        </View>
      </Dialog>
      <Dialog
        isVisible={openDialog2}
        onBackdropPress={() => {
          setOpenDialog2(false);
        }}
      >
        <View
          style={{
            marginStart: 4,
            marginEnd: 4,
            height: viewHeight / 2,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 8,
            justifyContent: 'center',
          }}
        >
          <Text
            style={[
              style.textInput,
              {
                alignSelf: 'center',
                fontWeight: '800',
                marginBottom: 8,
                textAlign: 'center',
              },
            ]}
          >
            Daftar Kecamatan
          </Text>
          <FlatList
            data={kategoriKecamatan}
            keyExtractor={(item) => item.id}
            renderItem={renderItemDistrict}
          />
        </View>
      </Dialog>
      <Dialog
        isVisible={openDialog3}
        onBackdropPress={() => {
          setOpenDialog3(false);
        }}
      >
        <View
          style={{
            marginStart: 4,
            marginEnd: 4,
            height: viewHeight / 2,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 8,
            justifyContent: 'center',
          }}
        >
          <Text
            style={[
              style.textInput,
              {
                alignSelf: 'center',
                fontWeight: '800',
                marginBottom: 8,
                textAlign: 'center',
              },
            ]}
          >
            Daftar Kelurahan
          </Text>
          <FlatList
            data={kategoriKelurahan}
            keyExtractor={(item) => item.id}
            renderItem={renderItemVillage}
          />
        </View>
      </Dialog>

      <Dialog isVisible={openDialog4}>
        <View
          style={{
            flexDirection: 'column',
            padding: 4,

            height: 125,
          }}
        >
          <Text
            style={[
              style.styleInput,
              {
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
              justifyContent: 'space-around',
              padding: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setOpenDialog4(false);
              }}
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                height: 45,
                marginStart: 8,
                marginEnd: 4,
                padding: 4,
              }}
            >
              <Text
                style={[
                  style.styleInput,
                  {
                    fontWeight: '700',
                    color: 'gray',
                  },
                ]}
              >
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateData();
              }}
              style={{
                height: 45,
                marginStart: 4,
                marginEnd: 8,
                padding: 4,
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Text
                style={[
                  style.styleInput,
                  {
                    fontWeight: '700',
                    color: '#FC572C',
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
    paddingTop: 4,
    paddingBottom: 4,
  },
  textInputContainer: {
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
    paddingTop: 8,
    paddingBottom: 8,
  },
});
