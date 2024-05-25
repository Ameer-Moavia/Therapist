import React, { useState, useEffect } from 'react';
import { auth, app, firestore, onAuthStateChanged } from './firebase';
import { collection, doc, updateDoc, where } from 'firebase/firestore';
import { Colors, } from '../constants/styles.js';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import color from '../components/colors.jsx';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import {database} from './firebase';
import { ref as databaseRef, get } from 'firebase/database';

//////////////////////Main Component////////////////////

function ProfileScreen() {
  const [profileImageUri, setProfileImageUri] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTet-jk67T6SYdHW04eIMLygHzEeJKobi9zdg&usqp=CAU');

  ///////////////////////Hooks////////////////////////////
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [docId1, setdocId] = useState('');
  const [data, setData] = useState(true);
  const [editable, setEditable] = useState(false);
  const [newName, setNewName] = useState('');
  const [eye, setEye] = useState(true);

  //////////////////////////////////////////////////////

  const navigation = useNavigation();

  /////////////////////Use Effect To fetch data from async storagre////////////////

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'focus',
      () => {
        const fetchData = async () => {
          const user = await AsyncStorage.getItem('emailS');

          console.log('user', user);
          if (user) {
            try {
              console.log('here2');
              const storedUserEmail = await AsyncStorage.getItem(
                `userEmail_${user}`,
              );
              const storedUserName = await AsyncStorage.getItem(
                `userName_${user}`,
              );
              console.log('here3');
              const storedUserPassword = await AsyncStorage.getItem(
                `userPassword_${user}`,
              );
              const userDoc = storedDocId
                ? storedDocId.replace(/[\[\]"]+/g, '')
                : '';

              const storedDocId = await AsyncStorage.getItem(`userDoc_${user}`);

              const userEmail = storedUserEmail
                ? storedUserEmail.replace(/[\[\]"]+/g, '')
                : '';
              setUserEmail(userEmail);
              const userName = storedUserName
                ? storedUserName.replace(/[\[\]"]+/g, '')
                : '';
              setUserName(userName);
              const userPassword = storedUserPassword
                ? storedUserPassword.replace(/[\[\]"]+/g, '')
                : '';
              setUserPassword(userPassword);
              const doctorsRef = databaseRef(database, 'doctorsData');
              const doctorSnapshot = await get(doctorsRef);
        
              doctorSnapshot.forEach((doc) => {
                const doctorData = doc.val();
                if (doctorData.email === user) {
                  console.log(doctorData.photo);
                  setData(doctorData)
                  setProfileImageUri(doctorData.photo);
                }
              });

              setdocId(userDoc);
              const phone = await AsyncStorage.getItem(
                `userPhone_${user}`,
              );

              const phoneNo = phone
                ? phone.replace(/[\[\]"]+/g, '')
                : '';
              setPhoneNo(phoneNo)

              console.log('user doc', userDoc);
              console.log('profile', profileImageUri);
              console.log('name', userEmail);
              console.log('username', storedUserName);
              console.log('Pdoc', docId1);
              console.log('Pdoc', phoneNo);
            } catch (error) {
              console.error('Error fetching data from AsyncStorage:', error);
            }
          }
        };
        fetchData();
        return unsubscribe;
      },
      [navigation, userName, newName],
    );
    return unsubscribe;
  }, []);

  ////////////////////////////////////////////

  /////////////Check if user uplaod photo then save data to firestore//////////

  useEffect(() => {
    if (photoUploaded) {
      saveUserData();
      setPhotoUploaded(false);
    }
  }, [photoUploaded]);
  /////////////////////////////////////////////

  ///////////////Saving profile data to fire store//////////////

  const saveUserData = async () => {
    try {
      const userDataCollection = collection(firestore, 'userdata');
      const userDoc = doc(userDataCollection, docId1);
      await updateDoc(userDoc, {
        profileImage: profileImageUri,
        name: newName,
      });
      showSuccess()
      console.log('User data updated in Firestore successfully!');
    } catch (error) {
      console.error('Error updating user data in Firestore: ', error);
    }
  };

  ////////////When user have no internet connection set profile image from async///////
  const saveProfileImageUri = async uri => {
    try {
      const user = await AsyncStorage.getItem('emailS');
      await AsyncStorage.setItem(`userProfile_${user}`, uri);
    } catch (error) {
      console.log('AsyncStorage Error: ', error);
    }
  };

  ///////////////////saving profile updating in async///////////
  const saveProfileEdit = async () => {
    try {
      const user = await AsyncStorage.getItem('emailS');
      await AsyncStorage.setItem(`userName_${user}`, newName);
      setUserName(newName);
    } catch (error) {
      console.log('AsyncStorage Error: ', error);
    }
  };

  ////////////When user have no internet connection get profile image from async///////
  const getProfileImageUri = async () => {
    try {
      const uri = await AsyncStorage.getItem('');
      if (uri) {
        setProfileImageUri(uri);
      }
    } catch (error) {
      console.log('AsyncStorage Error: ', error);
    }
  };

  useEffect(() => {
    getProfileImageUri();
  }, []);

  // ////////////////////////////Logout////////////////////
  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('LoginScreen');
  };
  ///////////////////////////////////////////////////////

  /////////////////Clear asysnc storage//////////////
  const clear = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };
  ///////////////////////////////////////////////
  /////////////////////Enable Edit///////////////
  const editProfile = () => {
    setEditable(true);
    showToast()
  };
  ////////////////////////////////////////////
  //////////////////////Eye//////////////////

  const handleEye = () => {
    setEye(!eye);
  };
  //////////////////////

  const showToast = () => {
    Toast.show({
      type: 'info',
      text1: 'Edit Your Name',
      text2:
        'Now You Can Edit Your UserName.',
    });
  };

  const showSuccess = () => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2:
        'Changes is successfully updated',
    });
  };

  const showError = () => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2:
        'Changes is not saved',
    });
  };

  ////////////////////////

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.profile}>
            <View style={styles.profileAvatarWrapper}>
              <Image
                alt=""
                source={{
                  uri: profileImageUri,
                }}
                style={styles.profileAvatar}
              />
            </View>

            <View style={styles.profileBody}>
              <Text style={styles.profileName}>{userName}</Text>
              <Text style={styles.profileAddress}>{data.education}</Text>
            </View>
            <TouchableOpacity
              style={[styles.editBtn, { marginVertical: 5 }]}
              onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder={userName}
              secureTextEntry={false}
              placeholderTextColor="black"
              editable={editable}
              onChangeText={txt => setNewName(txt)}
            />
            <Icon
              name="user"
              size={20}
              color={Colors.primaryColor}
              style={styles.user}
            />


            <TextInput
              style={styles.input}
              placeholder={userEmail}
              secureTextEntry={true}
              placeholderTextColor="black"
              editable={false}
            />
            <Icon
              name="envelope"
              size={20}
              color={Colors.primaryColor}
              style={styles.email}
            />

            <TextInput
              style={styles.input}
              placeholder={phoneNo}
              placeholderTextColor="black"
              value={phoneNo}
              editable={false}
            />

            <TouchableOpacity style={styles.eye2} >
              <Icon
                name={'phone'}
                size={20}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>

            {/* <TouchableOpacity
            style={[styles.getCode, {marginTop: 15}]}
            onPress={async () => {
              await saveUserData();
              await saveProfileEdit();
              setEditable(false)
            }}>
            <Text style={styles.loginButtonText}>Update</Text>
          </TouchableOpacity> */}
          </View>
        </ScrollView>

        {<TouchableOpacity style={styles.logoutIcon} onPress={() => {navigation.navigate('Settings')}}>
          <Icon name="cog" size={25} color={Colors.primaryColor} />
        </TouchableOpacity>}
        {<TouchableOpacity style={styles.logoutIcon2} onPress={() => logout()}>
          <Icon name="sign-out-alt" size={25} color={Colors.primaryColor} />
        </TouchableOpacity>}
      </SafeAreaView>
      <Toast />
    </>
  );
}

