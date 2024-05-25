import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Fonts, Sizes } from '../constants/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  View,
  StyleSheet,
  Text,
  BackHandler,
  Platform,
  SafeAreaView,
} from 'react-native';
import TherapistScreen from '../screens/TherapistScreen';
import Profile from '../screens/Profile';
import UpcomingSchedule from '../screens/UpcomingSchedule';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import MyStatusBar from './myStatusBar';

const Tab = createBottomTabNavigator();

const BottomTabBarScreen = ({ navigation }) => {
  const backAction = () => {
    if (Platform.OS === 'ios') {
      navigation.addListener('beforeRemove', e => {
        e.preventDefault();
      });
    } else {
      backClickCount == 1 ? BackHandler.exitApp() : _spring();
      return true;
    }
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

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setBackClickCount] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: Colors.primaryColor,
            tabBarInactiveTintColor: Colors.lightGrayColor,
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarShowLabel: false,
            tabBarItemStyle: {
              height: 60.0,
              alignSelf: 'flex-start',
            },
            tabBarStyle: {
              backgroundColor: Colors.whiteColor,
              height: 60.0,
            },
          }}>
          <Tab.Screen
            name="TherapistScreen"
            component={TherapistScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="home-variant"
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="UpcomingSchedule"
            component={UpcomingSchedule}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account"
                  size={24}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
      {exitInfo()}
    </View>
  );

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Press Back Once Again To Exit!
        </Text>
      </View>
    ) : null;
  }
};

export default BottomTabBarScreen;

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
});
