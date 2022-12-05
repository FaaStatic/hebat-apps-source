import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { Gap, Input } from '../components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SegeraHadir from './SegeraHadir';
export default Pencetakan = ({ data, onPresMenu }) => {
  const [modal, setModal] = useState(false);
  const [id, setId] = useState('');
  const [nomor, setNomor] = useState('');
  const onPressConfrimCetak = () => {
    setModal(false);
    const item = {
      id: id,
      nomor: nomor,
    };
    return onPresMenu(item);
  };
  const onAction = (id) => {
    setId(id);
    setModal(true);
  };
  const fuctionFormulir = () => {
    return (
      <>
        <Text
          style={{
            color: colorApp.black,
            textAlign: 'center',
            fontSize: 14,
            fontFamily: fontsCustom.primary[700],
          }}
        >
          Masukan Nomor NOP Anda & Pastikan Sesuai !
        </Text>
        <Gap height={20} />
        <Input
          value={nomor}
          onChangeText={(val) => setNomor(val)}
          backgroundColor={colorApp.secondary}
          borderColor={colorApp.secondary}
          keyboardType="numeric"
          onPressIcon={() => onPressConfrimCetak()}
          backgroundColorInInput={colorApp.button.primary}
          textIcon="Cetak"
        />
        <Gap height={30} />
      </>
    );
  };
  return (
    <View>
      <Gap height={30} />
      <Text style={{ fontFamily: fontsCustom.primary[400], color: colorApp.black, fontSize: 14 }}>
        Pilih formulir yang ingin kamu unduh!
      </Text>
      <Gap height={20} />
      {data.map((item) => {
        return (
          <>
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                borderRadius: 19,
                padding: 15,
                backgroundColor: colorApp.secondary,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: Platform.OS == 'android' ? 2 : 0,
                shadowRadius: 13,
                shadowColor: colorApp.black,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontFamily: fontsCustom.primary[400],
                  color: colorApp.black,
                  fontSize: 16,
                }}
              >
                {item.name}
              </Text>
              <TouchableOpacity onPress={() => onAction(item.id)}>
                <AntDesign name={'download'} size={24} color={colorApp.button.primary} />
              </TouchableOpacity>
            </View>
            <Gap height={10} />
          </>
        );
      })}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => setModal(false)}
      >
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
              {id !== 'CetakKodeBayar' ? fuctionFormulir() : <SegeraHadir />}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
