import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colorApp, fontsCustom } from '../../../../../util/globalvar';
import { Input, Gap } from '../../../components';
const width = Dimensions.get('window').width;
export default Partner = ({ load, primaryDataBank, data, onPressOpenApps, onPressOpenQris }) => {
  const [label, setLabel] = useState('');
  const [active, setActive] = useState(0);
  useEffect(() => {
    let title = `Menuju aplikasi ${primaryDataBank.name}`
    setLabel(title)
  })
  const openList = (id) => {
    if (active !== id) {
      setActive(id);
    } else {
      setActive(0);
    }
  };
  const tagsStyles = {
    p: {
      whiteSpace: 'normal',
      color: colorApp.black
    },
    div: {
      whiteSpace: 'normal',
      color: colorApp.black
    },
    li: {
      color: colorApp.black
    }
  };
  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Gap height={30} />
        {primaryDataBank.type == 'bank' && (
          <>
            <View style={{ marginHorizontal: 20 }}>
              <Input
                value={label}
                isReadOnly={true}
                backgroundColor={colorApp.secondary}
                borderColor={colorApp.primary}
                onPressIcon={() => onPressOpenApps('')}
                icon="external-link"
              />
            </View>
            {primaryDataBank.kode_partner === 'BNK-Bank Jateng' && (
              <><Gap height={20} /><View style={{ marginHorizontal: 20 }}>
                <Input
                  value={'Pindai Pembayaran QRIS'}
                  isReadOnly={true}
                  backgroundColor={colorApp.secondary}
                  borderColor={colorApp.primary}
                  onPressIcon={() => onPressOpenQris('')}
                  icon="qris" />
              </View></>
            )}
            <Gap height={40} />
          </>
        )}
        <Text style={{ fontFamily: fontsCustom.primary[400], color: colorApp.black, fontSize: 14 }}>
          {' '}
          Panduan Pembayaran{' '}
        </Text>
        <Gap height={10} />
        {load ? (
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
                <View
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
                  <TouchableOpacity onPress={() => openList(item.id)}>
                    <AntDesign name={icon} size={17} color={colorApp.header.primary} />
                  </TouchableOpacity>
                </View>
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
                      <RenderHTML
                        enableExperimentalBRCollapsing={true}
                        contentWidth={width}
                        tagsStyles={tagsStyles}
                        source={{ html: item.deskripsi }}
                      />
                    </View>
                    <Gap height={10} />
                  </>
                )}
              </>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};
