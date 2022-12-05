import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import { CurrencyFormat } from '../../addOns/CurrencyFormat';
import { Gap } from '../../components';
export default ContentDetailStatusBayarSKPD = ({ detail }) => {
  return (
    <>
      <Text
        style={{
          fontFamily: fontsCustom.primary[400],
          color: colorApp.black,
          fontSize: 14,
        }}
      >
        Status
      </Text>
      <Gap height={10} />
      <View
        style={{
          backgroundColor: colorApp.secondary,
          borderRadius: 19,
          padding: 15,
        }}
      >
        <View style={styles.cardIn}>
          <Text style={styles.title}>Kode Bayar</Text>
          <Text style={styles.description}>{detail.kodebayar}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Tanggal Penetapan</Text>
          <Text style={styles.description}>{detail.tglpenetapan}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Tangal Jatuh Tempo</Text>
          <Text style={styles.description}>{detail.tgljatuhtempo}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Jumlah Pajak</Text>
          <Text style={styles.description}>{CurrencyFormat(detail.jmlhpajak)}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Tanggal Pembayaran</Text>
          <Text style={styles.description}>{detail.tglpembayaran}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Status Bayar SKDP</Text>
          <Text style={styles.description}>{detail.status_skpd}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>No. SKPD</Text>
          <Text style={styles.description}>{detail.nopenetapan}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>NPWDP</Text>
          <Text style={styles.description}>{detail.npwpd}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>ID OP</Text>
          <Text style={styles.description}>{detail.nop}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Nama Objek</Text>
          <Text style={styles.description}>{detail.namaobjek}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Alamat OP</Text>
          <Text style={styles.description}>{detail.alamatlengkapobjek}</Text>
        </View>
        <Gap height={10} />
      </View>
      <Gap height={20} />
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
    flex: 0.7,
    fontFamily: fontsCustom.primary[400],
    color: colorApp.black,
    fontSize: 12,
  },
  titleTabel: {
    color: colorApp.black,
    fontFamily: fontsCustom.primary[400],
  },
});
