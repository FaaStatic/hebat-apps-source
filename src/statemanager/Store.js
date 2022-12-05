import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import LoginReducer from './LoginState/LoginSlicer';
import HeaderDateReducers from './HeaderDateState/HeaderDateSlicer';
import MapUpdateReducer from './MapUpdate/MapUpdateSlicer';

export const Store = configureStore({
  reducer: {
    login: LoginReducer,
    headerdate: HeaderDateReducers,
    mapupdate: MapUpdateReducer,
  },
  middleware: [thunk],
});
