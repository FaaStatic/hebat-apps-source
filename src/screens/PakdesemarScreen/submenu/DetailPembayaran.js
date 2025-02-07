import { View, StatusBar, Linking, Platform, ScrollView, Dimensions } from 'react-native';
import { colorApp } from '../../../util/globalvar';
import { stylesheet } from '../assets';
import { Gap, HeaderSubMenu } from '../components';
import React, { useEffect, useState } from 'react';
import ServiceHelper from '../addOns/ServiceHelper';
import DetailMetodeBayar from './detail/DetailMetodeBayar';
import SegeraHadir from './SegeraHadir';
const height = Dimensions.get('window').height;
const APPBAR_HEIGHT = Platform.isPad == true ? height / 7 : 110;
export default DetailPembayaran = ({ navigation, route }) => {
  const { data } = route.params;
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  useEffect(() => {
    data.id == 'PosPelayanan' ? getService(data.id) : setLoading(false);
  }, []);
  const getService = (menu) => {
    console.log('Action Service : ', menu);
    if (menu == 'PosPelayanan') {
      let endpoint = 'Pos_pelayanan/list_pos_pelayanan';
      getPosPelayanan(endpoint);
    }
  };
  const getPosPelayanan = async (endpoint) => {
    const res = await ServiceHelper.actionServiceGet(endpoint);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      setLoading(false);
      setList(response);
    } else {
      //
    }
  };
  const onPressMenuBankPartner = (data) => {
    const item = {
      type: 'bank',
      kode_partner: data.kode_partner,
      name: data.judul,
      image: data.image,
      link_app_ios: data.link_app_ios,
      link_app_android: data.link_app_android,
    };
    navigation.navigate('DetailSubMenuPartner', { data: item });
  };
  const onPressMenuAgenPartner = (data) => {
    const item = {
      type: 'agen',
      kode_partner: data.kode_partner,
      name: data.judul,
      image: data.image,
      link_app_ios: data.link_app_ios,
      link_app_android: data.link_app_android,
    };
    navigation.navigate('DetailSubMenuPartner', { data: item });
  };
  const onPressMenuPosPelayanan = (data) => {
    openGps(data.latitude, data.longitude, data.deskripsi)
  };
  const openGps = (lat, lng, adress) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    var url = scheme + `${lat},${lng}?q=${adress}`;
    Linking.openURL(url);
  }
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
          <Gap height={20} />
          <View style={[stylesheet.content]}>
            <ScrollView>
              {data.id == 'BankPartner' ? (
                <DetailMetodeBayar
                  type={'partner'}
                  status={'Bank'}
                  data={data.list}
                  load={loading}
                  onPressMenu={(data) => onPressMenuBankPartner(data)}
                />
              ) : data.id == 'AgenPartner' ? (
                <DetailMetodeBayar
                  type={'partner'}
                  status={'Agen'}
                  data={data.list}
                  load={loading}
                  onPressMenu={(data) => onPressMenuAgenPartner(data)}
                />
              ) : data.id == 'PosPelayanan' ? (
                <DetailMetodeBayar
                  type={'pos'}
                  status={'PosPelayanan'}
                  data={list}
                  load={loading}
                  onPressMenu={(data) => onPressMenuPosPelayanan(data)}
                />
              ) : (
                <SegeraHadir />
              )}
              {Platform.OS == 'ios' && <Gap height={35} />}
            </ScrollView>
          </View>
        </View>
      </View>
    </>
  );
};
