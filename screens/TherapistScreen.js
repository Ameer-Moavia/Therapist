import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, FlatList } from "react-native";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import MyStatusBar from '../components/myStatusBar';
import { Colors, Fonts, Sizes, screenWidth } from '../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation,DrawerActions} from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { database } from './firebase';
import { ref as databaseRef, set, push, get, onValue, query, orderByChild, equalTo ,update} from 'firebase/database';


import AsyncStorage from '@react-native-async-storage/async-storage';
const TherapistScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [profileImageUri, setProfileImageUri] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTet-jk67T6SYdHW04eIMLygHzEeJKobi9zdg&usqp=CAU');
  const [data, setData] = useState(true);
  const [Appointments, setAppointments] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    const fetchName = async () => {
      try {
        const user = await AsyncStorage.getItem('emailS');
        // Check if user exists in doctorsData table
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
        const storedUserName = await AsyncStorage.getItem(
          `userName_${user}`,
        );

        if (storedUserName) {
          setUserName(storedUserName.replace(/[\[\]"]+/g, ''));
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchName();
  }, []);


  const reject = async (id) => {
    
    try{
      const appointmentsRef = databaseRef(database, 'Appointments');
      const q = query(appointmentsRef, orderByChild('id'), equalTo(id));
      const snapshot = await get(q);
      console.log(snapshot)
      if (snapshot.exists()) {
        const appointmentKey = Object.keys(snapshot.val())[0]; // Assuming there's only one appointment for a given ID
        const appointmentRef = databaseRef(database, `Appointments/${appointmentKey}`);

  
        await update(appointmentRef, { status: "Rejected" });
        console.log("Appointment status updated to Rejected");
      } else {
        console.log("Appointment not found");
      }

    }catch(err){
      console.log(err)
    }
  }

  const accept= async(id)=>{
    try{
      const appointmentsRef = databaseRef(database, 'Appointments');
      const q = query(appointmentsRef, orderByChild('id'), equalTo(id));
      const snapshot = await get(q);
      console.log(snapshot)
      if (snapshot.exists()) {
        const appointmentKey = Object.keys(snapshot.val())[0]; // Assuming there's only one appointment for a given ID
        const appointmentRef = databaseRef(database, `Appointments/${appointmentKey}`);  
        await update(appointmentRef, { status: "Approved"});
        console.log("Appointment status updated to Approved");
      } else {
        console.log("Appointment not found");
      }

    }catch(err){
      console.log(err)
    }
  }


  const Message=(data)=>{

    const currentUser = {
      id: data.docid, // Replace with the actual current user ID
      name: data.doctorName,
      photo: data.doctorPhoto,
  };

    const  receiver={
      name: data.patientName,
      photo: data.patientPhoto,
      id: data.patientID,
  }
  navigation.navigate('Message', { receiver,currentUser});
    console.log(data)
  }
  const ViewReports=(data)=>{

  navigation.navigate('TestReports', { email : data.user});
     }

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

  const fetchAppointmentsData = () => {
    try {
      const appointmentsRef = databaseRef(database, 'Appointments');
      onValue(appointmentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const appointmentsArray = Object.values(data);
          const filteredAppointments = appointmentsArray.filter(appointment => appointment.doctorEmail === userEmail);
          setAppointments(filteredAppointments);
        }
      });
      console.log(Appointments)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchAppointmentsData();
    }
  }, [userEmail]);

  
  return (
    <View style={styles.container}>

      <View style={styles.Navheader}>

        <Text style={styles.title}>Home</Text>
        <TouchableOpacity onPress={() => handleNotifications()}>
          <MaterialCommunityIcons
            name="bell"
            size={24}
            color={Colors.whiteColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {banner(userName)}
      {upcommingAppointments()}
    </View>
  );

  function banner(name) {
    return (
      <View style={styles.bannerWrapStyle}>
        <Image
          source={{ uri: profileImageUri }} // Replace with the path to the profile picture
          style={styles.profileImage}
        />
        <View style={styles.bannerDetailWrapStyle}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.role}> {Array.isArray(data.categories) ? data.categories.join(" | ") : ''}</Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: Math.floor(data.rating) }, (v, i) => (
              <Icon key={i} name="star" size={20} color={Colors.starYellow} />
            ))}
            {data.rating % 1 !== 0 && (
              <Icon name="star-half" size={20} color={Colors.starYellow} />
            )}
            <Text style={styles.ratingText}> | {data.reviews}</Text>
          </View>
        </View>
      </View>
    );
  }
  function upcommingAppointments() {
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTextLeft}>Upcoming Appointments</Text>
          <Text style={styles.headerTextRight} onPress={()=>{
            navigation.navigate('UpcomingSchedule') }}>See All</Text>
        </View>
  
        {Appointments.map((Appointment, index) => (
          <View key={index} style={styles.appoint}>
            <Image
              source={{ uri: Appointment.patientPhoto }}
              style={styles.profileImageAppoint}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.nameAppoint}>{Appointment.patientName}</Text>
              <View style={styles.row}>
                <MaterialIcons name="phone" size={16} color={Colors.primaryColor} />
                <Text style={styles.phone}>{Appointment.patientPhone}  .</Text>
                <Text style={styles.status}>{Appointment.status}</Text>
                {Appointment.status === 'Pending' && (
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => accept(Appointment.id)}>
                    <MaterialIcons name="check" size={10} color={Colors.whiteColor} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={() => reject(Appointment.id)}>
                    <MaterialIcons name="close" size={10} color={Colors.whiteColor} />
                  </TouchableOpacity>
                </View>
              )}
              {Appointment.status === 'Approved' && (
                <TouchableOpacity style={styles.messageButton} onPress={()=>Message(Appointment)}>
                  <MaterialIcons name="message" size={26} color={Colors.primaryColor} />
                </TouchableOpacity>
              )}
               {Appointment.status === 'Approved' && (
                <TouchableOpacity style={styles.ViewReports} onPress={()=>ViewReports(Appointment)}>
                  <MaterialIcons name="table-view" size={26} color={Colors.primaryColor} />
                </TouchableOpacity>
              )}
              </View>
              
              <View style={styles.divider} />
              <Text style={styles.date}>{Appointment.date} at {Appointment.time}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  }
  
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // to make it a circle
  },
  name: {
    ...Fonts.whiteColor20Bold
  },
  role: {
    ...Fonts.whiteColor16Medium
  },
  bannerWrapStyle: {
    backgroundColor: Colors.primaryColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.fixPadding,
    elevation: 3.0,
    shadowColor: Colors.pinkColor,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    alignItems: 'center',
    padding: Sizes.fixPadding,
    borderBottomLeftRadius: 20, // Rounded bottom-left corner
    borderBottomRightRadius: 20, // Rounded bottom-right corner
    paddingBottom: 25,
  },
  bannerDetailWrapStyle: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: Sizes.fixPadding * 2.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    ...Fonts.whiteColor16Medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 5,
  },
  headerTextLeft: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  headerTextRight: {
    ...Fonts.blackColor18SemiBold,
    marginHorizontal: 10,
    color: Colors.primaryColor,
  },
  Navheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    marginTop: 1,
    paddingVertical: 10,
  },
  title: {
    ...Fonts.whiteColor20SemiBold,
    textAlign: "center",
    paddingLeft:2
  },
  icon: {
    paddingHorizontal: Sizes.fixPadding,
  },
  appoint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  profileImageAppoint: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  nameAppoint: {
    ...Fonts.blackColor16Medium,
    color:Colors.primaryColor, // dark teal
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  phone: {
    marginLeft: 5,
    ...Fonts.blackColor14Regular,

  },
  status: {
    marginLeft: 10,
    ...Fonts.blackColor14Regular,
    color: Colors.primaryColor,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  date: {
    ...Fonts.blackColor14Regular
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft:30
  },
  acceptButton: {
    backgroundColor: Colors.greenColor,
    borderRadius:20,
    padding: 5,
    marginRight: 5,
    marginTop:2
  },
  rejectButton: {
    backgroundColor: 'red',
    borderRadius:20,
    padding: 5,
    marginRight: 5,
    marginTop:2
  },
  messageButton:{
    position:"absolute",
    right:10,
  },
  ViewReports:{
    position:"absolute",
    right:45,
  }
});

export default TherapistScreen;
