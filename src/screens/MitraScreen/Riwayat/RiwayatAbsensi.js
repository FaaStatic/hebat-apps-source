import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { Dialog } from '@rneui/themed';
import React, { useCallback, useState } from 'react';
import {
  InteractionManager,
  View,
  FlatList,
  Text,
  StatusBar,
  ActivityIndicator,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Lottie from 'lottie-react-native';
import HeaderDate from '../../Komponen/HeaderDate';
import { Api } from '../../../util/ApiManager';
import { MessageUtil } from '../../../util/MessageUtil';
import { colorApp,fontsCustom } from '../../../util/globalvar';
import GapList from '../../Komponen/GapList';
const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');

const RiwayatAbsensi = ({ navigation, route }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [responseItem, setResponseItem] = useState([]);
  const [openIosDate, setOpenIosDate] = useState(false);
  const [closeIosDate, setCloseIosDate] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        getListAbsensi();
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

  const DialogIOSPicker = useCallback(({ status }) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            alignSelf: 'center',
          }}
        >
          <DateTimePicker
            themeVariant="light"
            display="spinner"
            testID="dateTimePicker"
            value={status === 'start' ? startDate : endDate}
            mode={'date'}
            onChange={(event, selectedDate) => {
              if (event.type === 'set') {
                changeDateIOS(selectedDate, status);
              }
            }}
          />
        </View>

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

  const getListAbsensi = async () => {
    setLoadingScreen(false);
    setResponseItem([]);
    const params = {
      tanggal_awal: moment(startDate).format('YYYY-MM-DD'),
      tanggal_akhir: moment(endDate).format('YYYY-MM-DD'),
    };
    await Api.post('authentication/riwayat_absens/', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          setResponseItem(response);
          console.log(response);
        } else {
          MessageUtil.warningMessage(message);
        }
      })
      .catch((err) => {
        MessageUtil.errorMessage(`${err}`);
      });
  };

  const setAbsensi = (item) => {
    getListAbsensi();
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      <HeaderDate
        dateStart={moment(startDate).format('YYYY-MM-DD')}
        dateEnd={moment(endDate).format('YYYY-MM-DD')}
        title={'Riwayat Absensi'}
        back={() => {
          navigation.goBack();
        }}
        searchText={setAbsensi}
        openDate={() => {
          dateOpen();
        }}
        closeDate={() => {
          dateClose();
        }}
      />
      {responseItem.length === 0 ? <View style={{
            flex:1,
            height:ViewHeight,
            marginTop:ViewHeight/10
          }}>
            <Lottie 
      source={require('../../../../assets/images/empty_animation.json')} autoPlay loop style={{
        position:'relative',
      }}/>
            </View> :  <>
      <View
        style={{
          backgroundColor: colorApp.backgroundView,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          height: Platform.OS === 'ios' ? 35 : StatusBar.currentHeight + 15,
          
          paddingTop:8,
          paddingBottom:4,
        }}
      >
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            marginStart:24,
            width:100,
            textAlignVertical: 'center',
          }}
        >
          Tanggal
        </Text>
        <Text
          style={{
            color: 'black',
            width:100,

            fontSize: 14,
            marginStart:24,
            textAlignVertical: 'center',
          }}
        >
          Jam
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            width:100,

            marginStart:24,
            textAlignVertical: 'center',
          }}
        >
          Keterangan
        </Text>
      </View>
      <FlatList
        data={responseItem}
        keyExtractor={(index) => index}
        contentContainerStyle={{
          paddingTop: 16,
         
          paddingBottom: 16,
        }}
        ItemSeparatorComponent={<GapList />}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                height: StatusBar.currentHeight,
                
              }}
            >
              <Text
                style={{
                  color: colorApp.gradientSatu,
                  fontSize: 14,
                  textAlignVertical: 'center',
                  width:100,
                  marginStart:24,
                }}
              >
                {moment(item.timestamp).format('YYYY/MM/DD')}
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginStart:24,

                  textAlignVertical: 'center',
                  width:100,

                }}
              >
                {moment(item.timestamp).format('HH:mm:ss')}
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginStart:24,
                  textAlignVertical: 'center',
                  width:100,

                }}
              >
                {item.status}
              </Text>
            </View>
          );
        }}
      />
      </>}
     
    

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

export default RiwayatAbsensi;
