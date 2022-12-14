import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/PakdesemarScreen/Home';
import Article from '../screens/PakdesemarScreen/Article';
import Support from '../screens/PakdesemarScreen/Support';
import Login from '../screens/Login';
import { createNavigationContainerRef } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import Pendataan from '../screens/MitraScreen/Pendataan/Pendataan';
import RiwayatSurvey from '../screens/MitraScreen/Riwayat/RiwayatSurvei';
import LoadWebView from '../screens/PakdesemarScreen/LoadWebView';
import EditData from '../screens/MitraScreen/EditData/EditData';
import FormKelengkapan from '../screens/MitraScreen/Potensi/FormKelengkapan';
import FormPotensi from '../screens/MitraScreen/Potensi/FormPotensi';
import DaftarPotensi from '../screens/MitraScreen/Potensi/DaftarPotensi';
import Pendaftaran from '../screens/MitraScreen/Pendaftaran/Pendaftaran';
import PutusanPendaftaran from '../screens/MitraScreen/Pendaftaran/PutusanPendaftaran';
import RiwayatHasilPendaftaran from '../screens/MitraScreen/Riwayat/RiwayatHasilPendaftaran';
import MainSubMenu from '../screens/PakdesemarScreen/MainSubMenu';
import DetailLacakPelayanan from '../screens/PakdesemarScreen/submenu/DetailLacakPelayanan';
import DetailStatusBayar from '../screens/PakdesemarScreen/submenu/DetailStatusBayar';
import DetailPembayaran from '../screens/PakdesemarScreen/submenu/DetailPembayaran';
import FormSurvey from '../screens/MitraScreen/Survey/FormSurvey';
import DetailSubMenuPartner from '../screens/PakdesemarScreen/submenu/detail/DetailSubMenuPartner';
import BerandaMitra from '../screens/MitraScreen/BerandaMitra';
import RiwayatMonitoring from '../screens/MitraScreen/Riwayat/RiwayatMonitoring';
import Monitoring from '../screens/MitraScreen/Monitoring/Monitoring';
import DetailMonitoring from '../screens/MitraScreen/Monitoring/DetailMonitoring';
import SettingScreen from '../screens/MitraScreen/SettingScreen';
import Notification from '../screens/MitraScreen/Notification/Notification';
import DetailNotification from '../screens/MitraScreen/Notification/DetailNotification';
import FormReklame from '../screens/MitraScreen/Reklame/FormReklame';
import Reklame from '../screens/MitraScreen/Reklame/Reklame';
import RiwayatReklame from '../screens/MitraScreen/Riwayat/RiwayatReklame';
import DetailArticle from '../screens/PakdesemarScreen/DetailArticle';
import FormRegistrasi from '../screens/PakdesemarScreen/submenu/detail/FormRegistrasi';
import WajibPajak from '../screens/MitraScreen/WajibPajak/WajibPajak';
import PajakSekitar from '../screens/MitraScreen/WajibPajak/PajakSekitar/PajakSekitar';
import MainNotification from '../screens/PakdesemarScreen/MainNotification';
import ViewPdf from '../screens/PakdesemarScreen/addOns/ViewPdf';
import BottomNavigation from '../screens/PakdesemarScreen/components/BottomNavigation';
import RiwayatPajakTutup from '../screens/MitraScreen/Riwayat/RiwayatPajakTutup';
import WajibPajakTutup from '../screens/MitraScreen/WajibPajak/WajibPajakTutup/WajibPajakTutup';
import UpdateWajibPajak from '../screens/MitraScreen/WajibPajak/UpdateWajibPajak/UpdateWajibPajak';
import RiwayatUpdatePajak from '../screens/MitraScreen/Riwayat/RiwayatUpdatePajak';
import AdminScreen from '../screens/MitraScreen/PetugasAdmin/AdminScreen';
import Absensi from '../screens/MitraScreen/Absensi/Absensi';
import AbsenCheck from '../screens/MitraScreen/Absensi/AbsenCheck';
import DetailRiwayatStatusBayarPBB from '../screens/PakdesemarScreen/submenu/detail/detailsubmenu/DetailRiwayatStatusBayarPBB';
import TugasList from '../screens/MitraScreen/PetugasAdmin/AdminKomponen/TugasList';
import DataPetugasList from '../screens/MitraScreen/PetugasAdmin/AdminKomponen/DataPetugasList ';
import RiwayatAbsensi from '../screens/MitraScreen/Riwayat/RiwayatAbsensi';
import PreviewSurvey from '../screens/MitraScreen/Survey/PreviewSurvey';
import RegisterMitra from '../screens/MitraScreen/RegisterMitra';





const initStack = createNativeStackNavigator();
const InitTab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef();
const TabScreen = ({ navigation, route }) => {
  return (
    <InitTab.Navigator tabBar={(props) => <BottomNavigation {...props} />}>
      <InitTab.Screen name="Beranda" component={Home} options={{ headerShown: false }} />
      <InitTab.Screen name="Artikel" component={Article} options={{ headerShown: false }} />
      <InitTab.Screen name="Bantuan" component={Support} options={{ headerShown: false }} />
      <InitTab.Screen name="Mitra" component={Login} options={{ headerShown: false }} />
    </InitTab.Navigator>
  );
};

