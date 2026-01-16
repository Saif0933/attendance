import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 1. Define the structure of your data object
interface ShiftData {
  id: string;
  name: string;
  time: string;
}

const App = () => {
  const navigation = useNavigation();
  
  // 2. Apply the interface to useState
  const [shifts, setShifts] = useState<ShiftData[]>([
    { id: '1', name: 'Day Shift', time: '9:00 AM - 5:00 PM' },
  ]);

  // Refresh Control State
  const [refreshing, setRefreshing] = useState(false);

  // Refresh Logic
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Header Component
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Bar: Back Button and Title */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Company Shifts</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Column Headers */}
      <View style={styles.columnHeaderContainer}>
        <View style={styles.columnLeft}>
          <Text style={styles.columnTitle}>Shift Name</Text>
        </View>
        
        <View style={styles.verticalSeparator} />

        <View style={styles.columnRight}>
          <Text style={styles.columnTitle}>Shift Timings</Text>
          <Icon name="access-time" size={16} color="#FFFFFF" style={styles.clockIcon} />
        </View>
      </View>
    </View>
  );

  // 3. Explicitly type the renderItem function using ListRenderItem
  const renderItem: ListRenderItem<ShiftData> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTextLeft}>{item.name}</Text>
      <Text style={styles.itemTextRight}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {renderHeader()}

      <FlatList
        data={shifts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF914D']}
            tintColor="#FF914D"
          />
        }
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => navigation.navigate('AddShift' as never)}>
        <Icon name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    backgroundColor: '#111111',
    paddingBottom: 15,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  columnHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  columnLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  columnRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  columnTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  clockIcon: {
    marginLeft: 5,
    marginTop: 1,
  },
  verticalSeparator: {
    width: 1.5,
    height: 20,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
    marginHorizontal: 10,
  },
  listContent: {
    paddingTop: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemTextLeft: {
    fontSize: 15,
    color: '#222222',
    fontWeight: '400',
  },
  itemTextRight: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '400',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: '#FF914D',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default App;