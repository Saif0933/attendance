
// import React from 'react';
// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// // Mock Data matching the screenshot exactly
// const ABSENT_DATA = [
//   {
//     id: '1',
//     name: 'Puja Staff',
//     role: 'Category Manager',
//     roleColor: '#FFC107',
//     status: 'Not marked',
//     avatar: 'P',
//     isImage: false,
//   },
//   {
//     id: '2',
//     name: 'Roshni Parween',
//     role: 'Employee',
//     roleColor: '#fff',
//     status: 'Not marked',
//     avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
//     isImage: true,
//   },
// ];

// interface TodaysAbsentScreenProps {
//   onClose?: () => void;
// }

// const TodaysAbsentScreen: React.FC<TodaysAbsentScreenProps> = ({ onClose }) => {

//   const renderItem = ({ item }: { item: any }) => (
//     <View style={styles.itemContainer}>
//       {/* Avatar */}
//       <View style={styles.avatarContainer}>
//         {item.isImage ? (
//           <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarInitials}>{item.avatar}</Text>
//           </View>
//         )}
//       </View>

//       {/* Name & Role */}
//       <View style={styles.infoContainer}>
//         <Text style={styles.nameText}>{item.name}</Text>
//         <Text style={[styles.roleText, { color: item.roleColor }]}>
//           {item.role}
//         </Text>
//       </View>

//       {/* Status Badge */}
//       <View style={styles.statusContainer}>
//         <View style={styles.notMarkedBadge}>
//           <Text style={styles.notMarkedText}>{item.status}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

//       {/* Background Layer */}
//       <View style={styles.backgroundLayer} />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={onClose}>
//           <Ionicons name="arrow-back-outline" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Today's Absent</Text>
//       </View>

//       {/* List */}
//       <FlatList
//         data={ABSENT_DATA}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.listContent}
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#383018',
//   },
//   backgroundLayer: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 50,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   backButton: {
//     marginRight: 15,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },

//   listContent: {
//     paddingHorizontal: 20,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//   },

//   avatarContainer: {
//     marginRight: 15,
//   },
//   avatarImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },
//   avatarPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#607D8B',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarInitials: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },

//   infoContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   nameText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   roleText: {
//     fontSize: 14,
//     fontWeight: '500',
//   },

//   statusContainer: {
//     alignItems: 'flex-end',
//   },
//   notMarkedBadge: {
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   notMarkedText: {
//     color: '#E0E0E0',
//     fontSize: 12,
//     fontWeight: '600',
//   },

//   separator: {
//     height: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//     marginLeft: 80,
//   },
// });

// export default TodaysAbsentScreen;


import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock Data matching the screenshot exactly
const ABSENT_DATA = [
  {
    id: '1',
    name: 'Puja Staff',
    role: 'Category Manager',
    roleColor: '#FBBF24', // Adjusted yellow for better visibility on dark bg
    status: 'Not marked',
    avatar: 'P',
    isImage: false,
  },
  {
    id: '2',
    name: 'Roshni Parween',
    role: 'Employee',
    roleColor: '#fff',
    status: 'Not marked',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isImage: true,
  },
];

interface TodaysAbsentScreenProps {
  onClose?: () => void;
}

const TodaysAbsentScreen: React.FC<TodaysAbsentScreenProps> = ({ onClose }) => {

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {item.isImage ? (
          <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{item.avatar}</Text>
          </View>
        )}
      </View>

      {/* Name & Role */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={[styles.roleText, { color: item.roleColor }]}>
          {item.role}
        </Text>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <View style={styles.notMarkedBadge}>
          <Text style={styles.notMarkedText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background Layer */}
      <View style={styles.backgroundLayer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today's Absent</Text>
      </View>

      {/* List */}
      <FlatList
        data={ABSENT_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // UPDATED: Modern Dark Blue Background
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E293B', // Slate 800
    opacity: 0.5,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  listContent: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },

  avatarContainer: {
    marginRight: 15,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155', // Slate 700
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
  },

  statusContainer: {
    alignItems: 'flex-end',
  },
  notMarkedBadge: {
    backgroundColor: '#334155', // Slate 700
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  notMarkedText: {
    color: '#CBD5E1', // Slate 300
    fontSize: 12,
    fontWeight: '600',
  },

  separator: {
    height: 1,
    backgroundColor: '#334155', // Slate 700
    marginLeft: 80,
  },
});

export default TodaysAbsentScreen;