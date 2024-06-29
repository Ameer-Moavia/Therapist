import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from '../constants/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import Material Community Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestore } from './firebase';
import { database } from './firebase';
import { ref as databaseRef, get,onValue,off } from 'firebase/database';
const UpcomingSchedule = () => {  
  const navigation = useNavigation(); // Get navigation object
  const [userEmail, setUserEmail] = useState("");
  const [Appointments, setAppointments] = useState([]);

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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchAppointmentsData();
    }
  }, [userEmail]);
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
  



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Schedule</Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    padding: Sizes.fixPadding,
    position: 'relative', // Ensure the container is relative for absolute positioning of the message icon
  },
  title: {
    ...Fonts.primaryColor20Bold,
    marginBottom: Sizes.fixPadding,
    textAlign: 'center',
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
  messageButton:{
    position:"absolute",
    right:10,
  }, ViewReports:{
    position:"absolute",
    right:45,
  }
});

export default UpcomingSchedule;