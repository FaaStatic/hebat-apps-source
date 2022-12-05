import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const date = new Date();

const HeaderDateSlicer = createSlice({
  name: 'headerdate',
  initialState: {
    dateStart: moment(date).format('YYYY-MM-DD'),
    dateEnd: moment(date).format('YYYY-MM-DD'),
    showIos: false,
    endShowIos: false,
    showSearch: false,
    textSearch: '',
  },
  reducers: {
    changeDateStart: (state, payload) => {
      state.dateStart = payload.action;
    },
    changeDateEnd: (state, payload) => {
      state.dateEnd = payload.action;
    },
    setShowIos: (state) => {
      state.showIos = !state.showIos;
    },

    setShowSearch: (state) => {
      state.showSearch = !state.showSearch;
    },
    setEndShowIos: (state) => {
      state.endShowIos = !state.endShowIos;
    },
    setTextSearch: (state, action) => {
      state.textSearch = action.payload;
    },
  },
});

export const {
  changeDateEnd,
  changeDateStart,
  setShowIos,
  setShowSearch,
  setEndShowIos,
  setTextSearch,
} = HeaderDateSlicer.actions;

export default HeaderDateSlicer.reducer;
