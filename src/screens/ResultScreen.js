import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

export default function ResultScreen({ route, navigation }) {
    const { result } = route.params;

    // Max score for Positive/Negative is 50 (10 questions * 5)
    const MAX_SCORE = 50;

    const positivePercentage = (result.positiveScore / MAX_SCORE) * 100;
    const negativePercentage = (result.negativeScore / MAX_SCORE) * 100;

    const isPositive = result.interpretation.includes('Positive');
    const isNegative = result.interpretation.includes('Negative');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.closeBtn}>
                        <Ionicons name="close-circle-outline" size={32} color="#95A5A6" />
                    </TouchableOpacity>
                    <Image source={require('../../Logo.png')} style={styles.headerLogo} />
                </View>

                <Text style={styles.title}>Your Results</Text>
                <Text style={styles.subtitle}>Based on your assessment</Text>

                {/* Hero Interpretation Card */}
                <View style={[
                    styles.heroCard,
                    isPositive ? { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' } :
                        isNegative ? { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' } :
                            { backgroundColor: '#F4F6F6', borderColor: '#E5E8E8' }
                ]}>
                    <Ionicons
                        name={isPositive ? "happy" : isNegative ? "sad" : "options"}
                        size={48}
                        color={isPositive ? "#4A8B62" : isNegative ? "#D4757C" : "#7F8C8D"}
                        style={styles.heroIcon}
                    />
                    <Text style={[
                        styles.heroInterpretation,
                        isPositive ? { color: '#2E7D32' } :
                            isNegative ? { color: '#C62828' } :
                                { color: '#455A64' }
                    ]}>
                        {result.interpretation}
                    </Text>
                    <Text style={styles.heroDesc}>
                        {isPositive
                            ? 'You are currently experiencing a strong level of enthusiasm, energy, and alertness.'
                            : isNegative
                                ? 'You are currently experiencing a higher level of distress or unpleasurable engagement.'
                                : 'Your emotional state is currently balanced, without strong extremes of positive or negative affect.'}
                    </Text>
                </View>

                {/* Detailed Scores Section */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>Score Breakdown</Text>

                    <View style={styles.barContainer}>
                        <View style={styles.barHeader}>
                            <Text style={styles.barLabel}>Positive Affect</Text>
                            <Text style={[styles.barValue, { color: '#4A8B62' }]}>{result.positiveScore} / {MAX_SCORE}</Text>
                        </View>
                        <View style={styles.barTrack}>
                            <View style={[styles.barFill, { backgroundColor: '#4A8B62', width: `${positivePercentage}%` }]} />
                        </View>
                    </View>

                    <View style={styles.barContainer}>
                        <View style={styles.barHeader}>
                            <Text style={styles.barLabel}>Negative Affect</Text>
                            <Text style={[styles.barValue, { color: '#D4757C' }]}>{result.negativeScore} / {MAX_SCORE}</Text>
                        </View>
                        <View style={styles.barTrack}>
                            <View style={[styles.barFill, { backgroundColor: '#D4757C', width: `${negativePercentage}%` }]} />
                        </View>
                    </View>

                    {/* Metadata Display */}
                    <View style={styles.metaDataRow}>
                        <Ionicons name="time-outline" size={16} color="#95A5A6" />
                        <Text style={styles.metaDataText}>Took {result.testDuration ? result.testDuration : '< 1'} seconds to complete</Text>
                    </View>
                </View>

                {/* Actions Menu */}
                <View style={styles.actionSection}>
                    <Button
                        title="Retake Test"
                        variant="primary"
                        onPress={() => navigation.replace('Test')}
                        style={styles.retakeBtn}
                    />
                    <Button
                        title="Back to Home"
                        variant="secondary"
                        onPress={() => navigation.navigate('Main')}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFB',
    },
    scroll: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    closeBtn: {
        padding: 4,
    },
    headerLogo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#2C3E50',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#7F8C8D',
        fontWeight: '500',
        marginBottom: 30,
    },
    heroCard: {
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 40,
    },
    heroIcon: {
        marginBottom: 16,
    },
    heroInterpretation: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
    },
    heroDesc: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        opacity: 0.8,
    },
    detailsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        paddingTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 20,
    },
    barContainer: {
        marginBottom: 24,
    },
    barHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    barLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#34495E',
    },
    barValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    barTrack: {
        width: '100%',
        height: 12,
        backgroundColor: '#F0F4F4',
        borderRadius: 6,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 6,
    },
    metaDataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    metaDataText: {
        fontSize: 13,
        color: '#95A5A6',
        marginLeft: 6,
        fontStyle: 'italic',
    },
    actionSection: {
        paddingTop: 10,
    },
    retakeBtn: {
        marginBottom: 4,
    }
});
