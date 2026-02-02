import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useDeleteShift, useGetAllShifts } from '../../api/hook/company/shift/useShift';
import { Shift } from '../../api/hook/type/shift';

const CompanyShifts = () => {
  const navigation = useNavigation();
  
  // Backend Hooks
  const { data: shiftsResponse, isLoading, refetch } = useGetAllShifts();
  const { mutate: deleteShift } = useDeleteShift();

  const shifts = shiftsResponse?.data || [];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Shift",
      "Are you sure you want to delete this shift?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteShift(id, {
              onSuccess: (res) => {
                Alert.alert("Success", res.message || "Shift deleted successfully");
              },
              onError: (err: any) => {
                Alert.alert("Error", err?.response?.data?.message || "Failed to delete shift");
              }
            });
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Company Shifts</Text>
        <View style={{ width: 24 }} /> 
      </View>

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

  const renderItem: ListRenderItem<Shift> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemTextLeft}>{item.name}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemTextRight}>{item.startTime} - {item.endTime}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => (navigation.navigate as any)('AddShift', { shift: item })}
            style={styles.actionIcon}
          >
            <Icon name="edit" size={20} color="#FF914D" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDelete(item.id)}
            style={styles.actionIcon}
          >
            <Icon name="delete" size={20} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {renderHeader()}

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF914D" />
        </View>
      ) : (
        <FlatList
          data={shifts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No shifts found</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF914D']}
              tintColor="#FF914D"
            />
          }
        />
      )}

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  itemLeft: {
    flex: 1,
  },
  itemRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionIcon: {
    padding: 5,
    marginLeft: 5,
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

export default CompanyShifts;