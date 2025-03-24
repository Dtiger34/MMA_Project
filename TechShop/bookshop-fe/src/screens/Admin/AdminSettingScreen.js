import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminSettingScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Management</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>Enable Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={notifications ? "#007bff" : "#f4f3f4"}
          />
        </View>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>View Users</Text>
          <Ionicons name="people-outline" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Add User</Text>
          <Ionicons name="person-add-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Backup Options</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Create Backup</Text>
          <Ionicons name="cloud-upload-outline" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Restore Backup</Text>
          <Ionicons name="cloud-download-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Change Privacy Settings</Text>
          <Ionicons name="lock-closed-outline" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Two-Factor Authentication</Text>
          <Ionicons name="shield-checkmark-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminSettingScreen;
