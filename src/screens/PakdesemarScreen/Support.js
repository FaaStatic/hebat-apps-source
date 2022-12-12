import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  SafeAreaView,
  FlatList,
  Dimensions
} from 'react-native';
import { Skeleton } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import { BgSupportNew, stylesheet } from './assets';
import { Gap, Input } from './components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colorApp, fontsCustom } from '../../util/globalvar';
import { sosmed } from './menu';
import ServiceHelper from './addOns/ServiceHelper';
import { MessageUtil } from '../../util/MessageUtil';



const {height:ViewHeight, width : ViewWidth } = Dimensions.get("window");

export default Support = ({ navigation, route }) => {
  const [sosialMedia, setSosialMedia] = useState(sosmed);
  const [linkTanya, setLinkTanya] = useState('');
  const [active, setActive] = useState(0);
  const [dataFaq, setDataFaq] = useState([]);
  useEffect(() => {
    getDataFaq();
    getSosialMedia();
  }, []);
  const getDataFaq = async () => {
    const res = await ServiceHelper.actionServiceGet('Faq/list_faq');
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      setDataFaq(response);
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const getSosialMedia = async () => {
    const res = await ServiceHelper.actionServiceGet('Support/list_support');
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      response.map((item, index) => {
        let link = item.deskripsi;
        let judul = item.judul;
        if (index !== 4) {
          sosialMedia[index].name = judul;
          sosialMedia[index].link_sosmed = link;
        } else {
          setLinkTanya(link);
        }
      });
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const actionLetter = () => {
    navigation.navigate('MainNotification');
  };
  const openLink = (link) => {
    Linking.openURL(link);
  };
  const openFaq = (id) => {
    if (active !== id) {
      setActive(id);
    } else {
      setActive(0);
    }
  };
  const renderItemSosmed = (item, index) => {
    return (
      <>
        <View style={{ flexDirection: 'row', justifyContent:'flex-start', width:'45%' }}>
          <View style={{ height: 50, justifyContent: 'center',margin:8, }}>
            <Image source={item.logo} style={styles.sosemed} />
          </View>
          <Gap width={10} />
          <View style={{ justifyContent: 'center' }}>
            <Text
              style={{
                fontFamily: fontsCustom.primary[400],
                fontSize: 9,
                color: colorApp.black,
              }}
            >
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => openLink(item.link_sosmed)}
            >
              <Text
              numberOfLines={2}
                style={{
                  fontFamily: fontsCustom.primary[700],
                  fontSize: 10,
                  color: colorApp.black,
                  width: Platform.isPad ? ViewWidth/2 :  ViewWidth/3.5,
                }}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* {index == 0 ? <Gap width={55} /> : index == 2 ? <Gap width={40} /> : null} */}
      </>
    );
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colorApp.gradientDua }}>
        <LinearGradient
          colors={[colorApp.gradientSatu, colorApp.gradientDua]}
          start={{ x: -2, y: 0.7 }}
          end={{ x: 0.1, y: 0 }}
          style={[stylesheet.pages]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Gap height={40} />
            <HeaderPrimary rute="Hubungi" onIcon={true} onPressIcon={() => actionLetter()} />
            <View style={[stylesheet.content]}>
              <Gap height={35} />
              <View style={{ justifyContent: 'center' }}>
                <Image source={BgSupportNew} style={styles.avatar} resizeMode="contain" />
                <Gap height={20} />
                <FlatList
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  data={sosialMedia}
                  keyExtractor={(item,index) => 'Sosmed-' + index}
                  numColumns={2}
                   columnWrapperStyle={{justifyContent: 'space-around'}}
                
                  onEndReachedThreshold={0.5}
                  initialNumToRender={10}
                  renderItem={({ item, index }) => renderItemSosmed(item, index)}
                />
              </View>
              <Gap height={20} />
              <Input
                borderColor={colorApp.primary}
                backgroundColor={colorApp.primary}
                backgroundColorInInput={colorApp.button.primary}
                onPressIcon={() => openLink(linkTanya)}
                value=" Informasi lebih lanjut?"
                icon="info"
                isReadOnly={true}
                textIcon="Halo BAPENDA"
              />
              <Gap height={20} />
              <Text style={styles.title1}>Pertanyaan Umum</Text>
              <Gap height={10} />
              <View>
                {dataFaq.length === 0 ? (
                  <>
                    <Skeleton
                      LinearGradientComponent={LinearGradient}
                      animation="wave"
                      width={'100%'}
                      height={40}
                      variant="rectangular"
                    />
                    <Gap height={10} />
                    <Skeleton
                      LinearGradientComponent={LinearGradient}
                      animation="wave"
                      width={'100%'}
                      height={40}
                      variant="rectangular"
                    />
                  </>
                ) : (
                  dataFaq.map((item) => {
                    let icon = active == item.id ? 'caretup' : 'caretdown';
                    return (
                      <>
                        <Gap height={10} />
                        <TouchableOpacity onPress={() => openFaq(item.id)}
                          key={item.id}
                          style={{
                            flexDirection: 'row',
                            borderRadius: 19,
                            borderBottomEndRadius: active == item.id ? 0 : 19,
                            borderBottomStartRadius: active == item.id ? 0 : 19,
                            padding: 15,
                            backgroundColor: colorApp.primary,
                            shadowOffset: {
                              width: 0,
                              height: 4,
                            },
                            shadowOpacity: Platform.OS == 'android' ? 2 : 0.1,
                            shadowRadius: 13,
                            shadowColor: colorApp.black,
                            elevation: 2
                          }}
                        >
                          <Text
                            style={{
                              flex: 1,
                              paddingEnd: 15,
                              fontFamily: fontsCustom.primary[400],
                              color: colorApp.black,
                              fontSize: 12,
                            }}
                          >
                            {item.pertanyaan}
                          </Text>
                          {/* <TouchableOpacity> */}
                          <AntDesign name={icon} size={17} color={colorApp.button.primary} />
                          {/* </TouchableOpacity> */}
                        </TouchableOpacity>
                        <Gap height={active == item.id ? 0 : 5} />
                        {active == item.id && (
                          <>
                            <View
                              style={{
                                borderBottomEndRadius: 19,
                                borderBottomStartRadius: 19,
                                padding: 15,
                                backgroundColor: colorApp.primary,
                                shadowOffset: {
                                  width: 0,
                                  height: 4,
                                },
                                shadowOpacity: Platform.OS == 'android' ? 2 : 0.1,
                                shadowRadius: 13,
                                shadowColor: colorApp.black,
                                elevation: 2
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: fontsCustom.primary[400],
                                  color: colorApp.black,
                                  fontSize: 11,
                                  textAlign: 'justify',
                                }}
                              >
                                {item.jawaban}
                              </Text>
                              <Gap height={10} />
                            </View>
                          </>
                        )}
                      </>
                    );
                  })
                )}
              </View>
              <Gap height={20} />
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colorApp.black,
    fontSize: 16,
    fontFamily: fontsCustom.primary[700],
  },
  title1: {
    color: colorApp.black,
    fontSize: 16,
    fontFamily: fontsCustom.primary[400],
  },
  avatar: {
    width: '100%',
    height: 203,
  },
  sosemed: {
    width: 20,
    height: 20,
  },
});
