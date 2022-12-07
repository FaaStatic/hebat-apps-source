import React, { useCallback, useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { HeaderWithoutHistory } from '../../Komponen/HeaderWithoutHistory';
import Gaplist from '../../Komponen/GapList';
import { CheckBox, Dialog } from '@rneui/themed';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { colorApp, stringApp } from '../../../util/globalvar';
import { Api } from '../../../util/ApiManager';
import { PermissionUtil } from '../../../util/PermissionUtil';
import { MessageUtil } from '../../../util/MessageUtil';

export default function PutusanPendaftaran({ navigation, route }) {
  const { modelData } = route.params;
  const [idMerchant, setIdMerchant] = useState('');
  const [namaWajib, setNamaWajib] = useState('');
  const [namaPemilik, setNamaPemilik] = useState('');
  const [alamatWajibPajak, setAlamatWajibPajak] = useState('');
  const [keteranganMenolak, setKeteranganMenolak] = useState('');
  const [ya, setYa] = useState(false);
  const [tidak, setTidak] = useState(false);
  const [menunggu, setMenunggu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState('Tidak');
  const [reason, setReason] = useState(false);
  const [mapState, setMapState] = useState({
    latitude: -6.966667,
    longitude: 110.416664,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      getLocation();
      loadData();
    });

    return () => {
      subscribe;
    };
  }, [navigation]);

  const loadData = () => {
    setIdMerchant(modelData.id);
    setNamaWajib(modelData.nama);
    setNamaPemilik(modelData.pemilik);
    setAlamatWajibPajak(modelData.alamat);
  };

  const checkYa = () => {
    setYa(true);
    setTidak(false);
    setMenunggu(false);
    setReason(true);
    setStatus('Ya');
  };
  const checkTidak = () => {
    setTidak(true);
    setYa(false);
    setMenunggu(false);
    setReason(false);
    setStatus('Tidak');
  };
  const checkMenunggu = () => {
    setMenunggu(true);
    setYa(false);
    setTidak(false);
    setReason(false);
    setStatus('Pending');
  };

  const getLocation = async () => {
    const permissionStat = await PermissionUtil.accessLocation();
    if (permissionStat === true) {
      try {
        Geolocation.getCurrentPosition((pos) => {
          var coordinate = pos.coords;
          var newLocation = {
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setMapState(newLocation);
        });
      } catch (error) {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      }
    } else {
      MessageUtil.errorMessage('Lokasi Belum Diberi Ijin');
    }
  };

  const kirimSurveySetuju = async () => {
    getLocation();
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      id_merchant: modelData.id,
      id_user: sesi.id,
      status: status,
      alasan: `${reason}?Merhchant menyetujui:${keteranganMenolak}`,
      lat: mapState.latitude,
      long: mapState.longitude,
      id_petugas: '',
    };

    await Api.post('Pendaftaran/Survey', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          console.log('====================================');
          console.log(response);
          console.log('====================================');
          navigation.navigate('FormSurvey', {
            modelData: modelData,
          });
        } else {
          MessageUtil.warningMessage(message);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const kirimSurveyMenolak = async () => {
    if (keteranganMenolak.length == 0) {
      MessageUtil.errorMessage('Mohon Keterangan Diisi terlebih dahulu!');
      return;
    }
    getLocation();
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      id_merchant: modelData.id,
      id_user: sesi.id,
      status: status,
      alasan: `${reason}?Merhchant menyetujui:${keteranganMenolak}`,
      lat: mapState.latitude,
      long: mapState.longitude,
      id_petugas: '',
    };

    await Api.post('Pendaftaran/Survey', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          console.log('====================================');
          console.log(response);
          console.log('====================================');
          MessageUtil.successMessage(message);
          navigation.navigate('Pendaftaran');
        } else {
          MessageUtil.warningMessage(message);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const kirimSurveyMenunggu = async () => {
    getLocation();
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      id_merchant: modelData.id,
      id_user: sesi.id,
      status: status,
      alasan: `${reason}?Merhchant menyetujui:${keteranganMenolak}`,
      lat: mapState.latitude,
      long: mapState.longitude,
      id_petugas: '',
    };

    await Api.post('Pendaftaran/Survey', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          console.log('====================================');
          console.log(response);
          console.log('====================================');
          MessageUtil.successMessage(message);
          navigation.navigate('Pendaftaran');
        } else {
          MessageUtil.warningMessage(message);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  return (
    <View style={style.container}>
      <HeaderWithoutHistory
        Title={'Putusan Pendaftaran'}
        back={() => {
          navigation.goBack();
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.containerForm}>
          <Text style={style.textTitle}>Nama Wajib Pajak</Text>
          <View style={style.containerInput}>
            <TextInput
              style={style.inputStyle}
              value={namaWajib}
              onChangeText={(txt) => setNamaWajib(txt)}
            />
          </View>
          <Text style={style.textTitle}>Nama Pemilik</Text>
          <View style={style.containerInput}>
            <TextInput
              style={style.inputStyle}
              value={namaPemilik}
              onChangeText={(txt) => setNamaPemilik(txt)}
            />
          </View>
          <Text style={style.textTitle}>Alamat Wajib Pajak</Text>
          <View style={style.containerInput}>
            <TextInput
              style={style.inputStyle}
              value={alamatWajibPajak}
              onChangeText={(txt) => setAlamatWajibPajak(txt)}
            />
          </View>
        </View>

        <Gaplist />

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginEnd: 24,
            marginStart: 24,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 14,
              fontWeight: '300',
              color: 'black',
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            Apakah wajib pajak tersebut berkenan untuk di daftarkan?
          </Text>
          <CheckBox
            title={'Ya, wajib pajak setuju untuk didaftarkan'}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={ya}
            onPress={() => {
              checkYa();
            }}
          />
          <CheckBox
            title={'Tidak, wajib pajak menolak untuk didaftarkan'}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={tidak}
            onPress={() => {
              checkTidak();
            }}
          />
          <CheckBox
            title={'Menunggu, wajib pajak menunggu persetujuan untuk pendaftaran'}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={menunggu}
            onPress={() => {
              checkMenunggu();
            }}
          />
          {ya && (
            <TouchableOpacity
              onPress={() => {
                kirimSurveySetuju();
              }}
              style={{
                backgroundColor: colorApp.button.primary,
                justifyContent: 'center',
                flexDirection: 'column',
                height: 45,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                  alignSelf: 'center',
                  fontWeight: '800',
                }}
              >
                Isi Kelengkapan Data
              </Text>
            </TouchableOpacity>
          )}
          {tidak && (
            <View
              style={{
                flexDirection: 'column',
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                Keterangan
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'grey',
                  fontWeight: '400',
                }}
              >
                Tulis keterangan kenapa merchant menolak
              </Text>
              <View
                style={{
                  backgroundColor: 'grey',
                  height: 1,
                  marginTop: 8,
                  marginBottom: 8,
                }}
              />
              <TextInput
                value={keteranganMenolak}
                onChangeText={(txt) => setKeteranganMenolak(txt)}
                multiline={true}
                placeholder={'Tulis keterangan disini'}
                numberOfLines={200}
                textAlign={'left'}
                textAlignVertical={'top'}
                placeholderTextColor={'grey'}
                selectionColor={'#669beb'}
                underlineColorAndroid={'#669beb'}
                selectionTextColor={'#669beb'}
                style={{
                  padding: 0,
                  height: 200,
                  textAlign: 'left',
                  marginBottom: 16,
                  color: 'black',
                  borderBottomColor: '#dadce0',
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  kirimSurveyMenolak();
                }}
                style={{
                  backgroundColor: colorApp.button.primary,
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: 45,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: 'white',
                    alignSelf: 'center',
                    fontWeight: '800',
                  }}
                >
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {menunggu && (
            <TouchableOpacity
              onPress={() => {
                setOpenDialog(true);
              }}
              style={{
                backgroundColor: colorApp.button.primary,
                justifyContent: 'center',
                flexDirection: 'column',
                height: 45,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                  alignSelf: 'center',
                  fontWeight: '800',
                }}
              >
                Simpan
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Dialog
        isVisible={openDialog}
        onBackdropPress={() => {
          setOpenDialog(false);
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            padding: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: 'black',
            }}
          >
            Konfirmasi
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: 'black',
              marginTop: 8,
            }}
          >
            Apakah Anda yakin ingin melanjutkan proses?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 16,
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              style={{
                margin: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: 'red',
                }}
              >
                Tidak
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                margin: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: 'red',
                }}
              >
                Ya
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  containerForm: {
    marginStart: 16,
    marginEnd: 16,
    marginBottom: 8,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  containerInput: {
    backgroundColor: '#dadce0',
    borderRadius: 8,
    marginBottom: 16,
  },
  inputStyle: {
    fontSize: 14,
    color: 'black',
    paddingStart:8,
    height:50
  },
  textTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: 'black',
    marginBottom: 8,
  },
});
