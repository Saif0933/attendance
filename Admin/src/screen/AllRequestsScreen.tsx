// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   StatusBar,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const AllRequestsScreen = () => {
//   const [activeTab, setActiveTab] = useState('All');

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
//       {/* Background Layer (Dark Olive/Brown Theme) */}
//       <View style={styles.backgroundLayer} />

//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* --- Header --- */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>All Requests.</Text>
//           <TouchableOpacity>
//             <Icon name="refresh" size={24} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* --- Statistics Card --- */}
//         <View style={styles.statsCard}>
//           <View style={styles.statsRow}>
//             <StatItem label="Total" count="0" color="#29B6F6" />
//             <StatItem label="Pending" count="0" color="#FFCA28" />
//             <StatItem label="Approved" count="0" color="#66BB6A" />
//             <StatItem label="Rejected" count="0" color="#FF7043" />
//           </View>
//         </View>

//         {/* --- Search Bar --- */}
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#fff" style={styles.searchIcon} />
//           <TextInput
//             placeholder="Search by name, reason or type..."
//             placeholderTextColor="#ccc"
//             style={styles.searchInput}
//           />
//         </View>

//         {/* --- Filter Tabs --- */}
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false} 
//           style={styles.tabsContainer}
//         >
//           <FilterTab label="All" active={activeTab === 'All'} onPress={() => setActiveTab('All')} />
//           <FilterTab label="Pending" active={activeTab === 'Pending'} onPress={() => setActiveTab('Pending')} />
//           <FilterTab label="Approved" active={activeTab === 'Approved'} onPress={() => setActiveTab('Approved')} />
//           <FilterTab label="Rejected" active={activeTab === 'Rejected'} onPress={() => setActiveTab('Rejected')} />
//         </ScrollView>

//         {/* --- Leave Requests Section --- */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Leave Requests</Text>
//           <Text style={styles.resultsCount}>0 results</Text>
//         </View>

//         {/* --- Empty State --- */}
//         <View style={styles.emptyStateContainer}>
//           <Text style={styles.emptyStateText}>No requests found</Text>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // --- Reusable Components ---

// const StatItem = ({ label, count, color }: { label: string, count: string, color: string }) => (
//   <View style={styles.statItem}>
//     <View style={styles.statLabelRow}>
//       <View style={[styles.dot, { backgroundColor: color }]} />
//       <Text style={[styles.statLabel, { color: color }]}>{label}</Text>
//     </View>
//     <Text style={styles.statCount}>{count}</Text>
//     <Text style={styles.statSubText}>requests</Text>
//   </View>
// );

// const FilterTab = ({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) => (
//   <TouchableOpacity 
//     style={[styles.tab, active ? styles.activeTab : styles.inactiveTab]} 
//     onPress={onPress}
//   >
//     <Text style={[styles.tabText, active ? styles.activeTabText : styles.inactiveTabText]}>
//       {label}
//     </Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#383018', // Base Dark Olive Color
//   },
//   backgroundLayer: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.3)', // Overlay for depth
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingTop: 50, // Space for StatusBar
//   },

//   // --- Header ---
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },

//   // --- Stats Card ---
//   statsCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassmorphism effect
//     borderRadius: 16,
//     paddingVertical: 20,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statLabelRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   dot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     marginRight: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   statCount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 2,
//   },
//   statSubText: {
//     fontSize: 10,
//     color: '#ccc',
//   },

//   // --- Search Bar ---
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     height: 50,
//     marginBottom: 20,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#fff',
//     fontSize: 15,
//   },

//   // --- Filter Tabs ---
//   tabsContainer: {
//     flexDirection: 'row',
//     marginBottom: 25,
//   },
//   tab: {
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginRight: 10,
//     borderWidth: 1,
//   },
//   activeTab: {
//     backgroundColor: '#fff',
//     borderColor: '#fff',
//   },
//   inactiveTab: {
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderColor: 'rgba(255,255,255,0.1)',
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   activeTabText: {
//     color: '#000',
//   },
//   inactiveTabText: {
//     color: '#fff',
//   },

//   // --- Section Header ---
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   resultsCount: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: '600',
//   },

//   // --- Empty State ---
//   emptyStateContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default AllRequestsScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AllRequestsScreen = () => {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background Layer (Slate Dark Theme) */}
      <View style={styles.backgroundLayer} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- Header --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Requests.</Text>
          <TouchableOpacity>
            <Icon name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* --- Statistics Card --- */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <StatItem label="Total" count="0" color="#29B6F6" />
            <StatItem label="Pending" count="0" color="#FFCA28" />
            <StatItem label="Approved" count="0" color="#66BB6A" />
            <StatItem label="Rejected" count="0" color="#FF7043" />
          </View>
        </View>

        {/* --- Search Bar --- */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            placeholder="Search by name, reason or type..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        {/* --- Filter Tabs --- */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabsContainer}
        >
          <FilterTab label="All" active={activeTab === 'All'} onPress={() => setActiveTab('All')} />
          <FilterTab label="Pending" active={activeTab === 'Pending'} onPress={() => setActiveTab('Pending')} />
          <FilterTab label="Approved" active={activeTab === 'Approved'} onPress={() => setActiveTab('Approved')} />
          <FilterTab label="Rejected" active={activeTab === 'Rejected'} onPress={() => setActiveTab('Rejected')} />
        </ScrollView>

        {/* --- Leave Requests Section --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Leave Requests</Text>
          <Text style={styles.resultsCount}>0 results</Text>
        </View>

        {/* --- Empty State --- */}
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No requests found</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Reusable Components ---

const StatItem = ({ label, count, color }: { label: string, count: string, color: string }) => (
  <View style={styles.statItem}>
    <View style={styles.statLabelRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.statLabel, { color: color }]}>{label}</Text>
    </View>
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statSubText}>requests</Text>
  </View>
);

const FilterTab = ({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    style={[styles.tab, active ? styles.activeTab : styles.inactiveTab]} 
    onPress={onPress}
  >
    <Text style={[styles.tabText, active ? styles.activeTabText : styles.inactiveTabText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50, // Space for StatusBar
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  // --- Stats Card ---
  statsCard: {
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  statSubText: {
    fontSize: 10,
    color: '#94A3B8', // Slate 400
  },

  // --- Search Bar ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },

  // --- Filter Tabs ---
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
  },
  activeTab: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  inactiveTab: {
    backgroundColor: '#1E293B', // Slate 800
    borderColor: '#334155', // Slate 700
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0F172A', // Dark Slate Text
  },
  inactiveTabText: {
    color: '#94A3B8', // Slate 400
  },

  // --- Section Header ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultsCount: {
    fontSize: 12,
    color: '#94A3B8', // Slate 400
    fontWeight: '600',
  },

  // --- Empty State ---
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94A3B8', // Slate 400
    fontWeight: 'bold',
  },
});

export default AllRequestsScreen;