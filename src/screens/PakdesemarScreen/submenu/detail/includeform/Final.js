import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Alert, Platform } from 'react-native';
import { colorApp, fontsCustom } from '../../../../../util/globalvar';
import { Button, Gap } from '../../../components';
import MapView from 'react-native-maps';
import { ImgMaps } from '../../../assets';
import ServiceHelper from '../../../addOns/ServiceHelper';
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;
export default Final = ({ data, active, onPressButton }) => {
  const [valueSatu, setValueSatu] = useState([]);
  const [valueDua, setValueDua] = useState([]);
  const [valueTiga, setValueTiga] = useState([]);
  const [jenis, setJenis] = useState('..');
  const [title1, setTitle1] = useState('..');
  const [title2, setTitle2] = useState('..');
  useEffect(() => {
    actionService('E_register/list_kelurahan', data[2].kode_kel, 0);
    actionService('E_register/list_kelurahan', data[2].kode_kec, 1);
    actionService('E_register/list_jenis_usaha', data[0].jenis, 2);
  }, []);
  const title = (index) => {
    let title = '';
    switch (index) {
      case 0:
        title = 'Tentang Usaha';
        break;
      case 1:
        title = 'Tentang Pemilik Usaha';
        break;
      case 2:
        title = 'Alamat Usaha';
        break;
      default:
        title = 'Dokumentasi Usaha';
        break;
    }
    return title;
  };

  const titleDetail = (key) => {
    let title = '';
    switch (key) {
      case 'nama':
        title = 'Nama Usaha';
        break;
      case 'jenis':
        title = 'Jenis Usaha';
        break;
      case 'noTelp':
        title = 'No. Telp Usaha';
        break;
      default:
        title = 'Email Usaha';
        break;
    }
    return title;
  };

  const titleDetail2 = (key) => {
    let title = '';
    switch (key) {
      case 'nama':
        title = 'Nama Pemilik';
        break;
      case 'alamat':
        title = 'Alamat Usaha';
        break;
      case 'noTelp':
        title = 'No. Telp Pemilik';
        break;
      default:
        title = 'Nik Pemilik';
        break;
    }
    return title;
  };

  const titleDetail3 = (key) => {
    let title = '';
    switch (key) {
      case 'alamat':
        title = 'Alamat Usaha';
        break;
      case 'rt':
        title = 'RT / RW';
        break;
      case 'kode_kel':
        title = 'Kelurahan';
        break;
      case 'kode_kec':
        title = 'Kecamatan';
        break;
      default:
        title = 'Kota / Kabupaten';
        break;
    }
    return title;
  };
  const renderDetailData = (detail, index) => {
    for (const key in detail) {
      if (detail.hasOwnProperty(key)) {
        if (key !== 'file') {
          index == 0
            ? valueSatu.push(key)
            : index == 1
              ? valueDua.push(key)
              : index == 2
                ? valueTiga.push(key)
                : null;
        }
      }
    }
  };
  const onAction = () => {
    Alert.alert('Hebat!', 'Anda yakin memproses data ini ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Iya',
        onPress: () => {
          return onPressButton(active, data);
        },
      },
    ]);
  };
  const actionService = async (endpoint, id, status) => {
    const res = await ServiceHelper.actionServiceGet(endpoint);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      setTitleJenis(response, id, status);
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const setTitleJenis = async (res, id, sesi) => {
    if (sesi == 0) {
      let jenis = await res.filter((item) => item.kode == id);
      setTitle1(jenis[0].nama);
    } else if (sesi == 1) {
      let jenis = await res.filter((item) => item.kode == id);
      setTitle2(jenis[0].nama);
    } else {
      let jenis = await res.filter((item) => item.kode == id);
      setJenis(jenis[0].nama);
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {data.map((item, index) => {
        valueSatu.length == 0
          ? renderDetailData(item, index)
          : valueDua.length == 0
            ? renderDetailData(item, index)
            : valueTiga.length == 0
              ? renderDetailData(item, index)
              : null;
        return (
          <>
            <Gap height={10} />
            <Text
              style={{
                fontFamily: fontsCustom.primary[400],
                color: colorApp.black,
                fontSize: 14,
              }}
            >
              {title(index)}
            </Text>
            <Gap height={10} />
            <View
              style={{
                backgroundColor: colorApp.secondary,
                borderRadius: 19,
                padding: 15,
              }}
            >
              {index == 0 &&
                valueSatu.map((item) => {
                  let detail =
                    item == 'nama'
                      ? data[index].nama
                      : item == 'jenis'
                        ? jenis
                        : item == 'noTelp'
                          ? data[index].noTelp
                          : data[index].email;
                  return (
                    <>
                      <View style={styles.cardIn}>
                        <Text style={styles.title}>{titleDetail(item)}</Text>
                        <Text style={styles.description}>: {detail}</Text>
                      </View>
                      <Gap height={10} />
                    </>
                  );
                })}
              {index == 1 &&
                valueDua.map((item) => {
                  let detail =
                    item == 'nama'
                      ? data[index].nama
                      : item == 'alamat'
                        ? data[index].alamat
                        : item == 'noTelp'
                          ? data[index].noTelp
                          : data[index].nik;
                  return (
                    <>
                      <View style={styles.cardIn}>
                        <Text style={styles.title}>{titleDetail2(item)}</Text>
                        <Text style={styles.description}>: {detail}</Text>
                      </View>
                      <Gap height={10} />
                    </>
                  );
                })}
              {index == 2 &&
                valueTiga.map((item) => {
                  let detail =
                    item == 'alamat'
                      ? data[index].alamat
                      : item == 'rt'
                        ? `RT ${data[index].rt} / RW ${data[index].rw}`
                        : item == 'kode_kel'
                          ? title1
                          : item == 'kode_kec'
                            ? title2
                            : data[index].kota;
                  if (item !== 'rw' && item !== 'latitude' && item !== 'longitude') {
                    return (
                      <>
                        <View style={styles.cardIn}>
                          <Text style={styles.title}>{titleDetail3(item)}</Text>
                          <Text style={styles.description}>: {detail}</Text>
                        </View>
                        <Gap height={10} />
                      </>
                    );
                  }
                })}
              {index == 2 && (
                <>
                  <View pointerEvents="none" style={{ padding: 5 }}>
                    <MapView
                      provider={MapView.PROVIDER_GOOGLE}
                      showsCompass={true}
                      showsBuildings={false}
                      showsTraffic={true}
                      showsIndoors={true}
                      style={styles.map}
                      maxZoomLevel={20}
                      mapType="standard"
                      region={{
                        latitude: data[index].latitude,
                        longitude: data[index].longitude,
                        latitudeDelta: limitlatitudeDelta,
                        longitudeDelta: limitLongitudeDelta,
                      }}
                    />
                    <View style={styles.touchableOpacityStyleMarker}>
                      <Image source={ImgMaps} style={{ marginTop: 10, width: 40, height: 40 }} />
                    </View>
                  </View>
                </>
              )}
              {index == 3 && (
                <View style={{ flexDirection: 'row' }}>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {data[3].file.length !== 0 ? (
                      data[3].file.map((item) => {
                        return (
                          <>
                            <Image
                              key={item.id}
                              style={{ height: 150, width: 150 }}
                              source={{ uri: item.uri }}
                            />
                            <Gap width={10} />
                          </>
                        );
                      })
                    ) : (
                      <Text
                        style={{
                          fontFamily: fontsCustom.primary[700],
                          color: colorApp.placeholderColor,
                        }}
                      >
                        Anda tidak melampirkan gambar
                      </Text>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          </>
        );
      })}
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
      <Gap height={50} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 200,
    width: '100%',
  },
  touchableOpacityStyle: {
    flex: 1,
    position: 'absolute',
    marginTop: '3%',
    marginStart: 10,
  },
  touchableOpacityStyleMarker: {
    flex: 1,
    position: 'absolute',
    marginTop: 50,
    alignSelf: 'center',
  },
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
    flex: 0.8,
    fontFamily: fontsCustom.primary[400],
    color: colorApp.black,
    fontSize: 12,
  },
  titleTabel: {
    color: colorApp.black,
    fontFamily: fontsCustom.primary[400],
  },
});
