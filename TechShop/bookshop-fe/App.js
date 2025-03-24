import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TabScreens from './src/screens/Customer/TabScreens';
import AdminTabScreen from './src/screens/Admin/AdminTabScreen';
import ProductDetail from './src/screens/Customer/ProductDetail';
import CartScreen from './src/screens/Customer/CartScreen';
import { CartProvider } from './src/context/CartContext';
import ProfileDetail from './src/screens/Customer/ProfileDetail';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={TabScreens}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminHome"
            component={AdminTabScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ProductDetail" component={ProductDetail} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Profile" component={ProfileDetail} />


        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </CartProvider>
  );
}
