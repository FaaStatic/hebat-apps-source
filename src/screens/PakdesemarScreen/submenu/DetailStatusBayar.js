import React, { useState } from 'react';
import { View, StatusBar, StyleSheet, Text, ScrollView, Platform, Dimensions } from 'react-native';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { stylesheet } from '../assets';
import { CustomModal, Gap, HeaderSubMenu, Input } from '../components';
import 'moment/locale/id';
import { MessageUtil } from '../../../util/MessageUtil';
import ServiceHelper from '../addOns/ServiceHelper';
import ContentDetailStatusBayarPBB from './detail/ContentDetailStatusBayarPBB';
import ContentDetailStatusBayarSKPD from './detail/ContentDetailStatusBayarSKPD';
import { NomorNOPFormat } from '../addOns/NomorNOPFormat';
const height = Dimensions.get('window').height;
const APPBAR_HEIGHT = Platform.isPad == true ? height / 7 : 110;
export default DetailStatusBayar = ({ navigation, route }) => {
  const { data } = route.params;
  const [nomor, setNomor] = useState('');
  const [convert, setConvert] = useState(true);
  const [dot, setDot] = useState(true);
  const [dot1, setDot1] = useState(true);
  const [dot2, setDot2] = useState(true);
  const [dot3, setDot3] = useState(true);
  const [dot4, setDot4] = useState(true);
  const [dot5, setDot5] = useState(true);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState('');
  const prosesCekStatus = async (id) => {
    if (nomor !== '') {
      setDetail('')
      setLoading(true);
      console.log('Action Menu : ', id);
      let endpoint = '';
      let params = {};
      if (id == 'StatusPBB') {
        endpoint = 'Status_pembayaran/check_status_pembayaran_pbb';
        params.nop = nomor;
      } else {
        endpoint = 'Status_pembayaran/check_status_pembayaran_skpd';
        params.kode_bayar = nomor;
      }
      await actionService(endpoint, params);
    } else {
      MessageUtil.warningMessage('Nomor diisi terlebih dahulu!!');
    }
  };
  const actionCetakSKLPBB = () => {
    setLoading(true)
    const endpoint = 'Pencetakan/cetak_skl_pbb';
    const params = {
      nop: nomor,
    };
    cetakSKLPBB(endpoint, params);
  }
  const cetakSKLPBB = async (endpoint, params) => {
    const res = await ServiceHelper.actionServicePost(endpoint, params);
    var metadata = res.data.metadata;
    var response = res.data.response;
    setLoading(false);
    if (metadata.status === 200) {
      navigation.navigate('ViewPdf', { file: response.url_pdf });
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const actionService = async (endpoint, params) => {
    const res = await ServiceHelper.actionServicePost(endpoint, params);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      if (response.JML_BARIS !== 0) {
        await actionServiceAddNJOP('Status_pembayaran/search_nop_pbb', params, response)
      } else {
        setLoading(false);
        MessageUtil.errorMessage('Data Kosong!!');
      }
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const actionServiceAddNJOP = async (endpoint, params, resData) => {
    const res = await ServiceHelper.actionServicePost(endpoint, params);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      resData.NJOP_BUMI = response.NJOP_BUMI
      resData.NJOP_BNG = response.NJOP_BNG
      setDetail(resData)
      setLoading(false);
      MessageUtil.successMessage(metadata.message);
    } else {
      setLoading(false);
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const optionSetNomor = (val) => {
    if (val.length == 2) {
      if (dot == true) {
        setDot(false)
        let nomor = `${val}.`
        setNomor(nomor)
      } else {
        setNomor(val)
        setDot(true)
      }
    } else if (val.length == 5) {
      if (dot1 == true) {
        setDot1(false)
        let nomor = `${val}.`
        setNomor(nomor)
      } else {
        setNomor(val)
        setDot1(true)
      }
    } else if (val.length == 9) {
      if (dot2 == true) {
        setDot2(false)
        let nomor = `${val}.`
        setNomor(nomor)
      } else {
        setNomor(val)
        setDot2(true)
      }
    } else if (val.length == 13) {
      if (dot3 == true) {
        setDot3(false)
        let nomor = `${val}.`
        setNomor(nomor)
      } else {
        setNomor(val)
        setDot3(true)
      }
    } else if (val.length == 17) {
      if (dot4 == true) {
        setDot4(false)
        let nomor = `${val}.`
        setNomor(nomor)
      } else {
        setNomor(val)
        setDot4(true)
      }
    } else if (val.length == 22) {
      if (dot5 == true) {
        setDot5(false)
        let nomor = `${val}.`
        setNomor(nomor)
      } else {
        setNomor(val)
        setDot5(true)
      }
    } else if (val.length == 25) {
      // MessageUtil.warningMessage('Batas maksimal karakter!')
      console.log('no action, max karakter!!')
    } else {
      setNomor(val)
    }
  }
  const onNavigateDetailRiwayat = (data) => {
    navigation.navigate('DetailRiwayatStatusBayarPBB', { data: data })
  }
  let title =
    data.id == 'StatusPBB' ? 'Masukan NOP PBB Anda' : 'Masukan NOP SKPD / SPTPD / Kode Bayar Anda';
  return (
    <>
      <StatusBar backgroundColor={colorApp.header.primary} />
      <View style={[stylesheet.container]}>
        <View style={{ height: APPBAR_HEIGHT }} />
        <HeaderSubMenu
          title={data.name}
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
          <Gap height={30} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[stylesheet.content]}>
              <Text
                style={{
                  fontFamily: fontsCustom.primary[700],
                  fontSize: 16,
                  color: colorApp.black,
                }}
              >
                {title}
              </Text>
              <Gap height={3} />
              <Text style={{ color: colorApp.black }}>Pastikan sesuai ya!</Text>
              <Gap height={20} />
              <Input
                value={nomor}
                onChangeText={(val) => data.id == 'StatusPBB' ? optionSetNomor(val) : setNomor(val)}
                placeholder="Masukan Nomor Disini"
                placeholderColor={true}
                keyboardType="numeric"
                backgroundColor={colorApp.secondary}
                borderColor={colorApp.secondary}
                onPressIcon={() => prosesCekStatus(data.id)}
                backgroundColorInInput={colorApp.button.primary}
                textIcon="Cek Status"
              />
              <Gap height={30} />
              {detail !== '' &&
                (data.id == 'StatusPBB' ? (
                  <ContentDetailStatusBayarPBB onPressDetailRiwayat={(data) => onNavigateDetailRiwayat(data)} onPressCetakSKL={() => actionCetakSKLPBB()} detail={detail} />
                ) : (
                  <ContentDetailStatusBayarSKPD detail={detail} />
                ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <CustomModal loading={loading} message={'Loading'} />
    </>
  );
};
const styles = StyleSheet.create({
  title: {
    flex: 0.7,
    fontFamily: fontsCustom.primary[700],
    color: colorApp.black,
    fontSize: 12,
  },
  cardIn: {
    flexDirection: 'row',
    borderRadius: 19,
    padding: 15,
    backgroundColor: colorApp.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: Platform.OS == 'android' ? 2 : 0,
    shadowRadius: 13,
    shadowColor: colorApp.black,
    elevation: 2,
  },
  description: {
    flex: 0.8,
    fontFamily: fontsCustom.primary[400],
    color: colorApp.black,
    fontSize: 12,
  },
  titleTabel: {
    color: colorApp.black,
    fontFamily: fontsCustom.primary[400],
  },
});