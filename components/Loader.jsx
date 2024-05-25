import React from 'react';
import Lottie from 'lottie-react-native';
import {View, Dimensions, Text} from 'react-native';
import colours from './colors';

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        height: Dimensions.get('window').height,
        alignItems: 'center',
        backgroundColor: '#FAF9F6',
      }}>
      <View>
        <Lottie
          style={{width: 200, height: 200}}
          source={require('../assets/loader.json')}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};


export default Loader;
