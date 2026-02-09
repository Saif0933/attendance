

// import React, { useState } from 'react';
// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// interface StaffMember {
//   id: string;
//   name: string;
//   role: string;
//   roleColor?: string;
//   status: 'IN' | 'Not marked';
//   time?: string;
//   avatar: string;
//   isImage: boolean;
// }

// const STAFF_DATA: StaffMember[] = [
//   {
//     id: '1',
//     name: 'Md. Saif',
//     role: 'Employee',
//     status: 'IN',
//     time: '9:11 AM',
//     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     isImage: true,
//   },
//   {
//     id: '2',
//     name: 'Puja Staff',
//     role: 'Category Manager',
//     roleColor: '#FFC107',
//     status: 'Not marked',
//     avatar: 'P',
//     isImage: false,
//   },
//   {
//     id: '3',
//     name: 'Roshni Parween',
//     role: 'Employee',
//     status: 'Not marked',
//     avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
//     isImage: true,
//   },
// ];

// interface SearchStaffProps {
//   onClose?: () => void;
// }

// const SearchStaff: React.FC<SearchStaffProps> = ({ onClose }) => {
//   const [searchText, setSearchText] = useState('');

//   const filteredData = STAFF_DATA.filter(item =>
//     item.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const renderItem = ({ item }: { item: StaffMember }) => (
//     <View style={styles.itemContainer}>
//       <View style={styles.avatarContainer}>
//         {item.isImage ? (
//           <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarInitials}>{item.avatar}</Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.infoContainer}>
//         <Text style={styles.nameText}>{item.name}</Text>
//         <Text
//           style={[
//             styles.roleText,
//             item.roleColor ? { color: item.roleColor } : null,
//           ]}
//         >
//           {item.role}
//         </Text>
//       </View>

//       <View style={styles.statusContainer}>
//         {item.status === 'IN' ? (
//           <View style={styles.statusInWrapper}>
//             <Text style={styles.statusInText}>IN</Text>
//             <Text style={styles.timeText}>{item.time}</Text>
//           </View>
//         ) : (
//           <View style={styles.notMarkedBadge}>
//             <Text style={styles.notMarkedText}>Not marked</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
//       <View style={styles.backgroundLayer} />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={onClose}>
//           <Ionicons name="arrow-back-outline" size={24} color="#fff" />
//         </TouchableOpacity>

//         <View style={styles.searchContainer}>
//           <Ionicons
//             name="search-outline"
//             size={20}
//             color="#ccc"
//             style={{ marginRight: 8 }}
//           />

//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search staff by name"
//             placeholderTextColor="#aaa"
//             value={searchText}
//             onChangeText={setSearchText}
//             autoFocus
//           />

//           {searchText.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchText('')}>
//               <Ionicons
//                 name="close-circle-outline"
//                 size={20}
//                 color="#ccc"
//               />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       <FlatList
//         data={filteredData}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.listContent}
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No staff found</Text>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#383018' },
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
//   backButton: { marginRight: 15 },

//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 45,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#fff',
//     fontSize: 16,
//     paddingVertical: 0,
//   },

//   listContent: { paddingHorizontal: 20 },
//   emptyText: {
//     color: '#ccc',
//     textAlign: 'center',
//     marginTop: 50,
//     fontSize: 16,
//   },

//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//   },
//   avatarContainer: { marginRight: 15 },
//   avatarImage: { width: 48, height: 48, borderRadius: 24 },
//   avatarPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarInitials: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#555',
//   },

//   infoContainer: { flex: 1 },
//   nameText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   roleText: { fontSize: 14, color: '#ccc', fontWeight: '500' },

//   statusContainer: { alignItems: 'flex-end', minWidth: 80 },
//   statusInWrapper: { alignItems: 'flex-end' },
//   statusInText: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//     fontSize: 14,
//     marginBottom: 2,
//   },
//   timeText: { color: '#fff', fontSize: 14, fontWeight: '500' },

//   notMarkedBadge: {
//     backgroundColor: 'rgba(255,255,255,0.15)',
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
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     marginLeft: 80,
//   },
// });

// export default SearchStaff;


import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetAllEmployeesWithInfiniteQuery } from '../../../../src/employee/hook/useEmployee';

const IMAGE_BASE_URL = "http://192.168.1.10:5000";


interface SearchStaffProps {
  onClose?: () => void;
}

const SearchStaff: React.FC<SearchStaffProps> = ({ onClose }) => {
  const [searchText, setSearchText] = useState('');

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetAllEmployeesWithInfiniteQuery({ 
    search: searchText,
    limit: 20
  });

  const employees = data?.pages.flatMap(page => page.data.employees) || [];

  const renderItem = ({ item: emp }: { item: any }) => (
    <View style={styles.itemContainer}>
      <View style={styles.avatarContainer}>
        {emp.profilePicture?.url ? (
          <Image 
            source={{ uri: `${IMAGE_BASE_URL}${emp.profilePicture.url}` }} 
            style={styles.avatarImage} 
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
             <Text style={styles.avatarInitials}>
              {emp.firstname.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{emp.firstname} {emp.lastname}</Text>
        <Text style={styles.roleText}>
          {emp.designation || 'Staff'}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        {emp.attendances?.length > 0 ? (
          <View style={styles.statusInWrapper}>
            <Text style={styles.statusInText}>{emp.attendances[0].status}</Text>
            <Text style={styles.timeText}>
               {emp.attendances[0].checkIn ? new Date(emp.attendances[0].checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </Text>
          </View>
        ) : (
          <View style={styles.notMarkedBadge}>
            <Text style={styles.notMarkedText}>Not marked</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.backgroundLayer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#94A3B8"
            style={{ marginRight: 8 }}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search staff by name"
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={employees}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#3B82F6" style={{ marginVertical: 20 }} />
          ) : null
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>No staff found</Text>
          ) : (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} />
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // UPDATED: Modern Dark Blue Background
  container: { flex: 1, backgroundColor: '#0F172A' }, // Slate 900
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
  backButton: { marginRight: 15 },

  // UPDATED: Search Bar to match input style of other screens
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 0,
  },

  listContent: { paddingHorizontal: 20 },
  emptyText: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: { marginRight: 15 },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
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

  infoContainer: { flex: 1 },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  roleText: { fontSize: 14, color: '#94A3B8', fontWeight: '500' }, // Slate 400

  statusContainer: { alignItems: 'flex-end', minWidth: 80 },
  statusInWrapper: { alignItems: 'flex-end' },
  statusInText: {
    color: '#4ADE80', // Green 400
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  timeText: { color: '#E2E8F0', fontSize: 14, fontWeight: '500' },

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

export default SearchStaff;