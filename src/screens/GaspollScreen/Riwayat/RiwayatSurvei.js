import moment from 'moment';
import React, {  useState, useCallback } from 'react';
import { MessageUtil } from '../../../util/MessageUtil';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  InteractionManager
} from 'react-native';
import { BottomSheet, Image, Dialog, LinearProgress } from '@rneui/themed';
import HeaderDate from '../../Komponen/HeaderDate';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Gaplist from '../../Komponen/GapList';
import {
  changeDateEnd,
  changeDateStart,
  setShowIos,
  setShowSearch,
  setEndShowIos,
} from '../../../statemanager/HeaderDateState/HeaderDateSlicer';
import { Api } from '../../../util/ApiManager';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { colorApp, stringApp } from '../../../util/globalvar';
import RNFetchBlob from 'rn-fetch-blob';
import { PermissionUtil } from '../../../util/PermissionUtil';
import { useFocusEffect } from '@react-navigation/native';
var count = 0;
const limit = 10;
var userInteract = false;
var firstLoad = true;

const { height: viewHeight, width: viewWidth } = Dimensions.get('window');

export default function RiwayatSurvey({ navigation, route }) {
  const { showIos, endShowIos } = useSelector((state) => state.headerdate);
  const { config, fs } = RNFetchBlob;
  const dispatching = useDispatch();
  const [changeDateStartTemp, setChangeDateStartTemp] = useState(new Date());
  const [changeDateEndTemp, setChangeDateEndTemp] = useState(new Date());
  const [extraData, setExtraData] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [emptyData, setEmptyData] = useState(false);
  const [dataResponse, setDataResponse] = useState([]);
  const [loadList, setLoadList] = useState(false);
  const [footerLoad, setFooterLoad] = useState(false);
  const [textTemp, setTextTemp] = useState('');
  const [tempItem, setTempItem] = useState([]);
  const [openBottom, setOpenBottom] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);


  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      PermissionUtil.requestExternalWritePermission();
      count = 0;
      userInteract = false;
      firstLoad = true;
      setLoadList(true);
      setExtraData(true);
      setDataResponse([]);
      getListItem();
    });
    return()=> task.cancel();
  },[]));

  const openBottomSheet = (item) => {
    PermissionUtil.requestExternalWritePermission();
    setTempItem(item);
    setOpenBottom(true);
  };

  const viewData = () => {
    navigation.navigate('EditData', { id: tempItem.id, item: tempItem });
  };

  const downloadFile = async () => {
    setOpenBottom(false);
    setDialogOpen(true);
    const permission = await PermissionUtil.requestExternalWritePermission();
    if (permission) {
      const configOption = Platform.select({
        ios: {
          fileCache: true,
          notification:true,
          path: fs.dirs.DocumentDir+"/surat_pernyataan.pdf",
          appendExt: 'pdf',
        },
        android: {
          fileCache: true,
          appendExt: 'pdf',
          path: `/storage/emulated/0/Download/surat_pernyataan.pdf`,
          addAndroidDownloads: {
            useDownloadManager: false,
            title: `surat_pernyataan.pdf`,
            description: 'HEBAT! Apps Download',
            mime: 'application/pdf',
            mediaScannable: true,
            notification: true,
          },
        },
      });
      RNFetchBlob.config(configOption)
        .fetch(
          'GET',
          `https://gmedia.bz/bapenda/api/Survey/download_surat_pernyataan?id=${tempItem.id}`
        )
        .progress((received, total) => {
          var totalReceived = (received / total) * 100;
          var finalValue = Math.floor(totalReceived);
          if (finalValue < downloadProgress) {
          } else {
            setDownloadProgress(finalValue);
          }
        })
        .then(async (res) => {
          if (Platform.OS === 'ios') {
            setDialogOpen(false);
            setTimeout(()=>{
              RNFetchBlob.ios.openDocument(res.data);
            },1000);
            setTimeout(() => {
              MessageUtil.successMessage('File Successfully Downloaded!');
              clearTimeout();
            }, 3000);
          } else {
            setDialogOpen(false);
            setTimeout(() => {
              MessageUtil.successMessage('File Successfully Downloaded!');
              clearTimeout();
            }, 3000);
          }
        })
        .catch((err) => {
          setDialogOpen(false);
          console.log('====================================');
          console.log(err);
          console.log('====================================');
          setTimeout(() => {
            MessageUtil.errorMessage(err);
            clearTimeout();
          }, 1000);
        });
    }
  };

  const getListItem = async (keyword = '', start = '', end = '') => {
    var sesi = SessionManager.GetAsObject(stringApp.session);
    if (firstLoad) {
      setLoadList(true);
    }
    const param = {
      id_user: sesi.id,
      tgl_awal: start === '' ? moment(changeDateStartTemp).format('YYYY-MM-DD') : start,
      tgl_akhir: end === '' ? moment(changeDateEndTemp).format('YYYY-MM-DD') : end,
      keyword: keyword,
      start: count,
      count: limit,
    };
    await Api.post('RiwayatSurvey/', param)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;

        if (status === 200) {
          console.log('datanya', response);
          console.log('====================================');
          console.log('gbr', response[0].image[0].image);
          console.log('====================================');
          if (firstLoad) {
            setDataResponse(response);
          } else {
            setDataResponse(dataResponse.concat(response));
          }
          if (response.length < limit) {
            setHasNextPage(false);
            setEmptyData(true);
          } else {
            setHasNextPage(true);
            setEmptyData(false);
            setExtraData(true);
          }
          console.log('====================================');
          console.log(message);
          console.log('====================================');
        } else {
          setHasNextPage(false);
          setEmptyData(true);
          setExtraData(false);
          MessageUtil.errorMessage(message);
        }

        if (firstLoad) {
          firstLoad = false;
        }
        setLoadList(false);
        firstLoad = false;
      })
      .catch((err) => {
        if (firstLoad) {
          firstLoad = false;
        }
        setLoadList(false);
        firstLoad = false;
      });
  };

  const loadMore = async () => {
    if (userInteract) {
      if (hasNextPage && extraData && emptyData == false && firstLoad == false) {
        setFooterLoad(true);
        count += limit;
        var start = moment(changeDateStartTemp).format('YYYY/MM/DD');
        var end = moment(changeDateEndTemp).format('YYYY/MM/DD');
        getListItem(textTemp, start, end);
      }
    } else {
      if (hasNextPage && extraData && emptyData == false && firstLoad == false) {
        setFooterLoad(true);
        count += limit;
        getListItem();
      }
    }
  };

  const dateShow = () => {
    if (Platform.OS === 'ios') {
      dispatching(setShowIos());
    } else {
      dialogAndroidDatePicker('start');
    }
  };

  const dateClose = () => {
    if (Platform.OS === 'ios') {
      dispatching(setEndShowIos());
    } else {
      dialogAndroidDatePicker('end');
    }
  };

  const searchShow = () => {
    dispatching(setShowSearch());
  };

  const backScreen = () => {
    navigation.goBack();
  };

  const dialogAndroidDatePicker = (status) => {
    switch (status) {
      case 'start':
        DateTimePickerAndroid.open({
          value: changeDateStartTemp,
          onChange: (event, selectedDate) => {
            if (event.type === 'set') {
              changeAndroidDate(selectedDate, status);
            }
          },

          mode: 'date',
        });
        break;
      case 'end':
        DateTimePickerAndroid.open({
          value: changeDateEndTemp,
          onChange: (event, selectedDate) => {
            if (event.type === 'set') {
              changeAndroidDate(selectedDate, status);
            }
          },
          mode: 'date',
        });
        break;
      default:
        false;
        break;
    }
  };

  const changeAndroidDate = (selectedDate, status) => {
    switch (status) {
      case 'start':
        var format = moment(selectedDate).format('YYYY-MM-DD');
        dispatching(changeDateStart(format));
        setChangeDateStartTemp(selectedDate);
        console.log(changeDateStart);
        break;
      case 'end':
        var format = moment(selectedDate).format('YYYY-MM-DD');
        dispatching(changeDateEnd(format));
        setChangeDateEndTemp(selectedDate);
        console.log(changeDateEnd);
        break;
      default:
        break;
    }
  };

  const changeIosDate = (selectedDate, status) => {
    switch (status) {
      case 'start':
        var format = moment(selectedDate).format('YYYY-MM-DD');
        dispatching(changeDateStart(format));
        setChangeDateStartTemp(selectedDate);
        console.log(changeDateStart);
        break;
      case 'end':
        var format = moment(selectedDate).format('YYYY-MM-DD');
        dispatching(changeDateEnd(format));
        setChangeDateEndTemp(selectedDate);
        console.log(changeDateEnd);
        break;
      default:
        break;
    }
  };

  const setSearch = (value) => {
    userInteract = true;
    firstLoad = true;
    count = 0;
    setDataResponse([]);
    setLoadList(true);
    setExtraData(true);
    setTextTemp(value);
    if (userInteract) {
      var start = moment(changeDateStartTemp).format('YYYY/MM/DD');
      var end = moment(changeDateEndTemp).format('YYYY/MM/DD');
      getListItem(value, start, end);
    }

    console.log('====================================');
    console.log(value);
    console.log('====================================');
  };

  const DialogIOSPicker = useCallback(({ status }) => {
    return (
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          display='spinner'
          themeVariant='light'
          value={status === 'start' ? changeDateStartTemp : changeDateEndTemp}
          mode={'date'}
          onChange={(event, selectedDate) => {
            if (event.type === 'set') {
              changeIosDate(selectedDate, status);
            }
          }}
        />
        <TouchableOpacity
        onPress={()=>{
          status === 'start' ? dispatching(setShowIos()) :             dispatching(setEndShowIos());
          ;
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
    );
  }, []);

  const displayDate = (date) => {
    var format1 = date.split(' ');
    var format2 = format1[0].split('-');

    return `${format2[0]}/${format2[1]}/${format2[2]}`;
  };

  const renderList = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          openBottomSheet(item);
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
        }}
      >
        <Image
          source={
            item.image.length === 0
              ? require('../../../../assets/images/store.png')
              : { uri: item.image[0].image }
          }
          PlaceholderContent={
            <ActivityIndicator
              size={'large'}
              color={colorApp.button.primary}
              style={{
                alignSelf: 'center',
              }}
            />
          }
          style={{
            width:75,
            height:75,
          }}
          placeholderStyle={{
          
            justifyContent: 'center',
            backgroundColor: 'white',
            flexDirection: 'column',
            width:75,
            height:75,
          }}
         
          containerStyle={{
            backgroundColor: 'black',
            aspectRatio: 1,
            width:75,
            borderRadius:8,
            height:75,
         
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          resizeMode={'cover'}
        />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginStart: 16,
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              marginBottom: 8,
              color: 'black',
            }}
          >
            {item.nama}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              color: 'black',
            }}
          >
            {item.pemilik}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: 'blue',
            }}
          >
            {displayDate(item.tgl)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);
  const renderLoad = useCallback(() => {
    if (footerLoad) {
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
        <ActivityIndicator color={colorApp.button.primary} size={'small'} style={{ alignSelf: 'center' }} />
      </View>;
    } else {
      return <></>;
    }
  });

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}
    >
      <HeaderDate
        title={'Riwayat Pendataan'}
        back={() => {
          backScreen();
        }}
        openDate={dateShow}
        closeDate={dateClose}
        dateStart={moment(changeDateStartTemp).format('YYYY-MM-DD')}
        dateEnd={moment(changeDateEndTemp).format('YYYY-MM-DD')}
        searchShow={searchShow}
        searchText={setSearch}
      />
      {loadList ? (
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
          showsVerticalScrollIndicator={false}
          data={dataResponse}
          extraData={extraData}
          style={{
            flexGrow: 1,
            height: viewHeight,
          }}
          contentContainerStyle={{
            padding: 16,
          }}
          renderItem={renderList}
          ListFooterComponent={renderLoad}
          onEndReached={loadMore}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => {
            return <Gaplist />;
          }}
        />
      )}

      {Platform.OS === 'ios' ? (
        <Dialog
          isVisible={showIos}
          onBackdropPress={() => {
            dispatching(setShowIos());
          }}
        >
          <DialogIOSPicker status={'start'} />
        </Dialog>
      ) : (
        <></>
      )}

      {Platform.OS === 'ios' ? (
        <Dialog
          isVisible={endShowIos}
          onBackdropPress={() => {
            dispatching(setEndShowIos());
          }}
        >
          <DialogIOSPicker status={'end'} />
        </Dialog>
      ) : (
        <></>
      )}
      <BottomSheet
        modalProps={{}}
        onBackdropPress={() => {
          setOpenBottom(false);
        }}
        isVisible={openBottom}
      >
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setOpenBottom(false);
              viewData();
            }}
            style={[
              style.btnBottom,
              {
                backgroundColor: '#fb9c3e',
              },
            ]}
          >
            <Text style={style.textBtn}>Lihat Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              style.btnBottom,
              {
                backgroundColor: '#669beb',
              },
            ]}
            onPress={() => {
              downloadFile();
            }}
          >
            <Text style={style.textBtn}>Unduh Surat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setOpenBottom(false);
              navigation.navigate('DaftarPotensi', {
                id_merchant: tempItem.id,
              });
            }}
            style={[
              style.btnBottom,
              {
                backgroundColor: '#f75757',
              },
            ]}
          >
            <Text style={style.textBtn}>Potensi</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <Dialog isVisible={dialogOpen}>
        <View
          style={{
            backgroundColor: 'white',
            height: viewHeight / 8,
            flexDirection: 'column',
            paddingTop: 8,
            paddingBottom: 8,
            paddingStart: 16,
            paddingEnd: 16,
            justifyContent: 'flex-start',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '800',
              color: 'black',
            }}
          >
            Pengunduhan dalam Proses, Mohon Ditunggu...
          </Text>
          <View
            style={{
              marginTop: 8,
              marginBottom: 8,
              marginStart: 14,
              marginVertical: 16,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <LinearProgress
              style={{ alignSelf: 'center' }}
              value={downloadProgress}
              color={'#FC572C'}
              variant="determinate"
            />
            <Text
              style={{
                fontSize: 12,
                color: 'gray',
                marginStart: 36,
                textAlign: 'center',
                alignSelf: 'center',
              }}
            >{` ${downloadProgress}/100`}</Text>
          </View>

          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              color: 'gray',
            }}
          >
            surat_pernyataan.pdf
          </Text>
        </View>
      </Dialog>
    </View>
  );
}

const style = StyleSheet.create({
  btnBottom: {
    marginBottom: 16,
    height: 55,
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 8,
  },
  textBtn: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
