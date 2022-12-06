import React, { useCallback,  useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  InteractionManager
} from 'react-native';
import { MessageUtil } from '../../../util/MessageUtil';
import { Api } from '../../../util/ApiManager';
import moment from 'moment/moment';
import { colorApp, stringApp } from '../../../util/globalvar';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { Header } from '../../Komponen/Header';
import GapList from '../../Komponen/GapList';
import { Image } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';


var dateNow = new Date();
var count = 0;
const limit = 10;
var firstLoad = false;

const Monitoring = ({ navigation, route }) => {
  const [hasNextPage, setHasNextPage] = useState(true);
  const [extraData, setExtraData] = useState(true);
  const [responseItem, setResponseItem] = useState([]);
  const [emptyData, setEmptyData] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);

  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      setLoadingScreen(true);
      count = 0;
      firstLoad = true;
      setResponseItem([]);
      getListMonitoring();
    });
    return()=> task.cancel();
  },[]));

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailMonitoring', {
            modelData: item,
          });
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
              ? require('../../../../assets/images/store.png')
              : { uri: item.image[0].image }
          }
          style={{
            height: 75,
            width: 75,
            alignSelf: 'center',
          }}
          resizeMode={'contain'}
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

  const loadMore = () => {
    if (firstLoad == false && hasNextPage == true && extraData == true && emptyData == false) {
      setFooterLoading(true);
      count += limit;
      getListMonitoring();
    }
  };

  const getListMonitoring = async () => {
    if (firstLoad) {
      setLoadingScreen(true);
    }
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      id_user: sesi.id,
      id_kategori: '',
      keyword: '',
      start: count,
      count: limit,
    };
    Api.post('MonitoringMerchant/jadwal_monitoring', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var message = body.metadata.message;
        var status = body.metadata.status;
        if (status === 200) {
          if (firstLoad) {
            setResponseItem(response);
          } else {
            setResponseItem(responseItem.concat(response));
          }
          if (response <= limit) {
            setExtraData(false);
            setHasNextPage(false);
            setEmptyData(false);
          } else {
            setExtraData(true);
            setHasNextPage(true);
            setEmptyData(false);
          }
          setLoadingScreen(false);
          setFooterLoading(false);
          if (firstLoad) {
            firstLoad = false;
          }
        } else {
          setExtraData(false);
          setHasNextPage(false);
          setEmptyData(true);
          setLoadingScreen(false);
          setFooterLoading(false);
          setEmptyData(true);
          if (firstLoad) {
            firstLoad = false;
          }
          MessageUtil.warningMessage(message);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        setExtraData(false);
        setHasNextPage(false);
        setEmptyData(true);
        setLoadingScreen(false);
        setFooterLoading(false);
        if (firstLoad) {
          firstLoad = false;
        }
        MessageUtil.errorMessage(err);
      });
  };

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
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <Header
        Title={'Tugas Monitoring'}
        back={() => {
          navigation.goBack();
        }}
        action={() => {
          navigation.navigate('RiwayatMonitoring');
        }}
      />
      <View
        style={{
          backgroundColor: '#F5F5F5',
          height: Platform.OS === "ios" ? StatusBar.currentHeight +35 :StatusBar.currentHeight + 10,
          flexDirection: 'column',
          padding: 8,
          justifyContent: 'flex-start',
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: 'black',
          }}
        >
          {moment(dateNow).format('dddd, DD/MM/YYYY')}
        </Text>
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
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={GapList}
          extraData={extraData}
          contentContainerStyle={{
            padding: 4,
          }}
          ListFooterComponent={renderLoad}
          onEndReached={loadMore}
        />
      )}
    </View>
  );
};

export default Monitoring;
