import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/PakdesemarScreen/Home';
import Article from '../screens/PakdesemarScreen/Article';
import Support from '../screens/PakdesemarScreen/Support';
import Login from '../screens/Login';
import SplashScreen from '../screens/SplashScreen';
import Pendataan from '../screens/GaspollScreen/Pendataan/Pendataan';
import RiwayatSurvey from '../screens/GaspollScreen/Riwayat/RiwayatSurvei';
import LoadWebView from '../screens/PakdesemarScreen/LoadWebView';
import EditData from '../screens/GaspollScreen/EditData/EditData';
import FormKelengkapan from '../screens/GaspollScreen/Potensi/FormKelengkapan';
import FormPotensi from '../screens/GaspollScreen/Potensi/FormPotensi';
import DaftarPotensi from '../screens/GaspollScreen/Potensi/DaftarPotensi';
import Pendaftaran from '../screens/GaspollScreen/Pendaftaran/Pendaftaran';
import PutusanPendaftaran from '../screens/GaspollScreen/Pendaftaran/PutusanPendaftaran';
import RiwayatHasilPendaftaran from '../screens/GaspollScreen/Riwayat/RiwayatHasilPendaftaran';
import MainSubMenu from '../screens/PakdesemarScreen/MainSubMenu';
import DetailLacakPelayanan from '../screens/PakdesemarScreen/submenu/DetailLacakPelayanan';
import DetailStatusBayar from '../screens/PakdesemarScreen/submenu/DetailStatusBayar';
import DetailPembayaran from '../screens/PakdesemarScreen/submenu/DetailPembayaran';
import FormSurvey from '../screens/GaspollScreen/Survey/FormSurvey';
import DetailSubMenuPartner from '../screens/PakdesemarScreen/submenu/detail/DetailSubMenuPartner';
import Beranda from '../screens/GaspollScreen/Beranda';
import RiwayatMonitoring from '../screens/GaspollScreen/Riwayat/RiwayatMonitoring';
import Monitoring from '../screens/GaspollScreen/Monitoring/Monitoring';
import DetailMonitoring from '../screens/GaspollScreen/Monitoring/DetailMonitoring';
import SettingScreen from '../screens/GaspollScreen/SettingScreen';
import Notification from '../screens/GaspollScreen/Notification/Notification';
import DetailNotification from '../screens/GaspollScreen/Notification/DetailNotification';
import FormReklame from '../screens/GaspollScreen/Reklame/FormReklame';
import Reklame from '../screens/GaspollScreen/Reklame/Reklame';
import RiwayatReklame from '../screens/GaspollScreen/Riwayat/RiwayatReklame';
import DetailArticle from '../screens/PakdesemarScreen/DetailArticle';
import FormRegistrasi from '../screens/PakdesemarScreen/submenu/detail/FormRegistrasi';
import WajibPajak from '../screens/GaspollScreen/WajibPajak/WajibPajak';
import PajakSekitar from '../screens/GaspollScreen/WajibPajak/PajakSekitar/PajakSekitar';
import MainNotification from '../screens/PakdesemarScreen/MainNotification';
import ViewPdf from '../screens/PakdesemarScreen/addOns/ViewPdf';
import BottomNavigation from '../screens/PakdesemarScreen/components/BottomNavigation';
import RiwayatPajakTutup from '../screens/GaspollScreen/Riwayat/RiwayatPajakTutup';
import WajibPajakTutup from '../screens/GaspollScreen/WajibPajak/WajibPajakTutup/WajibPajakTutup';
import UpdateWajibPajak from '../screens/GaspollScreen/WajibPajak/UpdateWajibPajak/UpdateWajibPajak';
import RiwayatUpdatePajak from '../screens/GaspollScreen/Riwayat/RiwayatUpdatePajak';
import AdminScreen from '../screens/GaspollScreen/PetugasAdmin/AdminScreen';
import Absensi from '../screens/GaspollScreen/Absensi/Absensi';
import AbsenCheck from '../screens/GaspollScreen/Absensi/AbsenCheck';
import DetailRiwayatStatusBayarPBB from '../screens/PakdesemarScreen/submenu/detail/detailsubmenu/DetailRiwayatStatusBayarPBB';
import TugasList from '../screens/GaspollScreen/PetugasAdmin/AdminKomponen/TugasList';
import DataPetugasList from '../screens/GaspollScreen/PetugasAdmin/AdminKomponen/DataPetugasList ';
import RiwayatAbsensi from '../screens/GaspollScreen/Riwayat/RiwayatAbsensi';



const initStack = createNativeStackNavigator();
const InitTab = createBottomTabNavigator();
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

export default function RouteManager() {
  return (
    <NavigationContainer>
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
        <initStack.Screen name="BerandaGaspoll" component={Beranda} />
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
        <initStack.Screen name="DetailArticle" component={DetailArticle} />
        <initStack.Screen name="FormRegistrasi" component={FormRegistrasi} />
        <initStack.Screen name="MainNotification" component={MainNotification} />
        <initStack.Screen name="ViewPdf" component={ViewPdf} />
        <initStack.Screen name="DetailRiwayatStatusBayarPBB" component={DetailRiwayatStatusBayarPBB} />
      </initStack.Navigator>
    </NavigationContainer>
  );
}
