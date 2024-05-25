import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Colors, Sizes, Fonts, CommonStyles } from "../constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MyStatusBar from '../components/myStatusBar';
import { RadioButton } from 'react-native-paper';

const CompleteDetailsScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    educationItems: [],
    experience: "",
    languageItems: [],
    gender: 'male' // Default value
  });

  const { educationItems, experience, languageItems, gender } = formData;

  const educationChecklist = [
    "Psychiatry",
    "Psychology",
    "Counseling",
    "Physical Therapy",
    "Occupational Therapy",
    "Speech Therapy",
  ];

  const languageChecklist = ["English", "Spanish", "French", "German"];

  const toggleEducationItem = (item) => {
    const updatedItems = educationItems.includes(item)
      ? educationItems.filter((i) => i !== item)
      : [...educationItems, item];
    setFormData({ ...formData, educationItems: updatedItems });
  };

  const toggleLanguageItem = (item) => {
    const updatedItems = languageItems.includes(item)
      ? languageItems.filter((i) => i !== item)
      : [...languageItems, item];
    setFormData({ ...formData, languageItems: updatedItems });
  };

  const handleNext = () => {
    if (!educationItems.length || !experience || !languageItems.length) {
      Alert.alert('Alert', 'All fields are required');
    } else {
      navigation.navigate('DetailsScreen2', { formData });
    }
  };

  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor={Colors.primaryColor} barStyle="light-content" />
      <Text style={styles.title}>Complete Details</Text>
      <ScrollView>
      <View style={styles.sectionsContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speciality</Text>
          <MaterialCommunityIcons
            name="school"
            size={20}
            color={Colors.primaryColor}
            style={styles.icon}
          />
        </View>
        {renderEducationChecklist()}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <MaterialCommunityIcons
            name="briefcase"
            size={20}
            color={Colors.primaryColor}
            style={styles.icon}
          />
        </View>
        {renderExperienceInput()}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <MaterialCommunityIcons
            name="translate"
            size={20}
            color={Colors.primaryColor}
            style={styles.icon}
          />
        </View>
        {renderLanguageChecklist()}
      </View>
      <View>
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <RadioButton
            value="male"
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setFormData({ ...formData, gender: 'male' })}
            color={Colors.primaryColor}
          />
          <Text style={{ ...Fonts.blackColor16Medium }}>Male</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="female"
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setFormData({ ...formData, gender: 'female' })}
            color={Colors.primaryColor}
          />
          <Text style={{ ...Fonts.blackColor16Medium }}>Female</Text>
        </View>
      </View>
      </ScrollView>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  function renderEducationChecklist() {
    const [otherSpecialty, setOtherSpecialty] = useState('');

    return (
      <View>
        {educationChecklist.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
            onPress={() => toggleEducationItem(item)}
          >
            <MaterialCommunityIcons
              name={educationItems.includes(item) ? "checkbox-marked" : "checkbox-blank-outline"}
              size={25}
              color={Colors.primaryColor}
            />
            <Text style={{ ...Fonts.blackColor16Medium, marginLeft: 10 }}>{item}</Text>
          </TouchableOpacity>
        ))}
        {/* Input field for Other Speciality */}
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="circle-edit-outline"
            size={25}
            color={Colors.primaryColor}
            style={{ marginRight: 10 }}
          />
          <TextInput
            placeholder="Other Speciality"
            placeholderTextColor={Colors.grayColor}
            style={{ ...Fonts.blackColor16Medium, height: 30.0, padding: 0 }}
            cursorColor={Colors.primaryColor}
            value={otherSpecialty}
            onChangeText={setOtherSpecialty}
          />
        </View>
      </View>
    );
  }

  function renderExperienceInput() {
    return (
      <View style={styles.inputWrapper}>
        <MaterialCommunityIcons
          name="account-clock"
          size={25}
          color={Colors.primaryColor}
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Experience (in years)"
          placeholderTextColor={Colors.grayColor}
          style={{ ...Fonts.blackColor16Medium, height: 30.0, padding: 0 }}
          cursorColor={Colors.primaryColor}
          keyboardType="numeric"
          value={experience}
          onChangeText={(text) => setFormData({ ...formData, experience: text })}
        />
      </View>
    );
  }

  function renderLanguageChecklist() {
    return (
      <View>
        {languageChecklist.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
            onPress={() => toggleLanguageItem(item)}
          >
            <MaterialCommunityIcons
              name={languageItems.includes(item) ? "checkbox-marked" : "checkbox-blank-outline"}
              size={25}
              color={Colors.primaryColor}
            />
            <Text style={{ ...Fonts.blackColor16Medium, marginLeft: 10 }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: Sizes.fixPadding * 2,
    height:"100%"
  },
  title: {
    ...Fonts.blackColor20SemiBold,
    textAlign: 'center',
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2,
    color: Colors.primaryColor
  },
  sectionsContainer: {
    marginBottom: Sizes.fixPadding * 2,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding,
  },
  sectionTitle: {
    ...Fonts.blackColor18SemiBold,
  },
  icon: {
    marginTop: 3,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: Colors.primaryColor, // Border color
    paddingVertical: 5,
  },
  nextButton: {
    position: 'absolute',
    bottom: Sizes.fixPadding * 2,
    right: Sizes.fixPadding * 2,
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2,
    borderRadius: 5,
  },
  nextButtonText: {
    ...Fonts.whiteColor16Medium,
  },
};

export default CompleteDetailsScreen;