/////////////////Style Sheet///////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.secondary,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: color.secondary,
  },
  profile: {
    padding: 24,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.secondary,
    marginVertical: 70,
  },
  profileAvatar: {
    width: 130,
    height: 130,
    borderRadius: 9999,
  },
  profileAvatarWrapper: {
    position: 'relative',
    borderWidth: 4,
    borderRadius: 9999,
    borderColor: Colors.primaryColor,
  },
  profileAction: {
    position: 'absolute',
    right: 5,
    bottom: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: Colors.primaryColor,
  },

  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: Colors.primaryColor,
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    marginTop: 20,
    marginHorizontal: 40,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.primaryColor,
    borderWidth: 1.5,
    fontFamily: 'sans-serif-condensed',
    backgroundColor: '#fff',
    color: 'black',
    fontWeight: 'bold',
  },
  getCode: {
    width: '80%',
    height: 50,
    marginVertical: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    marginHorizontal: 40,
  },
  editBtn: {
    width: '25%',
    height: 25,
    marginVertical: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    marginHorizontal: 40,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'sans-serif-condensed',
  },
  editText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'sans-serif-condensed',
  },
  eye2: {
    position: 'absolute',
    right: 40,
    bottom: 710,
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 9999,
  },
  logoutIcon: {
    position: 'absolute',
    left: 17,
    marginVertical: 20
  },
  
  logoutIcon2: {
    position: 'absolute',
    right: 17,
    marginVertical: 20
  },
  editIcon: {
    position: 'absolute',
    right: 140,
    bottom: 492,
  },
  user: {
    position: 'absolute',
    right: 60,
    bottom: 175,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
  },
  email: {
    position: 'absolute',
    right: 65,
    bottom: 104,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
  },
  eye2: {
    position: 'absolute',
    right: 70,
    bottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
  },
});

export default ProfileScreen;
