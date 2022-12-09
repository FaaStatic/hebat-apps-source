import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { Gap } from '../components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ServiceHelper from '../addOns/ServiceHelper';
import RenderHTML from 'react-native-render-html';
import { MessageUtil } from '../../../util/MessageUtil';
const width = Dimensions.get('window').width;
export default Persyaratan = () => {
  const [data, setData] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    getDataPersayaratan('Persyaratan/list_persyaratan');
  }, []);
  const tagsStyles = {
    ol: {
      whiteSpace: 'normal',
    },
    li: {
      color: colorApp.black
    }
  };
  const getDataPersayaratan = async (endpoint) => {
    const res = await ServiceHelper.actionServiceGet(endpoint);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      setData(response);
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const openList = (id) => {
    if (active !== id) {
      setActive(id);
    } else {
      setActive(0);
    }
  };

  return (
    <View>
      <Gap height={30} />
      <Text style={{ fontFamily: fontsCustom.primary[400], color: colorApp.black, fontSize: 14 }}>
        {' '}
        Masih bingung? cek syarat berikut!{' '}
      </Text>
      <Gap height={10} />

      {data.length == 0 ? (
        <>
          <Gap height={20} />
          <ActivityIndicator size="large" color={colorApp.header.primary} />
        </>
      ) : (
        data.map((item) => {
          let icon = active == item.id ? 'caretup' : 'caretdown';
          return (
            <>
              <Gap height={5} />
              <TouchableOpacity onPress={() => openList(item.id)}
                key={item.id}
                style={{
                  flexDirection: 'row',
                  borderTopEndRadius: 19,
                  borderTopStartRadius: 19,
                  borderBottomEndRadius: active == item.id ? 0 : 19,
                  borderBottomStartRadius: active == item.id ? 0 : 19,
                  padding: 15,
                  backgroundColor: colorApp.secondary,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: Platform.OS == 'android' ? 2 : 0,
                  shadowRadius: 13,
                  shadowColor: colorApp.black,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    paddingEnd: 20,
                    fontFamily: fontsCustom.primary[700],
                    color: colorApp.black,
                    fontSize: 14,
                  }}
                >
                  {item.judul}
                </Text>
                {/* <TouchableOpacity> */}
                <AntDesign name={icon} size={17} color={colorApp.button.primary} />
                {/* </TouchableOpacity> */}
              </TouchableOpacity>
              <Gap height={active == item.id ? 0 : 10} />
              {active == item.id && (
                <>
                  <View
                    style={{
                      borderBottomEndRadius: 19,
                      borderBottomStartRadius: 19,
                      paddingHorizontal: 15,
                      paddingBottom: 15,
                      backgroundColor: colorApp.secondary,
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      shadowOpacity: Platform.OS == 'android' ? 2 : 0,
                      shadowRadius: 13,
                      shadowColor: colorApp.black,
                      elevation: 2,
                    }}
                  >
                    <RenderHTML tagsStyles={tagsStyles} contentWidth={width} source={{ html: item.deskripsi }} />
                  </View>
                  <Gap height={10} />
                </>
              )}
            </>
          );
        })
      )}
    </View>
  );
};
