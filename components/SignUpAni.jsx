import React from 'react';
import Lottie from 'lottie-react-native';
import {View, Dimensions, Text} from 'react-native';

const SignUpAni = () => {
  return(
    <View
    style={{
      justifyContent: 'center',
      height: 100,
      width: 150,
      alignItems: 'center',
      backgroundColor: 'white',
    //   marginHorizontal: 190,
      marginVertical: 50
    }}>
    <View>
      <Lottie
        style={{width: 150, height: 100}}
        source={require('../assets/signup.json')}
        autoPlay
        loop
      />
    </View>
  </View>
  )
};

export default SignUpAni;
