import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../theme';
import apiClient from '../api/client';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'DRIVER' | 'PROVIDER' | 'ADMIN'>('DRIVER');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password
            });

            const { token, id, name, email: userEmail, role } = response.data;

            // Verification: Check if the logged in user's role matches the selected tab?
            // Or just redirect. Let's redirect based on actual role from backend.
            await signIn(token, { id, name, email: userEmail, role });

        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            Alert.alert('Login Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>ParkEase</Text>
                    <Text style={styles.subtitle}>Smart Parking Finder</Text>
                </View>

                <View style={styles.tabContainer}>
                    {(['DRIVER', 'PROVIDER', 'ADMIN'] as const).map((role) => (
                        <TouchableOpacity
                            key={role}
                            style={[styles.tab, activeTab === role && styles.activeTab]}
                            onPress={() => setActiveTab(role)}
                        >
                            <Text style={[styles.tabText, activeTab === role && styles.activeTabText]}>
                                {role.charAt(0) + role.slice(1).toLowerCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="example@mail.com"
                        placeholderTextColor={Theme.colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={Theme.colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.signupText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Theme.spacing.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: Theme.spacing.xl,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.md,
        marginBottom: Theme.spacing.lg,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: Theme.borderRadius.sm,
    },
    activeTab: {
        backgroundColor: Theme.colors.primary,
    },
    tabText: {
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: Theme.colors.text,
    },
    form: {
        width: '100%',
    },
    label: {
        color: Theme.colors.text,
        marginBottom: Theme.spacing.xs,
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.md,
        padding: Theme.spacing.md,
        color: Theme.colors.text,
        marginBottom: Theme.spacing.md,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    loginButton: {
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.borderRadius.md,
        padding: Theme.spacing.md,
        alignItems: 'center',
        marginTop: Theme.spacing.sm,
    },
    loginButtonText: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Theme.spacing.xl,
    },
    footerText: {
        color: Theme.colors.textSecondary,
    },
    signupText: {
        color: Theme.colors.primary,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
