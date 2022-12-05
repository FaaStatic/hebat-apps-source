import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import { Header } from '../../Komponen/Header';
import { BottomSheet, Image, Dialog } from '@rneui/themed';
import GapList from '../../Komponen/GapList';
import { Api } from '../../../util/ApiManager';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { stringApp } from '../../../util/globalvar';
import { MessageUtil } from '../../../util/MessageUtil';

var count = 0;
const limit = 10;
var loadFirst = false;

const { height: viewHeight, width: viewWidth } = Dimensions.get('window');
export default function Pendaftaran({ navigation, route }) {
  const [openBottom, setOpenBottom] = useState(false);
  const [responseItem, setResponItem] = useState([]);
  const [extraData, setExtraData] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingFooter, setLoadingFooter] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
  const [dataItem, setDataItem] = useState([]);

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      count = 0;
      loadFirst = true;
      setResponItem([]);
      getDataList();
    });

    return () => {
      subscribe;
    };
  }, [navigation]);

  const getDataList = async () => {
    var sesi = SessionManager.GetAsObject(stringApp.session);
    if (loadFirst) {
      setLoadingScreen(true);
    }
    const params = {
      id_user: sesi.id,
      id_kategori: '',
      start: count,
      count: limit,
    };
    await Api.post('PendaftaranMerchant/', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var message = body.metadata.message;
        var status = body.metadata.status;
        if (status === 200) {
          if (loadFirst) {
            setResponItem(response);
          } else {
            setResponItem(responseItem.concat(response));
          }
          if (response.length < 10) {
            setHasNextPage(false);
            setExtraData(false);
          } else {
            setHasNextPage(true);
            setExtraData(true);
          }
        } else {
          setHasNextPage(false);
          setExtraData(false);
          MessageUtil.errorMessage(message);
          setEmptyData(true);
        }
        loadFirst = false;
        setLoadingScreen(false);
        setLoadingFooter(false);
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        MessageUtil.errorMessage(err);
        setResponItem([]);
        setHasNextPage(false);
        setExtraData(false);
        loadFirst = false;
        setLoadingScreen(false);
        setLoadingFooter(false);
        setEmptyData(true);
      });
  };

  const loadMore = async () => {
    if (loadFirst == false && hasNextPage == true && extraData == true && emptyData == false) {
      setLoadingFooter(true);
      count += limit;
      getDataList();
    }
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onSelected(item);
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          padding: 8,
          justifyContent: 'space-around',
        }}
      >
        <Image
          source={
            item.image.length === 0
              ? require('../../../../assets/images/store.png')
              : { uri: item.image[0].image }
          }
          resizeMode={'cover'}
          PlaceholderContent={
            <ActivityIndicator
              size={'small'}
              color={'#FC572C'}
              style={{
                alignSelf: 'center',
              }}
            />
          }
          placeholderStyle={{
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column',
          }}
          containerStyle={{
            width: 70,
            height: 70,
            justifyContent: 'center',
            backgroundColor: 'white',
            flexDirection: 'column',
            borderRadius: 8,
          }}
        />
        <View
          style={{
            flex: 2,
            paddingLeft: 8,
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <Text
            style={[
              style.textBase,
              {
                fontSize: 16,
                fontWeight: '700',
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
                fontWeight: '400',
              },
            ]}
          >
            {item.alamat}
          </Text>
        </View>
        <Text
          style={[
            style.textBase,
            {
              fontSize: 16,
              fontWeight: '800',
              color: 'red',
            },
          ]}
        >
          {item.status_merchant}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const renderFooter = useCallback(({ item }) => {
    if (loadingFooter) {
      return (
        <View>
          <ActivityIndicator
            size={'large'}
            color={'#FC572C'}
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

  const onHistory = () => {
    navigation.navigate('RiwayatHasilPendaftaran');
  };

  const onSelected = (item) => {
    console.log('====================================');
    console.log(item);
    console.log('====================================');
    setDataItem(item);
    setOpenBottom(true);
  };

  return (
    <View style={style.container}>
      <Header
        Title={'Daftar Merchant'}
        back={() => {
          navigation.goBack();
        }}
        action={onHistory}
      />
      {loadingScreen ? (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            flexDirection: 'column',
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
          data={responseItem}
          renderItem={renderItem}
          extraData={extraData}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          ItemSeparatorComponent={() => {
            return <GapList />;
          }}
          style={{
            flexGrow: 1,
            height: viewHeight,
          }}
          contentContainerStyle={{
            padding: 16,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

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
              setOpenBottom(false);
              navigation.navigate('PutusanPendaftaran', {
                modelData: dataItem,
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
              Proses Pendaftaran
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
    </View>
  );
}

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
