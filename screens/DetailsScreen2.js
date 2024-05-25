import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator, Alert, TextInput } from "react-native";
import { Colors, Sizes, Fonts } from "../constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MyStatusBar from '../components/myStatusBar';
import CountryPicker from 'react-native-dropdown-country-picker'; // Import the country picker
import { State, City } from 'country-state-city';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo
import * as DocumentPicker from 'expo-document-picker';
import { firestore, storage } from './firebase';
import { collection, getDocs, query, where, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage methods
import { database } from './firebase';
import { ref as databaseRef, push, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color } from "react-native-elements/dist/helpers";

const DetailsScreen2 = ({ route, navigation }) => {
  const data = route.params;
  console.log(data)
  const [country, setCountry] = useState('Select Country');
  const [selectedState, setSelectedState] = useState('Select State');
  const [selectedStateISO, setSelectedStateISO] = useState();
  const [selectedCity, setSelectedCity] = useState('Select City');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // New state for profile picture
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [personaldata, setPersonalData] = useState('');
  const [PictureName, setProfilePictureName] = useState("Upload Profile Picture");
  const [loading, setLoading] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Inside the useEffect hooks for filtering states and cities:

  useEffect(() => {
    // Filtered states based on the search query
    const filteredStates = states.filter(state =>
      state.name.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );
    setFilteredStates(filteredStates);
  }, [stateSearchQuery, states]);

  useEffect(() => {
    // Filtered cities based on the search query
    const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
    );
    setFilteredCities(filteredCities);
  }, [citySearchQuery, cities]);




  const toggleStateModal = () => {
    setStateModalVisible(!stateModalVisible);
  };

  const toggleCityModal = () => {
    setCityModalVisible(!cityModalVisible);
  };

  const resetAll = () => {
    setSelectedState('Select State');
    setSelectedCity('Select City');
    setCitySearchQuery('');
    setStateSearchQuery('');
    setSelectedLocation(null)

  };


  useEffect(() => {
    const fetch = async () => {
      try {
        const user = await AsyncStorage.getItem('emailS');
        const storedUserEmail = await AsyncStorage.getItem(
          `userEmail_${user}`,
        );
        const userEmail = storedUserEmail
          ? storedUserEmail.replace(/[\[\]"]+/g, '')
          : '';
        setUserEmail(userEmail);
        const userDataCollection = collection(firestore, 'TherapistData');
        const querySnapshot = await getDocs(
          query(userDataCollection, where('emailId', '==', userEmail)),
        );

        const docId = querySnapshot.docs[0].id;
        console.log(docId)

        // Get the current document data
        const docData = querySnapshot.docs[0].data();
        console.log(docData)
        setPersonalData(docData)


        console.log('Data Retrieved from firestore');
      } catch (error) {
        console.error('Error', error);
      }

    }

    fetch();
  }, []);
  useEffect(() => {
    let location
    // Concatenate selected country, state, and city
    if (country != 'Select Country' && selectedState == 'Select State' && selectedCity == 'Select City') {
      location = `${country?.name}`;
    } else if (country != 'Select Country' && selectedState != 'Select State' && selectedCity == 'Select City') {

      location = `${country?.name}, ${selectedState}`;

    } else if (country != 'Select Country' && selectedState != 'Select State' && selectedCity != 'Select City') {

      location = `${country?.name}, ${selectedState}, ${selectedCity}`;

    }

    setSelectedLocation(location);
    console.log(location)

  }, [country, selectedState, selectedCity]);

  useEffect(() => {
    if (country?.code) {
      // Fetch states when a country is selected
      const fetchStates = async () => {
        const fetchedStates = State.getStatesOfCountry(country?.code);
        setStates(fetchedStates);
      };
      fetchStates();
    }
  }, [country]);

  useEffect(() => {
    if (selectedState !== 'Select State' && country?.code) {
      // Fetch cities when a state is selected
      const fetchCities = async () => {
        const fetchedCities = await City.getCitiesOfState(country?.code, selectedStateISO);
        setCities(fetchedCities);
      };
      fetchCities();
    }
  }, [selectedState, country?.code]);

  // Function to select profile picture
  // Function to select profile picture
  const selectProfilePicture = async () => {
    try {
      const permissionResult = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // Specify the MIME type for images

      });
      if (!permissionResult.isCancel) {
        const selectedImageUri = permissionResult.assets[0].uri;
        console.log("Image : ", selectedImageUri)
        const selectedImageName = permissionResult.assets[0].name;
        // Handle the selected image URI here
        console.log("Selected image URI:", selectedImageUri);
        // Set the selected image URI to the state
        setProfilePicture(selectedImageUri);
        setProfilePictureName(selectedImageName)
      } else {
        console.log("Document picking cancelled.");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const saveProfile = async () => {
    setLoading(true)
    try {
      if (!profilePicture) {
        setLoading(false)
        console.log("Profile picture is not selected.");
        Alert.alert('Alert', 'Select Profile Picture');
        return;
      }

      const storageRef = ref(storage, 'profile_pictures/' + personaldata.emailId);
      const response = await fetch(profilePicture);

      if (!response.ok) {
        setLoading(false)
        throw new Error("Failed to fetch profile picture.");
      }

      await uploadBytes(storageRef, await response.blob());

      // Get the download URL of the uploaded picture
      const downloadURL = await getDownloadURL(storageRef);

      // Construct the profile object with the downloaded URL
      const Profile = {
        bio: `Dr. ${personaldata.name} is an experienced therapist with a passion for helping individuals improve their well-being. He is fluent in ${data.formData.languageItems.join(', ')} and has ${data.formData.experience} years of experience in ${data.formData.educationItems.join(', ')}.`,
        categories: data.formData.educationItems,
        email: personaldata.emailId,
        education: "MS Psychology",
        experience: data.formData.experience + " years",
        id: personaldata.id,
        languages: data.formData.languageItems,
        location: selectedLocation,
        name: "Dr. " + personaldata.name,
        photo: downloadURL,
        phoneNo: personaldata.phoneNo,
        rating: 0,
        reviews: 0
      };


      const doctorsRef = databaseRef(database, 'doctorsData');
      const newDoctorRef = push(doctorsRef);

      set(newDoctorRef, Profile);


      console.log(Profile);
      // Now you can save the Profile object to Firestore or perform any other actions
    } catch (err) {
      console.error("Error saving profile:", err);
      setLoading(false)
    }
    setLoading(false)
    navigation.navigate('TimeSlotsScreen', { email: personaldata.emailId });
  };
  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor={Colors.primaryColor} barStyle="light-content" />
      <Text style={styles.title}>Complete Details</Text>

      <Text style={styles.sectionTitle}>Country</Text>
      <View style={styles.section}>
        <CountryPicker
          selected={
            country?.name ? (
              <View onPress={resetAll} style={{ width: "100%" }}>
                <Text style={{ ...Fonts.blackColor15Regular, color: Colors.primaryColor }} >{country.flag}  {country.name}</Text>
              </View>
            ) : (
              <View style={styles.dropdownStyles}>
                <View>
                  <Text style={{ ...Fonts.blackColor15Medium, color: Colors.primaryColor }}>Select Country</Text>
                </View>
                <View>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={25}
                    color={Colors.primaryColor}
                  />
                </View>
              </View>
            )
          }
          setSelected={(value) => {
            resetAll();
            setCountry(value);
          }}
          setCountryDetails={setCountry}
          searchable={true}
          showCountryNameWithFlag={true}
          countryCodeContainerStyles={styles.dropdown}
        />
      </View>
      <Text style={styles.sectionTitle}>State</Text>
      <TouchableOpacity onPress={toggleStateModal} style={styles.cityPick}>
        <View style={styles.dropdownStyles}>
          <Text style={{ ...Fonts.blackColor15Regular, color: Colors.primaryColor }}>{selectedState}</Text>
          <MaterialCommunityIcons
            name={'chevron-down'}
            size={25}
            color={Colors.primaryColor}
          />
        </View>
        <Modal visible={stateModalVisible} animationType="slide" onRequestClose={toggleStateModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select State</Text>
            <View style={styles.searchInputContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={Colors.primaryColor}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search State"
                value={stateSearchQuery}
                onChangeText={text => setStateSearchQuery(text)}
                style={styles.searchInput}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredStates.map((state, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedState(state.name);
                    setSelectedStateISO(state.isoCode);
                    setCities([]); // Clear the cities when a new state is selected
                    toggleStateModal();
                  }}
                  style={styles.modalOption}
                >
                  <Text style={styles.modalOptionText}>{state.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={toggleStateModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

      </TouchableOpacity>
      <Text style={styles.sectionTitle}>City</Text>
      <TouchableOpacity onPress={toggleCityModal} style={styles.cityPick}>
        <View style={styles.dropdownStyles}>
          <Text style={{ ...Fonts.blackColor15Regular, color: Colors.primaryColor }}>{selectedCity}</Text>
          <MaterialCommunityIcons
            name={'chevron-down'}
            size={25}
            color={Colors.primaryColor}
          />
        </View>
        <Modal visible={cityModalVisible} animationType="slide" onRequestClose={toggleCityModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select City</Text>
            <View style={styles.searchInputContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={Colors.primaryColor}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search City"
                value={citySearchQuery}
                onChangeText={text => setCitySearchQuery(text)}
                style={styles.searchInput}
              />
            </View>
            <ScrollView>
              {filteredCities.map((city, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedCity(city.name);
                    toggleCityModal();
                  }}
                  style={styles.modalOption}
                >
                  <Text style={styles.modalOptionText}>{city.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={toggleCityModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Profile Picture </Text>
      <TouchableOpacity style={styles.cityPick}>
        <View style={styles.dropdownStyles}>
          <TouchableOpacity onPress={selectProfilePicture} style={{ borderRightWidth: 1, paddingRight: 15, borderColor: Colors.primaryColor }}>
            <MaterialCommunityIcons name="upload" size={24} color={Colors.primaryColor} />
          </TouchableOpacity>
          {profilePicture && (
            <Image source={{ uri: profilePicture }} style={{ width: 50, height: 50, marginHorizontal: 10, borderRadius: 50 }} />
          )}
          <Text style={{ ...Fonts.blackColor15Regular, color: Colors.primaryColor }}>{PictureName}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={saveProfile}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: Sizes.fixPadding * 2,
    height: "100%"
  },
  title: {
    ...Fonts.blackColor20SemiBold,
    textAlign: 'center',
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2,
    color: Colors.primaryColor
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding,
  },
  sectionTitle: {
    marginTop: 10,
    ...Fonts.blackColor18SemiBold,
  },
  dropdownStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: "space-between",
    width: 350,
  },
  dropdown: {
    width: "100%",
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 7,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cityPick: {
    width: "100%",
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 7,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dropdownItem: {
    width: "100%",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrayColor,
    paddingVertical: 8
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginHorizontal: Sizes.fixPadding * 2,
    marginTop: 250,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.lightGrayColor

  },
  modalContainer2: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginHorizontal: Sizes.fixPadding * 2,
    marginTop: 335,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.lightGrayColor
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
    alignItems: "center"
  },
  addButtonText: {
    ...Fonts.whiteColor16Medium,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.whiteColor,
  },
  modalTitle: {
    ...Fonts.blackColor18SemiBold,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.primaryColor
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrayColor,
  },
  modalOptionText: {
    ...Fonts.blackColor16Medium
  },
  modalCloseButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    borderRadius: 20,
    marginTop: 15,
  },
  modalCloseButtonText: {
    ...Fonts.whiteColor16Medium,
    color: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 7,
  },
};

export default DetailsScreen2;
