const stringApp = {
  session: '@session',
  typeNotif: 'notification',
};

const colorApp = {
  primaryGaspoll: '#FC572C',
  btnColor2: '#669beb',
  btnColor3: '#f75757',
  btnColor1: '#fb9c3e',
  backgroundView: '#f5f5f5',
  gradientSatu: '#FA9494',
  gradientDua: '#FAFAFA',
  primary: '#ffffff',
  secondary: '#E6ECF6',
  header: {
    primary: '#C70039',
    secondary: 'rgba(250, 148, 148, 0.3)',
  },
  blue: '#0000ff',
  border: 'rgba(0,0,0,0.2)',
  input: '#C70039',
  inputText: '#000',
  label: '#646460',
  black: '#000',
  button: {
    primary: '#C70039',
    secondary: '#000',
  },
  placeholderColor: 'rgba(0, 0, 0, 0.4)',
  colorBlackLoading: 'rgba(0,0,0,0.7)',
};

const fontsCustom = {
  primary: {
    300: 'Poppins-Light',
    400: 'Poppins-Regular',
    500: 'Poppins-Medium',
    // 600: 'Poppins-SemiBold',
    700: 'Poppins-SemiBold',
    normal: 'Poppins-Regular',
  },
};

const firebaseConfig = {
  apiKey: 'AIzaSyBTnDJ5qVv8E7GwhnIkBsvZtgNQF_g9Y-k',
  authDomain: 'bapendaapps.firebaseapp.com',
  projectId: 'bapendaapps',
  storageBucket: 'bapendaapps.appspot.com',
  messagingSenderId: '461986255627',
  appId: '1:461986255627:web:0217d48606ba79e0fbc80e',
  measurementId: 'G-NDBHBCJRZ4',
};

const menuMain = [
  {
    id: 1,
    title: 'Pendataan',
    image: require('../../assets/images/ic_pendaftaran.png'),
    nextPage: 'Pendataan',
  },
  {
    id: 2,
    title: 'Pendaftaran',
    image: require('../../assets/images/ic_survey.png'),
    nextPage: 'Pendaftaran',
  },
  {
    id: 3,
    title: 'Monitoring',
    image: require('../../assets/images/ic_monitor.png'),
    nextPage: 'Monitoring',
  },
  {
    id: 4,
    title: 'Reklame',
    image: require('../../assets/images/ic_reklame.png'),
    nextPage: 'Reklame',
  },
  {
    id: 5,
    title: 'Wajib Pajak',
    image: require('../../assets/images/ic_merchant.png'),
    nextPage: 'WajibPajak',
  },
  {
    id: 6,
    title: 'Admin',
    image: require('../../assets/images/ic_adminicon.png'),
    nextPage: 'AdminScreen',
  },
  {
    id: 7,
    title: 'Absensi',
    image: require('../../assets/images/ic_absensi.png'),
    nextPage: 'Absensi',
  },
  {
    id: 8,
    title: 'Riwayat Absensi',
    image: require('../../assets/images/ic_riwayatabsensi.png'),
    nextPage: 'RiwayatAbsensi',
  },
];

const positionLevel = [
  {
    id: 0,
    position: 'Semua',
  },
  {
    id: 2,
    position: 'Petugas',
  },
  {
    id: 3,
    position: 'Supervisor',
  },
  {
    id: 4,
    position: 'Kasubbag',
  },
  {
    id: 5,
    position: 'Admin',
  },
];

export { stringApp, colorApp, fontsCustom, firebaseConfig, menuMain, positionLevel };
