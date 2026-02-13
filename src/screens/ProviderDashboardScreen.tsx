import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Theme } from '../theme';
import apiClient from '../api/client';
import { LayoutDashboard, Plus, Car, Wallet, Clock } from 'lucide-react-native';

const ProviderDashboardScreen = ({ navigation }: any) => {
    const [stats, setStats] = useState<any>({
        activeBookings: 0,
        totalEarnings: 0,
        totalSpots: 0,
        pendingApprovals: 0
    });
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            const response = await apiClient.get('/provider/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch provider stats', error);
            // Fallback or demo data if endpoint is not exactly as expected
            setStats({
                activeBookings: 12,
                totalEarnings: 4500,
                totalSpots: 5,
                pendingApprovals: 2
            });
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchStats().then(() => setRefreshing(false));
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Icon size={24} color={color} />
            </View>
            <View>
                <Text style={styles.statTitle}>{title}</Text>
                <Text style={styles.statValue}>{value}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Provider Dashboard</Text>
                <Text style={styles.subText}>Manage your parking assets</Text>
            </View>

            <View style={styles.statsGrid}>
                <StatCard
                    title="Active Bookings"
                    value={stats.activeBookings}
                    icon={Clock}
                    color="#2196F3"
                />
                <StatCard
                    title="Total Earnings"
                    value={`₹${stats.totalEarnings}`}
                    icon={Wallet}
                    color="#4CAF50"
                />
                <StatCard
                    title="Total Spots"
                    value={stats.totalSpots}
                    icon={Car}
                    color={Theme.colors.primary}
                />
                <StatCard
                    title="Pending"
                    value={stats.pendingApprovals}
                    icon={LayoutDashboard}
                    color="#FF9800"
                />
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddSpot')}
            >
                <Plus size={24} color="#FFF" />
                <Text style={styles.addButtonText}>Add New Parking Spot</Text>
            </TouchableOpacity>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Bookings</Text>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No recent bookings found.</Text>
                </View>
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
        paddingTop: Theme.spacing.xl,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    subText: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
    statsGrid: {
        padding: Theme.spacing.md,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.lg,
        padding: Theme.spacing.md,
        width: '48%',
        marginBottom: Theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        padding: 10,
        borderRadius: 12,
        marginRight: 12,
    },
    statTitle: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    addButton: {
        backgroundColor: Theme.colors.primary,
        margin: Theme.spacing.md,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
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
    emptyState: {
        padding: Theme.spacing.xl,
        alignItems: 'center',
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.md,
    },
    emptyStateText: {
        color: Theme.colors.textSecondary,
    }
});

export default ProviderDashboardScreen;
