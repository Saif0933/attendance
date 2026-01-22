
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Types ---
interface Colleague {
  id: string;
  name: string;
  role: string;
  image: string; // URL or local require
  isFollowing: boolean;
}

// --- Mock Data ---
// In a real app, replace the URLs with actual image imports or remote URLs
const COLLEAGUES_DATA: Colleague[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    role: 'Product Designer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    isFollowing: false,
  },
  {
    id: '2',
    name: 'Mark Stevenson',
    role: 'Software Engineer',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    isFollowing: true,
  },
  {
    id: '3',
    name: 'Sarah Connor',
    role: 'Project Manager',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    isFollowing: false,
  },
  {
    id: '4',
    name: 'David Smith',
    role: 'Marketing Head',
    image: 'https://randomuser.me/api/portraits/men/85.jpg',
    isFollowing: false,
  },
];

const FILTERS = ['All', 'Active', 'Nearby', 'New'];

const { height } = Dimensions.get('window');

interface OthersProps {
  onClose?: () => void;
}

const Others: React.FC<OthersProps> = ({ onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  // --- Render Components ---

  const renderFilterItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedFilter;
    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          isSelected ? styles.filterChipSelected : styles.filterChipUnselected,
        ]}
        onPress={() => setSelectedFilter(item)}
      >
        <Text
          style={[
            styles.filterText,
            isSelected ? styles.filterTextSelected : styles.filterTextUnselected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderColleagueItem = ({ item }: { item: Colleague }) => (
    <View style={styles.cardItem}>
      {/* Profile Image */}
      <Image source={{ uri: item.image }} style={styles.avatar} />

      {/* Text Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.roleText}>{item.role}</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          item.isFollowing ? styles.btnFollowing : styles.btnFollow,
        ]}
      >
        <Text
          style={[
            styles.btnText,
            item.isFollowing ? styles.textFollowing : styles.textFollow,
          ]}
        >
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Handle Bar */}
      <View style={styles.handleBar} />

      {/* Header with Close Button */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Find Your Colleagues</Text>
        
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
        >
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderFilterItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Colleagues List */}
      <FlatList
        data={COLLEAGUES_DATA}
        renderItem={renderColleagueItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default Others;

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // Aligns modal to bottom
  },
  modalContent: {
    backgroundColor: 'white',
    height: height * 0.75, // Takes up 75% of screen
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700', // Using generic bold, use custom font if needed
    color: '#1A1A1A',
    fontFamily: 'System', // Looks 'handwritten' in the image, strictly generic here
  },
  closeButton: {
    padding: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  // Filter Styles
  filtersContainer: {
    height: 50,
    marginBottom: 10,
  },
  filtersList: {
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
  },
  filterChipSelected: {
    backgroundColor: '#FFD700', // The specific yellow from the image
    borderColor: '#FFD700',
  },
  filterChipUnselected: {
    backgroundColor: 'transparent',
    borderColor: '#E0E0E0',
  },
  filterText: {
    fontWeight: '600',
    fontSize: 15,
  },
  filterTextSelected: {
    color: '#000',
  },
  filterTextUnselected: {
    color: '#A0A0A0',
  },
  // List Item Styles
  listContent: {
    paddingBottom: 40,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System', // Use a handwriting font if available (e.g., 'Comic Sans MS' on iOS)
  },
  roleText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  // Button Styles
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFollow: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#000',
  },
  btnFollowing: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  btnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  textFollow: {
    color: '#fff',
  },
  textFollowing: {
    color: '#000',
  },
});