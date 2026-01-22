
// import React, { useState } from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// interface NewCategoryScreenProps {
//   onClose?: () => void;
// }

// const NewCategoryScreen = ({ onClose }: NewCategoryScreenProps) => {
//   const [categoryName, setCategoryName] = useState('');

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//           <Ionicons name="close-outline" size={28} color="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>New Category</Text>

//         <TouchableOpacity onPress={onClose}>
//           <Text style={styles.doneText}>Done</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* Section 1: Category Name */}
//         <View style={styles.section}>
//           <Text style={styles.label}>Category name</Text>

//           <View style={styles.glassInputContainer}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Examples: Sales, Marketing, Development..."
//               placeholderTextColor="#ccc"
//               value={categoryName}
//               onChangeText={setCategoryName}
//             />
//           </View>

//           <Text style={styles.helperText}>
//             Categories help you organize and manage different groups of employees.
//           </Text>
//         </View>

//         {/* Section 2: Add Employees */}
//         <View style={styles.section}>
//           <Text style={styles.label}>Add Employees</Text>

//           <TouchableOpacity style={styles.glassButton}>
//             <View style={styles.iconCircle}>
//               <Ionicons name="person-add-outline" size={24} color="#fff" />
//             </View>
//             <Text style={styles.buttonText}>Add employees to category</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Section 3: Add Managers */}
//         <View style={styles.section}>
//           <Text style={styles.label}>Add Managers</Text>

//           <TouchableOpacity style={styles.glassButton}>
//             <View style={styles.iconCircle}>
//               <Ionicons name="person-add-outline" size={24} color="#fff" />
//             </View>
//             <Text style={styles.buttonText}>Add managers to category</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#383018',
//     paddingTop: 15,
//     paddingBottom: 20,
//   },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.1)',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   doneText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//   },

//   scrollContent: {
//     paddingHorizontal: 20,
//   },
//   section: {
//     marginBottom: 30,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 12,
//   },

//   glassInputContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     paddingVertical: 4,
//     height: 55,
//     justifyContent: 'center',
//   },
//   textInput: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   helperText: {
//     marginTop: 10,
//     color: '#E0E0E0',
//     fontSize: 13,
//     lineHeight: 18,
//   },

//   glassButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 12,
//     height: 60,
//     paddingHorizontal: 15,
//   },
//   iconCircle: {
//     marginRight: 15,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
// });

// export default NewCategoryScreen;


import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface NewCategoryScreenProps {
  onClose?: () => void;
}

const NewCategoryScreen = ({ onClose }: NewCategoryScreenProps) => {
  const [categoryName, setCategoryName] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New Category</Text>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Section 1: Category Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Category name</Text>

          <View style={styles.glassInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Examples: Sales, Marketing, Development..."
              placeholderTextColor="#94A3B8" // Slightly lighter placeholder for better contrast
              value={categoryName}
              onChangeText={setCategoryName}
            />
          </View>

          <Text style={styles.helperText}>
            Categories help you organize and manage different groups of employees.
          </Text>
        </View>

        {/* Section 2: Add Employees */}
        <View style={styles.section}>
          <Text style={styles.label}>Add Employees</Text>

          <TouchableOpacity style={styles.glassButton}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add-outline" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.buttonText}>Add employees to category</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Add Managers */}
        <View style={styles.section}>
          <Text style={styles.label}>Add Managers</Text>

          <TouchableOpacity style={styles.glassButton}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add-outline" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.buttonText}>Add managers to category</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // UPDATED: Modern Dark Blue Background
  container: {
    backgroundColor: '#0F172A', // Slate 900
    paddingTop: 15,
    paddingBottom: 20,
    flex: 1, // Ensure it takes full height if in a modal
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Slate 700
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6', // Blue accent for 'Done'
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },

  // UPDATED: Glassmorphism effect optimized for dark slate bg
  glassInputContainer: {
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4,
    height: 55,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155', // Subtle border
  },
  textInput: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  helperText: {
    marginTop: 10,
    color: '#94A3B8', // Slate 400
    fontSize: 13,
    lineHeight: 18,
  },

  glassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 12,
    height: 60,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconCircle: {
    marginRight: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default NewCategoryScreen;