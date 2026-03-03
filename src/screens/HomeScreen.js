import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { getCurrentUser } from '../auth/authStorage';

export default function HomeScreen({ navigation }) {
    const [lastResult, setLastResult] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const fetchHistory = async () => {
                try {
                    const user = await getCurrentUser();
                    const jsonValue = await AsyncStorage.getItem('@panas_history');
                    if (jsonValue != null && user) {
                        const history = JSON.parse(jsonValue);
                        const userHistory = history.filter(item => item.userId === user.id);
                        if (userHistory.length > 0) {
                            setLastResult(userHistory[0]);
                        } else {
                            setLastResult(null);
                        }
                    }
                } catch (e) {
                    console.error('Error fetching history:', e);
                }
            };

            fetchHistory();
        }, [])
    );

    return (
        <ScrollView style={styles.container} bounces={false}>
            <LinearGradient
                colors={['#E0F2F1', '#F9FBFB']}
                style={styles.heroGradient}
            >
                <Image source={require('../../Logo.png')} style={styles.floatingLogo} />
                <View style={styles.heroContent}>
                    <Text style={styles.emoji}>🌱</Text>
                    <Text style={styles.title}>MoodTrack</Text>
                    <Text style={styles.subtitle}>Understand your emotions better</Text>

                    <Card style={styles.infoCard}>
                        <Text style={styles.description}>
                            The PANAS Assessment helps measure your positive and negative affect to give you clear insights into your current emotional state.
                        </Text>
                    </Card>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <View style={styles.actionGrid}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('Test')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="play-outline" size={32} color="#4A8B62" />
                        </View>
                        <Text style={styles.actionTitle}>Start Test</Text>
                        <Text style={styles.actionSub}>20 questions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('HistoryTab')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="stats-chart-outline" size={32} color="#E67E22" />
                        </View>
                        <Text style={styles.actionTitle}>History</Text>
                        <Text style={styles.actionSub}>View past results</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Recent Activity</Text>
                {lastResult ? (
                    <Card style={styles.resultCard}>
                        <View style={styles.resultHeader}>
                            <View style={styles.resultIconWrap}>
                                <Ionicons
                                    name={lastResult.interpretation.includes('Positive') ? "happy-outline" : lastResult.interpretation.includes('Negative') ? "sad-outline" : "options-outline"}
                                    size={24}
                                    color={lastResult.interpretation.includes('Positive') ? "#4A8B62" : lastResult.interpretation.includes('Negative') ? "#D4757C" : "#7F8C8D"}
                                />
                            </View>
                            <View>
                                <Text style={styles.dateText}>{new Date(lastResult.date).toLocaleDateString()}</Text>
                                <Text style={styles.interpretationText}>{lastResult.interpretation}</Text>
                            </View>
                        </View>

                        <View style={styles.scoreDetailRow}>
                            <View style={styles.scorePill}>
                                <Text style={styles.scorePillLabel}>POS</Text>
                                <Text style={[styles.scorePillValue, { color: '#4A8B62' }]}>{lastResult.positiveScore}</Text>
                            </View>
                            <View style={styles.scorePill}>
                                <Text style={styles.scorePillLabel}>NEG</Text>
                                <Text style={[styles.scorePillValue, { color: '#D4757C' }]}>{lastResult.negativeScore}</Text>
                            </View>
                        </View>
                    </Card>
                ) : (
                    <Card style={styles.emptyCard}>
                        <Ionicons name="leaf-outline" size={40} color="#BDC3C7" style={{ marginBottom: 10 }} />
                        <Text style={styles.emptyText}>No previous test records found. Take your first test today!</Text>
                    </Card>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFB',
    },
    floatingLogo: {
        position: 'absolute',
        top: 50,
        right: 24,
        width: 45,
        height: 45,
        resizeMode: 'contain',
        zIndex: 10,
    },
    heroGradient: {
        paddingTop: 80,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    heroContent: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emoji: {
        fontSize: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#2C3E50',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#7F8C8D',
        fontWeight: '500',
        marginBottom: 24,
    },
    infoCard: {
        width: '100%',
        padding: 20,
        marginVertical: 0,
        shadowOpacity: 0.03,
    },
    description: {
        fontSize: 15,
        color: '#5D6D7E',
        lineHeight: 24,
        textAlign: 'center',
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 16,
        marginTop: 10,
        marginLeft: 4,
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 6,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    actionSub: {
        fontSize: 13,
        color: '#95A5A6',
        fontWeight: '500',
    },
    resultCard: {
        padding: 20,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    resultIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F4F6F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    dateText: {
        fontSize: 13,
        color: '#95A5A6',
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    interpretationText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    scoreDetailRow: {
        flexDirection: 'row',
        backgroundColor: '#F9FBFB',
        borderRadius: 12,
        padding: 12,
    },
    scorePill: {
        flex: 1,
        alignItems: 'center',
    },
    scorePillLabel: {
        fontSize: 12,
        color: '#7F8C8D',
        fontWeight: '600',
        marginBottom: 4,
    },
    scorePillValue: {
        fontSize: 20,
        fontWeight: '800',
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
    },
    emptyText: {
        fontSize: 16,
        color: '#95A5A6',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
});