const linkingData = {
  prefixes: ['hebatapp://'],
  config: {
    screens: {
      Home: {
        path: 'home'
      },
      DetailArticle:{
        path:'detailarticle/:data',
      },
      BerandaMitra: {
        path: 'mitra'
      },
      MainNotification:{
        path:"MainNotification"
      }
    }
  }
  
};

export default function RouteManager() {
  return (
    <NavigationContainer
    ref={navigationRef}
    linking={linkingData}>
      <initStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <initStack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <initStack.Screen name="Home" component={TabScreen} />
        <initStack.Screen name="BerandaMitra" component={BerandaMitra} />
        <initStack.Screen name="RegisterMitra" component={RegisterMitra} />
        <initStack.Screen name="Pendataan" component={Pendataan} />
        <initStack.Screen name="RiwayatSurvey" component={RiwayatSurvey} />
        <initStack.Screen name="EditData" component={EditData} />
        <initStack.Screen
          name="FormKelengkapan"
          component={FormKelengkapan}
          initialParams={{
            modelData: null,
          }}
        />
        <initStack.Screen name="DaftarPotensi" component={DaftarPotensi} />
        <initStack.Screen
          name="FormPotensi"
          component={FormPotensi}
          initialParams={{
            id: null,
            id_potensi: null,
            dataModel: null,
          }}
        />
        <initStack.Screen name="LoadWebView" component={LoadWebView} />
        <initStack.Screen name="Pendaftaran" component={Pendaftaran} />
        <initStack.Screen
          name="PutusanPendaftaran"
          component={PutusanPendaftaran}
          initialParams={{
            modelData: null,
          }}
        />
        <initStack.Screen name="Reklame" component={Reklame} />
        <initStack.Screen
          name="FormReklame"
          component={FormReklame}
          initialParams={{
            modelData: null,
            status: null,
          }}
        />
        <initStack.Screen name="WajibPajak" component={WajibPajak} />
        <initStack.Screen name="PajakSekitar" component={PajakSekitar} />
        <initStack.Screen name="RiwayatPajakTutup" component={RiwayatPajakTutup} />
        <initStack.Screen name="AdminScreen" component={AdminScreen} />
        <initStack.Screen name="Absensi" component={Absensi} />
        <initStack.Screen
          name="AbsenCheck"
          component={AbsenCheck}
          initialParams={{
            status: null,
          }}
        />
         <initStack.Screen name="RiwayatAbsensi" component={RiwayatAbsensi} />
        <initStack.Screen name="DataPetugasList" component={DataPetugasList} initialParams={{
          type:null
        }}/>
        <initStack.Screen name="TugasList" component={TugasList} initialParams={{
          itemPetugas:null,
          type:null
        }} />
        <initStack.Screen name="WajibPajakTutup" component={WajibPajakTutup} />
        <initStack.Screen name="UpdateWajibPajak" component={UpdateWajibPajak} />
        <initStack.Screen name="RiwayatUpdatePajak" component={RiwayatUpdatePajak} />
        <initStack.Screen name="RiwayatReklame" component={RiwayatReklame} />
        <initStack.Screen name="Monitoring" component={Monitoring} />
        <initStack.Screen
          name="DetailMonitoring"
          component={DetailMonitoring}
          initialParams={{
            modelData: null,
            status: null,
          }}
        />
        <initStack.Screen name="RiwayatMonitoring" component={RiwayatMonitoring} />
        <initStack.Screen name="SettingScreen" component={SettingScreen} />
        <initStack.Screen name="Notification" component={Notification} />
        <initStack.Screen
          name="DetailNotification"
          component={DetailNotification}
          initialParams={{
            model: null,
          }}
        />
        <initStack.Screen name="RiwayatHasilPendaftaran" component={RiwayatHasilPendaftaran} />
        <initStack.Screen name="MainSubMenu" component={MainSubMenu} />
        <initStack.Screen name="DetailLacakPelayanan" component={DetailLacakPelayanan} />
        <initStack.Screen name="DetailStatusBayar" component={DetailStatusBayar} />
        <initStack.Screen name="DetailPembayaran" component={DetailPembayaran} />
        <initStack.Screen name="DetailSubMenuPartner" component={DetailSubMenuPartner} />
        <initStack.Screen
          name="FormSurvey"
          component={FormSurvey}
          initialParams={{
            modelData: null,
            status: null,
          }}
        />
           <initStack.Screen
          name="PreviewSurvey"
          component={PreviewSurvey}
          initialParams={{
            modelData: null,
            status: null,
          }}
        />
        <initStack.Screen name="DetailArticle" component={DetailArticle} />
        <initStack.Screen name="FormRegistrasi" component={FormRegistrasi} />
        <initStack.Screen name="MainNotification" component={MainNotification} />
        <initStack.Screen name="ViewPdf" component={ViewPdf} />
        <initStack.Screen name="DetailRiwayatStatusBayarPBB" component={DetailRiwayatStatusBayarPBB} />
      </initStack.Navigator>
    </NavigationContainer>
  );
}

export {navigationRef}