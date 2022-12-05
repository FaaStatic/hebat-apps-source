import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { colorApp } from '../../../../../util/globalvar';
import { Button, Gap, Input } from '../../../components';

export default FormPageDua = ({ data, active, onPressButton }) => {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [nik, setNik] = useState('');
  useEffect(() => {
    data != '' && setConditionDraft(data);
  }, []);
  const setConditionDraft = (data) => {
    setNama(data.nama);
    setAlamat(data.alamat);
    setNoTelp(data.noTelp);
    setNik(data.nik);
  };
  const onAction = () => {
    const item = {
      nama: nama,
      alamat: alamat,
      noTelp: noTelp,
      nik: nik,
    };
    return onPressButton(active, item);
  };
  return (
    <View>
      <Text style={{ color: colorApp.black }}>Tentang Pemilik Usaha</Text>
      <Gap height={15} />
      <Input
        label="Nama Pemilik"
        onChangeText={(val) => setNama(val)}
        borderColor={colorApp.secondary}
        placeholderColor={true}
        value={nama}
        backgroundColor={colorApp.secondary}
      />
      <Gap height={15} />
      <Input
        label="Alamat Pemilik"
        onChangeText={(val) => setAlamat(val)}
        borderColor={colorApp.secondary}
        placeholderColor={true}
        value={alamat}
        backgroundColor={colorApp.secondary}
      />
      <Gap height={15} />
      <Input
        label="No. Telp Pemilik"
        onChangeText={(val) => setNoTelp(val)}
        borderColor={colorApp.secondary}
        placeholderColor={true}
        keyboardType="phone-pad"
        value={noTelp}
        backgroundColor={colorApp.secondary}
      />
      <Gap height={15} />
      <Input
        label="NIK Pemilik"
        onChangeText={(val) => setNik(val)}
        borderColor={colorApp.secondary}
        placeholderColor={true}
        value={nik}
        backgroundColor={colorApp.secondary}
      />
      <Gap height={15} />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }} />
        <Button
          height={35}
          title={active == 5 ? 'Kirim Data' : 'Lanjutkan'}
          type="primary"
          width="30%"
          onPress={() => onAction()}
        />
      </View>
    </View>
  );
};
