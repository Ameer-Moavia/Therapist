import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { auth, firestore } from './firebase';

import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MyStatusBar from '../components/myStatusBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors, CommonStyles, Fonts, Sizes } from '../constants/styles';
import { Text } from '../components/commonText';


function RegisterScreen() {
  const navigation = useNavigation();

  const [eye, setEye] = useState(true);

  

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [securePassword, setSecurePassword] = useState(true);
  const [loading, setLoading] = useState(false); // State for loader
  const onPressHandler = () => {
    navigation.navigate('LoginScreen');
    setWaiting(false)
  };

  const handleSignUp = async () => {
    setLoading(true);
    if (!username.trim() || !email.trim() || !password.trim() || !confirmpassword.trim()) {
      showToast();
      setLoading(false); // Reset loading state
      return;
    }
  
    if (password !== confirmpassword) {
      passwordConfirm();
      setLoading(false); // Reset loading state
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Assign role based on your logic
      const role = 'therapist'; // For example, assign all new users the role of therapist
  
      // Save user data and role information to Firestore
      await saveTherapistData(user.uid, username, email, mobile, role);
  
      // Send email verification
      await sendEmailVerification(user);
  
      // Show success message and navigate to login screen
      showAccountCreated();
      navigation.navigate('LoginScreen');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showEmailInUse();
      } else if (error.code === 'auth/invalid-email') {
        showToast();
      } else {
        console.error(error);
      }
    }
  
    setLoading(false); // Reset loading state
  };
  
  const saveTherapistData = async (userId, name, email, phoneNo, role) => {
    try {
      const TherapistDataCollection = collection(firestore, 'TherapistData');
  
      await addDoc(TherapistDataCollection, {
        id: userId,
        name: name,
        emailId: email,
        passwordS: password,
        phoneNo: phoneNo,
        role: role, // Save user role along with other user data
        profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTet-jk67T6SYdHW04eIMLygHzEeJKobi9zdg&usqp=CAU',
      });
  
      console.log('User data added to Firestore successfully!');
    } catch (error) {
      console.error('Error adding user data to Firestore: ', error);
    }
  };
  

  ///////Fetching user Data From firestore and saving in ASYNC Storage/////////////////
  ///////////////////////////Toast/////////////////
  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Authentication Failed',
      text2:
        'Invalid Email or Password. Please enter a valid email address and password.',
    });
  };
  const showAccountCreated = () => {
    Toast.show({
      type: 'success',
      text1: 'Account Created',
      text2: 'Account has been created now you can login with your credentials',
    });
  };
  const showEmailInUse = () => {
    Toast.show({
      type: 'error',
      text1: 'Email In Use',
      text2: 'This email is alraedy registered',
    });
  };
  const passwordConfirm = () => {
    Toast.show({
      type: 'error',
      text1: 'Password Mismatch',
      text2: 'Password and confirm password should be same',
    });
  };
  const Varefication = () => {
    Toast.show({
      type: 'info',
      text1: 'Verify Email',
      text2: 'Please Verify Email',
    });
  };
  ///////////////////////////////////////////////////////////

  return (
    <>
      {/* {waiting && <Loader />}
      {!waiting && ( */}
      <ScrollView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <MyStatusBar />
        <View style={{ flex: 1 }}>
          {header()}
          {nameInfo()}
          {emailInfo()}
          {mobileInfo()}
          {passwordInfo()}
          {confirmPasswordInfo()}
          {registerButton()}
          {alreadyAccountInfo()}

        </View>
      </ScrollView>
      {/* )} */}
      <Toast />
    </>
  );
  function alreadyAccountInfo() {
    return (
      <Text
        style={{
          margin: Sizes.fixPadding * 2.0,
          ...Fonts.grayColor16Medium,
          textAlign: 'center',
        }}
      >
        Already have an account?
        <Text
          onPress={onPressHandler}
          style={{ ...Fonts.primaryColor16Medium }}
        >
          {' '}
          Login now
        </Text>
      </Text>
    );
  }

  function registerButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          await handleSignUp();
        }}
        style={{ ...CommonStyles.buttonStyle, margin: Sizes.fixPadding * 2.0 }}
      >
        {loading ? ( // Conditionally render loader if loading state is true
          <ActivityIndicator size="small" color={Colors.whiteColor} />
        ) : (
          <Text style={{ ...Fonts.whiteColor18SemiBold }}>Register</Text>
        )}
      </TouchableOpacity>
    );
  }

  function passwordInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <View
          style={{
            ...CommonStyles.textFieldWrapper,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor={Colors.grayColor}
            style={{ ...Fonts.blackColor16Medium, height: 30.0, flex: 1, padding: 0 }}
            cursorColor={Colors.primaryColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={securePassword}
          />
          <TouchableOpacity onPress={() => { setSecurePassword(!securePassword) }}>
            <MaterialCommunityIcons
              name={securePassword ? 'eye' : 'eye-off'}
              size={20}
              color={Colors.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  function confirmPasswordInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <View
          style={{
            ...CommonStyles.textFieldWrapper,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={Colors.grayColor}
            style={{ ...Fonts.blackColor16Medium, height: 30.0, flex: 1, padding: 0 }}
            cursorColor={Colors.primaryColor}
            value={confirmpassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={securePassword}
          />
          <TouchableOpacity onPress={() => { setSecurePassword(!securePassword) }}>
            <MaterialCommunityIcons
              name={securePassword ? 'eye' : 'eye-off'}
              size={20}
              color={Colors.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function mobileInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={CommonStyles.textFieldWrapper}>
        <MaterialCommunityIcons
            name="phone-outline"
            size={25}
            color={Colors.primaryColor}
          />
          <TextInput
            placeholder="Enter Mobile Number*"
            placeholderTextColor={Colors.grayColor}
            style={{ ...Fonts.blackColor16Medium, height: 30.0, padding: 0 }}
            cursorColor={Colors.primaryColor}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="number-pad"
          />
        </View>
      </View>
    );
  }

  function emailInfo() {
    return (

      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <View style={CommonStyles.textFieldWrapper}>
          <MaterialCommunityIcons
            name="email"
            size={25}
            color={Colors.primaryColor}
          />
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor={Colors.grayColor}
            style={{ ...Fonts.blackColor16Medium, height: 30.0, padding: 0 }}
            cursorColor={Colors.primaryColor}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </View>
    );
  }

  function nameInfo() {
    return (

      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <View style={CommonStyles.textFieldWrapper}>
          <MaterialCommunityIcons
            name="account"
            size={25}
            color={Colors.primaryColor}
          />
          <TextInput
            placeholder="Enter Name"
            placeholderTextColor={Colors.grayColor}
            style={{ ...Fonts.blackColor16Medium, height: 30.0, padding: 0 }}
            cursorColor={Colors.primaryColor}
            value={username}
            onChangeText={setUsername}
          />
        </View>
      </View>
    );
  }



  function header() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2.0,
          justifyContent: 'center',
        }}
      >
        <MaterialIcons
          name="keyboard-backspace"
          size={26}
          color={Colors.primaryColor}
          style={{ position: 'absolute', zIndex: 100 }}
          onPress={() => {
            navigation.pop();
          }}
        />
        <Text style={CommonStyles.headerTextStyle}>Register Account</Text>
      </View>
    );
  }

}


export default RegisterScreen;
