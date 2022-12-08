import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { FlatList, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  set,
} from 'react-native-reanimated';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Image, Input } from '@rneui/themed';
import EvilIcon from 'react-native-vector-icons/dist/EvilIcons';
import { StatusBar } from 'react-native';
import { Api } from '../../../../util/ApiManager';
import { colorApp } from '../../../../util/globalvar';
import { MessageUtil } from '../../../../util/MessageUtil';
import GapList from '../../../Komponen/GapList';
import { useSelector } from 'react-redux';
import Lottie from 'lottie-react-native';

const { height: SCREEN_HEIGHT,width: SCREEN_WIDTH  } = Dimensions.get('window');

const limit = 10;
var count = 0;
var firstLoad = true;
var kategori = '1';
const PajakContent = forwardRef((props, ref) => {
  const { nav, map } = ref;
  const { latitudeInit, longitudeInit } = useSelector((state) => state.mapupdate);
  const heightTranslated = useSharedValue(0);
  const contextBS = useSharedValue({ y: 0 });
  const MAX_TRANSLATE_Y = Platform.OS === "ios" ? -SCREEN_HEIGHT + 100 :-SCREEN_HEIGHT;
  const statHeight = useSharedValue(false);
  const [keyword, setKeyword] = useState('');
  const [idKategori, setIdKategori] = useState('1');
  const [categoryItem, setCategoryItem] = useState([]);
  const [responseItem, setResponseItem] = useState([]);
  const [extraData, setExtraData] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [emptyData, setEmptyData] = useState(true);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingFooter, setLoadingFooter] = useState(false);

  const textInput = useRef();

  const ScrollTo = useCallback((destination) => {
    'worklet';
    heightTranslated.value = withSpring(destination, { damping: 50 });
  }, []);

  useEffect(() => {
    const valueScroll = -SCREEN_HEIGHT / 5.5;
    ScrollTo(valueScroll);

    console.log('================refvalue====================');
    console.log(map);
    console.log('====================================');
    console.log('====================================');
    console.log(nav);
    console.log('====================================');

    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      if (heightTranslated !== MAX_TRANSLATE_Y) {
        var scroll = -300 + -200;
        ScrollTo(scroll);
      }
    });

    const subscribeFocus = nav.addListener('focus', () => {
      count = 0;
      firstLoad = true;
      setResponseItem([]);
      setCategoryItem([]);
      getCategory();
      getLocationUpdate();
    });

    return () => {
      showSubscription.remove();
      subscribeFocus;
    };
  }, [nav]);

  const getCategory = async () => {
    await Api.get('Survey/kategori')
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          setCategoryItem(response);
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const getLocationUpdate = async () => {
    if (firstLoad) {
      setLoadingScreen(true);
    }
    params = {
      longitude: map.longitude,
      latitude: map.latitude,
      start: count,
      count: limit,
      id_kategori: kategori,
      keyword: keyword,
    };
    await Api.post('merchant', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          if (firstLoad) {
            setResponseItem(response);
            firstLoad = false;
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
          setEmptyData(false);
          MessageUtil.warningMessage(message);
          setLoadingFooter(false);
          setLoadingScreen(false);
        }
      })
      .catch((err) => {
        setLoadingFooter(false);
        setLoadingScreen(false);
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        setHasNextPage(false);
        setExtraData(false);
        setEmptyData(false);
      });
  };

  const loadMore = () => {
    if (hasNextPage == true && extraData == true && firstLoad == false && emptyData == false) {
      setLoadingFooter(true);
      count += limit;
      getLocationUpdate();
    }
  };

  const itemSelectedLoad = (item) => {
    kategori = item;
    count = 0;
    firstLoad = true;
    setResponseItem([]);
    setIdKategori(item);
    getLocationUpdate();
  };

  const setSearch = () => {
    count = 0;
    firstLoad = true;
    kategori = '';
    setResponseItem([]);
    setIdKategori('');
    getLocationUpdate();
  };

  const gestureFunc = Gesture.Pan()
    .onStart(() => {
      contextBS.value = { y: heightTranslated.value };
    })
    .onUpdate((event) => {
      //console.log(event.translationY);
      heightTranslated.value = event.translationY + contextBS.value.y;
      heightTranslated.value = Math.max(heightTranslated.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (heightTranslated.value > -SCREEN_HEIGHT / 4.5) {
        const valueScroll = -SCREEN_HEIGHT / 5.5;
        ScrollTo(valueScroll);
        statHeight.value = true;
      } else if (heightTranslated.value < -SCREEN_HEIGHT / 2) {
        ScrollTo(MAX_TRANSLATE_Y);
        statHeight.value = false;
      }
    })
    .onChange((event) => {
      if (event.translationY > -SCREEN_HEIGHT / 5.5) {
        statHeight.value = true;
      } else if (event.translationY < -SCREEN_HEIGHT / 4) {
        statHeight.value = false;
      }
    });

  const styleBottomSheet = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      heightTranslated.value,
      [MAX_TRANSLATE_Y + 75, MAX_TRANSLATE_Y],
      [25, 0],
      Extrapolate.CLAMP
    );
    return {
      borderRadius,
      transform: [{ translateY: heightTranslated.value }],
    };
  });

  return (
    <GestureDetector gesture={gestureFunc}>
      <Animated.View style={[style.container, styleBottomSheet]}>
        <View
          style={{
            backgroundColor: 'grey',
            height: 5,
            width: 100,
            alignSelf: 'center',
            marginBottom: 16,
            marginTop: 8,
            borderRadius: 5,
          }}
        />

        <View
          style={{
            backgroundColor: 'white',
            marginEnd: 24,
            marginStart: 24,

            marginBottom: 16,

            borderBottomColor: 'grey',

            borderBottomWidth: 1,
          }}
        >
          <Input
            leftIcon={<EvilIcon name="search" size={28} color={'black'} />}
            ref={textInput}
            value={keyword}
            onChangeText={(txt) => {
              setKeyword(txt);
            }}
            onChange={() => {
              setSearch();
            }}
            inputContainerStyle={{ borderBottomWidth: 0, padding: 0, margin: 0 }}
            placeholder="Cari Wajib Pajak"
            containerStyle={{
              margin: 0,
              height: Platform.OS === "ios" ? StatusBar.currentHeight + 40 : StatusBar.currentHeight + 20,
            }}
          />
        </View>
        <View
          style={{
            height: 60,
            flexDirection: 'column',
          }}
        >
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={categoryItem}
            contentContainerStyle={{
              padding: 8,
              height: Platform.OS === 'ios' ? 50 : 100,
            }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    itemSelectedLoad(item.id);
                  }}
                  style={{
                    backgroundColor: idKategori === item.id ? 'grey' : 'white',
                    flexDirection: 'column',
                    height: 45,
                    marginLeft: 8,
                    justifyContent: 'center',
                    shadowColor: 'black',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    borderRadius: 8,
                    padding: 8,
                  }}
                >
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: 'black',
                      fontSize: 14,
                    }}
                  >
                    {item.kategori}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {loadingScreen ? (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <ActivityIndicator
              color={colorApp.button.primary}
              size={'large'}
              style={{
                alignSelf: 'center',
              }}
            />
          </View>
        ) : (
          <>
          {responseItem.length === 0 ? <View style={{
            flex:1,
            height:SCREEN_HEIGHT,
            marginTop:SCREEN_HEIGHT/10
          }}>
            <Lottie 
      source={require('../../../../../assets/images/empty_animation.json')} autoPlay loop style={{
        position:'relative',
      }}/>
            </View> :     <FlatList
            data={responseItem}
            extraData={extraData}
            onEndReached={loadMore}
            ItemSeparatorComponent={<GapList />}
            style={{
              flexGrow: 1,
            }}
            contentContainerStyle={{
              padding: 16,
            }}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginBottom: 8,
                    padding: 8,
                  }}
                >
                  <Image
                    source={
                      item.image.length > 0
                        ? { uri: item.image[0].image }
                        : require('../../../../../assets/images/store.png')
                    }
                    style={{
                      width: 75,
                      height: 75,
                    }}
                    resizeMode={'cover'}
                    containerStyle={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: 75,
                      height: 75,
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
                        color={colorApp.primaryGaspoll}
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
                      paddingLeft: 8,
                    }}
                  >
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
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontWeight: '400',
                        width: Platform.isPad ? "100%" : 200,
                      }}
                    >
                      {item.alamat}
                    </Text>
                  </View>
                </View>
              );
            }}
          />}
        
          </>
        
        )}
      </Animated.View>
    </GestureDetector>
  );
});

const style = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    height: SCREEN_HEIGHT,
    borderRadius: 25,
    padding: 0,
    backgroundColor: 'white',
    elevation: 6,
    flex: 1,
    flexDirection: 'column',
  },
});

export default PajakContent;
