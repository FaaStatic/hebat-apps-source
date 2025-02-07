import { useEffect, useState } from 'react';
import { Skeleton } from '@rneui/themed';
import DeviceInfo from 'react-native-device-info';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import 'moment/locale/id';
import LinearGradient from 'react-native-linear-gradient';
import { colorApp, fontsCustom } from '../../util/globalvar';
import { menuPakdeSemar } from './menu';
import { stylesheet } from './assets';
import { Button, Gap, HeaderPrimary, Input } from './components';
import ServiceHelper from './addOns/ServiceHelper';
import { MessageUtil } from '../../util/MessageUtil';
import { BgSupportNew } from './assets';

var OsVer = parseInt(Platform.Version, 10);
export default function Home({ navigation }) {
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [version, setVersion] = useState(0);
  const [linkOpenApp, setLinkOpenApp] = useState('');
  useEffect(() => {
    checkStatusVersionApps();
    getDataArticle();
  }, []);

  const checkStatusVersionApps = async () => {
    const params = {
      modul: 'user',
    };
    const res = await ServiceHelper.actionServicePost('Authentication/checkversion', params);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status == 200) {
      console.log('Response App Version :', response);
      let appVersionLocal = parseFloat(DeviceInfo.getVersion());
      console.log(appVersionLocal);
      let value_version =
        Platform.OS === 'android' ? response.version_android : response.version_ios;
      let appVersionAPI = parseFloat(value_version);
      console.log(appVersionAPI);
      if (appVersionAPI > appVersionLocal) {
        setVersion(appVersionAPI);
        let link =
          Platform.OS === 'android' ? response.link_update_android : response.link_update_ios;
        setLinkOpenApp(link);
        setModal(true);
      }
    } else {
      console.log(metadata.message);
    }
  };

  const getDataArticle = async () => {
    const params = {
      keyword: '',
      sort: '',
      start: 0,
      count: 10,
    };
    const res = await ServiceHelper.actionServicePost('News/list_news', params);
    setLoading(false);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      setArticle(response);
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const onPressMenu = (item) => {
    if (item.link !== '') {
      navigation.navigate('LoadWebView', { url: item.link });
    } else {
      const data = {
        nama: item.name,
        logo: item.logo,
      };
      navigation.navigate('MainSubMenu', { data: data });
    }
  };
  const detailArticle = (data) => {
    navigation.navigate('DetailArticle', { data: data });
  };
  const actionOpenLink = () => {
    setModal(false);
    setTimeout(() => {
      Linking.openURL(linkOpenApp);
    }, 1000);
  };

  const renderItemMenu = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 8,
        }}
        onPress={() => onPressMenu(item)}
      >
        <View style={styles.cardMainMenu}>
          <Image
            source={item.logo}
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              width: 23,
              height: 27,
            }}
            resizeMode="contain"
          />
        </View>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 9,
            color: colorApp.black,
            textAlign: 'center',
            fontFamily: fontsCustom.primary[700],
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderItemArticle = (item) => {
    let image =
      item.image != ''
        ? item.image
        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPQNWqRv8vEezVuO_Ooo7Q2BL1mTfsDFGV7BuUj-2bh9N8OrxNPI62tVgrZf0cCGNDK_g&usqp=CAU';
    return (
      <TouchableOpacity onPress={() => detailArticle(item)}>
        <View style={styles.cardViewNews}>
          <View style={{ margin: 5 }}>
            <LinearGradient
              colors={[colorApp.gradientSatu, colorApp.gradientDua]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.2 }}
              style={styles.imgCardViewNews}
            >
              <Image source={{ uri: image }} style={styles.imgCardViewNews} resizeMode="cover" />
            </LinearGradient>
          </View>
          <View style={styles.coverTitle}>
            <Text
              style={{
                fontSize: 11,
                color: colorApp.black,
                fontFamily: fontsCustom.primary[700],
              }}
              numberOfLines={3}
            >
              {item.judul_news}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const actionLetter = () => {
    navigation.navigate('MainNotification');
  };
  return (
    <>
      <StatusBar backgroundColor={colorApp.header.primary} />
      <LinearGradient
        colors={[colorApp.gradientSatu, colorApp.gradientDua]}
        start={{ x: 5, y: 2.5 }}
        end={{ x: -1, y: 0.7 }}
        style={[stylesheet.pages]}
      >
        {Platform.OS == 'ios' && <Gap height={35} />}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Gap height={40} />
          <HeaderPrimary rute="Beranda" onIcon={true} onPressIcon={() => actionLetter()} />
          <Gap height={20} />
          <View style={[stylesheet.content]}>
            <Gap height={5} />
            <Text style={styles.title}>Layanan Kami</Text>
            <Gap height={15} />
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 19,
                padding: 23,
              }}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                data={menuPakdeSemar}
                keyExtractor={(item) => 'MenuHome-' + item.name}
                numColumns={4}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                renderItem={({ item }) => renderItemMenu(item)}
              />
            </View>
            <Gap height={20} />
            <Input
              value={'Anda Seorang Kawan?'}
              isReadOnly={true}
              backgroundColor={'#F7F7F7'}
              borderColor={'#F7F7F7'}
              onPressIcon={() => navigation.navigate('Mitra')}
              icon="login"
              backgroundColorInInput={colorApp.button.primary}
              textIcon="Masuk"
            />
            <Gap height={20} />
            <Text style={styles.title}>Artikel</Text>
            <Gap height={20} />
            <View style={{ alignItems: 'center' }}>
              {loading && (
                <>
                  <View style={{ flexDirection: 'row' }}>
                    <Skeleton
                      LinearGradientComponent={LinearGradient}
                      animation="wave"
                      width={160}
                      height={120}
                      variant="rectangular"
                    />
                    <Gap width={10} />
                    <Skeleton
                      LinearGradientComponent={LinearGradient}
                      animation="wave"
                      width={160}
                      height={120}
                      variant="rectangular"
                    />
                    {Platform.isPad == true && (
                      <>
                        <Gap width={10} />
                        <Skeleton
                          LinearGradientComponent={LinearGradient}
                          animation="wave"
                          width={160}
                          height={120}
                          variant="rectangular"
                        />
                        <Gap width={10} />
                        <Skeleton
                          LinearGradientComponent={LinearGradient}
                          animation="wave"
                          width={160}
                          height={120}
                          variant="rectangular"
                        />
                      </>
                    )}
                  </View>
                </>
              )}
              <FlatList
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                horizontal={Platform.isPad == true ? false : true}
                numColumns={Platform.isPad == true && 4}
                data={article}
                keyExtractor={(item, index) => 'Article-' + index}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                renderItem={({ item }) => renderItemArticle(item)}
              />
            </View>
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => setModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ borderRadius: 20, backgroundColor: 'white' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 12 }}>
                  <Image
                    source={BgSupportNew}
                    style={{ width: 250, height: 190, resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      fontFamily: fontsCustom.primary[700],
                      fontSize: 18,
                      textAlign: 'center',
                      paddingHorizontal: 16,
                    }}
                  >
                    Informasi
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontsCustom.primary[400],
                      fontSize: 16,
                      textAlign: 'center',
                      marginTop: 5,
                      paddingHorizontal: 16,
                    }}
                  >
                    Sudah tersedia versi aplikasi terbaru
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontsCustom.primary[700],
                      fontSize: 16,
                      textAlign: 'center',
                      paddingHorizontal: 16,
                    }}
                  >
                    Hebat! v. {version}
                  </Text>
                  <Gap height={20} />
                  <Button
                    title={'Perbarui'}
                    onPress={() => actionOpenLink()}
                    width={130}
                    fontSize={14}
                    height={40}
                    type={'primary'}
                  />
                  <Gap height={10} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colorApp.black,
    fontSize: 16,
    fontFamily: fontsCustom.primary[400],
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
  },
  cardViewNews: {
    borderRadius: 19,
    marginBottom: 10,
    height: 165,
    backgroundColor: colorApp.primary,
    width: 141,
    marginEnd: 16,
  },
  imgCardViewNews: {
    width: 130,
    height: 98,
    borderRadius: 19,
    opacity: 0.7,
  },
  titleCardViewNews: {
    minHeight: 25,
    color: 'black',
    fontSize: 14,
    marginTop: 6,
    textTransform: 'capitalize',
    numberOfLines: 2,
  },
  dateCardViewNews: {
    color: 'gray',
    fontSize: 12,
    marginTop: 2,
  },
  coverTitle: {
    flex: 1,
    marginHorizontal: 10,
  },
  cardMainMenu: {
    width: 55,
    height: 55,
    margin: 5,
    borderRadius: 13,
    padding: 15,
    backgroundColor: colorApp.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: Platform.OS == 'android' ? 2 : 0,
    shadowRadius: 13,
    shadowColor: colorApp.black,
    elevation: 2,
  },
});
