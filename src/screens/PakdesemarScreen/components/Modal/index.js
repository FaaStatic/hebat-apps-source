import React from 'react';
import { View, Text, Modal, ActivityIndicator, Dimensions, StyleSheet, Image } from 'react-native';
import { IcAntrianOnline, stylesheet } from '../../assets';
import ReactNativeModal from 'react-native-modal';
import { fontsCustom } from '../../../../util/globalvar';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const CustomModal = ({ type, loading, message }) => {
  if (type !== undefined) {
    if (type == 'confrim') {
      return (
        <ReactNativeModal
          entry="bottom"
          backdropPressToClose={false}
          isOpen={loading}
          style={styles.modalBox}
          useNativeDriver={true}
          swipeToClose={false}
        >
          <View style={{ paddingVertical: 16 }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                alignContent: 'center',
                flex: 1,
              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={IcAntrianOnline}
                  style={{ width: height / 10, height: height / 10 }}
                />
                <Text
                  style={{
                    fontFamily: fontsCustom.primary[700],
                    fontSize: 20,
                    textAlign: 'center',
                    marginTop: 16,
                    paddingHorizontal: 16,
                  }}
                >
                  {message}
                </Text>
              </View>
            </View>
          </View>
        </ReactNativeModal>
      );
    }
  }
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={loading}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={[stylesheet.textLoader]}>{message}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalBox: {
    overflow: 'hidden',
    height,
    width,
    backgroundColor: 'transparent',
  },
});

