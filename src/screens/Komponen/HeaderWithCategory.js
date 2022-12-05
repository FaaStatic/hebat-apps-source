import { View, TouchableOpacity, StatusBar, StyleSheet, Text} from 'react-native';
import React, { useState,useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { colorApp, positionLevel } from '../../util/globalvar';
import { Api } from '../../util/ApiManager';

var item = 0;
export const HeaderWithCategory = ({ Title, back, selectedItem = null }) => {
  const [itemSelected, setItemSelected] = useState("");
  const [ItemResponse,setItemResponse] = useState([]);

  useEffect(()=>{
    getListCategory();
  },[]);

  const getListCategory = async () => {
    await Api.get("Survey/kategori").then(res => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if(status === 200){
            setItemResponse(response);
        }else{
            console.log(message);
        }
    }).catch(err=>{
        console.log(err);
    });
  }

  return (
    <LinearGradient
      colors={[colorApp.gradientSatu,colorApp.gradientSatu]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style.container}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',

          height: StatusBar.currentHeight + 20,
          marginStart: 16,
          marginTop: 8,
        }}
      >
        <TouchableOpacity onPress={back} style={{ justifyContent: 'center' }}>
          <Icon name="arrowleft" size={24} color={'white'} />
        </TouchableOpacity>

        <Text
          style={[
            style.textTitle,
            {
              marginStart: 16,
              alignSelf: 'center',
              fontWeight:'700'
            },
          ]}
        >
          {Title}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {ItemResponse !== null && <FlatList
          data={ItemResponse}
          horizontal={true}
          contentContainerStyle={{
            height: 85,
            padding: 8,
          }}
          ListHeaderComponent={ () => {return(
            <TouchableOpacity
            onPress={() => {
              setItemSelected("");
              selectedItem("");
            }}
            style={{
              margin: 8,
              padding: 8,
              backgroundColor: itemSelected === "" ? colorApp.button.primary : 'transparent',
              borderColor: 'white',
              borderWidth: itemSelected === "" ? 0 : 0.5,
              borderRadius: 8,
              flexDirection: 'column',
              justifyContent: 'center',
              height: 35,
              width: 80,
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 12,
                color: 'white',
                fontWeight: '600',
              }}
            >
             Semua
            </Text>
          </TouchableOpacity>
          );}}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setItemSelected(item.kategori);
                  selectedItem(item.kategori);
                }}
                style={{
                  margin: 8,
                  padding: 8,
                  backgroundColor: itemSelected === item.kategori ? colorApp.button.primary : 'transparent',
                  borderColor: 'white',
                  borderWidth: itemSelected === item.kategori ? 0 : 0.5,
                  borderRadius: 8,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: 35,
                  width: 80,
                }}
              >
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 12,
                    color: 'white',
                    fontWeight: '600',
                  }}
                >
                  {item.kategori}
                </Text>
              </TouchableOpacity>
            );
          }}
        />}
      </View>
    </LinearGradient>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: StatusBar.currentHeight + 88,
  },
  textTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: '400',
  },
  buttonRiwayat: {
    borderRadius: 8,
    height: StatusBar.currentHeight,
    width: 125,
    marginEnd: 16,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'white',
    justifyContent: 'center',
  },
});
