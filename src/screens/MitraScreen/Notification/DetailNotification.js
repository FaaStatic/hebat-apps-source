import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Image } from '@rneui/themed';
import { Header } from '../../Komponen/Header';
import { fontsCustom } from '../../../util/globalvar';
export default function DetailNotification({ navigation, route }) {
  const { model } = route.params;
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {});
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const convertTgl = (item) => {
    var format = item.split('-');
    return `${format[2]}/${format[1]}/${format[0]}`;
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <Header
        Title={'Detail Notifikasi'}
        back={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          paddingEnd: 24,
          paddingStart: 24,
          paddingTop: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily:fontsCustom.primary[700],
            color: 'black',
            marginTop: 8,
          }}
        >
          Tanggal
        </Text>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 8,
            marginTop: 8,
            justifyContent: 'flex-start',
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[400],
              color: 'black',
            }}
          >
            {convertTgl(model.tgl)}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily:fontsCustom.primary[700],
            color: 'black',
            marginTop: 8,
          }}
        >
          Judul
        </Text>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 8,
            marginTop: 8,
            justifyContent: 'flex-start',
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[400],

              color: 'black',
            }}
          >
            {model.title}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily:fontsCustom.primary[700],

            color: 'black',
            marginTop: 8,
          }}
        >
          Keterangan
        </Text>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 8,
            marginTop: 8,
            justifyContent: 'flex-start',
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[400],

              color: 'black',
            }}
          >
            {model.ket}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily:fontsCustom.primary[700],

            color: 'black',
            marginTop: 8,
          }}
        >
          Wajib Pajak
        </Text>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 8,
            marginTop: 8,
            justifyContent: 'flex-start',
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily:fontsCustom.primary[400],

              color: 'black',
            }}
          >
            {model.nama}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily:fontsCustom.primary[700],

            color: 'black',
            marginTop: 8,
          }}
        >
          Foto
        </Text>
        {model.image.length === 0 ? (
          <></>
        ) : (
          <FlatList
            horizontal={true}
            data={model.image}
            keyExtractor={(index, item) => index}
            renderItem={({ item }) => {
              <Image
                source={{ uri: item.image }}
                containerStyle={{
                  margin: 8,
                  borderRadius: 8,
                  height: 80,
                  width: 80,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                resizeMode={'cover'}
                style={{
                  height: 80,
                  width: 80,
                }}
              />;
            }}
          />
        )}
      </View>
    </View>
  );
}
