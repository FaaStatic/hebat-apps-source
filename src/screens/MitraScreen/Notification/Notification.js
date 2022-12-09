import { useFocusEffect } from '@react-navigation/native';
import { Image } from '@rneui/themed';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager
} from 'react-native';
import { Api } from '../../../util/ApiManager';
import { colorApp, stringApp } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import GapList from '../../Komponen/GapList';
import { Header } from '../../Komponen/Header';


var loadFirst = true;
var count = 0;
const limit = 10;

const Notification = ({ navigation, route }) => {
  const [responseItem, setResponseItem] = useState([]);
  const [extraData, setExtraData] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [emptyData, setEmptyData] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingFooter, setLoadingFooter] = useState(false);


  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      loadFirst = true;
      count = 0;
      setResponseItem([]);
      getListNotifikasi();
    });
    return()=> task.cancel();
  },[]));
 

  const loadMore = () => {
    if (loadFirst == false && hasNextPage == true && extraData == true && emptyData == false) {
      setLoadingFooter(true);
      count += limit;
      getListNotifikasi();
    }
  };

  const getListNotifikasi = async () => {
    if (loadFirst) {
      setLoadingScreen(true);
    }
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      id_user: sesi.id,
      start: count,
      count: limit,
    };
    await Api.post('Notifikasi', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          if (loadFirst) {
            setResponseItem(response);
            loadFirst = false;
          } else {
            setResponseItem(responseItem.concat(response));
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

          setLoadingFooter(false);
          setLoadingScreen(false);
        } else {
          setHasNextPage(false);
          setExtraData(false);
          setEmptyData(true);
          setLoadingFooter(false);
          setLoadingScreen(false);
          MessageUtil.warningMessage(message);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        setHasNextPage(false);
        setExtraData(false);
        setEmptyData(true);
      });
  };

  const moveDetail = (item) => {
    console.log(item);
    navigation.navigate('DetailNotification', { model: item });
  };

  const renderList = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          moveDetail(item);
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          padding: 16,
          margin: 8,
          borderRadius: 8,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,

          elevation: 2,
        }}
      >
        <Image
          containerStyle={{
            height: 75,
            width: 75,
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: 8,
            backgroundColor: 'grey',
          }}
          source={require('../../../../assets/images/store.png')}
          resizeMode={'contain'}
          style={{
            alignSelf: 'center',
            height: 75,
            width: 75,
          }}
          placeholderStyle={{
            justifyContent: 'center',
            flexDirection: 'column',
            height: 75,
            width: 75,
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
            justifyContent: 'space-evenly',
            width:250,
            marginStart: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: 'red',
              width:300,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: '600',
            }}
          >
            {item.nama}
          </Text>
          <Text
            numberOfLines={5}
            style={{
              fontSize: 14,
              color: 'black',
              width: 250,
            }}
          >
            {item.alamat}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: 'black',
            }}
          >
            {convertTgl(item.tgl)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const convertTgl = (item) => {
    var format = item.split('-');
    return `${format[2]}/${format[1]}/${format[0]}`;
  };

  const renderFooter = useCallback(() => {
    if (loadingFooter) {
      return (
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'column',
            height: 175,
            padding: 8,
          }}
        >
          <ActivityIndicator
            size={'large'}
            color={colorApp.button.primary}
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
      );
    } else {
      return <></>;
    }
  });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      <Header
        Title={'Notifikasi'}
        back={() => {
          navigation.goBack();
        }}
      />
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
            color={colorApp.button.primary}
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
      ) : (
        <FlatList
          data={responseItem}
          extraData={extraData}
          showsVerticalScrollIndicator={false}
          renderItem={renderList}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          ItemSeparatorComponent={<GapList />}
          keyExtractor={(item, index) => index}
        />
      )}
    </View>
  );
};

export default Notification;
