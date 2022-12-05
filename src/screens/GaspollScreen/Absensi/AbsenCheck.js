import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { Dialog, LinearProgress } from '@rneui/themed';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform,Text,InteractionManager } from 'react-native';
import { colorApp, stringApp } from '../../../util/globalvar';
import { PermissionUtil } from '../../../util/PermissionUtil';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/dist/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';
import { SessionManager } from '../../../util/SessionUtil/SessionManager';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import {MessageUtil} from '../../../util/MessageUtil';
import * as mime from 'react-native-mime-types';
import polyfill from '@amityco/react-native-formdata-polyfill';
import RNFetchBlob from 'rn-fetch-blob';
import { useFocusEffect } from '@react-navigation/native';


var latitude = -6.966667;
var longitude = 110.416664;
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;
const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');
const AbsenCheck = ({ navigation, route }) => {
  const { status } = route.params;
  const { wrap, fs } = RNFetchBlob;
  const devices = useCameraDevices();
  const cameraActive = useIsFocused();
  const cameraUsing = devices.front;
  const cameraRef = useRef();
  const mapsLayout = useRef();
  const [mapState, setMapState] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: limitlatitudeDelta,
    longitudeDelta: limitLongitudeDelta,
  });
  const [heading, setHeading] = useState(0);
  const [openDialog,setOpenDialog] =useState(false);
  const [openDownload,setOpenDownload] =useState(false);
  const [valueUpload,setValueUpload] = useState(0);

  useFocusEffect(
   useCallback(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      getLocation();
      PermissionUtil.requestCameraPermission();
      PermissionUtil.requestExternalWritePermission();
        setCamera();
    });
    return()=> task.cancel();
    }, [])
  );
  

  const setCamera = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
  };

  const getLocation = async () => {
    const locationPermission = await PermissionUtil.accessLocation();
    if (locationPermission === true) {
      Geolocation.getCurrentPosition(
        async (pos) => {
         
          var datapos = pos.coords;
          latitude = datapos.latitude;
          longitude = datapos.longitude;
          setMapState({
            latitude: datapos.latitude,
            longitude: datapos.longitude,
            latitudeDelta: limitlatitudeDelta,
            longitudeDelta: limitLongitudeDelta,
          });
          setHeading(datapos.heading);
        },
        (err) => {
          console.log(err.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log('Error On Permission!');
    }
  };

  const absenApi = async () => {
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const snapshot = await cameraRef.current.takeSnapshot({
      quality: 85,
      skipMetadata: true,
    });

    let uriX = snapshot.path;
    let mimeType = mime.lookup(snapshot.path);
    let name = snapshot.path.replace(/^.*[\\\/]/, '');
    polyfill();
    let data = new FormData();
    data.append('files', {
      name: name,
      type: mimeType,
      uri: Platform.OS === 'android' ? 'file://' + uriX : uriX,
    });

    var test = {
      name: name,
      type: mimeType,
      uri: Platform.OS === 'android' ? 'file://' + uriX : uriX,
    };
    console.log('====================================');
    console.log(test);
    console.log('====================================');

    // prettier-ignore
    RNFetchBlob.fetch('POST', 'https://gmedia.bz/bapenda/api/authentication/absens', {
      'Client-Service': 'monitoring-bapeda',
      'Auth-Key': 'gmedia',
      'Content-Type': 'x-www-form-urlencoded',
      'id': `${sesi.id}`,
      'latitude': `${mapState.latitude}`,
      'longitude': `${mapState.longitude}`,
      'flag': `${status}`,
    },[
      {
        name: 'files',
        filename: name,
        type: mimeType,
        data:wrap(uriX)
      }
    ]).progress(prog => {
      setOpenDownload(true);
     setValueUpload(prog);
    }).then(res => {
      console.log('====================================');
      console.log(res.data);
      console.log('====================================');
      var body = JSON.parse(res.data);
      var status = body.metadata.status;
      var message = body.metadata.message;
      console.log(body);
      console.log(status);
      console.log(status);
      console.log(message);
      if(status === 200){
        setOpenDownload(true);
        setTimeout(()=>{
          setOpenDialog(true);
        },1000);
      }else{
        MessageUtil.errorMessage(message);
      }
   
    }).catch(err => {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
    });
  };

  if (cameraUsing == null)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          style={{ alignSelf: 'center' }}
          color={colorApp.primaryGaspoll}
          size={'large'}
        />
      </View>
    );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Camera
        ref={cameraRef}
        style={{
          ...StyleSheet.absoluteFill,
          height: ViewHeight / 1.5,
        }}
        photo={true}
        device={cameraUsing}
        isActive={cameraActive}
      />

      <View
        style={{
          flex: 1,
          ...StyleSheet.absoluteFill,
          height: ViewHeight / 2.6,
          marginTop: ViewHeight / 1.6,
        }}
      >
        <MapView
          ref={mapsLayout}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: limitlatitudeDelta,
            longitudeDelta: limitLongitudeDelta,
          }}
          
         
          region={{
            latitude: latitude,
            longitude:longitude,
            latitudeDelta: limitlatitudeDelta,
            longitudeDelta: limitLongitudeDelta,
          }}
          maxZoomLevel={20}
          style={{
            flex: 1,
          }}
        
          showsTraffic={true}
          showsIndoors={true}
          onLayout={() => {
            mapsLayout.current.animateCamera({
              center: {
                latitude: latitude,
                longitude: longitude,
              },

              head: 0,
              pitch: 100,
            });
            mapsLayout.current.animateToRegion({
              latitude: mapState.latitude,
              longitude:mapState.longitude,
              latitudeDelta: limitlatitudeDelta,
              longitudeDelta: limitLongitudeDelta,
            }, 2500);
          }}
        >
          <Marker.Animated
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            flat
            pinColor={'blue'}
          />
        </MapView>
        <View>
          <TouchableOpacity 
          onPress={()=>{
            getLocation();
          }}
          style={{
            position:'absolute',
            bottom:0,
            left:0,
            height:40,
            width:40,
            borderRadius:20,
            backgroundColor:'white',
            elevation:4,
            flexDirection:'column',
            justifyContent:'center',
            marginBottom:ViewHeight/3.2,
            marginLeft:16
          }}>
            <Icon2 name='my-location' size={24} color={'black'} style={{
              alignSelf:'center'
            }}/>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          height: 80,
          width: 80,
          borderRadius: 80 / 2,
          top: 0,
          bottom: 0,
          marginTop: ViewHeight / 1.7,
          backgroundColor: 'white',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            absenApi();
          }}
          style={{
            height: 80,
            width: 80,
            borderRadius: 80 / 2,

            backgroundColor: 'white',
            justifyContent: 'center',
            flexDirection: 'column',
            shadowColor: 'black',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Icon
            name="location"
            size={35}
            color={colorApp.btnColor2}
            style={{
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
      <Dialog isVisible={openDialog} overlayStyle={{
        backgroundColor:'white',
        flexDirection:'column',
        justifyContent:"space-evenly",
        padding:24,
        height:250,
        width:250,
        borderRadius:8,
      }} >
        <Icon3 name='check-circle' size={75} color={'green'} style={{
          alignSelf:'center'
        }}/>
        <Text style={{
          fontSize:24,
          color:'green',
          fontWeight:'600',
          alignSelf:'center'
        }}>Berhasil</Text>
        <TouchableOpacity
        onPress={()=>{
          setOpenDialog(false);
          navigation.goBack();
         
        }}
        style={{
          backgroundColor:'white',
          borderColor:'green',
          borderWidth:1,
          borderRadius:8,
          paddingTop:4,
          paddingBottom:4,
          flexDirection:'column',
          justifyContent:'center'
        }}>
          <Text style={{
            color:'green',
            fontSize:16,
            fontWeight:'600',
            alignSelf:'center'
          }}>OK</Text>
        </TouchableOpacity>
        
      </Dialog>
      <Dialog isVisible={openDownload}
     overlayStyle={{
      backgroundColor:'white',
      flexDirection:'column',
      padding:24,
      borderRadius:8,
      
     }}
      >
        <Text 
        style={{
          fontSize:16,
          color:'black',
          fontWeight:'800',
          marginTop:16,
          marginBottom:16,
        }}>Uploading Progress, please wait ...</Text>
        <View style={{
          flexDirection:'row',
          justifyContent:'space-between',
          marginBottom:16,
        }}>
        <LinearProgress style={{
          width:220,
          alignSelf:'center'
        }} animation={true} color={colorApp.primaryGaspoll} variant={'determinate'} value={valueUpload} />
        <Text  style={{
          fontSize:12,
          color:'black',
          fontWeight:'800',
          marginStart:14,
          marginTop:16,
          marginBottom:16,
        }} >{valueUpload} %</Text>
        </View>
      </Dialog>
    </View>
  );
};

export default AbsenCheck;
