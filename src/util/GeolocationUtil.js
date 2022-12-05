import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Api } from './ApiManager';
import { stringApp } from './globalvar';
import { SessionManager } from './SessionUtil/SessionManager';

export const GeolocationUtil = {
  accessLocation: async () => {
    if (Platform.OS === 'ios') {
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'always',
      });
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        GeolocationUtil.locationService;
      }
    } else {
      const androAuth = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Background Location Permission',
          message:
            'We need access to your location ' +
            'so we can get your location to add your jobdesk on field.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (androAuth === PermissionsAndroid.PERMISSIONS.GRANTED) {
        GeolocationUtil.locationService;
      }
    }
  },
  locationService: async () => {
    try {
      Geolocation.watchPosition(
        async (pos) => {
          const datapos = pos.coords;
          var sesi = SessionManager.GetAsObject(stringApp.session);
          const params = {
            id_petugas: sesi.id,
            lat: datapos.latitude,
            long: datapos.longitude,
          };
          Api.post('Monitoring/udpate_lokasi_petugas', params)
            .then((res) => {
              var body = res.data;
              var message = body.metadata.message;
              var status = body.metadata.status;
              if (status === 200) {
                console.log('====================================');
                console.log(message);
                console.log('====================================');
              } else {
                console.log('====================================');
                console.log(message);
                console.log('====================================');
              }
            })
            .catch((err) => {
              console.log('====================================');
              console.log(err);
              console.log('====================================');
            });
        },
        (err) => {
          console.log(err.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.log(error.message);
    }
  },
};
