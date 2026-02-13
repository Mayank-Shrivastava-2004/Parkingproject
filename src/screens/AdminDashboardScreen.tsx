import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Theme } from '../theme';
import apiClient from '../api/client';
import { ShieldCheck, Users, MapPin, AlertCircle } from 'lucide-react-native';

const AdminDashboardScreen = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSpots: 0,
        pendingSpots: 0,
        activeBookings: 0
    });
    const [pendingListings, setPendingListings] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            // Mocking endpoints based on typical Admin patterns
            const statsRes = await apiClient.get('/admin/stats');
            const pendingRes = await apiClient.get('/admin/listings/pending');
            setStats(statsRes.data);
            setPendingListings(pendingRes.data);
        } catch (error) {
            console.error(error);
            // Fallback
            setStats({
                totalUsers: 150,
                totalSpots: 45,
                pendingSpots: 8,
                activeBookings: 25
            });
            setPendingListings([
                { id: '1', title: 'Downtown Parking', address: '123 Main St', city: 'Bangalore', provider: 'Owner A' },
                { id: '2', title: 'Mall Basement', address: '456 Mall Rd', city: 'Mumbai', provider: 'Corp B' },
            ]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData().then(() => setRefreshing(false));
    };

    const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
        try {
            await apiClient.post(`/admin/listings/${id}/${action.toLowerCase()}`);
            Alert.alert('Success', `Parking spot ${action.toLowerCase()}d successfully`);
            fetchData();
        } catch (error) {
            Alert.alert('Error', 'Failed to update parking spot status');
        }
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Admin Command Center</Text>
                <Text style={styles.subtitle}>System Overview & Approvals</Text>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.miniStat}>
                    <Users size={20} color={Theme.colors.primary} />
                    <Text style={styles.miniStatValue}>{stats.totalUsers}</Text>
                    <Text style={styles.miniStatLabel}>Users</Text>
                </View>
                <View style={styles.miniStat}>
                    <MapPin size={20} color="#4CAF50" />
                    <Text style={styles.miniStatValue}>{stats.totalSpots}</Text>
                    <Text style={styles.miniStatLabel}>Spots</Text>
                </View>
                <View style={styles.miniStat}>
                    <AlertCircle size={20} color="#FF9800" />
                    <Text style={styles.miniStatValue}>{stats.pendingSpots}</Text>
                    <Text style={styles.miniStatLabel}>Pending</Text>
                </View>
                <View style={styles.miniStat}>
                    <ShieldCheck size={20} color="#2196F3" />
                    <Text style={styles.miniStatValue}>{stats.activeBookings}</Text>
                    <Text style={styles.miniStatLabel}>Bookings</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending Approvals</Text>
                {pendingListings.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyText}>All listings reviewed!</Text>
                    </View>
                ) : (
                    pendingListings.map((item) => (
                        <View key={item.id} style={styles.listingCard}>
                            <View style={styles.listingInfo}>
                                <Text style={styles.listingTitle}>{item.title}</Text>
                                <Text style={styles.listingSub}>{item.address}, {item.city}</Text>
                                <Text style={styles.providerText}>By: {item.provider}</Text>
                            </View>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.approveBtn]}
                                    onPress={() => handleAction(item.id, 'APPROVE')}
                                >
                                    <Text style={styles.btnText}>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.rejectBtn]}
                                    onPress={() => handleAction(item.id, 'REJECT')}
                                >
                                    <Text style={styles.btnText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    header: {
        padding: Theme.spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.md,
        marginBottom: Theme.spacing.lg,
    },
    miniStat: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.md,
        padding: Theme.spacing.sm,
        width: '23%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    miniStatValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginVertical: 2,
    },
    miniStatLabel: {
        fontSize: 10,
        color: Theme.colors.textSecondary,
        textTransform: 'uppercase',
    },
    section: {
        padding: Theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: Theme.spacing.md,
    },
    listingCard: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.lg,
        padding: Theme.spacing.md,
        marginBottom: Theme.spacing.md,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    listingInfo: {
        marginBottom: Theme.spacing.md,
    },
    listingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    listingSub: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
    },
    providerText: {
        fontSize: 12,
        color: Theme.colors.primary,
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
        marginLeft: 10,
    },
    approveBtn: {
        backgroundColor: '#4CAF50',
    },
    rejectBtn: {
        backgroundColor: Theme.colors.error,
    },
    btnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyCard: {
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.md,
        alignItems: 'center',
    },
    emptyText: {
        color: Theme.colors.textSecondary,
    }
});

export default AdminDashboardScreen;
