import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegiterScreen";
import BottomTabBarScreen from "./components/bottomTabBarScreen";
import CompleteDetailsScreen from "./screens/CompleteDetailsScreen";
import DetailsScreen2 from "./screens/DetailsScreen2";
import TimeSlotsScreen from "./screens/TimeSlotsScreen";
import DrawerNav from "./screens/DrawerNav";
import Message from "./screens/Message";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded, error] = useFonts({
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "SF-Compact-Display-Regular": require("./assets/fonts/SF-Compact-Display-Regular.ttf"),
    "SF-Compact-Display-Bold": require("./assets/fonts/SF-Compact-Display-Bold.ttf"),
    "SF-Compact-Display-Medium": require("./assets/fonts/SF-Compact-Display-Medium.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="TimeSlotsScreen" component={TimeSlotsScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="DrawerNav" component={DrawerNav} />
        <Stack.Screen name="CompleteDetailsScreen" component={CompleteDetailsScreen} />
        <Stack.Screen name="BottomTabBarScreen" component={BottomTabBarScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="DetailsScreen2" component={DetailsScreen2} />
        <Stack.Screen name="Message" component={Message} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
