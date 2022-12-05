import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text, Alert, Platform, Linking } from 'react-native';
import { AppInstalledChecker } from 'react-native-check-app-install';
import { colorApp } from '../../../../util/globalvar';
import { stylesheet } from '../../assets';
import { Gap } from '../../components';
import HeaderSubMenuDetail from '../../components/HeaderSubMenuDetail';
import SegeraHadir from '../SegeraHadir';
import Partner from './detailsubmenu/Partner';
import { MessageUtil } from '../../../../util/MessageUtil';
import ServiceHelper from '../../addOns/ServiceHelper';
const APPBAR_HEIGHT = 150;
export default DetailSubMenuPartner = ({ navigation, route }) => {
  const { data } = route.params;
  const [dataLangkah, setDataLangkah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState('');
  useEffect(() => {
    console.log('Action Kode :', data.kode_partner);
    getPanduanPembayaran(
      `Panduan_pembayaran/list_panduan_pembayaran?kode_partner=${data.kode_partner}`
    );
  }, []);
  const getPanduanPembayaran = async (endpoint) => {
    const res = await ServiceHelper.actionServiceGet(endpoint);
    setLoading(false);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      setDataLangkah(response);
    } else {
      setFailed(metadata.message);
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const onPressBankPartner = (link) => {
    if (Platform.OS === 'ios') {
      AppInstalledChecker
        .checkURLScheme(link.link_app_ios)
        .then((isInstalled) => {
          Linking.openURL(`${link.link_app_ios}://app`)
        })
        .catch(Linking.openURL('https://apps.apple.com/sg/app/'))

    } else { // Android
      AppInstalledChecker
        .checkURLScheme('com.hdb.healthAnd')
        .then((isInstalled) => {
          Linking.openURL('hdbhealth://app')
        })
        .catch(Linking.openURL(`https://play.google.com/store/apps/details?id=${link.link_app_android}`))
    }
  };
  const onPressBankPartnerQris = (link) => {
    Alert.alert('App', `Link Qris ${link} !!`);
  }
  return (
    <>
      <StatusBar backgroundColor={colorApp.header.primary} />
      <View style={[stylesheet.container]}>
        <Gap height={30} />
        <View style={{ height: APPBAR_HEIGHT }} />
        <HeaderSubMenuDetail
          title=""
          logo={data.image}
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
            {data.type == 'bank' || data.type == 'agen' ? (
              failed == '' ? (
                <Partner
                  primaryDataBank={data}
                  load={loading}
                  data={dataLangkah}
                  onPressOpenApps={(link) => onPressBankPartner(link)}
                  onPressOpenQris={(link) => onPressBankPartnerQris(link)}
                />
              ) : (
                <SegeraHadir />
              )
            ) : (
              <Text>In Progress</Text>
            )}
          </View>
        </View>
      </View>
    </>
  );
};
