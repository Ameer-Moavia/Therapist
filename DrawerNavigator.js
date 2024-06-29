// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './screens/CustomDrawerContent';
import ProfileScreen from './screens/Profile';
import TimeSlotsScreen from './screens/TimeSlotsScreen';
import BottomTabBarScreen from "./components/bottomTabBarScreen";
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}  initialRouteName="BottomTabBarScreen" drawerContent={(props) => <CustomDrawerContent {...props} />} >
      <Drawer.Screen name="BottomTabBarScreen" component={BottomTabBarScreen} />
      <Drawer.Screen name="TimeSlotsScreen" component={TimeSlotsScreen}/>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
