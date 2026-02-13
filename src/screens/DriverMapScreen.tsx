import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Theme } from '../theme';
import apiClient from '../api/client';
import { MapPin } from 'lucide-react-native';

const DriverMapScreen = () => {
    const [parkingSpots, setParkingSpots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState({
        latitude: 12.9716, // Default to Bangalore or user location
        longitude: 77.5946,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        fetchParkingSpots();
    }, []);

    const fetchParkingSpots = async () => {
        try {
            const response = await apiClient.get('/parking');
            // Filter only approved ones if backend doesn't
            const approvedSpots = response.data.filter((spot: any) => spot.status === 'APPROVED');
            setParkingSpots(approvedSpots);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch parking spots');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                // provider={PROVIDER_GOOGLE} // Use Google Maps if configured
                style={styles.map}
                initialRegion={region}
                customMapStyle={mapStyle} // Dark mode map style
            >
                {parkingSpots.map((spot) => (
                    <Marker
                        key={spot.id}
                        coordinate={{
                            latitude: spot.location.lat,
                            longitude: spot.location.lng,
                        }}
                        title={spot.title}
                        description={`₹${spot.pricing.hourlyRate}/hr`}
                        onPress={() => {
                            // Open Bottom Sheet with details
                            console.log('Spot selected:', spot);
                        }}
                    >
                        <View style={styles.markerContainer}>
                            <View style={styles.markerIcon}>
                                <MapPin size={24} color="#FFF" fill={Theme.colors.primary} />
                            </View>
                        </View>
                    </Marker>
                ))}
            </MapView>

            <View style={styles.searchBar}>
                <Text style={styles.searchText}>Search parking near you...</Text>
            </View>
        </View>
    );
};

const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#181818" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#1b1b1b" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#2c2c2c" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#8a8a8a" }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{ "color": "#373737" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#3c3c3c" }]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{ "color": "#4e4e4e" }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#000000" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#3d3d3d" }]
    }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    map: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerIcon: {
        padding: 6,
        borderRadius: 20,
        backgroundColor: Theme.colors.primary,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    searchBar: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: Theme.colors.card,
        padding: 15,
        borderRadius: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    searchText: {
        color: Theme.colors.textSecondary,
        fontSize: 14,
    }
});

export default DriverMapScreen;
