import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../theme';

// Screens (To be implemented)
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DriverMapScreen from '../screens/DriverMapScreen';
import ProviderDashboardScreen from '../screens/ProviderDashboardScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AddSpotScreen from '../screens/AddSpotScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
);

const DriverDrawer = () => (
    <Drawer.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: Theme.colors.card },
            headerTintColor: Theme.colors.text,
            drawerStyle: { backgroundColor: Theme.colors.background },
            drawerActiveTintColor: Theme.colors.primary,
            drawerInactiveTintColor: Theme.colors.textSecondary,
        }}
    >
        <Drawer.Screen name="Find Parking" component={DriverMapScreen} />
        {/* Add other screens here */}
    </Drawer.Navigator>
);

const ProviderStack = () => (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: Theme.colors.card }, headerTintColor: Theme.colors.text }}>
        <Stack.Screen name="ProviderHome" component={ProviderDashboardScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="AddSpot" component={AddSpotScreen} options={{ title: 'Add New Spot' }} />
    </Stack.Navigator>
);

const ProviderDrawer = () => (
    <Drawer.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: Theme.colors.card },
            headerTintColor: Theme.colors.text,
            drawerStyle: { backgroundColor: Theme.colors.background },
            drawerActiveTintColor: Theme.colors.primary,
            drawerInactiveTintColor: Theme.colors.textSecondary,
        }}
    >
        <Drawer.Screen name="Home" component={ProviderStack} options={{ headerShown: false }} />
        {/* Add other screens here */}
    </Drawer.Navigator>
);

const AdminDrawer = () => (
    <Drawer.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: Theme.colors.card },
            headerTintColor: Theme.colors.text,
            drawerStyle: { backgroundColor: Theme.colors.background },
            drawerActiveTintColor: Theme.colors.primary,
            drawerInactiveTintColor: Theme.colors.textSecondary,
        }}
    >
        <Drawer.Screen name="Command Center" component={AdminDashboardScreen} />
        {/* Add other screens here */}
    </Drawer.Navigator>
);

const AppNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // Return a splash screen component or null
        return null;
    }

    return (
        <NavigationContainer>
            {user ? (
                <>
                    {user.role === 'USER' && <DriverDrawer />}
                    {user.role === 'PROVIDER' && <ProviderDrawer />}
                    {user.role === 'ADMIN' && <AdminDrawer />}
                </>
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
