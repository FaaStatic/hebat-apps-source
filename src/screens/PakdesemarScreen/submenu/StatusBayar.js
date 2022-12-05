import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colorApp, fontsCustom } from '../../../util/globalvar';
import { Gap } from '../components';

export default StatusBayar = ({ data, onPressMenu }) => {
  return (
    <View>
      <Gap height={30} />
      <Text style={{ fontFamily: fontsCustom.primary[400], color: colorApp.black, fontSize: 14 }}>
        Pilih status yang ingin kamu cek!
      </Text>
      <Gap height={10} />
      {data.map((item) => {
        return (
          <>
            <TouchableOpacity key={item.id} onPress={() => onPressMenu(item)}>
              <LinearGradient
                colors={[colorApp.gradientSatu, colorApp.gradientDua]}
                start={{ x: -0.2, y: 0 }}
                end={{ x: 1, y: -2 }}
                style={styles.cardView}
              >
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ position: 'absolute', marginStart: '52%', opacity: 0.5 }}>
                      <Image
                        source={item.image}
                        style={{
                          width: 184,
                          height: 181,
                          marginTop: 10,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        height: 249,
                        flex: 1,
                        marginStart: 20,
                      }}
                    >
                      <View style={styles.cardViewIn}>
                        <Image
                          style={{ width: 33, height: 31 }}
                          source={item.logo}
                          resizeMode="contain"
                        />
                      </View>
                      <Gap height={20} />
                      <View style={{ width: '55%' }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: fontsCustom.primary[700],
                            color: colorApp.black,
                          }}
                        >
                          {item.name}
                        </Text>
                        <Gap height={7} />
                        <Text
                          style={{
                            fontSize: 8,
                            fontFamily: fontsCustom.primary[400],
                            color: colorApp.black,
                          }}
                        >
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <Gap height={10} />
          </>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    borderRadius: 19,
    marginBottom: 10,
    width: '100%',
    height: 249,
    marginEnd: 16,
  },
  imgCardView: {
    position: 'absolute',
    height: 229,
    width: 120,
    borderRadius: 19,
    opacity: 0.1,
  },
  cardViewIn: {
    width: 64,
    height: 64,
    backgroundColor: colorApp.primary,
    borderRadius: 19,
    padding: 15,
  },
});
