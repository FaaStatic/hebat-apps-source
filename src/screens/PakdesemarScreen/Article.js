import react, { useEffect, useState } from 'react';
import { Skeleton } from '@rneui/themed';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/id';
import { colorApp, fontsCustom } from '../../util/globalvar';
import LinearGradient from 'react-native-linear-gradient';
import { stylesheet } from './assets';
import { Gap, HeaderPrimary } from './components';
import RenderHTML from 'react-native-render-html';
import ServiceHelper from './addOns/ServiceHelper';
import { MessageUtil } from '../../util/MessageUtil';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const cols = 2;
const marginHorizontal = 10;
const widthGrid = Dimensions.get('window').width / cols - marginHorizontal * (cols + 1.5);

export default Article = ({ navigation, route }) => {
  const [article, setArticle] = useState([
    {
      id: '',
      judul_news: '',
      image: '',
      deskripsi: '',
      status: '',
      tgl_news: '',
    },
  ]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDataArticle();
  }, []);
  const getDataArticle = async () => {
    const params = {
      keyword: '',
      sort: '',
      start: 0,
      count: 10,
    };
    const res = await ServiceHelper.actionServicePost('News/list_news', params);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      setArticle(response);
      setLoading(false);
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const detailArticle = (data) => {
    navigation.navigate('DetailArticle', { data: data });
  };
  const renderItemArticle = (item) => {
    let image =
      item.image != ''
        ? item.image
        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPQNWqRv8vEezVuO_Ooo7Q2BL1mTfsDFGV7BuUj-2bh9N8OrxNPI62tVgrZf0cCGNDK_g&usqp=CAU';
    return (
      <TouchableOpacity onPress={() => detailArticle(item)}>
        <View style={styles.cardViewNews}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '45%', margin: 5 }}>
              <LinearGradient
                colors={[colorApp.gradientSatu, colorApp.gradientDua]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.2 }}
                style={styles.imgCardViewNews}
              >
                <Image source={{ uri: image }} style={styles.imgCardViewNews} resizeMode="cover" />
              </LinearGradient>
            </View>
            <View style={{ width: '50%', marginEnd: 5, justifyContent: 'center' }}>
              <Text
                style={{ fontSize: 8, color: colorApp.black, fontFamily: fontsCustom.primary[400] }}
              >
                {moment(article[0].tgl_new).format('dddd, hh MMMM YYYY')}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: colorApp.black,
                  fontFamily: fontsCustom.primary[700],
                }}
                numberOfLines={1}
              >
                {item.judul_news}
              </Text>
            </View>
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colorApp.gradientDua }}>
        <LinearGradient
          colors={[colorApp.gradientSatu, colorApp.gradientDua]}
          start={{ x: -2, y: 0.7 }}
          end={{ x: 0.1, y: 0 }}
          style={[stylesheet.pages]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Gap height={40} />
            <HeaderPrimary rute="Article" onIcon={true} onPressIcon={() => actionLetter()} />
            <View style={[stylesheet.content]}>
              <Gap height={15} />
              <Text style={styles.title}>Artikel Terbaru</Text>
              <Gap height={5} />
              {loading == true ? (
                <Skeleton
                  LinearGradientComponent={LinearGradient}
                  animation="wave"
                  width={'100%'}
                  height={120}
                  variant="rectangular"
                />
              ) : (
                <TouchableOpacity onPress={() => detailArticle(article[0])}>
                  <LinearGradient
                    colors={[colorApp.gradientSatu, colorApp.gradientDua]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.2 }}
                    style={styles.cardViewNewsSingle}
                  >
                    <View>
                      <Image
                        source={{
                          uri:
                            article[0].image != ''
                              ? article[0].image
                              : 'https://bapenda.semarangkota.go.id/home/po-content/uploads/HDR_n_1.png',
                        }}
                        style={styles.imgCardViewNewsSingle}
                        resizeMode="cover"
                      />
                      <View style={styles.coverTitleSigle}>
                        <View style={{ margin: 15 }}>
                          <Gap height={10} />
                          <Text
                            style={{
                              fontSize: 8,
                              color: colorApp.black,
                              fontFamily: fontsCustom.primary[400],
                              alignSelf: 'flex-end',
                            }}
                          >
                            {moment(article[0].tgl_new).format('dddd, hh MMMM YYYY')}
                          </Text>
                          <Gap height={5} />
                          <Text
                            style={{
                              fontSize: 20,
                              color: colorApp.black,
                              fontFamily: fontsCustom.primary[700],
                            }}
                            numberOfLines={1}
                          >
                            {article[0].judul_news}
                          </Text>
                        </View>
                        {/* <View
                          style={{ height: 60, flex: 1, maxHeight: 60 }}>
                          <RenderHTML
                          contentWidth={width}
                          source={{ html: article[0].deskripsi.substring(0, 1000) }}
                        /> */}
                        {/* </View> */}
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              <Gap height={10} />
              <Text style={styles.title}>Artikel Lainnya</Text>
              <Gap height={10} />
              <View style={{ alignItems: 'center' }}>
                {loading && (
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
                  </View>
                )}
                <FlatList
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  data={article.slice(1, article.length)}
                  keyExtractor={(item) => 'Article-' + item.title}
                  renderItem={({ item }) => renderItemArticle(item)}
                />
              </View>
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
    fontFamily: fontsCustom.primary[400],
    fontSize: 16,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
  },
  cardViewNews: {
    flex: 1,
    borderRadius: 0,
    marginBottom: 10,
    backgroundColor: colorApp.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    borderRadius: 19,
    elevation: 2,
    marginTop: 5,
  },
  cardViewNewsSingle: {
    borderRadius: 0,
    marginBottom: 10,
    width: '100%',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderRadius: 19,
    marginEnd: 16,
    elevation: 5,
    marginTop: 8,
  },
  imgCardViewNews: {
    height: 100,
    width: 139,
    opacity: 0.7,
    borderRadius: 19,
  },
  imgCardViewNewsSingle: {
    height: 240,
    width: '100%',
    borderRadius: 19,
    opacity: 0.18,
  },
  coverTitleSigle: {
    flex: 1,
    justifyContent: 'center',
    height: 90,
    width: '89%',
    backgroundColor: colorApp.primary,
    position: 'absolute',
    borderRadius: 15,
    opacity: 0.8,
    margin: 20,
    marginTop: '42%'
  },
});
