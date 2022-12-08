import React, {  useCallback, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Dimensions,
  InteractionManager
} from 'react-native';
import HeaderDate from '../../Komponen/HeaderDate';
import { BottomSheet, Image, Dialog, TabView, Tab } from '@rneui/themed';
import GapList from '../../Komponen/GapList';
import { Api } from '../../../util/ApiManager';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { setShowSearch } from '../../../statemanager/HeaderDateState/HeaderDateSlicer';
import { TabItem } from '@rneui/base/dist/Tab/Tab.Item';
import { TabViewItem } from '@rneui/base/dist/TabView/TabView.Item';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { colorApp, stringApp } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';
import { useFocusEffect } from '@react-navigation/native';

var count = 0;
const limit = 10;
var loadFirst = false;
var userInteract = false;
var tempIndex = 0;
var value = 0;

const RiwayatHasilPendaftaran = ({ navigation, route }) => {
  const [openBottom, setOpenBottom] = useState(false);
  const [responseItem, setResponItem] = useState([]);
  const [extraData, setExtraData] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingFooter, setLoadingFooter] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openDialogStart, setOpenDialogStart] = useState(false);
  const [openDialogEnd, setOpenDialogEnd] = useState(false);
  const [dataItem, setDataitem] = useState([]);
  const [indexTab, setIndexTab] = useState(0);
  const [statusMerch, setStatusMerch] = useState('Terdaftar');
  const [searchKeyword, setSearchKeyword] = useState('');

  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      setIndexTab(0);
      loadFirst = true;
      getDataList();
    });
    return()=> task.cancel();
  },[]));

  const dispatch = useDispatch();

  const changeTabFunc = (e) => {
    console.log('====================================');
    console.log(indexTab);
    console.log('====================================');
    setIndexTab(e);
    value = e;
    setResponItem([]);
    loadFirst = true;
    userInteract = false;
    count = 0;
    getDataList();
  };

  const getDataList = async (keyword = '') => {
    if (loadFirst) {
      setLoadingScreen(true);
    }
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      keyword: keyword,
      id_user: sesi.id,
      merchant_status: value === 0 ? 'Terdaftar' : 'Tidak',
      tgl_awal: moment(startDate).format('YYYY-MM-DD'),
      tgl_akhir: moment(endDate).format('YYYY-MM-DD'),
      start: count,
      count: limit,
    };
    await Api.post('PendaftaranMerchant/riwayat_pendaftaran', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var response = body.response;
        var status = body.metadata.status;

        if (status === 200) {
          if (loadFirst) {
            setResponItem(response);
          } else {
            setResponItem(responseItem.concat(response));
          }
          if (response.length < limit) {
            setHasNextPage(false);
            setExtraData(false);
          } else {
            setHasNextPage(true);
            setExtraData(true);
          }
          loadFirst = false;
          setLoadingScreen(false);
          setLoadingFooter(false);
        } else {
          setHasNextPage(false);
          setExtraData(false);
          loadFirst = false;
          setLoadingScreen(false);
          setLoadingFooter(false);
          MessageUtil.errorMessage(message);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        setHasNextPage(false);
        setExtraData(false);
        setLoadingScreen(false);
        setLoadingFooter(false);
        loadFirst = false;
      });
  };

  const loadMore = async () => {
    if (hasNextPage == true && loadFirst == false && extraData == true) {
      count += 10;
      getDataList();
    }
  };

  const selectItem = (item) => {
    console.log('====================================');
    console.log(item);
    console.log('====================================');
    setDataitem(item);
    setOpenBottom(true);
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          
          selectItem(item);
        }}
        style={{
          flexDirection: 'row',
          flex: 1,
          marginEnd: 16,
          marginStart: 16,
          backgroundColor: 'white',
          
          justifyContent: 'space-evenly',
        }}
      >
        <Image
          source={
            item.image.length === 0
              ? require('../../../../assets/images/store.png')
              : { uri: item.image[0].image }
          }
          onError={({nativeEvent: {error}}) => {
            console.log(error);
        }}
          resizeMode={item.image.length === 0 ? 'cover' : 'cover'}
          style={{
            width: 100,
            height: 100,
          }}
          PlaceholderContent={
            <ActivityIndicator
              size={'small'}
              color={colorApp.button.primary}
              style={{
                alignSelf: 'center',
              }}
            />
          }
          placeholderStyle={{
            width: 100,
            height: 100,
            justifyContent: 'center',
            flexDirection: 'column',
          }}
          containerStyle={{
            width: 100,
            height: 100,
            justifyContent: 'center',
            backgroundColor: 'white',
            flexDirection: 'column',
            borderRadius: 8,
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex:3,
            marginStart: 10,
          }}
        >
          <Text
            style={[
              style.textBase,
              {
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              },
            ]}
          >
            {item.nama}
          </Text>
          <Text
            style={[
              style.textBase,
              {
                fontSize: 14,
                fontWeight: '500',
                textAlign: 'center',
              },
            ]}
          >
            {item.alamat}
          </Text>
          <GapList />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={[
                style.textBase,
                {
                  fontSize: 12,
                  fontWeight: '400',
                  textAlign: 'center',
                  marginBottom: 8,
                  marginEnd: 16,
                },
              ]}
            >
              Tanggal Putusan
            </Text>
            <Text
              style={[
                style.textBase,
                {
                  fontSize: 14,
                  fontWeight: '400',
                  textAlign: 'center',
                },
              ]}
            >
              {item.tanggal_putusan}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={[
                style.textBase,
                {
                  fontSize: 12,
                  fontWeight: '400',
                  textAlign: 'center',
                },
              ]}
            >
              Status Terdaftar
            </Text>
            <Text
              style={[
                style.textBase,
                {
                  fontSize: 14,
                  fontWeight: '600',
                  textAlign: 'center',
                  color: 'green',
                },
              ]}
            >
            {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderFooter = useCallback(({ item }) => {}, []);

  const dateShow = () => {
    if (Platform.OS === 'ios') {
      setOpenDialogStart(true);
    } else {
      dialogAndroidDatePicker('start');
    }
  };

  const dateClose = () => {
    if (Platform.OS === 'ios') {
      setOpenDialogEnd(true);
    } else {
      dialogAndroidDatePicker('end');
    }
  };

  const searchShow = () => {
    dispatch(setShowSearch());
  };

  const dialogAndroidDatePicker = (status) => {
    switch (status) {
      case 'start':
        DateTimePickerAndroid.open({
          value: startDate,
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
          value: endDate,
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
        setStartDate(selectedDate);
        console.log(changeDateStart);
        break;
      case 'end':
        var format = moment(selectedDate).format('YYYY-MM-DD');
        setEndDate(selectedDate);
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

        setStartDate(selectedDate);
        console.log(changeDateStart);
        break;
      case 'end':
        var format = moment(selectedDate).format('YYYY-MM-DD');

        setEndDate(selectedDate);
        console.log(changeDateEnd);
        break;
      default:
        break;
    }
  };

  const setSearch = (value) => {
    userInteract = true;
    loadFirst = true;
    count = 0;
    getDataList(value);
  };

  const DialogIOSPicker = useCallback(({ status }) => {
    return (
      <View>
        <DateTimePicker
          themeVariant='light'
          testID="dateTimePicker"
          display='spinner'
          value={status === 'start' ? startDate : endDate}
          mode={'date'}
          onChange={(event, selectedDate) => {
            if (event.type === 'set') {
              changeIosDate(selectedDate, status);
            }
          }}
        />
        <TouchableOpacity
        onPress={()=>{
          status === 'start' ? setOpenDialogStart(false) : setOpenDialogEnd(false);
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

  return (
    <View style={style.container}>
      <HeaderDate
        title="Riwayat Hasil Pendaftaran"
        back={() => {
          navigation.goBack();
        }}
        dateStart={moment(startDate).format('YYYY-MM-DD')}
        dateEnd={moment(endDate).format('YYYY-MM-DD')}
        openDate={() => {
          dateShow();
        }}
        closeDate={() => {
          dateClose();
        }}
        searchShow={searchShow}
        searchText={setSearch}
      />
      <Tab
        value={indexTab}
        onChange={(e) => {
          changeTabFunc(e);
        }}
        indicatorStyle={{
          backgroundColor: '#FC572C',
          height: 3,
        }}
        containerStyle={{
          backgroundColor: 'white',
        }}
      >
        <TabItem
          title="TERDAFTAR"
          titleStyle={{ fontSize: 14, color: indexTab === 0 ? '#FC572C' : 'gray' }}
        />
        <TabItem
          title="MENOLAK"
          titleStyle={{ fontSize: 14, color: indexTab === 1 ? '#FC572C' : 'gray' }}
        />
      </Tab>
      <TabView value={indexTab} onChange={setIndexTab} animationType="timing">
        <TabViewItem
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'white',
          }}
        >
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
              contentContainerStyle={{
                paddingTop:16,
               
              }}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={GapList}
              onEndReached={loadMore}
              renderItem={renderItem}
            />
          )}
        </TabViewItem>
        <TabViewItem
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'white',
          }}
        >
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
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={GapList}
              onEndReached={loadMore}
              renderItem={renderItem}
            />
          )}
        </TabViewItem>
      </TabView>
      <BottomSheet
        isVisible={openBottom}
        onBackdropPress={() => {
          setOpenBottom(false);
        }}
      >
        <View
          style={{
            justifyContent: 'space-between',
            flex: 1,
            padding: 16,
            backgroundColor: 'white',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              console.log('====================================');
          console.log(dataItem);
          console.log('====================================');
              setOpenBottom(false);
              navigation.navigate('FormSurvey', {
                modelData: dataItem,
                status: "History"
              });
            }}
            style={{
              backgroundColor: '#fb9c3e',
              marginBottom: 16,
              height: 55,
              justifyContent: 'center',
              flexDirection: 'column',
              borderRadius: 8,
            }}
          >
            <Text
              style={[
                style.textBase,
                {
                  textAlign: 'center',
                  color: 'white',
                  alignSelf: 'center',
                  padding: 12,
                },
              ]}
            >
              Lihat Data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setOpenBottom(false);
              navigation.navigate('DaftarPotensi', {
                id_merchant: dataItem.id,
              });
            }}
            style={{
              backgroundColor: '#669beb',
              marginBottom: 16,
              height: 55,
              justifyContent: 'center',
              flexDirection: 'column',
              borderRadius: 8,
            }}
          >
            <Text
              style={[
                style.textBase,
                {
                  textAlign: 'center',
                  color: 'white',
                  alignSelf: 'center',
                  padding: 12,
                },
              ]}
            >
              Potensi
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <Dialog isVisible={openDialogStart}>
        <DialogIOSPicker status={'start'} />
      </Dialog>
      <Dialog isVisible={openDialogEnd}>
        <DialogIOSPicker status={'end'} />
      </Dialog>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  textBase: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
  },
});

export default RiwayatHasilPendaftaran;
