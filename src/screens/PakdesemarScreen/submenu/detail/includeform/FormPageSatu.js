import React, { Component, useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, ScrollView } from 'react-native';
import { colorApp } from '../../../../../util/globalvar';
import { MessageUtil } from '../../../../../util/MessageUtil';
import { Button, Gap, Input } from '../../../components';
import ServiceHelper from '../../../addOns/ServiceHelper';
export default FormPageSatu = ({ data, active, onPressButton }) => {
  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState('');
  const [title, setTitle] = useState('Jenis Usaha');
  const [noTelp, setNoTelp] = useState('');
  const [email, setEmail] = useState('');
  const [listUsaha, setListUsaha] = useState([]);
  useEffect(() => {
    listUsaha.length != 0 ? null : getListUsaha();
    data !== '' && setConditionDraft(data);
  }, []);
  const setConditionDraft = (data) => {
    setNama(data.nama);
    setJenis(data.jenis);
    setNoTelp(data.noTelp);
    setEmail(data.email);
  };
  const getListUsaha = async () => {
    const res = await ServiceHelper.actionServiceGet('E_register/list_jenis_usaha');
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      data !== '' && data.jenis !== '' && setTitleJenis(response, data.jenis);
      response.forEach((item) => {
        const id = item.kode;
        const name = item.nama;
        const data = {
          id: id,
          name: name,
        };
        listUsaha.push(data);
      });
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const setTitleJenis = async (data, id) => {
    let jenis = await data.filter((item) => item.kode == id);
    setTitle(jenis[0].nama);
  };
  const onAction = () => {
    const item = {
      nama: nama,
      jenis: jenis,
      noTelp: noTelp,
      email: email,
    };
    return onPressButton(active, item);
  };
  return (
    <KeyboardAvoidingView enabled={true} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ color: colorApp.black }}>Tentang Usaha</Text>
          <Gap height={15} />
          <Input
            label="Nama Usaha"
            onChangeText={(val) => setNama(val)}
            borderColor={colorApp.secondary}
            placeholderColor={true}
            value={nama}
            backgroundColor={colorApp.secondary}
          />
          <Gap height={15} />
          <Input
            label="Jenis Usaha"
            title={title}
            showSearchBox={false}
            colorTheme={colorApp.black}
            selectData={listUsaha}
            onSelect={(val) => setJenis(val[0])}
            keyboardType="select2"
          />
          <Gap height={15} />
          <Input
            label="No. Telp Usaha"
            onChangeText={(val) => setNoTelp(val)}
            borderColor={colorApp.secondary}
            keyboardType="phone-pad"
            placeholderColor={true}
            value={noTelp}
            backgroundColor={colorApp.secondary}
          />
          <Gap height={15} />
          <Input
            label="Email Usaha"
            onChangeText={(val) => setEmail(val)}
            borderColor={colorApp.secondary}
            placeholderColor={true}
            keyboardType="email-address"
            value={email}
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
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};
