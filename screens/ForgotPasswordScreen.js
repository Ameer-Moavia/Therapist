import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { Text } from '../components/commonText';
import { Colors, CommonStyles, Fonts, Sizes } from '../constants/styles';
import { useFocusEffect } from '@react-navigation/native';
import MyStatusBar from '../components/myStatusBar';
import { auth,sendPasswordResetEmail } from './firebase';
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email.trim()) {
            showToast('Please enter your email.');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth,email);
            showToast('Password reset email sent successfully. Click  To verify');
            setTimeout(() => {
                setLoading(false);
                navigation.navigate('LoginScreen');
            }, 2000);
        } catch (error) {
            setLoading(false);
            console.error('Error sending password reset email:', error);
            showToast('Failed to send password reset email.');
        }
    };

    const showToast = (message) => {
        Toast.show({
            type: 'info',
            text1: 'Info',
            text2: message,
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
                        {resetPasswordButton()}
                    </ScrollView>
                </View>
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
                Forgot Password
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

    function resetPasswordButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleResetPassword}
                style={{ ...CommonStyles.buttonStyle, margin: Sizes.fixPadding * 2.0 }}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>Reset Password</Text>
                )}
            </TouchableOpacity>
        );
    }
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    // Styles here if needed
});
