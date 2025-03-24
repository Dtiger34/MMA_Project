import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import admin screens
import UserManagementScreen from './UserManagementScreen';
import ProductManagementScreen from './ProductManagementScreen';
import AdminSettingScreen from './AdminSettingScreen';

const Tab = createBottomTabNavigator();

const AdminTabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'UserManagement') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProductManagement') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'AdminSettings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007bff',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen 
        name="UserManagement" 
        component={UserManagementScreen} 
        options={{
          title: 'User Management',
          headerTitle: 'Manage Users'
        }}
      />
      <Tab.Screen 
        name="ProductManagement" 
        component={ProductManagementScreen} 
        options={{
          title: 'Products',
          headerTitle: 'Manage Products'
        }}
      />
      <Tab.Screen 
        name="AdminSettings" 
        component={AdminSettingScreen}
        options={{
          title: 'Settings',
          headerTitle: 'Admin Settings'
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabScreen;