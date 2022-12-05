import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colorApp } from '../../../../../util/globalvar';
import { MessageUtil } from '../../../../../util/MessageUtil';
import ServiceHelper from '../../../addOns/ServiceHelper';
import { Button, Gap, Input } from '../../../components';
import Geolocation from 'react-native-geolocation-service';
import { PermissionUtil } from '../../../../../util/PermissionUtil';
import MapView from 'react-native-maps';
import { ImgMaps } from '../../../assets';
const limitlatitudeDelta = 0.00089279988035873;
const limitLongitudeDelta = 0.0012991949915885925;
export default FormPageTiga = ({ data, active, onPressButton }) => {
  const [listKelurahan, setListKelurahan] = useState([]);
  const [listKecamatan, setListKecamatan] = useState([]);
  const mapsLayout = useRef();
  const [title, setTitle] = useState('Kelurahan');
  const [title1, setTitle1] = useState('Kecamatan');
  const [alamat, setAlamat] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: limitlatitudeDelta,
    longitudeDelta: limitLongitudeDelta,
  });
  useEffect(() => {
    //List Kelurahan
    listKelurahan.length == 0 && actionService('E_register/list_kelurahan', 0);
    //List Kecamatan
    listKecamatan.length == 0 && actionService('E_register/list_kecamatan', 1);
    data !== '' && setConditionDraft(data);
    checkPermissionAndChackLocation();
  }, []);

  const setConditionDraft = (data) => {
    setAlamat(data.alamat);
    setRt(data.rt);
    setRw(data.rw);
    setKelurahan(data.kode_kel);
    setKecamatan(data.kode_kec);
  };
  const checkPermissionAndChackLocation = async () => {
    const permission = await PermissionUtil.accessLocation();
    if (permission === true) {
      Geolocation.getCurrentPosition(
        async (pposition) => {
          const datapos = pposition.coords;
          var params = {
            latitude: datapos.latitude,
            longitude: datapos.longitude,
            latitudeDelta: limitlatitudeDelta,
            longitudeDelta: limitLongitudeDelta,
          };
          setPosition(params);
        },
        (err) => {
          console.log(err.message);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      MessageUtil.errorMessage('Permission Not Allow Access!!');
    }
  };

  const onRegionChange = (coords) => {
    const location = {
      latitude: parseFloat(coords.latitude),
      longitude: parseFloat(coords.longitude),
      latitudeDelta: coords.latitudeDelta,
      longitudeDelta: coords.longitudeDelta,
    };
    setPosition(location);
  };

  const actionService = async (endpoint, status) => {
    const res = await ServiceHelper.actionServiceGet(endpoint);
    var metadata = res.data.metadata;
    var response = res.data.response;
    if (metadata.status === 200) {
      if (data !== '') {
        if (status == 0) {
          data.kode_kel !== '' && setTitleJenis(response, status);
        } else {
          data.kode_kec !== '' && setTitleJenis(response, status);
        }
      }
      response.forEach((item) => {
        const id = item.kode;
        const name = item.nama;
        const value = {
          id: id,
          name: name,
        };
        if (status == 0) {
          listKelurahan.push(value);
        } else {
          listKecamatan.push(value);
        }
      });
    } else {
      MessageUtil.errorMessage(metadata.message);
    }
  };
  const setTitleJenis = async (res, sesi) => {
    if (sesi == 0) {
      let jenis = await res.filter((item) => item.kode == data.kode_kel);
      setTitle(jenis[0].nama);
    } else if (sesi == 1) {
      let jenis = await res.filter((item) => item.kode == data.kode_kec);
      setTitle1(jenis[0].nama);
    }
  };
  const onAction = () => {
    const item = {
      alamat: alamat,
      rt: rt,
      rw: rw,
      kode_kel: kelurahan,
      kode_kec: kecamatan,
      kota: 'Semarang',
      latitude: position.latitude,
      longitude: position.longitude,
    };
    return onPressButton(active, item);
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ color: colorApp.black }}>Alamat Usaha</Text>
        <Gap height={15} />
        <Input
          label="Alamat Usaha"
          onChangeText={(val) => setAlamat(val)}
          borderColor={colorApp.secondary}
          placeholderColor={true}
          value={alamat}
          backgroundColor={colorApp.secondary}
        />
        <Gap height={15} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '40%' }}>
            <Input
              label="RT"
              onChangeText={(val) => setRt(val)}
              borderColor={colorApp.secondary}
              placeholderColor={true}
              keyboardType="numeric"
              value={rt}
              backgroundColor={colorApp.secondary}
            />
          </View>
          <Gap width={15} />
          <View style={{ width: '40%' }}>
            <Input
              label="RW"
              onChangeText={(val) => setRw(val)}
              borderColor={colorApp.secondary}
              placeholderColor={true}
              keyboardType="numeric"
              value={rw}
              backgroundColor={colorApp.secondary}
            />
          </View>
        </View>
        <Gap height={15} />
        <Input
          label="Kelurahan"
          title={title}
          showSearchBox={false}
          colorTheme={colorApp.black}
          selectData={listKelurahan}
          onSelect={(val) => setKelurahan(val[0])}
          keyboardType="select2"
        />
        <Gap height={15} />
        <Input
          label="Kecamatan"
          title={title1}
          showSearchBox={false}
          colorTheme={colorApp.black}
          selectData={listKecamatan}
          onSelect={(val) => setKecamatan(val[0])}
          keyboardType="select2"
        />
        <Gap height={15} />
        <Input
          isReadOnly={true}
          borderColor={colorApp.secondary}
          placeholderColor={true}
          value={'Kota Semarang'}
          backgroundColor={colorApp.secondary}
        />
        <Gap height={15} />
        <View>
          <MapView
            ref={mapsLayout}
            provider={MapView.PROVIDER_GOOGLE}
            showsCompass={true}
            showsBuildings={false}
            showsTraffic={true}
            showsIndoors={true}
            style={styles.map}
            maxZoomLevel={20}
            zoomEnabled={true}
            zoomControlEnabled={true}
            onRegionChangeComplete={onRegionChange}
            mapType="standard"
            initialRegion={{
              latitude: 0,
              longitude: 0,
              latitudeDelta: limitlatitudeDelta,
              longitudeDelta: limitLongitudeDelta,
            }}
            region={position}
            onLayout={() => {
              mapsLayout.current.animateCamera({
                center: {
                  latitude: position.latitude,
                  longitude: position.longitude,
                },

                head: 0,
                pitch: 100,
              });
              mapsLayout.current.animateToRegion(position, 2500);
            }}
          />
          <View style={styles.touchableOpacityStyleMarker}>
            <Image source={ImgMaps} style={{ marginTop: 10, width: 40, height: 40 }} />
          </View>
          <TouchableOpacity onPress={() => checkPermissionAndChackLocation()} style={styles.touchableOpacityStyle}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 5,
                backgroundColor: colorApp.primary,
                borderWidth: 1,
                borderColor: colorApp.black,
              }}
            >
              <FontAwesome
                style={{ marginLeft: 6, marginTop: 4 }}
                name={'refresh'}
                color={'red'}
                size={30}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Gap height={15} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <Button
            height={35}
            title={active == 5 ? 'Kirim Data' : 'Lanjutkan'}
            type="primary"
            width="30%"
            onPress={() => onAction()}
          />
        </View>
      </View>
      <Gap height={45} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  touchableOpacityStyle: {
    flex: 1,
    position: 'absolute',
    marginTop: '3%',
    marginStart: 10,
  },
  touchableOpacityStyleMarker: {
    flex: 1,
    position: 'absolute',
    marginTop: 50,
    alignSelf: 'center',
  },
  group: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  touchableOpacityStyle: {
    flex: 1,
    position: 'absolute',
    marginTop: '3%',
    marginStart: 10,
  },
});
