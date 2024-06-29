import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    BackHandler,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors, CommonStyles, Fonts, Sizes } from '../constants/styles';
import { Text } from '../components/commonText';
import { useFocusEffect } from '@react-navigation/native';
import MyStatusBar from '../components/myStatusBar';
import { auth, firestore } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {database} from './firebase';
import { ref as databaseRef, get } from 'firebase/database';


const LoginScreen = ({ navigation }) => {

    const [backClickCount, setBackClickCount] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [securePassword, setSecurePassword] = useState(true);
    const [waiting, setWaiting] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setWaiting(false);
        }, []),
    );

    const handleAlert = (email, password) => {
        const isEmailValid = email.includes('@') && email.includes('.');
        const isPasswordValid = password.length >= 6;

        if (!isEmailValid || !isPasswordValid) {
            showToast();
        }
    };


    const fetchData = async () => {
        const userDataCollection = collection(firestore, 'TherapistData');

        try {
            const querySnapshot = await getDocs(
                query(userDataCollection, where('emailId', '==', email)),
            );

            const UserEmail = querySnapshot.docs.map(doc => doc.data().emailId);
            const Username = querySnapshot.docs.map(doc => doc.data().name);
            const Userpassword = querySnapshot.docs.map(doc => doc.data().passwordS);
            const Profile = querySnapshot.docs.map(doc => doc.data().profileImage);
            const phoneNo = querySnapshot.docs.map(doc => doc.data().phoneNo);
            console.log('from fire',phoneNo)
            const docId = querySnapshot.docs[0].id;



            
            await AsyncStorage.setItem(
                `userEmail_${email}`,
                JSON.stringify(UserEmail),
            );
            console.log('Setting userEmail:', UserEmail);



            await AsyncStorage.setItem(
                `userName_${email}`,
                JSON.stringify(Username),
            );
            console.log('Setting userName:', Username);



            await AsyncStorage.setItem(
                `userPassword_${email}`,
                JSON.stringify(Userpassword),
            );
            console.log('Setting userPassword:', Userpassword);

            await AsyncStorage.setItem(
                `userProfile_${email}`,
                JSON.stringify(Profile),
            );
            console.log('profile:', Profile)
            await AsyncStorage.setItem(
                `userPhone_${email}`,
                JSON.stringify(phoneNo),
            );
            console.log('Setting phone:', phoneNo);
            await AsyncStorage.setItem(`userDoc_${email}`, JSON.stringify(docId));

        } catch (error) {
            console.error('Error fetching data from Firestore:', error);
        }
    };


    


    const backAction = () => {
        if (Platform.OS === 'ios') {
            navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
            });
        } else {
            backClickCount === 1 ? BackHandler.exitApp() : _spring();
            return true;
        }
    };

    const _spring = () => {
        setBackClickCount(1);
        setTimeout(() => {
            setBackClickCount(0);
        }, 1000);
    };

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', backAction);
            navigation.addListener('gestureEnd', backAction);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', backAction);
                navigation.removeListener('gestureEnd', backAction);
            };
        }, [backAction]),
    );


    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            showToast();
            return;
        }
    
        setWaiting(true);
        try {
            const userDataCollection = collection(firestore, 'TherapistData');
            const querySnapshot = await getDocs(query(userDataCollection, where('emailId', '==', email)));
            if (querySnapshot.empty) {
                showToast();
                setWaiting(false);
                return;
            }
    
            await signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    
                    const user = userCredential.user;
                    if (user.emailVerified) {
                        // Check if user exists in doctorsData table
                        const doctorsRef = databaseRef(database, 'doctorsData');
                        const doctorSnapshot = await get(doctorsRef);
    
                        let userExists = false;
                        doctorSnapshot.forEach((doc) => {
                            if (doc.val().email === email) {
                                userExists = true;
                            }
                        });
    
                        if (userExists) {
                            fetchData();
                            await AsyncStorage.setItem('userToken', 'user_authenticated');
                            await AsyncStorage.setItem('emailS', email);
                            navigation.navigate('BottomTabBarScreen');
                            setWaiting(false);
                        } else {
                            fetchData();
                            await AsyncStorage.setItem('userToken', 'user_authenticated');
                            await AsyncStorage.setItem('emailS', email);
                            navigation.navigate('CompleteDetailsScreen');
                            setWaiting(false);
                        }
                    } else {
                        setWaiting(false);
                        Alert.alert(
                            'Email Not Verified',
                            'Please verify your email to sign in.',
                        );
                    }
                })
                .catch((error) => {
                    setWaiting(false);
                    if (error.code === 'auth/invalid-credential') {
                        showToast();
                    }
                    if (error.code === 'auth/invalid-email') {
                        InvalidMail();
                    }
                    if (error.code === 'auth/too-many-requests') {
                        Tomanyrequest();
                    }
                    if (error.code === 'auth/network-request-failed') {
                        Internet();
                    }
                    console.error(error);
                });
        } catch (error) {
            console.error('Error signing in:', error);
            setWaiting(false);
        }
    };
    

    ///////////////////////////Toast/////////////////

    const showToast = () => {
        Toast.show({
            type: 'error',
            text1: 'Authentication Failed',
            text2:
                'Invalid Email or Password. Please enter a valid email address and password.',
        });
    };
    const InvalidMail = () => {
        Toast.show({
            type: 'error',
            text1: 'Authentication Failed',
            text2: 'Invalid Email. Please enter a valid email address.',
        });
    };
    const Tomanyrequest = () => {
        Toast.show({
            type: 'info',
            text1: 'To Many Requests',
            text2: 'Too many requests Try again later.',
        });
    };
    const Internet = () => {
        Toast.show({
            type: 'info',
            text1: 'No Internet Connection',
            text2: 'Connect to internet.',
        });
    };

    return (
        <>
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                    <MyStatusBar />
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            automaticallyAdjustKeyboardInsets={true}
                        >
                            {appIcon()}
                            {title()}
                            {emailInfo()}
                            {passwordInfo()}
                            {forgetPasswordText()}
                            {loginButton()}
                        </ScrollView>
                        {dontAccountInfo()}
                    </View>
                    {exitInfo()}
                </View>
            <Toast />
        </>

    );

    function appIcon() {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: Sizes.fixPadding * 2.5,
                }}
            >
                <Image
                    source={require('../assets/soulsync.jpg')}
                    style={{
                        width: 100.0,
                        height: 100.0,
                        resizeMode: 'contain',
                    }}
                />
            </View>
        );
    }

    function title() {
        return (
            <Text style={{ ...Fonts.blackColor20Bold, textAlign: 'center' }}>
                Login to{' '}
                <Text style={{ ...styles.appTitleTextStyle }}>
                    Soul<Text style={{ ...Fonts.primaryColor20Bold }}>Sync</Text>
                </Text>
            </Text>
        );
    }

    function emailInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.grayColor16Regular }}>
                    Email
                    <Text style={{ ...Fonts.redColor15SemiBold }}>*</Text>
                </Text>
                <View style={CommonStyles.textFieldWrapper}>
                    <MaterialCommunityIcons
                        name="email"
                        size={30}
                        color={Colors.primaryColor}
                    />
                    <TextInput
                        placeholder="Enter Email"
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...Fonts.blackColor16Medium, height: 30.0, padding: 0 }}
                        cursorColor={Colors.primaryColor}
                        value={email}
                        onChangeText={(val) => setEmail(val)}
                        keyboardType="email-address"
                    />
                </View>
            </View>
        );
    }

    function passwordInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.grayColor16Regular }}>
                    Password<Text style={{ ...Fonts.redColor15SemiBold }}>*</Text>
                </Text>
                <View
                    style={{
                        ...CommonStyles.textFieldWrapper,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <MaterialCommunityIcons
                        name="lock"
                        size={30}
                        color={Colors.primaryColor}
                    />
                    <TextInput
                        placeholder="Enter Password"
                        placeholderTextColor={Colors.grayColor}
                        style={{
                            ...Fonts.blackColor16Medium,
                            height: 30.0,
                            flex: 1,
                            padding: 0,
                        }}
                        cursorColor={Colors.primaryColor}
                        value={password}
                        onChangeText={(val) => setPassword(val)}
                        secureTextEntry={securePassword}
                    />
                    <MaterialCommunityIcons
                        name={securePassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={Colors.lightGrayColor}
                        onPress={() => {
                            setSecurePassword(!securePassword);
                        }}
                    />
                </View>
            </View>
        );
    }

    function forgetPasswordText() {
        return (
            <Text style={styles.forgetPasswordTextStyle} onPress={()=>{
                navigation.navigate('ForgotPasswordScreen')
            }}>Forget password?</Text>
        );
    }

    function loginButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                    handleAlert(email, password);
                    await handleLogin()
                }}
                style={{ ...CommonStyles.buttonStyle, margin: Sizes.fixPadding * 2.0 }}
            >
                {waiting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
            <>
          <Text style={{ ...Fonts.whiteColor18SemiBold }}>Login</Text>
          <MaterialCommunityIcons
              name="login"
              size={30}
              color={Colors.whiteColor}
          />
          </>
        )}
            </TouchableOpacity>
        );
    }

    function orOptions() {
        return (
            <View style={{ alignItems: 'center', margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.grayColor16Medium }}>Or Continue with</Text>
                <View
                    style={{
                        marginTop: Sizes.fixPadding * 2.5,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {socialMediaOptionSort({
                        iconName: 'google',
                        bgColor: '#DD4F43',
                    })}
                    {socialMediaOptionSort({
                        iconName: 'github',
                        bgColor: '#000000',
                    })}
                </View>
            </View>
        );
    }

    function socialMediaOptionSort({ iconName, bgColor }) {
        return (
            <View
                style={{
                    backgroundColor: bgColor,
                    ...styles.socialCircleStyle,
                }}
            >
                <FontAwesome name={iconName} size={30} color={Colors.whiteColor} />
            </View>
        );
    }

    function dontAccountInfo() {
        return (
            <Text
                style={{
                    margin: Sizes.fixPadding * 2.0,
                    ...Fonts.grayColor16Medium,
                    textAlign: 'center',
                }}
            >
                Don’t have an account?
                <Text
                    onPress={() => navigation.push('RegisterScreen')}
                    style={{ ...Fonts.primaryColor16Medium }}
                >
                    {' '}
                    Register now
                </Text>
            </Text>
        );
    }

    function exitInfo() {
        return backClickCount === 1 ? (
            <View style={styles.exitInfoWrapStyle}>
                <Text style={{ ...Fonts.whiteColor14Medium }}>
                    Press Back Once Again To Exit!
                </Text>
            </View>
        ) : null;
    }
};

export default LoginScreen;

const styles = StyleSheet.create({
    exitInfoWrapStyle: {
        backgroundColor: Colors.grayColor,
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appNameTextStyle: {
        ...Fonts.primaryColor16Bold,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    forgetPasswordTextStyle: {
        ...Fonts.primaryColor16Medium,
        textAlign: 'right',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,
        textDecorationLine: 'underline',
        textDecorationColor: Colors.primaryColor,
    },
    socialCircleStyle: {
        width: 50.0,
        height: 50.0,
        borderRadius: 30.0,
        marginHorizontal: Sizes.fixPadding - 3.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});
