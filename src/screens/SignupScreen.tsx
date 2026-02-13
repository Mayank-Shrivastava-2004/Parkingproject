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

const SignupScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'USER' | 'PROVIDER'>('USER'); // Map DRIVER to USER for backend
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleSignup = async () => {
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            // Backend SignupRequest structure: { name, email, password, role }
            // Phone is not in the SignupRequest but we can try to send it or update later
            const response = await apiClient.post('/auth/register', {
                name,
                email,
                password,
                role
            });

            const { token, id, name: userName, email: userEmail, role: userRole } = response.data;

            // If the backend doesn't store phone during register, we could call an update profile here
            // But let's assume successful registration for now.

            await signIn(token, { id, name: userName, email: userEmail, role: userRole });

        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            Alert.alert('Signup Failed', message);
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
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the ParkEase community</Text>
                </View>

                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[styles.roleButton, role === 'USER' && styles.activeRole]}
                        onPress={() => setRole('USER')}
                    >
                        <Text style={[styles.roleText, role === 'USER' && styles.activeRoleText]}>Driver</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleButton, role === 'PROVIDER' && styles.activeRole]}
                        onPress={() => setRole('PROVIDER')}
                    >
                        <Text style={[styles.roleText, role === 'PROVIDER' && styles.activeRoleText]}>Space Owner</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="John Doe"
                        placeholderTextColor={Theme.colors.textSecondary}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="john@example.com"
                        placeholderTextColor={Theme.colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="+1 234 567 890"
                        placeholderTextColor={Theme.colors.textSecondary}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
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

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={Theme.colors.textSecondary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.signupButton}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Login</Text>
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
    },
    header: {
        marginTop: Theme.spacing.xl,
        marginBottom: Theme.spacing.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
    roleContainer: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.md,
        marginBottom: Theme.spacing.lg,
        padding: 4,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: Theme.borderRadius.sm,
    },
    activeRole: {
        backgroundColor: Theme.colors.primary,
    },
    roleText: {
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    activeRoleText: {
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
    signupButton: {
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.borderRadius.md,
        padding: Theme.spacing.md,
        alignItems: 'center',
        marginTop: Theme.spacing.sm,
    },
    signupButtonText: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Theme.spacing.xl,
        marginBottom: Theme.spacing.xl,
    },
    footerText: {
        color: Theme.colors.textSecondary,
    },
    loginText: {
        color: Theme.colors.primary,
        fontWeight: 'bold',
    },
});

export default SignupScreen;
