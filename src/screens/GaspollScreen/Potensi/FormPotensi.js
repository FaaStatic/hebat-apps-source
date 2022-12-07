import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  InteractionManager,
  Platform
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { Header } from '../../Komponen/Header';
import Gaplist from '../../Komponen/GapList';
import { Dialog } from '@rneui/themed';
import { Api } from '../../../util/ApiManager';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { colorApp, stringApp } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';
import { useFocusEffect } from '@react-navigation/native';

const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');

export default function FormPotensi({ navigation, route }) {
  const { id, id_potensi, modelData } = route.params;
  const [responseItem, setResponseItem] = useState([]);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [npwpd, setNpwpd] = useState('');
  const [namaUsaha, setNamaUsaha] = useState('');
  const [alamatUsaha, setAlamatUsaha] = useState('');
  const [kota, setKota] = useState(null);
  const [kecamatan, setKecamatan] = useState(null);
  const [kelurahan, setKelurahan] = useState(null);
  const [nik, setNik] = useState('');
  const [owner, setOwner] = useState('');
  const [ownerAdress, setOwnerAdress] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [klasifikasiUsaha, setKlasifikasiUsaha] = useState('');
  const [pendapatan, setPendapatan] = useState(null);
  const [pajak, setPajak] = useState(null);
  const [petugas, setPetugas] = useState('');
  const [idpotensi, setIdPotensi] = useState('');
  const [kategoriKota, setKategoriKota] = useState([]);
  const [kategoriKecamatan, setKategoriKecamatan] = useState([]);
  const [kategoriKelurahan, setKategoriKelurahan] = useState([]);
  const [sesiAkun, setSesiAkun] = useState('');
  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingVillage, setLoadingVillage] = useState(false);
  const [selectCityId, setSelectCityId] = useState('');
  const [selectDistrictId, setSelectDictrictId] = useState('');
  const [selectVillageId, setSelectVillageId] = useState('');
  const [selectKtegoriId, setSelectKategoriId] = useState('');


  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      if (id_potensi === null) {
        getSesi();
        getForm();
      } else {
        getSesi();
        getDetail();
      }
    });
    return()=> task.cancel();
  },[]));


  

  const getSesi = () => {
    var sesi = SessionManager.GetAsObject(stringApp.session);
    setSesiAkun(sesi.nama);
  };

  const getDetail = async () => {
    const params = {
      id: id,
      id_potensi: id_potensi,
    };
    await Api.post('Pendaftaran/detail_potensi', params)
      .then((res) => {
        var body = res.data;
        var status = body.metadata.status;
        var message = body.metadata.message;
        var response = body.response;
        if (status === 200) {
        
          setResponseItem(response);
          setNpwpd(response.npwpdwp === '' ? '...' : response.npwpdwp);
          setNamaUsaha(response.nama);
          setAlamatUsaha(response.alamat);
          setKota(response.keterangan_kota === '' ? null : response.keterangan_kota);
          setKecamatan(response.keterangan_kec === '' ? null : response.keterangan_kec);
          setKelurahan(response.keterangan_kel === '' ? null : response.keterangan_kel);
          setKlasifikasiUsaha(response.kategori);
          setOwner(response.pemilik);
          setNik(response.nik_pemilik);
          setOwnerAdress(response.alamat_pemilik);
          setOwnerPhone(response.no_telp);
          setPendapatan(Number(response.pendapatan));
          setPajak(Number(response.pajak));
          setSelectCityId(response.kota);
          setSelectDictrictId(response.kecamatan);
          setSelectVillageId(response.kelurahan);
          setSelectKategoriId(response.id_kategori);
          setLoadingScreen(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log('err1', err);
        console.log('====================================');
        setLoadingScreen(false);
      });
  };

  const getForm = async () => {
    setLoadingScreen(true);
    const params = {
      id: id,
    };
    await Api.post('pendaftaran/potensi', params)
      .then((res) => {
        var body = res.data;
        var status = body.metadata.status;
        var message = body.metadata.message;
        var response = body.response;
        if (status === 200) {
          console.log('====================================');
          console.log(response);
          console.log('====================================');
          setResponseItem(response);
          setNpwpd(response.npwpdwp === '' ? 'Still On Process' : response.npwpdwp);
          setNamaUsaha(response.nama);
          setAlamatUsaha(response.alamat);
          setKota(response.keterangan_kota === '' ? null : response.keterangan_kota);
          setKecamatan(response.keterangan_kec === '' ? null : response.keterangan_kec);
          setKelurahan(response.keterangan_kel === '' ? null : response.keterangan_kel);
          setKlasifikasiUsaha(response.kategori);
          setIdPotensi(response.id_user_potensi);
          setLoadingScreen(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log('err2', err);
        console.log('====================================');
        setLoadingScreen(false);
      });
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
        <Text style={Style.textInput}>{item.kota}</Text>
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
        <Text style={Style.textInput}>{item.kecamatan}</Text>
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
        <Text style={Style.textInput}>{item.kelurahan}</Text>
      </TouchableOpacity>
    );
  }, []);

  const continueAddMerchant = () => {
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const param = {
      id_merchant: id,
      id_user_potensi: sesi.id,
      id_kategori: responseItem.id_kategori,
      pendapatan: pendapatan,
      pajak: pajak,
      idp: '',
      id_potensi: '',
      flag_sumber: '',
      flag: '',
    };
    navigation.navigate('FormKelengkapan', {
      modelData: param,
    });
  };

  const continueEditMerchant = () => {
    const param = {
      id_merchant: id,
      id_user_potensi: responseItem.id_user_potensi,
      id_kategori: responseItem.id_kategori,
      pendapatan: pendapatan,
      pajak: pajak,
      idp: '',
      id_potensi: id_potensi,
      flag_sumber: '',
      flag: 'edit',
    };
    navigation.navigate('FormKelengkapan', {
      modelData: param,
    });
  };

  return (
    <View style={Style.container}>
      <Header
        Title={id_potensi === null ? 'Form Potensi' : 'Detail Potensi'}
        back={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        style={{
          paddingEnd: 16,
          paddingStart: 16,
          paddingBottom: 8,
          paddingTop: 8,
          paddingTop: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>NPWPD</Text>
        <View style={Style.backgroundTextInput}>
          <TextInput
            keyboardType="number-pad"
            style={Style.textInput}
            value={npwpd}
            onChangeText={(txt) => {
              setNpwpd(txt);
            }}
          />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>Nama Usaha</Text>
        <View style={Style.backgroundTextInput}>
          <TextInput
            style={Style.textInput}
            value={namaUsaha}
            onChangeText={(txt) => {
              setNamaUsaha(txt);
            }}
          />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>Alamat Usaha</Text>
        <View style={Style.backgroundTextInput}>
          <TextInput
            style={Style.textInput}
            value={alamatUsaha}
            onChangeText={(txt) => {
              setAlamatUsaha(txt);
            }}
          />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>Kota</Text>
        <TouchableOpacity
          style={Style.backgroundTextInput}
          onPress={() => {
            processCity();
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: 'black',
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            {kota === '' ? '...' : kota}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>Kecamatan</Text>
        <TouchableOpacity
          style={Style.backgroundTextInput}
          onPress={() => {
            processDistrict();
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: 'black',
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            {kecamatan === '' ? '...' : kecamatan}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>Kelurahan</Text>
        <TouchableOpacity
          style={Style.backgroundTextInput}
          onPress={() => {
            processVillage();
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: 'black',
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            {kelurahan === '' ? '...' : kelurahan}
          </Text>
        </TouchableOpacity>
        <Gaplist />
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>NIK Pemilik Usaha</Text>
        <View style={Style.backgroundTextInput}>
          <TextInput
            style={Style.textInput}
            value={nik}
            onChangeText={(txt) => {
              setNik(txt);
            }}
          />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>Nama Pemilik Usaha</Text>
        <View style={Style.backgroundTextInput}>
          <TextInput
            style={Style.textInput}
            value={owner}
            onChangeText={(txt) => {
              setOwner(txt);
            }}
          />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>Alamat Pemilik Usaha</Text>
        <View style={Style.backgroundTextInput}>
          <TextInput
            style={Style.textInput}
            value={ownerAdress}
            onChangeText={(txt) => {
              setOwnerAdress(txt);
            }}
          />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>Telpon Pemilik Usaha</Text>
        <View style={Style.backgroundTextInput}>
          <TextInput
            style={Style.textInput}
            keyboardType={'number-pad'}
            value={ownerPhone}
            onChangeText={(txt) => setOwnerPhone(txt)}
          />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>klasifikasi Usaha</Text>
        <View style={Style.backgroundTextInput}>
          <TextInput style={Style.textInput} value={klasifikasiUsaha} editable={false} />
        </View>
        <Gaplist />
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>
          Pendapatan Per Bulan (Rp)
        </Text>
        <View style={Style.backgroundTextInput}>
          <CurrencyInput
            value={pendapatan}
            onChangeValue={setPendapatan}
            prefix="Rp"
            delimiter="."
            separator=","
            precision={2}
            minValue={0}
            onChangeText={(formattedValue) => {
              console.log(formattedValue); // R$ +2.310,46
            }}
            style={Style.textInput}
          />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>
          Pajak Per Bulan (Rp)
        </Text>
        <View style={Style.backgroundTextInput}>
          <CurrencyInput
            value={pajak}
            onChangeValue={setPajak}
            prefix="Rp"
            delimiter="."
            separator=","
            precision={2}
            minValue={0}
            onChangeText={(formattedValue) => {
              console.log(formattedValue); // R$ +2.310,46
            }}
            style={Style.textInput}
          />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>Petugas</Text>
        <View style={Style.backgroundTextInput}>
          <TextInput value={sesiAkun} editable={false} style={Style.textInput} />
        </View>

        <TouchableOpacity
          onPress={() => {
            {
              id_potensi !== null ? continueEditMerchant() : continueAddMerchant();
            }
          }}
          style={Style.btnSimpan}
        >
          <Text style={Style.textBtn}>{id_potensi === null ? 'Simpan' : 'Lihat Potensi'}</Text>
        </TouchableOpacity>
      </ScrollView>

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
            height: ViewHeight / 2,
            backgroundColor: 'white',
            padding: 8,
            justifyContent: 'center',

            borderRadius: 8,
          }}
        >
          <Text
            style={[
              Style.textInput,
              {
                alignSelf: 'center',
                fontWeight: '800',
                marginBottom: 8,
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
            height: ViewHeight / 2,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 8,
            justifyContent: 'center',
          }}
        >
          <Text
            style={[
              Style.textInput,
              {
                alignSelf: 'center',
                fontWeight: '800',
                marginBottom: 8,
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
            height: ViewHeight / 2,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 8,
            justifyContent: 'center',
          }}
        >
          <Text
            style={[
              Style.textInput,
              {
                alignSelf: 'center',
                fontWeight: '800',
                marginBottom: 8,
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
    </View>
  );
}

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  textInput: {
    padding: 0,
    fontSize: 16,
    color: 'black',
    paddingTop: 8,
    paddingBottom: 8,
  },
  backgroundTextInput: {
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 4,
    paddingBottom:4,
    paddingStart:8,
    height:50,
    borderRadius: 8,
    backgroundColor: '#dadce0',
  },
  btnSimpan: {
    backgroundColor: colorApp.button.primary,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  textBtn: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
