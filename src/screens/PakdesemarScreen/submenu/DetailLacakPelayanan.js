import React from 'react';
import { View, Text, StatusBar, Image, SafeAreaView, ScrollView } from 'react-native';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { IcBerhasil, IcMainMenuLacakLayanan, IcMainMenuPembayaran, stylesheet } from '../assets';
import { Gap, HeaderDetail, Input } from '../components';
export default DetailLacakPelayanan = ({ navigation, route }) => {
  const { data } = route.params;
  return (
    <>
      <StatusBar backgroundColor={colorApp.header.primary} />
      <View style={[stylesheet.container]}>
        <HeaderDetail type="icon-only" icon="black" onPress={() => navigation.goBack()} />
        <ScrollView>
          <View style={stylesheet.content}>
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
                Saat ini data anda telah selesai diperoses Mohon tunggu informasi selanjutnya.
              </Text>
            </View>
            <Gap height={40} />
            <View style={{ marginHorizontal: 20 }}>
              <Text
                style={{
                  fontFamily: fontsCustom.primary[400],
                  color: colorApp.black,
                  fontSize: 14,
                }}
              >
                Riwayat Status
              </Text>
              <Gap height={10} />
              <Input
                borderColor={colorApp.primary}
                value={`NO : ${data.BLOK_KAV_NO_OP}`}
                isReadOnly
              />
              <Gap height={10} />
              <Input
                borderColor={colorApp.primary}
                value={`No Pajak Bangunan : ${data.NJOP_BNG}`}
                isReadOnly
              />
              <Gap height={10} />
              <Input
                borderColor={colorApp.primary}
                value={`No Pajak Bumi : ${data.NJOP_BUMI}`}
                isReadOnly
              />
              <Gap height={10} />
              <Input borderColor={colorApp.primary} value={`RT : ${data.RT_OP}`} isReadOnly />
              <Gap height={10} />
              <Input borderColor={colorApp.primary} value={`RW : ${data.RW_OP}`} isReadOnly />
              <Gap height={10} />
              <Input
                borderColor={colorApp.primary}
                value={`Alamat : ${data.JALAN_OP}`}
                isReadOnly
              />
              <Gap height={10} />
              <Input
                borderColor={colorApp.primary}
                value={`Subjek Pajak : ${data.SUBJEK_PAJAK_ID}`}
                isReadOnly
              />
              <Gap height={10} />
              <Input
                borderColor={colorApp.primary}
                value={`Total Luas Bangunan : ${data.TOTAL_LUAS_BNG}`}
                isReadOnly
              />
              <Gap height={10} />
              <Input
                borderColor={colorApp.primary}
                value={`Total Luas Bumi : ${data.TOTAL_LUAS_BUMI}`}
                isReadOnly
              />
              <Gap height={10} />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};
