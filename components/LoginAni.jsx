import React from 'react';
import Lottie from 'lottie-react-native';
import {View, Dimensions, Text} from 'react-native';
import colours from './colors';

const LoginAni = () => {
    return(
        <View
        style={{
          justifyContent: 'center',
          height: 170,
          width: 160,
          alignItems: 'center',
          backgroundColor: 'white',
          marginHorizontal: 90,
          marginVertical: 5
        }}>
        <View>
          <Lottie
            style={{width: 210, height: 160}}
            source={require('../assets/login.json')}
            autoPlay
            loop
          />
        </View>
      </View>
      )
    };


export default LoginAni;
