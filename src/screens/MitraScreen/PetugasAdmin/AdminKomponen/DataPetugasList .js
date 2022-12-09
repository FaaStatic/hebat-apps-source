import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  InteractionManager,
  Dimensions,
} from 'react-native';
import { BottomSheet, Image, Input, Dialog } from '@rneui/themed';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { HeaderWithChip } from '../../../Komponen/HeaderWithChip';
import { MessageUtil } from '../../../../util/MessageUtil';
import { Api } from '../../../../util/ApiManager';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import GapList from '../../../Komponen/GapList';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import Icon2 from 'react-native-vector-icons/Entypo';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

var item = 0;
const { height: ViewHeight } = Dimensions.get('window');

const DataPetugasList = ({ navigation, route }) => {
  const { type } = route.params;
  const [keyword, setKeyword] = useState('');
  const [responseItem, setResponseItem] = useState([]);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [itemSelectList, setItemSelectList] = useState(null);
  const [openIosDate, setOpenIosDate] = useState(false);
  const [datePick, setDatePick] = useState(new Date());
  const [keterangan, setKeterangan] = useState('');
  const inputText = useRef();
  const inputRef = useRef();
  const inputRef2 = useRef();

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        getPetugas();
      });
      return () => task.cancel();
    }, [])
  );

  const openDialogDate = () => {
    if (Platform.OS === 'ios') {
      setOpenIosDate(true);
    } else {
      DateTimePickerAndroid.open({
        value: datePick,
        onChange: (event, selectedDate) => {
          if (event.type === 'set') {
            changeDatePick(selectedDate);
          }
        },
        minimumDate: datePick,
        mode: 'date',
      });
    }
  };

  const changeDatePick = (selectedDate) => {
    setDatePick(selectedDate);
  };

  const selectPetugas = (item) => {
    setItemSelectList(item);
    setTimeout(() => {
      setOpenDialog(true);
    }, 1000);
  };

  const selectId = (itemId) => {
    item = itemId;
    setResponseItem([]);
    getPetugas();
  };

  const getPetugas = async () => {
    setLoadingScreen(true);
    const params = {
      keyword: keyword,
      level: item === 0 ? '' : item,
    };

    await Api.post('Authentication/data_petugas', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        console.log('====================================');
        console.log(response);
        console.log('====================================');
        if (status === 200) {
          setResponseItem(response);
          setLoadingScreen(false);
        } else {
          MessageUtil.errorMessage(message);
          setLoadingScreen(false);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        MessageUtil.errorMessage(`${err}`);
        console.log('====================================');
        setLoadingScreen(false);
      });
  };

  const cariPetugas = () => {
    setResponseItem([]);
    getPetugas();
  };

  const kirimTugas = async () => {
    setLoadingScreen(true);
    const params = {
      id_petugas: itemSelectList.id,
      title: title,
      date: datePick,
      keterangan: keterangan,
    };
    await Api.post('Monitoring/hubungi_petugas', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var status = body.metadata.status;
        var message = body.metadata.message;
        if (status === 200) {
          setTitle('');
          setKeterangan('');
          setLoadingScreen(false);
          setTimeout(() => {
            MessageUtil.successMessage(message);
            navigation.navigate('BerandaMitra');
          }, 500);
        } else {
          setLoadScreen(false);
          setTimeout(() => {
            MessageUtil.errorMessage(message);
          }, 500);
        }
      })
      .catch((err) => {
        setLoadScreen(false);
        setTimeout(() => {
          MessageUtil.errorMessage("Error");
        }, 500);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      <HeaderWithChip
        Title={'Data Petugas'}
        back={() => {
          navigation.goBack();
        }}
        selectedItem={selectId}
      />
      <View
        style={{
          backgroundColor: colorApp.backgroundView,
          paddingEnd: 16,
          paddingStart: 16,
          height: 60,
        }}
      >
        <Input
          onChangeText={(txt) => {
            setKeyword(txt);
          }}
          onChange={() => {
            cariPetugas();
          }}
          ref={inputText}
          value={keyword}
          leftIcon={<Icon name="search" size={24} color={'black'} />}
          placeholder={'Cari Nama Pekerja'}
          inputStyle={{
            textAlign: 'center',
            borderWidth: 0,
          }}
          containerStyle={{
            margin: 0,
          }}
        />
      </View>
      {loadingScreen ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator
            size={'large'}
            style={{
              alignSelf: 'center',
            }}
            color={colorApp.button.primary}
          />
        </View>
      ) : (
        <FlatList
          data={responseItem}
          ItemSeparatorComponent={<GapList />}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (type === 'contact') {
                    selectPetugas(item);
                  } else {
                    navigation.navigate('TugasList', {
                      itemPetugas: item,
                      type: type,
                    });
                  }
                }}
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  justifyContent: 'flex-start',
                  padding: 16,
                }}
              >
                <Image
                  source={
                    item.foto === null || item.foto === ''
                      ? require('../../../.././../assets/images/store.png')
                      : { uri: item.foto }
                  }
                  style={{
                    height: 70,
                    width: 70,
                  }}
                  containerStyle={{
                    height: 70,
                    width: 70,
                    borderRadius: 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                  }}
                  placeholderStyle={{
                    height: 70,
                    width: 70,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                  }}
                  PlaceholderContent={
                    <ActivityIndicator
                      size={'large'}
                      color={colorApp.button.primary}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  }
                />
                <View
                  style={{
                    flexDirection: 'column',
                    marginStart: 16,
                    justifyContent: 'space-evenly',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily:fontsCustom.primary[700],

                      color: 'black',
                    }}
                  >
                    {item.nama}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily:fontsCustom.primary[400],

                      color: 'black',
                    }}
                  >
                    {item.email == null ? 'null' : item.email}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <BottomSheet
        isVisible={openDialog}
        onBackdropPress={() => {
          setOpenDialog(false);
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            padding: 16,
            backgroundColor: 'white',
            borderTopStartRadius: 16,
            borderTopEndRadius: 16,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              color: colorApp.btnColor2,
              fontSize: 24,
              margin: 8,
              fontFamily:fontsCustom.primary[700],

            }}
          >
            Hubungi Petugas
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: 'black',
              marginTop: 8,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingLeft: 8,
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            <Icon
              name="user-alt"
              size={24}
              color={'black'}
              style={{
                textAlignVertical: 'center',
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                paddingStart: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily:fontsCustom.primary[700],

                  color: 'black',
                }}
              >
                {itemSelectList == null ? '...' : itemSelectList.nama}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily:fontsCustom.primary[400],

                  color: 'grey',
                }}
              >
                {itemSelectList == null ? '...' : itemSelectList.email}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: 'black',
              marginTop: 8,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              paddingEnd: 16,
              paddingStart: 16,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                openDialogDate();
              }}
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',

                borderColor: colorApp.primaryGaspoll,
                borderRadius: 8,
                borderWidth: 0.5,
                justifyContent: 'center',
                padding: 16,
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              <Icon2
                name="calendar"
                size={24}
                color={colorApp.button.primary}
                style={{
                  alignSelf: 'center',
                  textAlignVertical: 'center',
                  marginEnd: 16,
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colorApp.button.primary,
                  textAlignVertical: 'center',
                }}
              >
                {moment(datePick).format('YYYY-MM-DD')}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 14,
                color: 'black',
                fontFamily:fontsCustom.primary[700],

              }}
            >
              Tambahkan Judul
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'grey',
                fontFamily:fontsCustom.primary[400],

              }}
            >
              Tulis judul kegiatan
            </Text>
            <View
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: 8,
                height: 45,
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              <Input
                ref={inputRef}
                value={title}
                onChangeText={(txt) => {
                  setTitle(txt);
                }}
                inputContainerStyle={{
                  borderBottomWidth: 0,
                  padding: 0,
                  margin: 0,
                }}
                inputStyle={{
                  fontSize: 14,
                }}
              />
            </View>

            <Text
              style={{
                fontSize: 14,
                color: 'black',
                fontFamily:fontsCustom.primary[700],

              }}
            >
              Keterangan
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'grey',
                fontFamily:fontsCustom.primary[400],

              }}
            >
              Tulis keterangan tugas
            </Text>
            <Input
              ref={inputRef2}
              value={keterangan}
              onChangeText={(txt) => {
                setKeterangan(txt);
              }}
              multiline={true}
              textAlignVertical={'top'}
              textAlign={'left'}
              inputContainerStyle={{
                borderBottomWidth: 0,
                backgroundColor: '#f5f5f5',
                padding: 0,
                margin: 0,
              }}
              containerStyle={{
                backgroundColor: '#f5f5f5',
                borderRadius: 8,
                marginTop: 8,
                marginBottom: 16,
              }}
              inputStyle={{
                fontSize: 12,
                backgroundColor: '#f5f5f5',
                height: ViewHeight / 5,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setOpenDialog(false);
                setConfirmDialog(true);
              }}
              style={{
                padding: 16,
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: 8,
                backgroundColor: colorApp.button.primary,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontSize: 16,
                  fontFamily:fontsCustom.primary[700],

                  color: 'white',
                }}
              >
                Kirim Tugas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
      <Dialog isVisible={openIosDate}>
        <View>
          <DateTimePicker
            themeVariant="light"
            display="spinner"
            testID="dateTimePicker"
            value={datePick}
            mode={'date'}
            minimumDate={datePick}
            onChange={(event, selectedDate) => {
              if (event.type === 'set') {
                changeDatePick(selectedDate);
              }
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setOpenIosDate(false);
            }}
            style={{
              margin: 16,
              backgroundColor: colorApp.button.primary,
              justifyContent: 'center',
              padding: 8,
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 16,
                color: 'white',
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </Dialog>
      <Dialog
        overlayStyle={{
          borderRadius: 8,
          backgroundColor: 'white',
          padding: 24,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        isVisible={confirmDialog}
      >
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 14,
            color: 'black',
            textAlign: 'center',
            fontFamily: fontsCustom.primary[500],
            marginBottom: 16,
          }}
        >
          Apakah Anda yakin ingin mengirim tugas ini?
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setConfirmDialog(false);
            }}
            style={{
              width: 100,
              backgroundColor: 'white',
              elevation: 2,
              borderRadius: 8,
              elevation: 2,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 12,
                padding: 4,
                fontFamily: fontsCustom.primary[500],
                color: 'black',
                
                textAlign: 'center',
              }}
            >
              Batal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setConfirmDialog(false);
              kirimTugas();
              
            }}
            style={{
              width: 100,
              backgroundColor: colorApp.button.primary,
              borderRadius: 8,
              padding: 8,
              elevation: 2,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 12,
                fontFamily: fontsCustom.primary[700],
                color: 'white',
                textAlign: 'center',
              }}
            >
              Kirim Data
            </Text>
          </TouchableOpacity>
        </View>
      </Dialog>
    </View>
  );
};

export default DataPetugasList;
