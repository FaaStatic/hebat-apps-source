import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  InteractionManager,
  Dimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { colorApp, fontsCustom } from '../../util/globalvar';
import ServiceHelper from './addOns/ServiceHelper';
import { IcAgenPartner, IcAntrianOnline, IcBgNotif, stylesheet } from './assets';
import { Button, Gap, HeaderSubMenu, Input } from './components';

var loadFirst = true;
var count = 0;
const limit = 10;

export default MainNotification = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState([]);
  const [hasNextpage, setHasNextPage] = useState(true);
  const [emptyData, setEmptyData] = useState(false);
  const [extraData, setExtraData] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        count = 0;
        loadFirst = true;
        getDataArticle();
        setLoading(false);
        setNotification([
          // {
          //   title: 'Notification I',
          //   description: 'Jangan lupa untuk cek tagihan pembayaran PBB kamu ya!',
          //   image: IcAgenPartner,
          //   read: 1,
          // },
          // {
          //   title: 'Notification II',
          //   description:
          //     'Kamu sudah cek artikel terbaru kami belum? Yuk di cek biar ngga ketinggalan informasi terbaru seputar PBB Kota Semarang.',
          //   image: IcAntrianOnline,
          //   read: 0,
          // },
        ]);
      });
      return () => task.cancel();
    }, [])
  );
  const onDeleteNotification = () => {
    Alert.alert('Hebat!!', 'No Action On Progress!!');
  };
  const onDetailNotification = (item) => {
    // Alert.alert('Hebat!!', 'No Action On Progress!!');
    navigation.navigate('DetailArticle', {
      data: {
        id: item.id,
      },
    });
  };

  const loadMore = () => {
    if (loadFirst == false && hasNextpage == true && extraData == true && emptyData == false) {
      count += limit;
      getDataArticle();
    }
  };

  const renderNotificationList = (item) => {
    let color1 = item.read == 1 ? colorApp.gradientSatu : colorApp.secondary;
    let color2 = item.read == 1 ? colorApp.gradientDua : colorApp.secondary;
    return (
      <TouchableOpacity onPress={() => onDetailNotification(item)} style={styles.cardView}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                justifyContent: 'center',
                height: 116,
                flex: 0.7,
                marginHorizontal: 20,
              }}
            >
              <View style={styles.cardViewIn}>
                <Image
                  style={{ width: 33, height: 31 }}
                  source={{ uri: item.image }}
                  resizeMode="cover"
                />
              </View>
            </View>
            <View style={{ marginStart: 40, padding: 15, justifyContent: 'center', width: '70%' }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: fontsCustom.primary[700],
                  color: colorApp.black,
                  fontWeight: '700',
                }}
              >
                {item.judul_news}
              </Text>
              <Gap height={7} />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: fontsCustom.primary[400],
                  color: colorApp.black,
                }}
              >
                {item.judul_news}
              </Text>
              {/* <RenderHTML tagsStyles={tagsStyles} baseStyle={{
                height:200,
              }} contentWidth={300} source={{ html: item.deskripsi }} /> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getDataArticle = async () => {
    const params = {
      keyword: '',
      sort: '',
      start: count,
      count: limit,
    };
    const res = await ServiceHelper.actionServicePost('News/list_news', params);
    setLoading(false);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      if (loadFirst) {
        setNotification(response);
        loadFirst = false;
      } else {
        setNotification(notification.concat(response));
      }
      if(response.length < limit){
        setHasNextPage(false);
        setEmptyData(false);
        setExtraData(false);
      }else{
        setHasNextPage(true);
        setEmptyData(false);
        setExtraData(true);
      }
    } else {
      setHasNextPage(false);
      setEmptyData(true);
      setExtraData(false);
      MessageUtil.errorMessage(metadata.message);
    }
  };

  const tagsStyles = {
    p: {
      whiteSpace: 'normal',
      color: colorApp.black,
    },
    div: {
      whiteSpace: 'normal',
      color: colorApp.black,
    },
    li: {
      color: colorApp.black,
    },
  };

  return (
    <>
      <StatusBar backgroundColor={colorApp.header.primary} />
      <HeaderSubMenu
        title="Notifikasi"
        type="icon-only"
        icon="black"
        absolute={false}
        background={colorApp.primary}
        onPress={() => navigation.goBack()}
      />
      <View style={[stylesheet.container]}>
        <View style={[stylesheet.content]}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }} />
            {loading == false && notification.length !== 0 ? (
              <Input
                isReadOnly={true}
                backgroundColor={colorApp.primary}
                borderColor={colorApp.primary}
                onPressIcon={() => onDeleteNotification()}
                icon="close"
                positionIconStart={true}
                backgroundColorInInput={colorApp.button.primary}
                textIcon="Hapus Semua"
              />
            ) : null}
          </View>
          <Gap height={15} />
          <View style={{ justifyContent: 'center' }}>
            {loading && <ActivityIndicator size="large" color={colorApp.header.primary} />}
            {loading == false && notification.length == 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '80%',
                }}
              >
                <Image
                  source={IcBgNotif}
                  style={{ width: 113, height: 123, resizeMode: 'contain' }}
                />
                <Gap height={20} />
                <Text
                  style={{
                    color: colorApp.black,
                    marginHorizontal: 50,
                    textAlign: 'center',
                    fontFamily: fontsCustom.primary[700],
                  }}
                >
                  Keren, saat ini tidak ada berita terbaru! Stay update ya
                </Text>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={notification}
                contentContainerStyle={{
                  paddingBottom:Dimensions.get('window').height/6,
                }}
                onEndReached={loadMore}
                keyExtractor={(item,index) => 'notif-' + index}
                numColumns={1}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                renderItem={({ item }) => renderNotificationList(item)}
              />
            )}
          </View>
          <Gap height={10} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardView: {
    borderRadius: 19,
    marginBottom: 10,
    width: '100%',
    height: 116,
    marginEnd: 16,
    backgroundColor: '#F6F6F6',
  },
  imgCardView: {
    position: 'absolute',
    height: 116,
    width: 120,
    borderRadius: 19,
    opacity: 0.1,
  },
  cardViewIn: {
    width: 64,
    height: 64,
    backgroundColor: colorApp.primary,
    borderRadius: 19,
    padding: 15,
  },
});
