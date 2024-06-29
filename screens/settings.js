import React,{useEffect,useState} from 'react';
import {Alert, StyleSheet, Text, View,ScrollView} from 'react-native';
import colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Colors, CommonStyles, Fonts, Sizes } from '../constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Settings = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const user = await AsyncStorage.getItem('emailS');
        const storedUserEmail = await AsyncStorage.getItem(`userEmail_${user}`);
        if (storedUserEmail) {
          setUserEmail(storedUserEmail.replace(/[\[\]"]+/g, ''));
        }
      } catch (error) {
        console.error('Error retrieving user email from AsyncStorage:', error);
      }
    };

    getUserEmail();
  }, []);

  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.secondary, flex: 1}}>
        
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subhead}>Account</Text>
          <View style={styles.first}>
            <Text style={styles.text} onPress={()=>navigation.navigate('EditProfile')}>Edit Profile</Text>
            <Icon name="user" size={20} color="#544c4c" style={styles.email} />
            <Text style={styles.text} onPress={()=>navigation.navigate('UpdateTimeSlotsScreen',{email:userEmail})}>Update Slots</Text>
            <Icon
              name="shield-alt"
              size={20}
              color="#544c4c"
              style={styles.privacy}
            />
            <Text style={styles.text} onPress={()=>navigation.navigate('Notifications')}>Notification</Text>
            <Icon
              name="bell"
              size={20}
              color="#544c4c"
              style={styles.notification}
            />
            <Text style={styles.text} onPress={()=>navigation.navigate('Privacy')}>Privacy Policy</Text>
            <Icon name="lock" size={20} color="#544c4c" style={styles.lock} />
          </View>
          <Text style={styles.subhead}>Support & About</Text>
          <View style={[styles.first, {height: 135}]}>
            <Text style={styles.text} onPress={()=>navigation.navigate('Subscribe')}>My Subscription</Text>
            <Icon
              name="credit-card"
              size={20}
              color="#544c4c"
              style={[styles.email, {bottom: 100}]}
            />
            <Text style={styles.text} onPress={()=>navigation.navigate('Support')}>Help & Support</Text>
            <Icon
              name="question-circle"
              size={20}
              color="#544c4c"
              style={[styles.privacy, {bottom: 57}]}
            />
            <Text style={styles.text} onPress={()=>navigation.navigate('Terms')}>Terms and Policies</Text>
            <Icon
              name="exclamation-circle"
              size={20}
              color="#544c4c"
              style={[styles.notification, , {bottom: 15}]}
            />
          </View>
          <Text style={styles.subhead}>Actions</Text>
          <View style={[styles.first, {height: 95}]}>
            <Text style={styles.text} onPress={()=>navigation.navigate('Report')}>Report a problem</Text>
            <Icon
              name="flag"
              size={20}
              color="#544c4c"
              style={[styles.email, {bottom: 60}]}
            />
            <Text
              style={styles.text}
              onPress={() => navigation.navigate('Login')}>
              Log Out
            </Text>
            <Icon
              name="sign-out-alt"
              size={20}
              color="#544c4c"
              style={[styles.privacy, {bottom: 20}]}
            />
          </View>
          <Text style={styles.subhead}>Records</Text>
          <View style={[styles.first, {height: 50}]}>
            <Text
              style={styles.text}
              onPress={() => navigation.navigate('test')}>
              My Records
            </Text>
            <Icon
              name="file"
              size={20}
              color="#544c4c"
              style={[styles.email, {bottom: 16}]}
            />
          </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  first: {
    height: 175,
    width: '85%',
    backgroundColor: '#e6e6e9',
    marginHorizontal: 28,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    
  },
  text: {
    ...Fonts.blackColor19SemiBold,
    marginHorizontal: 60,
    marginVertical: 9,
    fontWeight: 'bold',
  },

  title: {
    color: Colors.primaryColor,
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 30,
    marginTop: 30,
  },
  subhead: {
    color: Colors.primaryColor,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 18,
    marginTop: 15,
    marginHorizontal: 40,
  },
  email: {
    position: 'absolute',
    marginHorizontal: 20,
    bottom: 141,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacy: {
    position: 'absolute',
    marginHorizontal: 20,
    bottom: 97,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification: {
    position: 'absolute',
    marginHorizontal: 20,
    bottom: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lock: {
    position: 'absolute',
    marginHorizontal: 20,
    bottom: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Settings;
