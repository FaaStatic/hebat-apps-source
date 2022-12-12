import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../../Komponen/Header';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { Api } from '../../../util/ApiManager';
import { MessageUtil } from '../../../util/MessageUtil';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { Image } from '@rneui/themed';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import GapList from '../../Komponen/GapList';

const limit = 10;
var count = 0;
var firstLoad = true;

const Reklame = ({ navigation, route }) => {
  const [hasNextPage, setHasNextPage] = useState(true);
  const [extraData, setExtraData] = useState(true);
  const [emptyData, setEmptyData] = useState(false);
  const [responseItem, setResponseItem] = useState([]);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingFooter, setLoadingFooter] = useState(false);
  const [keyword, setKeyword] = useState('');
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      setResponseItem([]);
      count = 0;
      firstLoad = true;
      getListReklame();
    });
    return () => {
      subscribe;
    };
  }, [navigation]);

  const loadMore = () => {
    if (hasNextPage == true && extraData == true && emptyData == false && firstLoad == false) {
      count += limit;
      getListReklame();
    }
  };

  const getListReklame = async () => {
    if (firstLoad) {
      setLoadingScreen(true);
    }
    const params = {
      keyword: keyword,
      start: count,
      count: limit,
    };
    await Api.post('merchant/reklame', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;

        if (status === 200) {
          if (firstLoad) {
            setResponseItem(response);
            setKeyword('');
            firstLoad = false;
          } else {
            setResponseItem(responseItem.concat(response));
            setKeyword('');
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
          setLoadingScreen(false);
          setLoadingFooter(false);
        } else {
          firstLoad = false;
          setHasNextPage(false);
          setExtraData(false);
          setEmptyData(true);
          MessageUtil.warningMessage(message);
          setLoadingScreen(false);
          setLoadingFooter(false);
        }
      })
      .catch((err) => {
        firstLoad = false;
        setHasNextPage(false);
        setExtraData(false);
        setEmptyData(true);
        MessageUtil.errorMessage(err);
        setLoadingScreen(false);
        setLoadingFooter(false);
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const getKeyword = () => {
    count = 0;
    firstLoad = true;
    getListReklame();
  };

  const renderList = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('FormReklame', { modelData: item, status: null });
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          padding: 8,
          margin: 8,
        }}
      >
        <Image
          source={
            item.image.length > 0
              ? { uri: item.image[0].image }
              : require('../../../../assets/images/store.png')
          }
          style={{
            width: 80,
            height: 80,
          }}
          resizeMode={'cover'}
          containerStyle={{
            flexDirection: 'column',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 8,
            backgroundColor: 'white',
          }}
          placeholderStyle={{
            width: 80,
            height: 80,
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
            justifyContent: 'space-evenly',
            marginStart: 16,
            padding: 8,
          }}
        >
          <Text
            style={{
              color: colorApp.black,
              fontSize: 16,
              fontFamily:fontsCustom.primary[700],

              width: 250,
            }}
          >
            {item.nama}
          </Text>
          <Text
            style={{
              color: colorApp.black,
              fontSize: 14,
              width: 250,

              fontFamily:fontsCustom.primary[400],

            }}
          >
            {item.alamat}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);
  const renderFooter = useCallback(() => {}, []);

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <Header
        Title={'Reklame'}
        action={() => {
          navigation.navigate('RiwayatReklame');
        }}
        back={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          backgroundColor: colorApp.backgroundView,
        }}
      >
        <Icon
          name="search"
          size={24}
          color={colorApp.black}
          style={{
            margin: 8,
          }}
        />
        <TextInput
          value={keyword}
          onChangeText={(txt) => setKeyword(txt)}
          onSubmitEditing={() => {
            getKeyword();
          }}
          placeholder={'Cari Nama Wajib Pajak'}
          placeholderTextColor={'grey'}
          textAlign={'center'}
          style={{
            fontSize: 14,
            flex: 1,
            color: colorApp.black,
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
          renderItem={renderList}
          onEndReached={loadMore}
          ItemSeparatorComponent={<GapList />}
        />
      )}
    </View>
  );
};

export default Reklame;
