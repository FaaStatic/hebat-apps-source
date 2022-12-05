import { createSlice } from '@reduxjs/toolkit';

const MapUpdate = createSlice({
  name: 'mapupdate',
  initialState: {
    latitudeInit: -6.966667,
    longitudeInit: 110.416664,
  },
  reducers: {
    storeLatInit: (state, action) => {
      state.latitudeInit = action.payload;
    },
    storeLongInit: (state, action) => {
      state.longitudeInit = action.payload;
    },
  },
});

export const { storeLatInit, storeLongInit } = MapUpdate.actions;

export default MapUpdate.reducer;
