import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Card from '../components/Card';
import { registerUser } from '../auth/authStorage';

export default function RegisterScreen({ navigation, route }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // This screen expects an onAuthSuccess callback from App.js routing passed via Login
    const { onAuthSuccess } = route.params || {};

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        setIsLoading(true);
        try {
            await registerUser(name, email, password);
            if (onAuthSuccess) onAuthSuccess(); // Switch stacks
        } catch (e) {
            Alert.alert("Registration Failed", e.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
                    <LinearGradient
                        colors={['#E0F2F1', '#F9FBFB']}
                        style={styles.heroGradient}
                    >
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                                <Ionicons name="chevron-back" size={28} color="#2C3E50" />
                            </TouchableOpacity>
                            <Image source={require('../../Logo.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                        </View>
                        <Text style={styles.emoji}>✨</Text>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Start tracking your daily mood</Text>
                    </LinearGradient>

                    <View style={styles.formContainer}>
                        <Card style={styles.card}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="person-outline" size={20} color="#95A5A6" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="John Doe"
                                        placeholderTextColor="#BDC3C7"
                                        value={name}
                                        onChangeText={setName}
                                        returnKeyType="next"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="mail-outline" size={20} color="#95A5A6" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="you@example.com"
                                        placeholderTextColor="#BDC3C7"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        returnKeyType="next"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#95A5A6" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="••••••••"
                                        placeholderTextColor="#BDC3C7"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        returnKeyType="done"
                                        onSubmitEditing={handleRegister}
                                    />
                                </View>
                            </View>

                            <Button
                                title={isLoading ? "Creating Account..." : "Sign Up"}
                                onPress={handleRegister}
                                disabled={isLoading}
                                style={{ marginTop: 10 }}
                            />
                        </Card>
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
    scroll: {
        flexGrow: 1,
    },
    heroGradient: {
        paddingTop: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
    },
    headerRow: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backBtn: {
        padding: 4,
    },
    emoji: {
        fontSize: 40,
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2C3E50',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#7F8C8D',
        fontWeight: '500',
    },
    formContainer: {
        padding: 24,
        marginTop: -20,
    },
    card: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#34495E',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F6F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8ECEC',
        paddingHorizontal: 16,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#2C3E50',
    }
});
