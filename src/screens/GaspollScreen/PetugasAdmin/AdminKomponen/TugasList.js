import React, { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheet, Image, Dialog, Input } from '@rneui/themed';
import { HeaderWithCategory } from '../../../Komponen/HeaderWithCategory';
import {
  View,
  InteractionManager,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  FlatList,
  Platform,
  Dimensions,
} from 'react-native';
import { Api } from '../../../../util/ApiManager';
import { MessageUtil } from '../../../../util/MessageUtil';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Entypo';
import { colorApp, stringApp } from '../../../../util/globalvar';

const limit = 10;
var count = 0;
var firstLoad = true;
var item = '';
const { height: ViewHeight } = Dimensions.get('window');

const TugasList = ({ navigation, route }) => {
  const { itemPetugas, type } = route.params;
  const [HasNextPage, setHasNextPage] = useState(true);
  const [ExtraData, setExtraData] = useState(true);
  const [EmptyData, setEmptyData] = useState(true);
  const [LoadFooter, setLoadFooter] = useState(false);
  const [LoadScreen, setLoadScreen] = useState(false);
  const [ItemResponse, setItemResponse] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [openIosDate, setOpenIosDate] = useState(false);
  const [datePick, setDatePick] = useState(new Date());
  const [title, setTitle] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [itemSelectList, setItemSelectList] = useState(null);
  const inputRef = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        firstLoad = true;
        count = 0;
        setItemResponse([]);
        getListPajak();
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

  const selectId = (itemId) => {
    item = itemId;
    setItemResponse([]);
    firstLoad = true;
    count = 0;
    getListPajak();
  };

  const getListPajak = async () => {
    if (firstLoad) {
      setLoadScreen(true);
    }
    const params = {
      kategori: item,
      keyword: keyword,
      start: count,
      count: limit,
    };

    await Api.post('penugasan/merchant_penugasan', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var message = body.metadata.message;
        var status = body.metadata.status;
        if (status === 200) {
          if (firstLoad) {
            setItemResponse(response);
            firstLoad = false;
          } else {
            setItemResponse(ItemResponse.concat(response));
          }
          if (response.length < limit) {
            setHasNextPage(false);
            setExtraData(false);
            setEmptyData(false);
          } else {
            setHasNextPage(true);
            setExtraData(true);
            setEmptyData(false);
          }
          setLoadFooter(false);
          setLoadScreen(false);
        } else {
          setHasNextPage(false);
          setExtraData(false);
          setEmptyData(true);
          setLoadFooter(false);
          setLoadScreen(false);
          MessageUtil.errorMessage(message);
        }
      })
      .catch((err) => {
        setHasNextPage(false);
        setExtraData(false);
        setEmptyData(true);
        setLoadFooter(false);
        setLoadScreen(false);
        MessageUtil.errorMessage(err);
      });
  };

  const loadMore = () => {
    if (HasNextPage == true && ExtraData == true && EmptyData == false && firstLoad == false) {
      setLoadFooter(true);
      count += limit;
      getListPajak();
    }
  };

  const selectItemList = (item) => {
    console.log(item);
    setItemSelectList(item);
    setTimeout(() => {
      setOpenDialog(true);
    }, 1000);
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          selectItemList(item);
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          flex: 1,
          borderRadius: 8,
          justifyContent: 'flex-start',
          elevation: 4,
          padding: 16,
        }}
      >
        <Image
          source={
            item.image.length === 0
              ? require('../../../../../assets/images/store.png')
              : { uri: item.image[0].image }
          }
          style={{
            height: 75,
            width: 75,
            alignSelf: 'center',
          }}
          resizeMode={'cover'}
          containerStyle={{
            backgroundColor: '#F5F5F5',
            borderRadius: 8,
            height: 75,
            width: 75,
            padding: 8,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              marginBottom: 8,
              fontWeight: '700',
            }}
          >
            {item.nama}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'black',
            }}
          >
            {item.alamat}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderLoad = useCallback(() => {
    if (LoadFooter) {
      <View
        style={{
          justifyContent: 'center',
          marginTop: 16,
          height: 100,
          backgroundColor: 'white',
          flexDirection: 'column',
          marginBottom: 16,
          width: '100%',
        }}
      >
        <ActivityIndicator color="'#FC572C'" size={'small'} style={{ alignSelf: 'center' }} />
      </View>;
    } else {
      return <></>;
    }
  });

  const cariPajak = () => {
    setItemResponse([]);
    count = 0;
    firstLoad = true;
    getListPajak();
  };

  const kirimMonitor = async () => {
    
    setLoadScreen(true);
    const params = {
      id_petugas: itemPetugas.id,
      id_merchant: selectItemList.id,
      tgl_monitor: moment(datePick).format('YYYY-MM-DD'),
      title: title,
      keterangan: keterangan,
    };
    await Api.post('Monitoring/jadwal_monitoring_petugas', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var status = body.metadata.status;
        var message = body.metadata.message;
        if (status === 200) {
          MessageUtil.successMessage(message);
          setTitle('');
          setKeterangan('');
          setLoadScreen(false);
          navigation.navigation('BerandaGaspoll');
        } else {
          MessageUtil.successMessage(message);
          setLoadScreen(false);
        }
      })
      .catch((err) => {
        MessageUtil.errorMessage(err);
        setLoadScreen(false);
      });
  };

  const kirimSurvey = async () => {
   
    setLoadScreen(true);
    const params = {
      id_petugas: itemPetugas.id,
      id_merchant: selectItemList.id,
      tgl_survey: moment(datePick).format('YYYY-MM-DD'),
      title: title,
      keterangan: keterangan,
    };
    await Api.post('Penugasan/penugasan_survey_admin', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var status = body.metadata.status;
        var message = body.metadata.message;
        if (status === 200) {
          MessageUtil.successMessage(message);
          setTitle('');
          setKeterangan('');
          setLoadScreen(false);
          navigation.navigation('BerandaGaspoll');
        } else {
          MessageUtil.successMessage(message);
          setLoadScreen(false);
        }
      })
      .catch((err) => {
        MessageUtil.errorMessage(err);
        setLoadScreen(false);
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
      <HeaderWithCategory
        Title={'Daftar Wajib Pajak'}
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
            cariPajak();
          }}
          ref={inputRef2}
          value={keyword}
          leftIcon={<Icon name="search" size={24} color={'black'} />}
          placeholder={'Cari Wajib Pajak'}
          inputStyle={{
            textAlign: 'center',
            borderWidth: 0,
          }}
          containerStyle={{
            margin: 0,
          }}
        />
      </View>
      {LoadScreen ? (
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
            color={'#FC572C'}
          />
        </View>
      ) : (
        <FlatList
          data={ItemResponse}
          extraData={ExtraData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListFooterComponent={renderLoad}
          onEndReached={loadMore}
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
              fontWeight: '700',
            }}
          >
            {type === 'monitoring' ? 'Tugas Monitoring' : 'Tugas Pendaftaran'}
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
                  fontWeight: '700',
                  color: 'black',
                }}
              >
                {itemPetugas.nama}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: 'grey',
                }}
              >
                {itemPetugas.email}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingLeft: 8,
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            <Icon2
              name="shop"
              size={24}
              color={'black'}
              style={{
                textAlignVertical: 'center',
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                paddingStart: 8,
                justifyContent: 'space-evenly',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: 'black',
                }}
              >
                {itemSelectList == null ? '...' : itemSelectList.nama}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: 'grey',
                }}
              >
                {itemSelectList == null ? '...' : itemSelectList.alamat}
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
                color={colorApp.primaryGaspoll}
                style={{
                  alignSelf: 'center',
                  textAlignVertical: 'center',
                  marginEnd: 16,
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colorApp.primaryGaspoll,
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
                fontWeight: '700',
              }}
            >
              Tambahkan Judul
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'grey',
                fontWeight: '400',
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
                fontWeight: '700',
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
              {type === 'monitoring'
                ? 'Tulis keterangan tugas monitoring'
                : 'Tulis keterangan tugas survey'}
            </Text>
            <Input
              ref={inputRef3}
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
                backgroundColor: colorApp.primaryGaspoll,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontSize: 16,
                  fontWeight: '600',
                  color: 'white',
                }}
              >
                {type === 'monitoring' ? 'Kirim Tugas Monitoring' : 'Kirim Tugas Survey'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Dialog isVisible={openIosDate}>
          <View>
            <DateTimePicker
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
                backgroundColor: '#FC572C',
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
      </BottomSheet>
      <Dialog
        overlayStyle={{
          borderRadius: 8,
          backgroundColor: 'white',
          padding: 16,
          flexDirection: 'column',
          justifyContent: 'center',
          height:200,
          width:300
        }}
        isVisible={confirmDialog}
      >
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
            color: 'black',
            textAlign: 'center',
            fontWeight:'700',
            marginBottom: 16,
          }}
        >
          Apakah Anda yakin ingin mengirim tugas ini?
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop:16,
          }}
        >
          <TouchableOpacity
          onPress={()=>{setConfirmDialog(false)}}
            style={{
              width: 125,
              backgroundColor: 'white',
              elevation:2,
              borderRadius: 4,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 14,
                padding: 4,
                color: 'black',
                textAlign: 'center',
              }}
            >
              Batal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{
            if (type === 'monitoring') {
              kirimMonitor();
            } else if (type === 'survey') {
              kirimSurvey();
            }
          }}
            style={{
              width: 125,
              backgroundColor: colorApp.primaryGaspoll,
              borderRadius: 4,
              padding: 4,
              elevation:2,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 14,
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

export default TugasList;
