import { createSlice } from '@reduxjs/toolkit';
import { Api } from '../../util/ApiManager';
import { SessionManager } from '../../util/SessionUtil/SessionManager';
import { BackgroundLocationServices } from '../../util/BackgroundLocationServices';
import { GeolocationUtil } from '../../util/GeolocationUtil';
import { stringApp } from '../../util/globalvar';
import { MessageUtil } from '../../util/MessageUtil';
import messaging from '@react-native-firebase/messaging';

export const LoginSlicer = createSlice({
  name: 'login',
  initialState: {
    user: '',
    pass: '',
    obsecure: true,
    message: '',
    stat: false,
  },
  reducers: {
    storeUsername: (state, action) => {
      console.log(action.payload);
      state.user = action.payload;
    },
    storePassword: (state, action) => {
      state.pass = action.payload;
    },
    changeObsecure: (state) => {
      state.obsecure = !state.obsecure;
    },
  },
});

export const updateFcm = async () => {
  var idToken = await messaging().getToken();
  var sesi = await SessionManager.GetAsObject(stringApp.session);
  const params = {
    id_user: sesi.id,
    fcm_id: idToken,
  };
  await Api.post('Authentication/update_fcm', params)
    .then((res) => {
      console.log('====================================');
      console.log('Token Update :', res.data.metadata.message);
      console.log('====================================');
    })
    .catch((err) => {
      console.log('====================================');
      console.log(`error : ${err}`);
      console.log('====================================');
    });
};

export const loginProcess = (params, navigation) => async (dispatch) => {
  try {
    await Api.post('authentication', params)
      .then((res) => {
        var body = res.data;
        var response = body.response;
        var message = body.metadata.message;
        var status = body.metadata.status;

        if (status == 200) {
          SessionManager.StoreAsObject(stringApp.session, response);
          MessageUtil.successMessage(message);
          GeolocationUtil.accessLocation();
          BackgroundLocationServices.startBackgroundServices();
          updateFcm();
          setTimeout(() => {
            navigation.replace('BerandaMitra');
            clearTimeout();
          }, 1000);
          console.log(SessionManager.GetAsObject(stringApp.session));
        } else {
          MessageUtil.errorMessage('Username atau password salah! Mohon diperiksa kembali');
          console.log('fail', message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

export const { storeUsername, storePassword, changeObsecure } = LoginSlicer.actions;

export default LoginSlicer.reducer;
