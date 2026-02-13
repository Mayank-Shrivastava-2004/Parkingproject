import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '../theme';
import apiClient from '../api/client';
import { Camera, MapPin, Save } from 'lucide-react-native';

const AddSpotScreen = ({ navigation }: any) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [location, setLocation] = useState({
        lat: 12.9716,
        lng: 77.5946
    });
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !hourlyRate) {
            Alert.alert('Error', 'Please fill in all basic details');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('pricing.hourlyRate', hourlyRate);
            formData.append('location.lat', location.lat.toString());
            formData.append('location.lng', location.lng.toString());

            // Handle images for multer backend
            images.forEach((uri, index) => {
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : `image`;
                formData.append('images', { uri, name: filename, type } as any);
            });

            await apiClient.post('/parking', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert('Success', 'Parking spot submitted for approval');
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to add spot');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Listing Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Safe Gated Parking"
                    placeholderTextColor={Theme.colors.textSecondary}
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    placeholder="Describe your parking space..."
                    placeholderTextColor={Theme.colors.textSecondary}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Hourly Rate (₹)</Text>
                        <TextInput
                            style={styles.input}
                            value={hourlyRate}
                            onChangeText={setHourlyRate}
                            keyboardType="numeric"
                            placeholder="e.g. 50"
                            placeholderTextColor={Theme.colors.textSecondary}
                        />
                    </View>
                </View>

                <Text style={styles.label}>Location (Drag to pinpoint)</Text>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.lat,
                            longitude: location.lng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            draggable
                            coordinate={{ latitude: location.lat, longitude: location.lng }}
                            onDragEnd={(e) => setLocation({
                                lat: e.nativeEvent.coordinate.latitude,
                                lng: e.nativeEvent.coordinate.longitude
                            })}
                        />
                    </MapView>
                </View>

                <Text style={styles.label}>Photos</Text>
                <View style={styles.imageGrid}>
                    {images.map((uri, index) => (
                        <Image key={index} source={{ uri }} style={styles.previewImage} />
                    ))}
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        <Camera size={30} color={Theme.colors.textSecondary} />
                        <Text style={styles.imagePickerText}>Add Photo</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Save size={20} color="#FFF" />
                            <Text style={styles.btnText}>Submit Listing</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    form: {
        padding: Theme.spacing.md,
    },
    label: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.md,
        padding: 12,
        color: Theme.colors.text,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
    },
    mapContainer: {
        height: 200,
        borderRadius: Theme.borderRadius.lg,
        overflow: 'hidden',
        marginTop: 8,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 10,
        marginBottom: 10,
    },
    imagePicker: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: Theme.colors.card,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    imagePickerText: {
        color: Theme.colors.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
    submitBtn: {
        backgroundColor: Theme.colors.primary,
        padding: 16,
        borderRadius: Theme.borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 50,
    },
    btnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});

export default AddSpotScreen;
