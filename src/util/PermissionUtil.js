import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {checkMultiple, requestMultiple,request, PERMISSIONS} from 'react-native-permissions';

export const PermissionUtil = {
  requestCameraPermission: async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  },
  requestExternalWritePermission: async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  },
  accessLocation: async () => {
    if (Platform.OS === 'ios') {
      try {
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'always',
        });
        const auth = await Geolocation.requestAuthorization('whenInUse');
        console.log(auth);
        return auth === 'granted';
      } catch (error) {
        console.log(error);
      }
    } else if (Platform.OS === 'android') {
      try {
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
        console.log(androAuth);
        return androAuth === 'granted';
      } catch (error) {
        console.log(error);
      }
    } else {
      return true;
    }
  },
  
  accesLocationIosAlways: () => {
    request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((stat)=>{
      console.log('Location', statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]);
    })
  },
  accessIosCameraPhotoLibrary: () => {
    requestMultiple([PERMISSIONS.IOS.CAMERA,PERMISSIONS.IOS.PHOTO_LIBRARY , PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY]).then((statuses) => {
      console.log('Library Photo', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
      console.log('Photo AddOns', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY]);
      console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
    });
  },

  
};
