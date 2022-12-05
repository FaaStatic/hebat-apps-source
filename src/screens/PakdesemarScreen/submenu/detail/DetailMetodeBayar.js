import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import { Gap } from '../../components';
import ListPartner from './ListPartner';
import ListPosPelayanan from './ListPosPelayanan';
export default DetailMetodeBayar = ({ load, status, type, data, onPressMenu }) => {
  let title =
    status == 'Agen' || status == 'PosPelayanan' || status == 'Bank'
      ? 'Pembayaran PBB & PB1'
      : 'Antrian';
  return (
    <View>
      <Gap height={10} />
      {load && (
        <>
          <Gap height={30} />
          <ActivityIndicator size="large" color={colorApp.header.primary} />
        </>
      )}
      {type === 'partner' ? (
        <ListPartner title={title} data={data} onPressMenu={onPressMenu} />
      ) : (
        <ListPosPelayanan data={data} onPressMenu={onPressMenu} />
      )}
    </View>
  );
};
