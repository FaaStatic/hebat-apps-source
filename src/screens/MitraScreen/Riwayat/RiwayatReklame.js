import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import HeaderDate from '../../Komponen/HeaderDate';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { setShowSearch } from '../../../statemanager/HeaderDateState/HeaderDateSlicer';
import moment from 'moment/moment';
import { Image, Dialog } from '@rneui/themed';
import { colorApp, fontsCustom, stringApp } from '../../../util/globalvar';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { Api } from '../../../util/ApiManager';
import { MessageUtil } from '../../../util/MessageUtil';
import GapList from '../../Komponen/GapList';
import { useFocusEffect } from '@react-navigation/native';
import Lottie from 'lottie-react-native';

const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');

const limit = 10;
var count = 0;
var firstLoad = true;

const RiwayatReklame = ({ navigation, route }) => {
  const [openIosDate, setOpenIosDate] = useState(false);
  const [closeIosDate, setCloseIosDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [LoadingScreen, setLoadingScreen] = useState(false);
  const [LoadingFooter, setLoadingFooter] = useState(false);
  const [itemListResponse, setItemListResponse] = useState([]);
  const [extraData, setExtraData] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [emptyData, setEmptyData] = useState(false);
  const [keyword, setKeyword] = useState('');

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setItemListResponse([]);
        setKeyword('');
        count = 0;
        firstLoad = true;
        getListItem();
      });
      return () => task.cancel();
    }, [])
  );

  const dateOpen = () => {
    if (Platform.OS === 'ios') {
      setOpenIosDate(true);
    } else {
      DateTimePickerAndroid.open({
        value: startDate,
        onChange: (event, selectedDate) => {
          if (event.type === 'set') {
            changeDateAndroid(selectedDate, 'start');
          }
        },
        mode: 'date',
      });
    }
  };

  const dateClose = () => {
    if (Platform.OS === 'ios') {
      setCloseIosDate(true);
    } else {
      DateTimePickerAndroid.open({
        value: endDate,
        onChange: (event, selectedDate) => {
          if (event.type === 'set') {
            changeDateAndroid(selectedDate, 'end');
          }
        },
        mode: 'date',
      });
    }
  };

  const getListItem = async () => {
    const sesi = SessionManager.GetAsObject(stringApp.session);
    if (firstLoad) {
      setLoadingScreen(true);
    }

    const params = {
      id_user: sesi.id,
      keyword: keyword,
      tgl_awal: moment(startDate).format('YYYY-MM-DD'),
      tgl_akhir: moment(endDate).format('YYYY-MM-DD'),
      start: count,
      count: limit,
    };

    await Api.post('merchant/riwayat_reklame/', params)
      .then((res) => {
        var body = res.data;
        var status = body.metadata.status;
        var message = body.metadata.message;
        var response = body.response;

        if (status === 200) {
          if (firstLoad) {
            setItemListResponse(response);
            firstLoad = false;
          } else {
            setItemListResponse(itemListResponse.concat(response));
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
          if (firstLoad) {
            firstLoad = false;
          }
          setLoadingScreen(false);
          setLoadingFooter(false);
        } else {
          setHasNextPage(false);
          setExtraData(false);
          setEmptyData(true);
          setLoadingScreen(false);
          setLoadingFooter(false);
          if (firstLoad) {
            firstLoad = false;
          }
          MessageUtil.warningMessage(message);
        }
      })
      .catch((err) => {
        MessageUtil.errorMessage(`Data tidak ada`);
        console.log('====================================');
        console.log(`${err}`);
        if (firstLoad) {
          firstLoad = false;
        }
        console.log('====================================');
      });
  };

  const loadMore = () => {
    if (hasNextPage == true && extraData == true && firstLoad == false && emptyData == false) {
      setLoadingFooter(true);
      count += limit;
      getListItem();
    }
  };

  const openSearch = () => {
    dispatch(setShowSearch());
  };

  const changeDateAndroid = (selectedDate, status) => {
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

  const changeDateIOS = (selectedDate, status) => {
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

  const searchKeyword = (value) => {
    setKeyword(value);
    setItemListResponse([]);
    count = 0;
    firstLoad = true;
    getListItem();
  };

  const renderList = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('FormReklame', {
            modelData: item,
            status: 'edit',
          });
        }}
        style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-around',
          margin: 8,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          borderRadius: 8,
        }}
      >
        <Image
          source={{ uri: item.image[0].image }}
          placeholderStyle={{
            width: 80,
            height: 80,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          PlaceholderContent={
            <ActivityIndicator
              color={colorApp.button.primary}
              size={'large'}
              style={{
                alignSelf: 'center',
              }}
            />
          }
          containerStyle={{
            width: 80,
            height: 80,
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: 8,
            backgroundColor: colorApp.backgroundView,
          }}
          resizeMode={'stretch'}
          style={{
            width: 80,
            height: 80,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            marginStart: 16,
            padding: 8,
          }}
        >
          <Text
            style={{
              alignSelf: 'flex-end',
              fontSize: 14,
              color: 'black',
              marginBottom: 8,
            }}
          >
            {item.insert_at}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: 16,
              width: 250,
              fontFamily:fontsCustom.primary[700],
              color: 'black',
              marginBottom: 8,
            }}
          >
            {item.nama}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-start',
              width: 250,
              fontSize: 12,
              color: 'black',
              marginBottom: 8,
              fontFamily:fontsCustom.primary[400],
            }}
          >
            {item.alamat}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderLoad = useCallback(() => {
    if (LoadingFooter) {
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
        <ActivityIndicator
          color={colorApp.button.primary}
          size={'small'}
          style={{ alignSelf: 'center' }}
        />
      </View>;
    } else {
      return <></>;
    }
  });

  const DialogIOSPicker = useCallback(({ status }) => {
    return (
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          display="spinner"
          themeVariant="light"
          value={status === 'start' ? startDate : endDate}
          mode={'date'}
          onChange={(event, selectedDate) => {
            if (event.type === 'set') {
              changeDateIOS(selectedDate, status);
            }
          }}
        />
        <TouchableOpacity
          onPress={() => {
            status === 'start' ? setOpenIosDate(false) : setCloseIosDate(false);
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
        title={'Riwayat Reklame'}
        back={() => {
          navigation.goBack();
        }}
        dateStart={moment(startDate).format('YYYY-MM-DD')}
        dateEnd={moment(endDate).format('YYYY-MM-DD')}
        openDate={dateOpen}
        closeDate={dateClose}
        searchText={searchKeyword}
        searchShow={() => {
          openSearch();
        }}
      />
      {LoadingScreen ? (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}
        ></View>
      ) : (
        <>
          {itemListResponse.length === 0 ? (
            <View
              style={{
                flex: 1,
                height: ViewHeight,
                marginTop: ViewHeight / 10,
              }}
            >
              <Lottie
                source={require('../../../../assets/images/empty_animation.json')}
                autoPlay
                loop
                style={{
                  position: 'relative',
                }}
              />
            </View>
          ) : (
            <FlatList
              data={itemListResponse}
              extraData={extraData}
              renderItem={renderList}
              onEndReached={loadMore}
              ItemSeparatorComponent={<GapList />}
              ListFooterComponent={renderLoad}
            />
          )}
        </>
      )}

      <Dialog
        isVisible={openIosDate}
        onBackdropPress={() => {
          setOpenIosDate(false);
        }}
      >
        <DialogIOSPicker status={'start'} />
      </Dialog>
      <Dialog
        isVisible={closeIosDate}
        onBackdropPress={() => {
          setCloseIosDate(false);
        }}
      >
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
});
export default RiwayatReklame;
