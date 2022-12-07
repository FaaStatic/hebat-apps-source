import React, { useState } from 'react';
import { View, StatusBar, Platform, Text, Modal, Image } from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import { MessageUtil } from '../../../../util/MessageUtil';
import ServiceHelper from '../../addOns/ServiceHelper';
import { IcBerhasil, IcMainMenuRegistrasi, stylesheet } from '../../assets';
import { CustomModal, Gap } from '../../components';
import HeaderSubMenuDetail from '../../components/HeaderSubMenuDetail';
import Final from './includeform/Final';
import FormPageDua from './includeform/FormPageDua';
import FormPageEmpat from './includeform/FormPageEmpat';
import FormPageSatu from './includeform/FormPageSatu';
import FormPageTiga from './includeform/FormPageTiga';
const APPBAR_HEIGHT = Platform.isPad == true ? 180 : 140;
const APPBAR_HEIGHT_2 = Platform.isPad == true ? 135 : 105;
export default FormRegistrasi = ({ navigation, route }) => {
  const { data } = route.params;
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [detik, setDetik] = useState(5);
  const [page, setPage] = useState([
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
  ]);
  const [dataFormSatu, setDataFormSatu] = useState('');
  const [dataFormDua, setDataFormDua] = useState('');
  const [dataFormTiga, setDataFormTiga] = useState('');
  const [dataFormEmpat, setDataFormEmpat] = useState('');
  const [active, setActive] = useState(1);
  const actionClickButton = async (page, data) => {
    if (page != 5) {
      if (page == 1) {
        setDataFormSatu(data);
        console.log(data);
      } else if (page == 2) {
        setDataFormDua(data);
        console.log(data);
      } else if (page == 3) {
        setDataFormTiga(data);
        console.log(data);
      } else if (page == 4) {
        setDataFormEmpat(data);
        console.log(data);
      }
      actionNextPage(page);
    } else {
      setLoading(true);
      let file = await actionFile(data);
      await actionPostDataFormulir(data, file);
    }
  };
  const actionFile = async (data) => {
    let files = [];
    data[3].file.map((item) => {
      const value = {
        name: item.fileName,
        type: item.type,
        uri: Platform.OS === 'ios' ? item.uri.replace('file://', '') : item.uri,
      };
      files.push(value);
    });
    return files;
  };
  const actionPostDataFormulir = async (datas, file) => {
    const formData = new FormData();
    formData.append('jenisobjek', data.name == 'Pribadi' ? 1 : 2);
    formData.append('nama_usaha', datas[0].nama);
    formData.append('bidang_usaha', datas[0].jenis);
    formData.append('notelp_usaha', datas[0].noTelp);
    formData.append('email_usaha', datas[0].email);
    formData.append('nama_pemilik', datas[1].nama);
    formData.append('alamat_pemilik', datas[1].alamat);
    formData.append('notelp_pemilik', datas[1].noTelp);
    formData.append('notelp_pemilik', datas[1].nik_pemilik);
    formData.append('alamat_usaha', datas[2].alamat);
    formData.append('rt', datas[2].rt);
    formData.append('rw', datas[2].rw);
    formData.append('kode_kel', datas[2].kode_kel);
    formData.append('kode_kec', datas[2].kode_kec);
    formData.append('kota', datas[2].kota);
    formData.append('latitude', datas[2].latitude);
    formData.append('longitude', datas[2].longitude);
    formData.append('attachment', file);
    var res = await ServiceHelper.actionServicePostWithFormData('E_register/simpatda', formData);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      setLoading(false);
      setTimeout(() => {
        setModal(true);
        setTimmer();
      }, 500);
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const setTimmer = () => {
    setTimeout(() => {
      const data = {
        nama: 'E-Register',
        logo: IcMainMenuRegistrasi,
      };
      navigation.navigate('MainSubMenu', { data: data });
    }, 6000);
    let interval = setInterval(() => {
      setDetik((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };
  const actionNextPage = (page) => {
    if (page != 5) {
      let next = page + 1;
      setActive(next);
    }
  };
  const onBackHandler = (page) => {
    if (page == 1) {
      navigation.goBack();
    } else {
      let prev = page - 1;
      setActive(prev);
    }
  };
  return (
    <>
      <StatusBar backgroundColor={colorApp.header.primary} />
      <View style={[stylesheet.container]}>
        <View style={{ height: APPBAR_HEIGHT }} />
        <HeaderSubMenuDetail
          title={data.name}
          type="icon-only"
          icon="black"
          imageNoUri={true}
          background={colorApp.header.secondary}
          onPress={() => onBackHandler(active)}
        />
        <View
          style={{
            alignSelf: 'center',
            marginTop: APPBAR_HEIGHT_2,
            backgroundColor: colorApp.primary,
            width: '90%',
            borderRadius: 19,
            padding: 12,
            position: 'absolute',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {page.map((item) => {
              let radius = active == item.id ? 10 : 15;
              let long = active == item.id ? 30 : 18;
              let color = active == item.id ? colorApp.header.primary : colorApp.header.secondary;
              return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View
                    style={{
                      width: long,
                      height: long,
                      borderRadius: radius,
                      backgroundColor: color,
                    }}
                  />
                </View>
              );
            })}
            <Text
              style={{
                color: colorApp.black,
                fontFamily: fontsCustom.primary[700],
                alignSelf: 'center',
                marginEnd: 15,
              }}
            >
              {active == 5 ? 'Tinjau Data' : `Tahap ${active} / 5`}
            </Text>
          </View>
        </View>
        <Gap height={30} />
        <View
          style={{
            flex: 1,
            borderTopStartRadius: 45,
            borderTopEndRadius: 45,
            backgroundColor: colorApp.primary,
          }}
        >
          <Gap height={20} />
          <View style={[stylesheet.content]}>
            {active == 1 ? (
              <FormPageSatu
                active={active}
                data={dataFormSatu}
                onPressButton={(page, item) => actionClickButton(page, item)}
              />
            ) : active == 2 ? (
              <FormPageDua
                active={active}
                data={dataFormDua}
                onPressButton={(page, item) => actionClickButton(page, item)}
              />
            ) : active == 3 ? (
              <FormPageTiga
                active={active}
                data={dataFormTiga}
                onPressButton={(page, item) => actionClickButton(page, item)}
              />
            ) : active == 4 ? (
              <FormPageEmpat
                active={active}
                data={dataFormEmpat}
                onPressButton={(page, item) => actionClickButton(page, item)}
              />
            ) : (
              <Final
                active={active}
                data={[dataFormSatu, dataFormDua, dataFormTiga, dataFormEmpat]}
                onPressButton={(page, item) => actionClickButton(page, item)}
              />
            )}
            <Gap height={20} />
          </View>
        </View>
        <CustomModal loading={loading} message={'Loading'} />
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: colorApp.primary,
                  borderRadius: 19,
                  padding: 15,
                  width: '100%',
                }}
              >
                <Image
                  style={{
                    width: 250,
                    height: 250,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                  source={IcBerhasil}
                />
                <View style={{ marginHorizontal: 50 }}>
                  <Text
                    style={{
                      fontFamily: fontsCustom.primary[700],
                      fontSize: 30,
                      color: colorApp.black,
                      textAlign: 'center',
                    }}
                  >
                    Proses Berhasil
                  </Text>
                  <Gap height={10} />
                  <Text
                    style={{
                      fontFamily: fontsCustom.primary[400],
                      fontSize: 14,
                      color: colorApp.black,
                      textAlign: 'center',
                    }}
                  >
                    Selamat! Data kamu telah terunggah, silakan tunggu informasi lebih lanjut oleh
                    petugas pendataan.
                  </Text>
                  <Gap height={50} />
                  <Text
                    style={{
                      fontFamily: fontsCustom.primary[400],
                      fontSize: 11,
                      color: colorApp.placeholderColor,
                      textAlign: 'center',
                    }}
                  >
                    Kembali otomatis dalam.....{detik} detik.
                  </Text>
                  <Gap height={30} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};
