import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import { Gap, Button } from '../../components';
import moment from 'moment';
import 'moment/locale/id';
import Entypo from 'react-native-vector-icons/Entypo'
import { CurrencyFormat } from '../../addOns/CurrencyFormat';
var noPush = 1
export default ContentDetailStatusBayarPBB = ({ detail, onPressCetakSKL, onPressDetailRiwayat }) => {
  const [masterListRiwayat, setMasterListRiwayat] = useState([])
  const [listRiwayat, setListRiwayat] = useState([])
  useEffect(() => {
    noPush = 1
    convertArrayRiwayatStatusPBB()
  }, [])
  const convertArrayRiwayatStatusPBB = async () => {
    var no = 1;
    let limitAction = 16;
    for (const key in detail) {
      if (detail.hasOwnProperty(key)) {
        let item = {
          id: no++,
          key: key,
          value: detail[key]
        }
        if (no > limitAction) {
          actionPush(item)
        }
      }
    }
    await setListMasterDataRiwayat()
  }
  const actionPush = async (data) => {
    data.id = noPush;
    noPush++
    masterListRiwayat.push(data)
    if (noPush == 7) {
      noPush = 1
    }
  }
  const setListMasterDataRiwayat = async () => {
    let data1 = {}
    let data2 = {}
    let data3 = {}
    let data4 = {}
    let data5 = {}
    let data6 = {}
    masterListRiwayat.forEach(element => {
      if (element.id == 1) {
        let key = element.key;
        data1[key] = element.value;
      }
      else if (element.id == 2) {
        let key = element.key;
        data2[key] = element.value;
      } else if (element.id == 3) {
        let key = element.key;
        data3[key] = element.value;
      } else if (element.id == 4) {
        let key = element.key;
        data4[key] = element.value;
      } else if (element.id == 5) {
        let key = element.key;
        data5[key] = element.value;
      } else {
        let key = element.key;
        data6[key] = element.value;
      }
    });
    await realList(data1, data2, data3, data4, data5, data6)
  }
  const realList = async (data1, data2, data3, data4, data5, data6) => {
    const convert1 = {
      tempo: data1.TGL_JTH_TEMPO_1,
      bayar: data1.TGL_BAYAR_1,
      detail: [{
        label: 'Tahun',
        value: data1.THN_PAJAK_1
      },
      {
        label: 'Tanggal Jatuh Tempo',
        value: formatDate(data1.TGL_JTH_TEMPO_1)
      }, {
        label: 'Diskon',
        value: `${data1.KOMPEN_1} %`
      }, {
        label: 'Denda',
        value: CurrencyFormat(parseInt(data1.DENDA_1))
      }, {
        label: 'Bayar Denda',
        value: CurrencyFormat(parseInt(data1.DENDA_BAYAR_1))
      }, {
        label: 'Total Bayar',
        value: CurrencyFormat(parseInt(data1.JML_BAYAR_1))
      }]
    }
    const convert2 = {
      tempo: data2.TGL_JTH_TEMPO_2,
      bayar: data2.TGL_BAYAR_2,
      detail: [{
        label: 'Tahun',
        value: data2.THN_PAJAK_2
      },
      {
        label: 'Tanggal Jatuh Tempo',
        value: formatDate(data2.TGL_JTH_TEMPO_2)
      }, {
        label: 'Diskon',
        value: `${data2.KOMPEN_2} %`
      }, {
        label: 'Denda',
        value: CurrencyFormat(parseInt(data2.DENDA_2))
      }, {
        label: 'Bayar Denda',
        value: CurrencyFormat(parseInt(data2.DENDA_BAYAR_2))
      }, {
        label: 'Total Bayar',
        value: CurrencyFormat(parseInt(data2.JML_BAYAR_2))
      }]
    }
    const convert3 = {
      tempo: data3.TGL_JTH_TEMPO_3,
      bayar: data3.TGL_BAYAR_3,
      detail: [{
        label: 'Tahun',
        value: data3.THN_PAJAK_3
      },
      {
        label: 'Tanggal Jatuh Tempo',
        value: formatDate(data3.TGL_JTH_TEMPO_3)
      }, {
        label: 'Diskon',
        value: `${data3.KOMPEN_3} %`
      }, {
        label: 'Denda',
        value: CurrencyFormat(parseInt(data3.DENDA_3))
      }, {
        label: 'Bayar Denda',
        value: CurrencyFormat(parseInt(data3.DENDA_BAYAR_3))
      }, {
        label: 'Total Bayar',
        value: CurrencyFormat(parseInt(data3.JML_BAYAR_3))
      }]
    }
    const convert4 = {
      tempo: data4.TGL_JTH_TEMPO_4,
      bayar: data4.TGL_BAYAR_4,
      detail: [{
        label: 'Tahun',
        value: data4.THN_PAJAK_4
      },
      {
        label: 'Tanggal Jatuh Tempo',
        value: formatDate(data4.TGL_JTH_TEMPO_4)
      }, {
        label: 'Diskon',
        value: `${data4.KOMPEN_4} %`
      }, {
        label: 'Denda',
        value: CurrencyFormat(parseInt(data4.DENDA_4))
      }, {
        label: 'Bayar Denda',
        value: CurrencyFormat(parseInt(data4.DENDA_BAYAR_4))
      }, {
        label: 'Total Bayar',
        value: CurrencyFormat(parseInt(data4.JML_BAYAR_4))
      }]
    }
    const convert5 = {
      tempo: data5.TGL_JTH_TEMPO_5,
      bayar: data5.TGL_BAYAR_5,
      detail: [{
        label: 'Tahun',
        value: data5.THN_PAJAK_5
      },
      {
        label: 'Tanggal Jatuh Tempo',
        value: formatDate(data5.TGL_JTH_TEMPO_5)
      }, {
        label: 'Diskon',
        value: `${data5.KOMPEN_5} %`
      }, {
        label: 'Denda',
        value: CurrencyFormat(parseInt(data5.DENDA_5))
      }, {
        label: 'Bayar Denda',
        value: CurrencyFormat(parseInt(data5.DENDA_BAYAR_5))
      }, {
        label: 'Total Bayar',
        value: CurrencyFormat(parseInt(data5.JML_BAYAR_5))
      }]
    }
    const convert6 = {
      tempo: data6.TGL_JTH_TEMPO_6,
      bayar: data6.TGL_BAYAR_6,
      detail: [{
        label: 'Tahun',
        value: data6.THN_PAJAK_6
      },
      {
        label: 'Tanggal Jatuh Tempo',
        value: formatDate(data6.TGL_JTH_TEMPO_6)
      }, {
        label: 'Diskon',
        value: `${data6.KOMPEN_6} %`
      }, {
        label: 'Denda',
        value: CurrencyFormat(parseInt(data6.DENDA_6))
      }, {
        label: 'Bayar Denda',
        value: CurrencyFormat(parseInt(data6.DENDA_BAYAR_6))
      }, {
        label: 'Total Bayar',
        value: CurrencyFormat(parseInt(data6.JML_BAYAR_6))
      }]
    }
    setListRiwayat([convert1, convert2, convert3, convert4, convert5, convert6])
  }
  const formatDate = (tgl) => {
    let date = moment(tgl).format('hh MMMM YYYY')
    return date
  }
  const renderListRiwayat = () => {
    return listRiwayat.map((item, index) => {
      return <><Gap height={10} /><TouchableOpacity onPress={() => onPressDetailRiwayat(item)} style={styles.cardInDua}>
        <Text style={styles.titleDua}>{formatDate(item.tempo)}</Text>
        <Text style={styles.descriptionDua}>{item.bayar === null ? 'Belum' : 'Sudah'} Bayar</Text>
        <View style={{ width: 20, height: 20, borderRadius: 40, backgroundColor: colorApp.gradientSatu }}>
          <Entypo name={item.bayar === null ? 'cross' : 'check'} size={20} color={colorApp.primary} />
        </View>
      </TouchableOpacity><Gap height={10} /></>
    })
  }
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
          <Text style={styles.title}>NOP</Text>
          <Text style={styles.description}> {detail.SUBJEK_PAJAK_ID.trim()}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Nama WP</Text>
          <Text style={styles.description}> {detail.NM_WP_SPPT.trim()}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Letak Objek Pajak</Text>
          <Text style={styles.description}>
            {`${detail.JALAN_OP.trim()}, ${detail.RT_OP.trim()} / ${detail.RW_OP.trim()}, Kel. ${detail.NM_KELURAHAN.trim()}, Kec. ${detail.NM_KECAMATAN.trim()}`}
          </Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>Luas Bumi / Bangunan</Text>
          <Text style={styles.description}>
            {detail.TOTAL_LUAS_BUMI} / {detail.TOTAL_LUAS_BNG}
          </Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>NJOP Bumi</Text>
          <Text style={styles.description}>{detail.NJOP_BUMI.trim()}</Text>
        </View>
        <Gap height={10} />
        <View style={styles.cardIn}>
          <Text style={styles.title}>NJOP Bangunan</Text>
          <Text style={styles.description}>{detail.NJOP_BNG.trim()}</Text>
        </View>
        <Gap height={10} />
      </View>
      <Gap height={20} />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }} />
        <Button
          height={35}
          title="Unduh SKL"
          type="primary"
          width="30%"
          onPress={() => onPressCetakSKL()}
        />
      </View>
      <Gap height={10} />
      <Text
        style={{
          fontFamily: fontsCustom.primary[400],
          color: colorApp.black,
          fontSize: 14,
        }}
      >
        Riwayat Pembayaran
      </Text>
      {listRiwayat.length > 0 ? renderListRiwayat() : <ActivityIndicator size="large" color={colorApp.header.primary} />}
      <Gap height={20} />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 0.8,
    fontFamily: fontsCustom.primary[700],
    color: colorApp.black,
    fontSize: 12,
  },
  titleDua: {
    flex: 1.4,
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
  cardInDua: {
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
  },
  description: {
    flex: 0.8,
    fontFamily: fontsCustom.primary[400],
    color: colorApp.black,
    fontSize: 12,
  },
  descriptionDua: {
    flex: 0.6,
    fontFamily: fontsCustom.primary[400],
    color: colorApp.black,
    fontSize: 12,
  },
  titleTabel: {
    color: colorApp.black,
    fontFamily: fontsCustom.primary[400],
  },
});
