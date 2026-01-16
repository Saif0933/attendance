import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using Material Icons

const App = () => {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* --- Header Section --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* --- Profile Avatar Section --- */}
        <View style={styles.avatarContainer}>
          <View style={styles.imageWrapper}>
            <Image
              // Placeholder image mimicking the user in the photo
              source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80' }} 
              style={styles.avatar}
            />
            <View style={styles.cameraIconContainer}>
              <Icon name="camera-alt" size={16} color="#fff" />
            </View>
          </View>
        </View>

        {/* --- Form Section --- */}
        
        {/* Row for First and Last Name */}
        <View style={styles.row}>
          <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.floatingLabel}>First Name</Text>
            <TextInput 
              style={styles.input} 
              value="Md." 
              editable={true}
            />
          </View>

          <View style={[styles.inputWrapper, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>Last Name</Text>
            <TextInput 
              style={styles.input} 
              value="Saif" 
              editable={true}
            />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputWrapper}>
          <Text style={styles.floatingLabel}>Phone Number</Text>
          <TextInput 
            style={[styles.input, styles.disabledText]} 
            value="9334804356" 
            editable={false} // Assuming read-only based on grey color
          />
        </View>

        {/* Pay Type */}
        <View style={styles.inputWrapper}>
          <Text style={styles.floatingLabel}>Pay Type</Text>
          <TextInput 
            style={[styles.input, styles.disabledText]} 
            value="Monthly" 
            editable={false}
          />
        </View>

        {/* Monthly Salary */}
        <View style={styles.inputWrapper}>
          <Text style={styles.floatingLabel}>Monthly Salary</Text>
          <TextInput 
            style={[styles.input, styles.disabledText]} 
            value="₹ 10000" 
            editable={false}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    // Slight shadow for header separation if desired, though image looks flat
  },
  saveButton: {
    backgroundColor: '#FF9F00', // Matches the specific orange/yellow in image
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20, // Pill shape
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  imageWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff', // White border to separate icon from image
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#D1D5DB', // Light grey border
    borderRadius: 8,
    marginBottom: 24, // Space between inputs
    paddingHorizontal: 12,
    paddingTop: 4, 
    height: 56, // Fixed height for consistency
    justifyContent: 'center',
  },
  floatingLabel: {
    position: 'absolute',
    top: -10, // Pulls the label up to sit on the border
    left: 10,
    backgroundColor: '#fff', // White background covers the border line
    paddingHorizontal: 4,
    fontSize: 12,
    color: '#9CA3AF', // Grey text for label
  },
  input: {
    fontSize: 16,
    color: '#1F2937', // Dark text color
    paddingVertical: 0, // Reset padding to align text perfectly
    height: '100%',
  },
  disabledText: {
    color: '#9CA3AF', // Grey text for disabled fields like phone/salary
  }
});

export default App;