import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { colorApp } from '../../../../util/globalvar'

const Border = ({ height, heightIOS, background }) => {
  return (
    Platform.OS === 'android' ?
      <View style={[{ borderWidth: height, marginBottom: 5, borderColor: background != undefined ? background : '#E6E6E6', shadowColor: '#000', shadowOpacity: 4, elevation: 0.5 }, styles.bg]} />
      : <View
        style={{
          borderStyle: 'solid',
          borderWidth: heightIOS != undefined ? heightIOS : 0.3,
          borderRadius: 2,
          borderColor: colorApp.input,

        }}
      />
  )
}

export default Border

const styles = StyleSheet.create({
  bg: {
    // shadowColor: '#000',
  }
})
