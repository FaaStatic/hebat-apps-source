import React, {  useState, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  InteractionManager
} from 'react-native';
import moment from 'moment';
import Lottie from 'lottie-react-native';
import { Dialog, FAB } from '@rneui/themed';
import HeaderDate from '../../Komponen/HeaderDate';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Api } from '../../../util/ApiManager';
import { MessageUtil } from '../../../util/MessageUtil';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { colorApp, fontsCustom } from '../../../util/globalvar';

const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');
export default function DaftarPotensi({ navigation, route }) {
  const { id_merchant } = route.params;
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [showIosDate, setShowIosDate] = useState(false);
  const [showIosDateEnd, setShowIosDateEnd] = useState(false);
  const [responseItem, setResponseItem] = useState([]);


  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      getListPotensi();
    });
    return()=> task.cancel();
  },[]));
 

  const getListPotensi = async () => {
    const params = {
      id_merchant: id_merchant,
      tgl_mulai: moment(dateStart).format('YYYY-MM-DD'),
      tgl_akhir: moment(dateEnd).format('YYYY-MM-DD'),
    };
    await Api.post('Potensi_wp/list_potensi_wp', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var message = body.metadata.message;
        var status = body.metadata.status;
        if (status === 200) {
          setResponseItem(response);
        } else {
          MessageUtil.errorMessage(message);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const showStartDate = () => {
    if (Platform.OS === 'ios') {
      setShowIosDate(true);
    } else {
      androidDateShow('start');
    }
  };

  const showEndDate = () => {
    if (Platform.OS === 'ios') {
      setShowIosDateEnd(true);
    } else {
      androidDateShow('end');
    }
  };

  const androidDateShow = (status) => {
    switch (status) {
      case 'start':
        DateTimePickerAndroid.open({
          value: dateStart,
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
          value: dateEnd,
          onChange: (event, selectedDate) => {
            if (event.type === 'set') {
              changeAndroidDate(selectedDate, status);
            }
          },

          mode: 'date',
        });
        break;
      default:
        break;
    }
  };

  const changeAndroidDate = (selectedDate, status) => {
    switch (status) {
      case 'start':
        setDateStart(selectedDate);
        console.log(changeDateStart);
        break;
      case 'end':
        setDateEnd(selectedDate);
        console.log(changeDateEnd);
        break;
      default:
        break;
    }
  };

  const DialogIOSPicker = useCallback(({ status }) => {
    return (
      <View>
        <DateTimePicker
          themeVariant='light'
          testID="dateTimePicker"
          display='spinner'
          value={status === 'start' ? dateStart : dateEnd}
          mode={'date'}
          onChange={(event, selectedDate) => {
            if (event.type === 'set') {
              changeIosDate(selectedDate, status);
            }
          }}
        />
        <TouchableOpacity
          onPress={() => {
            status === 'start' ? setShowIosDate(false) : setShowIosDateEnd(false);
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
            Simpan
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, []);

  const changeIosDate = (selectedDate, status) => {
    switch (status) {
      case 'start':
        setDateStart(selectedDate);
        console.log(changeDateStart);
        break;
      case 'end':
        setDateEnd(selectedDate);
        console.log(changeDateEnd);
        break;
      default:
        break;
    }
  };

  const backScreen = () => {
    navigation.goBack();
  };

  const setShowList = (value) => {
    getListPotensi();
  };

  const datePotensi = (value) => {
    var format1 = value.split(' ');
    var date = format1[0].split('-');
    var time = format1[1].split(':');
    switch (date[1]) {
      case '01':
        return `${date[2]} Jan ${date[0]}/${time[0]}:${time[1]}`;
      case '02':
        return `${date[2]} Feb ${date[0]}/${time[0]}:${time[1]}`;
      case '03':
        return `${date[2]} Mar ${date[0]}/${time[0]}:${time[1]}`;

      case '04':
        return `${date[2]} Apr ${date[0]}/${time[0]}:${time[1]}`;

      case '05':
        return `${date[2]} Mei ${date[0]}/${time[0]}:${time[1]}`;

      case '06':
        return `${date[2]} Jun ${date[0]}/${time[0]}:${time[1]}`;

      case '07':
        return `${date[2]} Jul ${date[0]}/${time[0]}:${time[1]}`;

      case '08':
        return `${date[2]} Aug ${date[0]}/${time[0]}:${time[1]}`;

      case '09':
        return `${date[2]} Sept ${date[0]}/${time[0]}:${time[1]}`;

      case '10':
        return `${date[2]} Okt ${date[0]}/${time[0]}:${time[1]}`;

      case '11':
        return `${date[2]} Nov ${date[0]}/${time[0]}:${time[1]}`;

      case '12':
        return `${date[2]} Des ${date[0]}/${time[0]}:${time[1]}`;

      default:
        return `1 Jan 1997/00:00`;
    }
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(item);
        navigation.navigate('FormPotensi', { id: id_merchant, id_potensi: item.id_potensi });
        }}
        style={{
          marginBottom: 8,
          marginEnd: 8,
          marginStart: 8,
          borderRadius: 16,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          flexDirection: 'column',
          elevation: 5,
        }}
      >
        <LinearGradient
          style={{
            flexDirection: 'column',
            overflow: 'hidden',
            justifyContent: 'center',
            borderTopStartRadius: 16,
            padding: 8,
            borderTopEndRadius: 16,
          }}
          colors={[colorApp.gradientSatu,colorApp.gradientSatu]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 16,
              fontFamily:fontsCustom.primary[700],

              color: 'white',
            }}
          >
            {datePotensi(item.tgl_potensi)}
          </Text>
        </LinearGradient>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
            marginEnd: 16,
            marginStart: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[500],

              color: 'black',
            }}
          >
            Pendapatan :
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[500],

              color: 'black',
            }}
          >
            IDR {item.pendapatan}.00
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginEnd: 16,
            marginTop: 8,
            marginStart: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[500],

              color: 'black',
            }}
          >
            Pajak{'\b\b\b\b\b\b\b\b\b\b'}:
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[500],

              color: 'black',
            }}
          >
            IDR {item.pajak}.00
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
            marginTop: 8,
            marginEnd: 16,
            marginStart: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[500],

              color: 'black',
            }}
          >
            Status {'\b\b\b\b\b\b\b\b'}:
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[500],

              color: item.ket_status === 'Ya' ? 'green' : 'red',
            }}
          >
            {item.ket_status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={Style.container}>
      <HeaderDate
        title={'Daftar Potensi'}
        back={() => {
          backScreen();
        }}
        openDate={showStartDate}
        closeDate={showEndDate}
        dateStart={moment(dateStart).format('YYYY-MM-DD')}
        dateEnd={moment(dateEnd).format('YYYY-MM-DD')}
        searchText={setShowList}
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
            </View> :  <FlatList
        data={responseItem}
        keyExtractor={(item) => item.id_potensi}
        contentContainerStyle={{
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />}
     
      <FAB
        visible={true}
        onPress={() => {
          navigation.navigate('FormPotensi', { id: id_merchant, id_potensi: null });
        }}
        placement="right"
        icon={{ name: 'add', color: 'white' }}
        color={colorApp.button.primary}
        size="large"
      />
      <Dialog isVisible={showIosDate}>
        <View
          style={{
            backgroundColor: 'white',
            marginEnd: 16,
            marginStart: 16,
            height: 200,
          }}
        >
          <DialogIOSPicker status={'start'} />
        </View>
      </Dialog>

      <Dialog isVisible={showIosDateEnd}>
        <View
          style={{
            backgroundColor: 'white',
            marginEnd: 16,
            marginStart: 16,
            height: 200,
          }}
        >
          <DialogIOSPicker status={'end'} />
        </View>
      </Dialog>
    </View>
  );
}

const Style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
});
