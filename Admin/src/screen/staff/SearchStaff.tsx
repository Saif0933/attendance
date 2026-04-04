
import { useNavigation } from '@react-navigation/native';
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
import { useAuthStore } from '../../../../src/store/useAuthStore';
import { useTheme } from '../../../../src/theme/ThemeContext';

const IMAGE_BASE_URL = "http://192.168.1.5:5000";


interface SearchStaffProps {
  onClose?: () => void;
}

const SearchStaff: React.FC<SearchStaffProps> = ({ onClose }) => {
  const { colors, isDark } = useTheme();
  const { company } = useAuthStore();
  const companyId = company?.id;
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetAllEmployeesWithInfiniteQuery({ 
    search: searchText,
    limit: 20,
    companyId: companyId
  });

  const employees = data?.pages.flatMap(page => page.data.employees) || [];

  const renderItem = ({ item: emp }: { item: any }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => {
        onClose?.();
        navigation.navigate('EmployeeDetailsScreen', { employeeId: emp.id });
      }}
    >
      <View style={styles.avatarContainer}>
        {emp.profilePicture?.url ? (
          <Image 
            source={{ uri: `${IMAGE_BASE_URL}${emp.profilePicture.url}` }} 
            style={styles.avatarImage} 
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? colors.surface : '#E2E8F0' }]}>
             <Text style={[styles.avatarInitials, { color: colors.text }]}>
              {(emp.firstname || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.nameText, { color: colors.text }]}>{emp.firstname} {emp.lastname}</Text>
        <Text style={[styles.roleText, { color: colors.textSecondary }]}>
          {emp.designation || 'Staff'}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        {emp.attendances?.length > 0 ? (
          <View style={styles.statusInWrapper}>
            <Text style={[styles.statusInText, { color: isDark ? '#4ADE80' : '#16A34A' }]}>{emp.attendances[0].status}</Text>
            <Text style={[styles.timeText, { color: colors.text }]}>
               {emp.attendances[0].checkIn ? new Date(emp.attendances[0].checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </Text>
          </View>
        ) : (
          <View style={[styles.notMarkedBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.notMarkedText, { color: colors.textSecondary }]}>Not marked</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.backgroundLayer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
            style={{ marginRight: 8 }}
          />

          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search staff by name"
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={colors.textSecondary}
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
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : null
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No staff found</Text>
          ) : (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // UPDATED: Modern Dark Blue Background
  container: { flex: 1 }, 
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
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
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },

  listContent: { paddingHorizontal: 20 },
  emptyText: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  infoContainer: { flex: 1 },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleText: { fontSize: 14, fontWeight: '500' },

  statusContainer: { alignItems: 'flex-end', minWidth: 80 },
  statusInWrapper: { alignItems: 'flex-end' },
  statusInText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  timeText: { fontSize: 14, fontWeight: '500' },

  notMarkedBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  notMarkedText: {
    fontSize: 12,
    fontWeight: '600',
  },

  separator: {
    height: 1,
    marginLeft: 80,
  },
});

export default SearchStaff;