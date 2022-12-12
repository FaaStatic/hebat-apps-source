import React, { useState } from 'react';
import { View, TouchableOpacity, StatusBar, StyleSheet, Text, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import Icon2 from 'react-native-vector-icons/dist/FontAwesome';
import { useSelector } from 'react-redux';
import { colorApp,fontsCustom } from '../../util/globalvar';

const HeaderDate = ({
  title = '',
  back = () => {},
  openDate = null,
  closeDate = null,
  dateStart = null,
  dateEnd = null,
  searchShow = null,
  searchText = null,
}) => {
  const [textInput, setTextInput] = useState('');
  const { showSearch } = useSelector((state) => state.headerdate);
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
          width: '100%',
          justifyContent: searchShow !== null ? 'space-around' : 'flex-start',
          paddingStart: 8,
          paddingEnd: 8,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: '90%',
          }}
        >
          <TouchableOpacity
            onPress={back}
            style={{ justifyContent: 'center', marginLeft: 16, marginRight: 16 }}
          >
            <Icon name="arrowleft" size={24} color={'white'} />
          </TouchableOpacity>
          {showSearch ? (
            <View
              style={{
                marginEnd: 8,
                marginStart: 8,
                width: '90%',

                alignSelf: 'center',
                justifyContent: 'space-around',
                borderBottomWidth: 0.5,
                borderColor: 'white',
                flexDirection: 'row',
              }}
            >
              <TextInput
                style={{
                  marginStart: 8,
                  marginEnd: 8,
                  flex: 1,
                  paddingTop: 4,
                  paddingBottom: 4,
                  paddingStart: 0,
                  paddingEnd: 0,
                  width: '20%',
                  fontSize: 20,
                  color: 'white',
                  fontFamily:fontsCustom.primary[500],
                  borderBottomColor: 'white',
                }}
                value={textInput}
                onChangeText={(value) => {
                  setTextInput(value);
                  console.log(value);
                }}
              />
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                onPress={searchShow}
              >
                <Icon2 name="close" size={20} color={'white'} style={{}} />
              </TouchableOpacity>
            </View>
          ) : (
            <Text
            numberOfLines={2}
        ellipsizeMode='tail'
              style={[
                style.textTitle,
                {
                  marginStart: 16,
                  fontFamily: fontsCustom.primary[700],
                },
              ]}
            >
              {title}
            </Text>
          )}
        </View>
{searchShow !== null && <View
          style={{
            flexDirection: 'row',
            width: '10%',
            justifyContent: 'flex-end',
          }}
        >
          {showSearch ? (
            <></>
          ) : (
            <TouchableOpacity onPress={searchShow} style={{ marginEnd: 8, alignSelf: 'center' }}>
              <Icon2 name={'search'} color={'white'} size={24} />
            </TouchableOpacity>
          )}
        </View> }
        
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          padding: 8,
          justifyContent: 'space-around',
        }}
      >
        <TouchableOpacity onPress={openDate} style={style.btnDate}>
          <Icon2
            name="calendar"
            color={colorApp.gradientSatu}
            size={20}
            style={{
              marginEnd: 8,
            }}
          />
          <Text style={style.textDate}>{dateStart}</Text>
        </TouchableOpacity>
        <Text
          style={[
            style.textDate,
            {
              fontSize: 18,
              alignSelf: 'center',
              color: 'white',
            },
          ]}
        >
          -
        </Text>
        <TouchableOpacity onPress={closeDate} style={style.btnDate}>
          <Icon2
            name="calendar"
            color={colorApp.gradientSatu}
            size={20}
            style={{
              marginEnd: 8,
            }}
          />
          <Text style={style.textDate}>{dateEnd}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.btnDate}
          onPress={() => {
            searchText(textInput);
            setTextInput('');
          }}
        >
          <Icon2 name="arrow-right" size={20} color={colorApp.gradientSatu} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop:Platform.OS === "ios" ? 28 : 0,
    height: Platform.OS === "ios" ? StatusBar.currentHeight+150 :StatusBar.currentHeight + 100,
  },
  textTitle: {
    fontSize: 18,
    color: 'white',
    paddingTop: 4,
    paddingBottom: 4,
    fontFamily:fontsCustom.primary[700],
    width:250,
  },
  btnDate: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingEnd: 20,
    paddingStart: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  textDate: {
    fontSize: 12,
    fontFamily:fontsCustom.primary[400],
    textAlign: 'center',
    alignSelf: 'center',
    color: 'black',
  },
});

export default HeaderDate;
