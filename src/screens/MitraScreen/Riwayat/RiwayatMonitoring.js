import { Image, Dialog } from '@rneui/themed';
import React, {  useState, useCallback } from 'react';
import HeaderDate from '../../Komponen/HeaderDate';
import { setShowSearch } from '../../../statemanager/HeaderDateState/HeaderDateSlicer';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Api } from '../../../util/ApiManager';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { stringApp,colorApp } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  InteractionManager
} from 'react-native';
import moment from 'moment/moment';
import GapList from '../../Komponen/GapList';
import { useFocusEffect } from '@react-navigation/native';


var count = 0;
const limit = 10;
var userInteract = false;
var firstLoad = true;

const { width: viewWidth, height: viewHeight } = Dimensions.get('window');

const RiwayatMonitoring = ({ navigation, route }) => {
  const [responseItem, setResponseItem] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [extraData, setExtraData] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [keywordData, setKeywordData] = useState('');
  const [dateStartIos, setDateStartIos] = useState(false);
  const [dateEndIos, setDateEndIos] = useState(false);


  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      setLoadingScreen(true);
      firstLoad = true;
      count = 0;
      setHasNextPage(true);
      setResponseItem([]);
      getListMerchant();
    });
    return()=> task.cancel();
  },[]));

  const loadMore = () => {
    if (hasNextPage == true && firstLoad == false && extraData == true && emptyData == false) {
      setFooterLoading(true);
      count += limit;
      getListMerchant();
    }
  };

  const getListMerchant = async () => {
    if (firstLoad) {
      setLoadingScreen(true);
    }
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      id_user: sesi.id,
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD'),
      keyword: keywordData,
      start: count,
      count: limit,
    };
    Api.post('MonitoringMerchant/riwayat_monitoring', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          if (firstLoad) {
            setResponseItem(response);
          } else {
            setResponseItem(responseItem.concat(response));
          }
          if (response.length <= limit) {
            setExtraData(false);
            setHasNextPage(false);
            setFooterLoading(false);
            setLoadingScreen(false);
            setEmptyData(false);
          } else {
            setExtraData(true);
            setHasNextPage(true);
            setFooterLoading(false);
            setLoadingScreen(false);
            setEmptyData(false);
          }
          if (firstLoad) {
            firstLoad = false;
          }
        } else {
          setExtraData(false);
          setHasNextPage(false);
          setFooterLoading(false);
          setLoadingScreen(false);
          setEmptyData(true);
        }
        if (firstLoad) {
          firstLoad = false;
        }
        MessageUtil.warningMessage(message);
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        MessageUtil.errorMessage(err);
      });
  };

  const setKeyword = (value) => {
    userInteract = true;
    count = 0;
    firstLoad = true;
    setKeywordData(value);
    setResponseItem([]);
    getListMerchant();
  };

  const dateShow = () => {
    if (Platform.OS === 'ios') {
      setDateStartIos(true);
    } else {
      dialogAndroidDatePicker('start');
    }
  };

  const dateClose = () => {
    if (Platform.OS === 'ios') {
      setDateEndIos(true);
    } else {
      dialogAndroidDatePicker('end');
    }
  };

  const searchShow = () => {
    dispatching(setShowSearch());
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
        setStartDate(selectedDate);
        break;
      case 'end':
        setEndDate(selectedDate);
        break;
      default:
        break;
    }
  };

  const changeIosDate = (selectedDate, status) => {
    switch (status) {
      case 'start':
        setStartDate(selectedDate);
        break;
      case 'end':
        setEndDate(selectedDate);
        break;
      default:
        break;
    }
  };

  const DialogIOSPicker = useCallback(({ status }) => {
    return (
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          themeVariant='light'
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
          onPress={() => {
            switch (status) {
              case 'start':
                setDateStartIos(false);
                break;
              case 'end':
                setDateEndIos(false);
                break;
              default:
                break;
            }
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

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(item);
          navigation.navigate('DetailMonitoring', {
            modelData: item,
            status: 'Riwayat',
          });
        }}
        style={{
          elevation: 2,
          flexDirection: 'row',
          backgroundColor: 'white',
          flex: 1,
          justifyContent: 'flex-start',
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Image
          source={
            item.image.length === 0
              ? require('../../../../assets/images/store.png')
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
              marginBottom: 10,
            }}
          >
            {item.nama}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'black',
              width: viewWidth / 2,
            }}
            numberOfLines={2}
          >
            {item.alamat}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderLoad = useCallback(() => {
    if (footerLoading) {
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
        flexDirection: 'column',
      }}
    >
      <HeaderDate
        title={'Riwayat Monitoring'}
        back={() => {
          navigation.goBack();
        }}
        openDate={dateShow}
        closeDate={dateClose}
        dateStart={moment(startDate).format('YYYY-MM-DD')}
        dateEnd={moment(endDate).format('YYYY-MM-DD')}
        searchShow={searchShow}
        searchText={setKeyword}
      />
      <FlatList
        data={responseItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        extraData={extraData}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 8,
        }}
        ItemSeparatorComponent={GapList}
        ListFooterComponent={renderLoad}
      />
      <Dialog
        isVisible={dateStartIos}
        onBackdropPress={() => {
          setDateStartIos(false);
        }}
      >
        <DialogIOSPicker status={'start'} />
      </Dialog>
      <Dialog
        isVisible={dateEndIos}
        onBackdropPress={() => {
          setDateEndIos(false);
        }}
      >
        <View>
          <DialogIOSPicker status={'end'} />
        </View>
      </Dialog>
    </View>
  );
};
export default RiwayatMonitoring;
