import React, {  useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  InteractionManager,
  Platform
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { storeLatInit, storeLongInit } from '../../../../statemanager/MapUpdate/MapUpdateSlicer';
import Geolocation from 'react-native-geolocation-service';
import { PermissionUtil } from '../../../../util/PermissionUtil';
import { MessageUtil } from '../../../../util/MessageUtil';
import PajakContent from './PajakContent';
import { colorApp, fontsCustom } from '../../../../util/globalvar';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { useFocusEffect } from '@react-navigation/native';


var latitude = -6.966667;
var longitude = 110.416664;
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;
const { height: viewHeight } = Dimensions.get('window');

const PajakSekitar = ({ navigation, route }) => {
  const [mapState, setMapState] = useState({
    latitude: -6.966667,
    longitude: 110.416664,
    latitudeDelta: limitlatitudeDelta,
    longitudeDelta: limitLongitudeDelta,
  });

  const dispatching = useDispatch();
  const mapsLayout = useRef();

  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      locationLock();
    });
    return()=> task.cancel();
  },[]));


  const locationLock = async () => {
    try {
      var permissionStat = await PermissionUtil.accessLocation();
      if (permissionStat === true) {
        Geolocation.getCurrentPosition(
          async (pos) => {
            const datapos = await pos.coords;
            latitude = datapos.latitude;
            longitude = datapos.longitude;
            var params = {
              latitude: datapos.latitude,
              longitude: datapos.longitude,
              latitudeDelta: limitlatitudeDelta,
              longitudeDelta: limitLongitudeDelta,
            };
            setMapState(params);
            console.log('====================================');
            console.log(permissionStat);
            console.log('====================================');
          },
          (err) => {
            console.log(err.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        MessageUtil.errorMessage('Anda Belum Memberi Izin Lokasi!');
      }
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={style.container}>
        <View
          style={{
            height: viewHeight,
          }}
        >
          <MapView
          provider={MapView.PROVIDER_GOOGLE}
            ref={mapsLayout}
            style={{
              flex: 1,
            }}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: limitlatitudeDelta,
              longitudeDelta: limitLongitudeDelta,
            }}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: limitlatitudeDelta,
              longitudeDelta: limitLongitudeDelta,
            }}
            onRegionChangeComplete={(region) => {
              latitude = region.latitude;
              longitude = region.longitude;
              latitudeDelta =
                region.latitudeDelta < limitlatitudeDelta
                  ? limitlatitudeDelta
                  : region.latitudeDelta;
              longitudeDelta =
                region.longitudeDelta < limitLongitudeDelta
                  ? limitLongitudeDelta
                  : region.longitudeDelta;
              dispatching(storeLatInit(latitude));
              dispatching(storeLongInit(longitude));

              setMapState(region);
            }}
            onLayout={() => {
              mapsLayout.current.animateCamera({
                center: {
                  latitude: mapState.latitude,
                  longitude: mapState.longitude,
                },

                head: 0,
                pitch: 100,
              });
              mapsLayout.current.animateToRegion(mapState, 2500);
            }}
          >
            <Marker
              coordinate={{
                latitude: mapState.latitude,
                longitude: mapState.longitude,
              }}
              pinColor="blue"
              title="You are here"
              
            />
          </MapView>
          <TouchableOpacity
            onPress={() => {
              locationLock();
            }}
            style={{
              backgroundColor: colorApp.button.primary,
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 8,
              paddingBottom: 8,
              width: 100,
              position: 'absolute',
              top: 0,
              right: 0,
              marginTop: Platform.OS === "ios" ? 55: 16,
              marginEnd: 16,
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                alignSelf: 'center',
                fontFamily:fontsCustom.primary[700],

              }}
            >
              Reset
            </Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' &&  <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            style={{
            
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 8,
              paddingBottom: 8,
              width: 100,
              position: 'absolute',
              top: 0,
              left: 0,
              marginTop: Platform.OS === "ios" ? 55: 16,
              marginStart: 16,
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: 8,
            }}
          >
                        <Icon name="arrowleft" size={24} color={'black'} />

          </TouchableOpacity>}
         
        </View>

        <PajakContent ref={{ nav: navigation, map: mapState }} />
      </View>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
});

export default PajakSekitar;
