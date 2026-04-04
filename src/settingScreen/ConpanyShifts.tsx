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
import { useTheme } from '../theme/ThemeContext';

interface Shift {
    id: string;
    shiftName: string;
    startTime: string;
    endTime: string;
}

const CompanyShifts = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    // Queries & Mutations
    const { data: shiftsData, isLoading, refetch } = useGetAllShifts();
    const deleteShiftMutation = useDeleteShift();

    const shifts: Shift[] = shiftsData?.data || [];

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
                        deleteShiftMutation.mutate(id, {
                            onSuccess: () => refetch(),
                        });
                    } 
                }
            ]
        );
    };

    const renderShiftItem: ListRenderItem<Shift> = ({ item }) => (
        <View style={[styles.shiftItem, { borderBottomColor: colors.border }]}>
            <View style={styles.shiftInfo}>
                <Text style={[styles.shiftName, { color: colors.text }]}>{item.shiftName || (item as any).name}</Text>
                <Text style={[styles.shiftTime, { color: colors.textSecondary }]}>
                    {item.startTime} - {item.endTime}
                </Text>
            </View>
            <View style={styles.actionGroup}>
                <TouchableOpacity 
                    onPress={() => (navigation.navigate as any)("AddShift", { shift: item })}
                    style={styles.iconBtn}
                >
                    <Icon name="edit" size={22} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => handleDelete(item.id)}
                    style={styles.iconBtn}
                >
                    <Icon name="delete-outline" size={22} color="#F87171" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            
            {/* Standard Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Company Shifts</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {isLoading && !refreshing ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={shifts}
                        keyExtractor={(item) => item.id}
                        renderItem={renderShiftItem}
                        contentContainerStyle={styles.list}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                        }
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Text style={{ color: colors.textSecondary }}>No shifts found</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity 
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => (navigation.navigate as any)("AddShift")}
            >
                <Icon name="add" size={32} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        marginRight: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    shiftItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
    },
    shiftInfo: {
        flex: 1,
    },
    shiftName: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    shiftTime: {
        fontSize: 14,
    },
    actionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        padding: 8,
        marginLeft: 10,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    empty: {
        alignItems: 'center',
        marginTop: 50,
    }
});

export default CompanyShifts;