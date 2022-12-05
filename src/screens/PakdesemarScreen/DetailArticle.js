import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  StatusBar,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Skeleton } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import { colorApp, fontsCustom } from '../../util/globalvar';
import { stylesheet } from './assets';
import { Gap, HeaderSubMenu } from './components';
import moment from 'moment';
import 'moment/locale/id';
import ServiceHelper from './addOns/ServiceHelper';
import { MessageUtil } from '../../util/MessageUtil';
import RenderHTML from 'react-native-render-html';
const APPBAR_HEIGHT = 110;
const width = Dimensions.get('window').width;
export default DetailArticle = ({ navigation, route }) => {
  const { data } = route.params;
  const [load, setLoad] = useState(true);
  const [statusFull, setStatusFull] = useState(true);
  const [detail, setDetail] = useState({
    id: '',
    title: '',
    keterangan: '',
    image_name: '',
    image: '',
    jumlah_views: '',
    status: '',
  });

  useEffect(() => {
    getDetailArticle();
  }, []);
  const getDetailArticle = async () => {
    const params = {
      id: data.id,
    };
    const res = await ServiceHelper.actionServicePost('News/detail_news', params);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      setDetail(response);
      setLoad(false);
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  return (
    <>
      <StatusBar backgroundColor={colorApp.header.primary} />
      <View style={{ height: APPBAR_HEIGHT }} />
      <HeaderSubMenu
        title="Artikel"
        logo={data.image}
        type="icon-only"
        icon="black"
        background={colorApp.header.secondary}
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 45,
          borderTopRightRadius: 45,
          backgroundColor: colorApp.primary,
        }}
      >
        {load ? (
          <><Gap height={30} />
            <View style={{ marginHorizontal: 25 }}>
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={'100%'}
                height={200}
                variant="rectangular" />
              <Gap height={20} />
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={'90%'}
                height={30}
                variant="rectangular" />
              <Gap height={10} />
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={'50%'}
                height={20}
                variant="rectangular" />
            </View></>
        ) : (
          <View style={[stylesheet.content]}>
            <View style={{ marginHorizontal: 5 }}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
              >
                <Gap height={10} />
                <Image
                  source={{
                    uri:
                      detail.image != ''
                        ? detail.image
                        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPQNWqRv8vEezVuO_Ooo7Q2BL1mTfsDFGV7BuUj-2bh9N8OrxNPI62tVgrZf0cCGNDK_g&usqp=CAU',
                  }}
                  style={{
                    borderRadius: 35,
                    height: 200,
                  }}
                  resizeMode='cover'
                />
                <Gap height={20} />
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: fontsCustom.primary[700],
                    color: colorApp.black,
                  }}
                >
                  {detail.title}
                </Text>
                <Text>{moment(detail.tgl_news).format('dddd, hh MMMM YYYY')}</Text>
                <Gap height={10} />
                <RenderHTML contentWidth={width} source={{ html: detail.keterangan }} />
                <Gap height={35} />
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
