import React from 'react';
import { View } from 'react-native';

const Gap = ({ width, height, color }) => {
  return <View style={{ backgroundColor: color !== undefined ? color : null, height: height, width: width }} />;
};

export default Gap;
