import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Colors, Sizes, Fonts } from "../constants/styles";
import MyStatusBar from '../components/myStatusBar';
import { useNavigation } from '@react-navigation/native';
import { database } from './firebase';
import { ref as databaseRef, onValue, update ,get} from 'firebase/database';

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const UpdateTimeSlotsScreen = ({ route }) => {
  const navigation = useNavigation();
  const email = route.params.email;
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [loading, setLoading] = useState(false);

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = () => {
    const slotsRef = databaseRef(database, 'slots');
    onValue(slotsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userSlots = Object.values(data).find(slot => slot.email === email);
        if (userSlots) {
          setSelectedSlots(userSlots.timeSlots || {});
        }
      }
    }, (error) => {
      console.error("Error fetching time slots: ", error);
    });
  };

  function generateTimeSlots() {
    const slots = [];
    const startTimeAM = 8; // 8:00 AM
    const endTimeAM = 11; // 11:00 AM
    const startTimePM = 12; // 12:00 PM
    const endTimePM = 20; // 8:00 PM

    for (let hour = startTimeAM; hour <= endTimeAM; hour++) {
      slots.push(`${hour}:00 AM - ${hour + 1}:00 AM`);
    }

    for (let hour = startTimePM; hour <= endTimePM; hour++) {
      let displayHour = hour % 12 === 0 ? 12 : hour % 12;
      slots.push(`${displayHour}:00 PM - ${displayHour + 1}:00 PM`);
    }

    return slots;
  }

  const toggleSlotSelection = (day, slot) => {
    setSelectedSlots((prevSelectedSlots) => {
      const daySlots = prevSelectedSlots[day] || [];
      return {
        ...prevSelectedSlots,
        [day]: daySlots.includes(slot)
          ? daySlots.filter((s) => s !== slot)
          : [...daySlots, slot]
      };
    });
  };

  const handleUpdateTimeSlots = async () => {
    setLoading(true);

    const data = {
      email: email,
      timeSlots: selectedSlots
    };

    const slotsRef = databaseRef(database, 'slots');
    onValue(slotsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const key = Object.keys(data).find(key => data[key].email === email);
        if (key) {
          const userRef = databaseRef(database, `slots/${key}`);
          update(userRef, { timeSlots: selectedSlots })
            .then(() => {
              console.log('Time slots updated successfully');
              setLoading(false);
              navigation.navigate('BottomTabBarScreen');
            })
            .catch((error) => {
              console.error('Error updating time slots: ', error);
              setLoading(false);
            });
        } else {
          setLoading(false);
          console.error('Error: No matching email found in slots data.');
        }
      } else {
        setLoading(false);
        console.error('Error: No data found in slots.');
      }
    }, (error) => {
      console.error("Error fetching slots key: ", error);
      setLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <Text style={styles.title}>Update Time Slots</Text>
      <ScrollView horizontal contentContainerStyle={styles.dayPickerContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayButtonText, selectedDay === day && styles.selectedDayButtonText]}>
              {day.charAt(0)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.timeSlotsContainer}>
        <View style={styles.slotColumn}>
          {timeSlots
            .filter((slot) => slot.includes("AM"))
            .map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedSlots[selectedDay]?.includes(slot) && styles.selectedTimeSlot,
                ]}
                onPress={() => toggleSlotSelection(selectedDay, slot)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedSlots[selectedDay]?.includes(slot) && styles.selectedTimeSlotText,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
        <View style={styles.slotColumn}>
          {timeSlots
            .filter((slot) => slot.includes("PM"))
            .map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedSlots[selectedDay]?.includes(slot) && styles.selectedTimeSlot,
                ]}
                onPress={() => toggleSlotSelection(selectedDay, slot)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedSlots[selectedDay]?.includes(slot) && styles.selectedTimeSlotText,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleUpdateTimeSlots}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Update Time Slots</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: Sizes.fixPadding * 1.5,
  },
  title: {
    ...Fonts.blackColor20SemiBold,
    textAlign: "center",
    marginTop: Sizes.fixPadding - 6,
    marginBottom: Sizes.fixPadding,
    color: Colors.primaryColor,
  },
  dayPickerContainer: {
    flexDirection: "row",
    marginBottom: -40,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGrayColor,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding - 2.3,
  },
  selectedDayButton: {
    backgroundColor: Colors.primaryColor,
  },
  dayButtonText: {
    ...Fonts.blackColor16Medium,
  },
  selectedDayButtonText: {
    color: "#ffffff",
  },
  timeSlotsContainer: {
    flexDirection: "row",
  },
  slotColumn: {
    flex: 1,
  },
  timeSlot: {
    paddingVertical: Sizes.fixPadding,
    backgroundColor: Colors.lightGrayColor,
    borderRadius: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding - 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    paddingVertical: 22,
    elevation: 4,
  },
  selectedTimeSlot: {
    backgroundColor: Colors.primaryColor,
  },
  timeSlotText: {
    ...Fonts.blackColor16Medium,
  },
  selectedTimeSlotText: {
    color: "#ffffff",
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: Colors.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: {
    ...Fonts.whiteColor16Medium,
    color: '#fff',
  },
};
export default UpdateTimeSlotsScreen;
