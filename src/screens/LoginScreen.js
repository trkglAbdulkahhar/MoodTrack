import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Card from '../components/Card';
import { loginUser } from '../auth/authStorage';

export default function LoginScreen({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // This screen expects an onAuthSuccess callback from App.js routing
    const { onAuthSuccess } = route.params;

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        setIsLoading(true);
        try {
            await loginUser(email, password);
            onAuthSuccess(); // Switch stacks
        } catch (e) {
            Alert.alert("Login Failed", e.message || "Invalid credentials.");
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
                        <Image source={require('../../Logo.png')} style={styles.floatingLogo} />
                        <Text style={styles.emoji}>😌</Text>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to track your mood</Text>
                    </LinearGradient>

                    <View style={styles.formContainer}>
                        <Card style={styles.card}>
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
                                        onSubmitEditing={handleLogin}
                                    />
                                </View>
                            </View>

                            <Button
                                title={isLoading ? "Signing In..." : "Sign In"}
                                onPress={handleLogin}
                                disabled={isLoading}
                                style={{ marginTop: 10 }}
                            />
                        </Card>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register', { onAuthSuccess })}>
                                <Text style={styles.footerLink}>Register</Text>
                            </TouchableOpacity>
                        </View>
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
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
    },
    floatingLogo: {
        position: 'absolute',
        top: 60,
        right: 24,
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    emoji: {
        fontSize: 50,
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
        marginTop: -20, // Overlap the gradient slightly
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
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        color: '#7F8C8D',
        fontSize: 15,
    },
    footerLink: {
        color: '#4A8B62',
        fontSize: 15,
        fontWeight: '700',
    }
});
