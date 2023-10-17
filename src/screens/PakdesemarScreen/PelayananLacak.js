import React, { useState } from 'react';
import { colorApp, fontsCustom } from '../../util/globalvar';
import {
  Platform,
  StatusBar,
  View,
  Text,
  InputAccessoryView,
  Keyboard,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CustomModal, Gap, HeaderSubMenu, Input } from './components';
import axios from 'axios';
import moment from 'moment';

const PelayananLacak = ({ navigation, route }) => {
  const [nomor, setNomor] = useState('');
  const [loading, setLoading] = useState(false);
  const [dot, setDot] = useState(true);
  const [dot1, setDot1] = useState(true);
  const [dot2, setDot2] = useState(true);
  const [dot3, setDot3] = useState(true);
  const [dataLacak, setDataLacak] = useState({
    nop: null,
    namawp: null,
    tanggal: null,
    status: null,
  });
  const { height: ViewPortHeight } = Dimensions.get('window');

  const APPBAR_HEIGHT = Platform.isPad == true ? ViewPortHeight / 7 : 110;
  const inputAccessoryViewID = '123DoneX';
  const optionSetNomor = (val) => {
    if (val.length == 2) {
      if (dot == true) {
        setDot(false);
        let nomor = `${val}.`;
        setNomor(nomor);
      } else {
        setNomor(val);
        setDot(true);
      }
    } else if (val.length == 5) {
      if (dot1 == true) {
        setDot1(false);
        let nomor = `${val}.`;
        setNomor(nomor);
      } else {
        setNomor(val);
        setDot1(true);
      }
    } else if (val.length == 10) {
      if (dot2 == true) {
        setDot2(false);
        let nomor = `${val}.`;
        setNomor(nomor);
      } else {
        setNomor(val);
        setDot2(true);
      }
    } else if (val.length == 15) {
      if (dot3 == true) {
        setDot3(false);
        let nomor = `${val}.`;
        setNomor(nomor);
      } else {
        setNomor(val);
        setDot3(true);
      }
    } else if (val.length == 20) {
      // MessageUtil.warningMessage('Batas maksimal karakter!')
      console.log('no action, max karakter!!');
    } else {
      setNomor(val);
    }
  };

  const getDataLacak = async () => {
    Keyboard.dismiss();
    setLoading(true);
    const Api = axios.create({
      baseURL: 'http://103.101.52.67:22000',
    });

    const param = {
      NOPEL: nomor,
    };

    const response = await Api.post('api/pelayanan', param);
    const body = response.data;
    if (response.status === 200) {
      const date = Date.parse(body.tanggal);
      const formatted = moment(date).format('DD MMMM YYYY');

      setDataLacak({
        nop: body.nop,
        namawp: body.namawp,
        tanggal: formatted,
        status: `Proses ${body.status}`,
      });
      setDot(true);
      setDot1(true);
      setDot2(true);
      setDot3(true);
      setNomor('');
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colorApp.header.secondary,
      }}
    >
      <StatusBar backgroundColor={colorApp.header.primary} />
      <View style={{ height: APPBAR_HEIGHT }} />
      <HeaderSubMenu
        title={'Lacak Pelayanan'}
        logo={''}
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
          flexDirection: 'column',
          paddingTop: 55,
          paddingEnd: 23,
          paddingStart: 23,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontsCustom.primary[700],
            color: colorApp.black,
          }}
        >
          Masukan Nomor Pelanggan Anda
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: fontsCustom.primary[400],
            color: colorApp.black,
          }}
        >
          Pastikan sesuai ya!
        </Text>
        <Gap height={10} />

        <Input
          value={nomor}
          onChangeText={(val) => optionSetNomor(val)}
          placeholder="Masukan Nomor Disini"
          placeholderColor={true}
          keyboardType="numeric"
          backgroundColor={colorApp.secondary}
          borderColor={colorApp.secondary}
          onPressIcon={() => getDataLacak()}
          backgroundColorInInput={colorApp.button.primary}
          textIcon="Lacak"
        />
        {Platform.OS === 'ios' && (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <View
              style={{
                height: 40,
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'grey',
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  width: 70,
                  height: 35,
                  marginEnd: 8,
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}
                onPress={() => {
                  Keyboard.dismiss();
                }}
              >
                <Text>Selesai</Text>
              </TouchableOpacity>
            </View>
          </InputAccessoryView>
        )}

        <Gap height={60} />
        <View
          style={{
            borderRadius: 20,
            backgroundColor: '#F2F2F2',
            paddingLeft: 13,
            paddingRight: 13,
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <View
            style={{
              borderRadius: 20,
              flexDirection: 'row',
              height: 45,
              backgroundColor: 'white',
              paddingHorizontal: 14,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                }}
              >
                NOP
              </Text>
            </View>
            <View
              style={{
                width: '50%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                  marginEnd: 8,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                }}
              >
                {dataLacak.nop === null ? '-' : dataLacak.nop}
              </Text>
            </View>
          </View>

          <View
            style={{
              borderRadius: 20,
              flexDirection: 'row',
              height: 45,
              backgroundColor: 'white',
              paddingHorizontal: 14,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                }}
              >
                Nama WP
              </Text>
            </View>
            <View
              style={{
                width: '50%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                  marginEnd: 8,
                }}
              >
                :
              </Text>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{
                  fontSize: 12,

                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                }}
              >
                {dataLacak.namawp === null ? '-' : dataLacak.namawp}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderRadius: 20,
              flexDirection: 'row',
              height: 45,
              backgroundColor: 'white',
              paddingHorizontal: 14,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                }}
              >
                Tanggal Pembayaran
              </Text>
            </View>
            <View
              style={{
                width: '50%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                  marginEnd: 8,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                }}
              >
                {dataLacak.tanggal === null ? '-' : dataLacak.tanggal}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderRadius: 20,
              flexDirection: 'row',
              height: 45,
              backgroundColor: 'white',
              paddingHorizontal: 14,
            }}
          >
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                }}
              >
                Status
              </Text>
            </View>
            <View
              style={{
                width: '50%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                  marginEnd: 8,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                }}
              >
                {dataLacak.status === null ? '-' : dataLacak.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <CustomModal loading={loading} message={'Loading'} />
    </View>
  );
};

export default PelayananLacak;
