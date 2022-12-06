import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { colorApp } from '../../util/globalvar';
import { MessageUtil } from '../../util/MessageUtil';
import ServiceHelper from './addOns/ServiceHelper';
import { stylesheet } from './assets';
import { CustomModal, HeaderSubMenu } from './components';
import { menuMetodeBayar, menuRegistrasi, menuStatusBayar } from './menu';
// import LacakPelayanan from './submenu/LacakPelayanan';
import MetodePembayaran from './submenu/MetodePembayaran';
// import Pencetakan from './submenu/Pencetakan';
import Persyaratan from './submenu/Persyaratan';
import Registrasi from './submenu/Registrasi';
import SegeraHadir from './submenu/SegeraHadir';
import StatusBayar from './submenu/StatusBayar';
const APPBAR_HEIGHT = 110;
export default MainSubMenu = ({ navigation, route }) => {
  const { data } = route.params;
  const [loading, setLoading] = useState(false);
  const [listPartner, setDataPartner] = useState(menuMetodeBayar);
  useEffect(() => {
    if (data.nama == 'Pembayaran') {
      setLoading(true);
      //List Bank Partner
      actionServiceGet('Bank_pembayaran/list_bank_pembayaran', 0);
      //List Agen Partner
      actionServiceGet('Nonbank_pembayaran/list_nonbank_pembayaran', 1);
    }
  }, []);
  const actionServiceGet = async (endpoint, status) => {
    const res = await ServiceHelper.actionServiceGet(endpoint);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      listPartner[0].detail[status].list = response;
      if ((await status) === 1) {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  // const actionLacak = (nomor) => {
  //   setLoading(true);
  //   const endpoint = 'Status_pembayaran/search_nop_pbb';
  //   const params = {
  //     nop: nomor,
  //   };
  //   lacakLayanan(endpoint, params);
  // };
  // const lacakLayanan = async (endpoint, params) => {
  //   const res = await ServiceHelper.actionServicePost(endpoint, params);
  //   var metadata = res.data.metadata;
  //   var response = res.data.response;
  //   if (metadata.status === 200) {
  //     setLoading(false);
  //     navigation.navigate('DetailLacakPelayanan', { data: response });
  //   } else {
  //     MessageUtil.errorMessage(metadata.message);
  //   }
  // };

  // const actionLupaNomor = () => {
  //   Alert.alert('Apps', 'aksi lupa nomor!');
  // };
  const onPressMenuStatusBayar = (data) => {
    const item = {
      id: data.id,
      name: data.name,
      logo: data.logo,
    };
    navigation.navigate('DetailStatusBayar', { data: item });
  };
  // const onPressMenuPercetakan = (data) => {
  //   setLoading(true);
  //   const endpoint = 'Pencetakan/cetak_skl_pbb';
  //   const params = {
  //     nop: data.nomor,
  //   };
  //   cetakSKLPBB(endpoint, params);
  // };
  // const cetakSKLPBB = async (endpoint, params) => {
  //   const res = await ServiceHelper.actionServicePost(endpoint, params);
  //   var metadata = res.data.metadata;
  //   var response = res.data.response;
  //   setLoading(false);
  //   if (metadata.status === 200) {
  //     navigation.navigate('ViewPdf', { file: response.url_pdf });
  //   } else {
  //     MessageUtil.errorMessage(metadata.message);
  //   }
  // };
  const onPressMenuMetodePembayaran = (data) => {
    const item = {
      id: data.id,
      name: data.name,
      logo: data.logo,
      list: data.list,
    };
    navigation.navigate('DetailPembayaran', { data: item });
  };
  const onPresMenuRegistrasi = (data) => {
    navigation.navigate('FormRegistrasi', { data: data });
  };
  return (
    <>
      <StatusBar backgroundColor={colorApp.header.primary} />
      <View style={{ height: APPBAR_HEIGHT }} />
      <HeaderSubMenu
        title={data.nama}
        logo={data.logo}
        type="icon-only"
        icon="black"
        background={colorApp.header.secondary}
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 1,
          borderTopStartRadius: 45,
          borderTopEndRadius: 45,
          backgroundColor: colorApp.primary,
        }}
      >
        <View style={[stylesheet.content]}>
          {data.nama == 'Lacak Pelayanan' ? (
            /* <LacakPelayanan
              onPressLacakLayanan={(val) => actionLacak(val)}
              onPressLupaNomor={() => actionLupaNomor()}
            /> */
            <SegeraHadir />
          ) : data.nama == 'Status Bayar' ? (
            <StatusBayar
              data={menuStatusBayar}
              onPressMenu={(data) => onPressMenuStatusBayar(data)}
            />
          ) : data.nama == 'STS Online' ? (
            <SegeraHadir />
            /* <Pencetakan data={menuPercetakan} onPresMenu={(data) => onPressMenuPercetakan(data)} /> */
          ) : data.nama == 'Pembayaran' ? (
            <MetodePembayaran
              data={listPartner}
              onPressMenu={(data) => onPressMenuMetodePembayaran(data)}
            />
          ) : data.nama == 'Persyaratan' ? (
            <Persyaratan />
          ) : (
            <Registrasi data={menuRegistrasi} onPressMenu={(data) => onPresMenuRegistrasi(data)} />
          )}
        </View>
      </View>
      <CustomModal loading={loading} message={'Loading'} />
    </>
  );
};
