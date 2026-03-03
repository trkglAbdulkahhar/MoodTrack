import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Card from '../components/Card';
import { getCurrentUser, updateUserProfile, logoutUser } from '../auth/authStorage';

export default function ProfileScreen({ navigation, route }) {
    const [user, setUser] = useState(null);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [occupation, setOccupation] = useState('');
    const [bio, setBio] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    // If passed from App.js
    const onLogoutSuccess = route.params?.onLogoutSuccess;

    useFocusEffect(
        useCallback(() => {
            const loadUser = async () => {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    setAge(currentUser.age ? String(currentUser.age) : '');
                    setGender(currentUser.gender || '');
                    setOccupation(currentUser.occupation || '');
                    setBio(currentUser.bio || '');
                }
            };
            loadUser();
        }, [])
    );

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUserProfile({
                age: age ? parseInt(age, 10) : null,
                gender,
                occupation,
                bio
            });
            Alert.alert("Success", "Profile updated successfully!");
        } catch (e) {
            Alert.alert("Error", "Could not update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await logoutUser();
                        if (onLogoutSuccess) {
                            onLogoutSuccess();
                        }
                    }
                }
            ]
        );
    };

    if (!user) return null; // Will be handled by loading screen theoretically

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../Logo.png')} style={styles.headerLogo} />
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                            <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                    <View style={styles.avatarSection}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarInitial}>
                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </Text>
                        </View>
                        <Text style={styles.nameText}>{user.name}</Text>
                        <Text style={styles.emailText}>{user.email}</Text>
                    </View>

                    <Card style={styles.card}>
                        <Text style={styles.sectionTitle}>Personal Info</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 28"
                                placeholderTextColor="#BDC3C7"
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Gender</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Female, Male, Non-binary"
                                placeholderTextColor="#BDC3C7"
                                value={gender}
                                onChangeText={setGender}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Occupation</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Student, Software Engineer, etc."
                                placeholderTextColor="#BDC3C7"
                                value={occupation}
                                onChangeText={setOccupation}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Short Bio</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="A little about yourself..."
                                placeholderTextColor="#BDC3C7"
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>

                        <Button
                            title={isSaving ? "Saving..." : "Save Changes"}
                            onPress={handleSave}
                            disabled={isSaving}
                            style={styles.saveBtn}
                        />
                    </Card>

                    <View style={styles.dangerZone}>
                        <Text style={styles.dangerTitle}>Account Actions</Text>
                        <Button
                            title="Log Out"
                            variant="outline"
                            onPress={handleLogout}
                            textStyle={{ color: '#E74C3C' }}
                            style={{ borderColor: '#FFCDD2', backgroundColor: '#FFEBEE' }}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F4',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2C3E50',
    },
    headerLogo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginRight: 12,
    },
    logoutBtn: {
        padding: 8,
        backgroundColor: '#FFEBEE',
        borderRadius: 20,
    },
    scroll: {
        padding: 24,
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0F2F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    avatarInitial: {
        fontSize: 32,
        fontWeight: '800',
        color: '#4A8B62',
    },
    nameText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    emailText: {
        fontSize: 14,
        color: '#7F8C8D',
        fontWeight: '500',
    },
    card: {
        padding: 24,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7F8C8D',
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F4F6F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8ECEC',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2C3E50',
    },
    textArea: {
        minHeight: 80,
    },
    saveBtn: {
        marginTop: 10,
    },
    dangerZone: {
        marginBottom: 20,
    },
    dangerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E74C3C',
        marginBottom: 10,
        marginLeft: 4,
    }
});
