import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IMAGE_BASE_URL } from '../../api/api';
import { useGetEmployeeById, useUpdateEmployee } from '../employee/hook/useEmployee';
import { useDeleteProfilePicture, useUploadProfilePicture } from '../employee/hook/useProfilePicture';
import { useEmployeeAuthStore } from '../store/useEmployeeAuthStore';
import { showSuccess } from '../utils/meesage';

const PersonalDetails = () => {
  const navigation = useNavigation();
  const { employee, company,token } = useEmployeeAuthStore();
  const employeeId = employee?.id;
  
  console.log({employee,company,token})
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phoneNumber: '',
    salary: '',
    salaryType: 'Monthly', // Default if not provided
  });
  const [pendingImage, setPendingImage] = useState<any>(null);

  const { data: employeeDetails, isLoading } = useGetEmployeeById(employeeId || '');
  const updateEmployeeMutation = useUpdateEmployee();
  const uploadPhotoMutation = useUploadProfilePicture();
  const deletePhotoMutation = useDeleteProfilePicture();

  useEffect(() => {
    // Try to find the employee object in common response locations
    const emp = employeeDetails?.data?.employee || employeeDetails?.data || employeeDetails?.employee || employeeDetails;
    
    if (emp && (emp.id || emp.firstname)) {
      console.log('Employee Data for Form:', emp);
      let fname = emp.firstname || '';
      let lname = emp.lastname || '';

      // If lastname is missing but firstname has multiple words, split them for the UI
      if (!lname && fname.trim().includes(' ')) {
        const parts = fname.trim().split(/\s+/);
        fname = parts[0];
        lname = parts.slice(1).join(' ');
      }

      setFormData({
        firstname: fname,
        lastname: lname,
        phoneNumber: emp.phoneNumber || '',
        salary: emp.salary ? emp.salary.toString() : '',
        salaryType: emp.salaryType || 'Monthly',
      });
    }
  }, [employeeDetails]);

  const handleImagePick = async () => {
    if (!employeeId) return;

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const photoFile: any = {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName || `profile_${employeeId}.jpg`,
      };

      setPendingImage(photoFile);
    }
  };

  const handleImageDelete = () => {
    if (!employeeId) return;
    
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deletePhotoMutation.mutate(employeeId, {
              onSuccess: () => {
                showSuccess('Profile picture removed');
              },
              onError: (err: any) => {
                Alert.alert('Error', err?.response?.data?.message || 'Failed to delete photo');
              },
            });
          }
        },
      ]
    );
  };

  const handleUpdate = async () => {
    if (!employeeId) return;

    // We'll use a simple flag to track if we should go back
    let navigateBackOnSuccess = true;

    // 1. If there's a pending image, upload it first or in parallel
    if (pendingImage) {
      navigateBackOnSuccess = false; // We'll handle navigation in the image upload callback
      uploadPhotoMutation.mutate(
        { employeeId, file: pendingImage },
        {
          onSuccess: () => {
             // After image upload is successful, update employee details
             updateEmployeeMutation.mutate(
              {
                id: employeeId,
                payload: {
                  firstname: formData.firstname,
                  lastname: formData.lastname,
                },
              },
              {
                onSuccess: () => {
                  showSuccess('Personal details updated');
                  navigation.goBack();
                },
                onError: (error: any) => {
                  Alert.alert('Error', error?.response?.data?.message || 'Failed to update details');
                },
              }
            );
          },
          onError: (err: any) => {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to upload photo');
          },
        }
      );
    }

    // 2. If no pending image, just update the names
    if (navigateBackOnSuccess) {
      updateEmployeeMutation.mutate(
        {
          id: employeeId,
          payload: {
            firstname: formData.firstname,
            lastname: formData.lastname,
          },
        },
        {
          onSuccess: () => {
            showSuccess('Personal details updated');
            navigation.goBack();
          },
          onError: (error: any) => {
            Alert.alert('Error', error?.response?.data?.message || 'Failed to update details');
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9F00" />
      </View>
    );
  }

  // Determine the profile image URL with multiple fallbacks
  const getProfileImageUrl = () => {
    // 0. Priority: If user just selected a new image locally
    if (pendingImage?.uri) return pendingImage.uri;

    // 1. Try to find the inner object where health/profile data usually lives
    const emp = employeeDetails?.data?.employee || employeeDetails?.data || employeeDetails?.employee || employeeDetails;
    
    if (!emp) return null;

    // 2. Try various keys the backend might use for the photo
    const pp = emp.profilePicture || emp.avatar || emp.image || emp.logo || emp.profilePhoto;
    
    if (!pp) return null;

    let finalUrl = '';

    // 3. Extract the URL string
    if (typeof pp === 'string') {
      finalUrl = pp;
    } else {
      // If it's an object (like from Cloudinary/Multer), look for the URL inside
      finalUrl = pp.secure_url || pp.url || pp.uri || pp.imagePath;
    }

    if (!finalUrl) return null;

    // 4. Debug log to see exactly what we found
    console.log('--- Profile Picture Debug ---');
    console.log('Original Value:', pp);
    console.log('Extracted Value:', finalUrl);

    // 5. Handle different types of URLs
    if (finalUrl.startsWith('http') || finalUrl.startsWith('data:')) {
      return finalUrl;
    }
  

    // 6. If it's a relative path, prepend the IMAGE_BASE_URL
    const normalizedPath = finalUrl.replace(/\\/g, '/');
    const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    const path = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    
    console.log('Final Constructed URL:', `${baseUrl}${path}`);
    return `${baseUrl}${path}`;
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* --- Header Section --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            (updateEmployeeMutation.isPending || uploadPhotoMutation.isPending) && styles.disabledButton
          ]} 
          onPress={handleUpdate}
          disabled={updateEmployeeMutation.isPending || uploadPhotoMutation.isPending}
        >
          {updateEmployeeMutation.isPending || uploadPhotoMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* --- Profile Avatar Section --- */}
        <View style={styles.avatarContainer}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={handleImagePick}
              style={styles.imageContainer}
            >
              <Image
                source={
                  profileImageUrl 
                    ? { uri: profileImageUrl } 
                    : { uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' } // Generic placeholder
                } 
                style={styles.avatar}
              />
              {uploadPhotoMutation.isPending && (
                <View style={[styles.avatar, styles.loadingOverlay]}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Icon name="camera-alt" size={16} color="#fff" />
              </View>
            </TouchableOpacity>

            {profileImageUrl && !uploadPhotoMutation.isPending && (
              <TouchableOpacity 
                style={styles.deleteIconContainer}
                onPress={handleImageDelete}
              >
                <Icon name="delete" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* --- Form Section --- */}
        
        {/* Row for First and Last Name */}
        <View style={styles.row}>
          <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.floatingLabel}>First Name</Text>
            <TextInput 
              style={styles.input} 
              value={formData.firstname} 
              onChangeText={(text) => setFormData({ ...formData, firstname: text })}
              editable={true}
            />
          </View>

          <View style={[styles.inputWrapper, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>Last Name</Text>
            <TextInput 
              style={styles.input} 
              value={formData.lastname} 
              onChangeText={(text) => setFormData({ ...formData, lastname: text })}
              editable={true}
            />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputWrapper}>
          <Text style={styles.floatingLabel}>Phone Number</Text>
          <TextInput 
            style={[styles.input, styles.disabledText]} 
            value={formData.phoneNumber} 
            editable={false} 
          />
        </View>

        {/* Pay Type */}
        <View style={styles.inputWrapper}>
          <Text style={styles.floatingLabel}>Pay Type</Text>
          <TextInput 
            style={[styles.input, styles.disabledText]} 
            value={formData.salaryType} 
            editable={false}
          />
        </View>

        {/* Monthly Salary */}
        <View style={styles.inputWrapper}>
          <Text style={styles.floatingLabel}>Monthly Salary</Text>
          <TextInput 
            style={[styles.input, styles.disabledText]} 
            value={formData.salary ? `₹ ${formData.salary}` : ''} 
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#FF9F00', 
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20, 
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
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
  imageContainer: {
    borderRadius: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  loadingOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff', 
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 0,
    right: -10,
    backgroundColor: '#FF3B30',
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#D1D5DB', 
    borderRadius: 8,
    marginBottom: 24, 
    paddingHorizontal: 12,
    paddingTop: 4, 
    height: 56, 
    justifyContent: 'center',
  },
  floatingLabel: {
    position: 'absolute',
    top: -10, 
    left: 10,
    backgroundColor: '#fff', 
    paddingHorizontal: 4,
    fontSize: 12,
    color: '#9CA3AF', 
  },
  input: {
    fontSize: 16,
    color: '#1F2937', 
    paddingVertical: 0, 
    height: '100%',
  },
  disabledText: {
    color: '#9CA3AF', 
  }
});

export default PersonalDetails;