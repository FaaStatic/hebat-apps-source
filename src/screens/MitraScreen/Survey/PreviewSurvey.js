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
  InteractionManager,
} from 'react-native';
import { Image, Dialog, CheckBox, BottomSheet } from '@rneui/themed';
import MapView, { Marker } from 'react-native-maps';
import SignatureScreen from 'react-native-signature-canvas';
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
import GapList from '../../Komponen/GapList';
import { useFocusEffect } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';

const { height: viewHeight, width: viewWidth } = Dimensions.get('window');

var latitude = 0;
var longitude = 0;
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;

const PreviewSurvey = ({ navigation, route }) => {
  const { modelData } = route.params;
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
  const [openBottom, setOpenBottom] = useState(false);

  const signatureRef = useRef();
  const mapsLayout = useRef();

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        clearData();
        getCategory(modelData.klasifikasi_usaha);
        loadData();
      });
      return () => task.cancel();
    }, [])
  );

  const loadData = () => {
    console.log('====================================');
    console.log(modelData);
    console.log('====================================');
    setNamaUsaha(modelData.nama_usaha);
    setAlamatUsaha(modelData.alamat);
    setKota(modelData.kota);
    setNik(modelData.nik_pemilik);
    setKecamatan(modelData.kecamatan);
    setMerchantPhone(modelData.telp_usaha);
    setKelurahan(modelData.kelurahan);
    setSelectCityId(modelData.idKota);
    setSelectDictrictId(modelData.idKecamatan);
    setSelectVillageId(modelData.idKelurahan);
    setOwner(modelData.pemilik);
    setOwnerAdress(modelData.alamat_pemilik);
    setOwnerPhone(modelData.no_telp_pemilik);
    setFileList(modelData.image);
    setSavingFileData(modelData.savingImg);
    switch (modelData.bidang_usaha) {
      case 'Badan Usaha':
        checkBadanUsahaFunc();
        break;
      case 'Badan Pribadi':
        checkBadanPribadiFunc();
        break;
      default:
        checkBadanPribadiFunc();
        break;
    }

    setMapState({
      latitude: Number(modelData.latitude),
      longitude: Number(modelData.longitude),
      latitudeDelta: limitlatitudeDelta,
      longitudeDelta: limitLongitudeDelta,
    });
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

  const convertResponse = async (data, kategori) => {
    var i = 0;
    var temp = [];

    while (i < data.length) {
      var dataSet = {
        label: data[i].kategori,
        value: data[i].id,
      };
      if (kategori === data[i].id) {
        setValueCategory(data[i].id);
      }
      temp.push(dataSet);
      i++;
    }
    setListData(temp);
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

  const simpanData = async () => {
    if (ttd.length === 0) {
      MessageUtil.errorMessage('tanda tangan diisi terlebih dahulu!');
      return;
    }
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      user_login: sesi.id,
      id: modelData.id,
      idp: modelData.idp,
      nama: modelData.nama_usaha,
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
          navigation.replace('BerandaMitra');
        } else {
          MessageUtil.warningMessage(message);
          // setOpenDialog4(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(`${err}`);
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
      <HeaderWithoutHistory Title={'Preview Form'} back={() => navigation.goBack()} />
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
                editable={false}
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
                editable={false}
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
                //processCity();
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
                //processDistrict();
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
                //processVillage();
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
                editable={false}
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
                disabled={true}
                title={'Badan Usaha'}
                checked={checkBadanUsaha}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={colorApp.button.primary}
                uncheckedColor={colorApp.button.primary}
                style={{
                  marginEnd: 8,
                }}
                onPress={() => {
                  checkBadanUsahaFunc();
                }}
              />
              <CheckBox
                disabled={true}
                title={'Badan Pribadi'}
                checked={checkBadanPribadi}
                checkedColor={colorApp.button.primary}
                uncheckedColor={colorApp.button.primary}
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
                editable={false}
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
                editable={false}
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
                editable={false}
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
                editable={false}
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
                open={false}
                value={valueCategory}
                items={listData}
                setOpen={false}
                placeholder={'Pilih Kategori Klasifikasi Usaha'}
                setValue={setValueCategory}
                containerStyle={{
                  backgroundColor: 'white',
                }}
                dropDownContainerStyle={{
                  elevation: 2,
                  backgroundColor: 'white',
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
                  },
                ]}
              >
                Tunggu Sebentar ...
              </Text>
            )}
            <Text style={style.textInput}>Keterangan</Text>
            <View style={style.textInputContainer}>
              <TextInput
                style={style.styleInput}
                value={keterangan}
                editable={false}
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

          {/* {status === null && (
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
          )} */}

          {fileList.length > 0 ? (
            <FlatList
              nestedScrollEnabled={true}
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
                  </View>
                );
              }}
            />
          ) : (
            <></>
          )}

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
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <Dialog
        overlayStyle={{
          backgroundColor: 'white',
          paddingTop: 16,
          paddingBottom: 16,
          flexDirection: 'column',
          justifyContent: 'center',
          height: viewHeight / 1.8,
        }}
        isVisible={modalConfirm}
        onBackdropPress={() => {
          setModalConfirm(false);
        }}
      >
        <Text
          numberOfLines={3}
          style={{
            alignSelf: 'center',
            marginEnd: 24,
            marginStart: 24,
            fontSize: 12,
            marginBottom: 16,
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
            borderRadius: 8,
            backgroundColor: colorApp.button.primary,
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

      <Dialog
        overlayStyle={{
          flexDirection: 'column',
          padding: 24,
          height: viewHeight / 4.5,
        }}
        isVisible={openDialog4}
      >
        <Text
          style={[
            style.styleInput,
            {
              color: 'black',
              textAlign: 'center',
              fontSize: 14,
              fontFamily: fontsCustom.primary[700],
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
              height: 35,
              marginBottom: 16,
              marginStart: 8,
              marginEnd: 4,
              padding: 4,
            }}
          >
            <Text
              style={[
                style.styleInput,
                {
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
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
              height: 35,
              marginStart: 4,
              marginEnd: 8,
              backgroundColor: colorApp.button.primary,
              borderRadius: 8,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                style.styleInput,
                {
                  fontSize: 12,
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
    </View>
  );
};

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
    height: 50,
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

export default PreviewSurvey;
