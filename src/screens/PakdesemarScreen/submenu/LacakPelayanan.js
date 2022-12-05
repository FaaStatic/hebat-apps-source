import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { BgLacakLayanan } from '../assets';
import { Gap, Input, Button } from '../components';
export default LacakPelayanan = ({ onPressLacakLayanan, onPressLupaNomor }) => {
  const [nomor, setNomor] = useState('');
  return (
    <View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Gap height={50} />
          <Image
            style={{ width: '100%', height: 199, resizeMode: 'contain' }}
            source={BgLacakLayanan}
          />
          <Gap height={40} />
          <Text
            style={{
              fontFamily: fontsCustom.primary[700],
              fontSize: 16,
              color: colorApp.black,
            }}
          >
            Masukan Nomor Pelayanan Anda
          </Text>
          <Gap height={3} />
          <Text style={{ color: colorApp.black }}>Pastikan sesuai ya!</Text>
          <Gap height={20} />
          <Input borderColor={colorApp.secondary} onChangeText={(val) => setNomor(val)} />
          <Gap height={20} />
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                color: colorApp.black,
                fontFamily: fontsCustom.primary[400],
                fontSize: 12,
              }}
            >
              Lupa nomornya? cek caranya{' '}
            </Text>
            <TouchableOpacity onPress={() => onPressLupaNomor()} style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', color: colorApp.button.primary, fontSize: 12 }}>
                Disini
              </Text>
            </TouchableOpacity>
            <Button
              height={35}
              title="Lacak Sekarang"
              type="primary"
              width="40%"
              onPress={() => onPressLacakLayanan(nomor)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
