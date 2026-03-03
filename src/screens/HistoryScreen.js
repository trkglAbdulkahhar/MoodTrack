import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Alert, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { getCurrentUser } from '../auth/authStorage';

// Utility line chart component to avoid heavy victory-native dependency
const LineChart = ({ data }) => {
    if (!data || data.length < 2) return null;

    const width = Dimensions.get('window').width - 80;
    const height = 100;
    const maxScore = 50;

    const dx = width / (data.length - 1);

    // Render points
    const points = data.map((d, i) => {
        const x = i * dx;
        // Map score (0-50) to Y space (height -> 0)
        const yPos = height - ((d.positiveScore / maxScore) * height);
        const yNeg = height - ((d.negativeScore / maxScore) * height);

        return { x, yPos, yNeg };
    });

    return (
        <View style={[styles.chartContainer, { width, height }]}>
            {/* Background horizontal lines */}
            {[0, 0.5, 1].map((pct, i) => (
                <View key={i} style={[styles.gridLine, { top: height * pct }]} />
            ))}
            {/* Positive Points (Green) */}
            {points.map((p, i) => (
                <View
                    key={`pos-${i}`}
                    style={[styles.chartDot, { left: p.x - 4, top: p.yPos - 4, backgroundColor: '#4A8B62' }]}
                />
            ))}
            {/* Negative Points (Red) */}
            {points.map((p, i) => (
                <View
                    key={`neg-${i}`}
                    style={[styles.chartDot, { left: p.x - 4, top: p.yNeg - 4, backgroundColor: '#D4757C' }]}
                />
            ))}
        </View>
    );
};

export default function HistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchHistory = async () => {
                setIsLoading(true);
                try {
                    const user = await getCurrentUser();
                    const jsonValue = await AsyncStorage.getItem('@panas_history');

                    if (jsonValue != null && user) {
                        const allHistory = JSON.parse(jsonValue);
                        setHistory(allHistory.filter(item => item.userId === user.id));
                    } else {
                        setHistory([]);
                    }
                } catch (e) {
                    console.error("Failed to load history", e);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchHistory();
        }, [])
    );

    const clearHistory = async () => {
        Alert.alert(
            "Clear History",
            "Are you sure you want to delete all your past test results? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const user = await getCurrentUser();
                            const jsonValue = await AsyncStorage.getItem('@panas_history');
                            if (jsonValue != null && user) {
                                const allHistory = JSON.parse(jsonValue);
                                // Filter OUT the ones belonging to this user
                                const remaining = allHistory.filter(item => item.userId !== user.id);
                                await AsyncStorage.setItem('@panas_history', JSON.stringify(remaining));
                                setHistory([]);
                            }
                        } catch (e) {
                            console.error("Failed to clear history", e);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item, index }) => {
        const dateObj = new Date(item.date);
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        const isLast = index === history.length - 1;

        return (
            <View style={styles.timelineRow}>
                {/* Left Side: Timeline graphics */}
                <View style={styles.timelineColumn}>
                    <View style={styles.timelineDot} />
                    {!isLast && <View style={styles.timelineLine} />}
                </View>

                {/* Right Side: Content Card */}
                <View style={styles.contentColumn}>
                    <Text style={styles.timestamp}>{dateStr} • {timeStr}</Text>
                    <View style={styles.historyCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconWrap}>
                                <Ionicons
                                    name={item.interpretation.includes('Positive') ? "happy" : item.interpretation.includes('Negative') ? "sad" : "options"}
                                    size={20}
                                    color={item.interpretation.includes('Positive') ? "#4A8B62" : item.interpretation.includes('Negative') ? "#D4757C" : "#7F8C8D"}
                                />
                            </View>
                            <Text style={styles.interpretationText}>{item.interpretation}</Text>
                        </View>
                        <View style={styles.scoreRow}>
                            <View style={styles.scoreSet}>
                                <Text style={styles.scoreLabel}>POS</Text>
                                <Text style={[styles.scoreValue, { color: '#4A8B62' }]}>{item.positiveScore}</Text>
                            </View>
                            <View style={[styles.scoreSet, { marginLeft: 20 }]}>
                                <Text style={styles.scoreLabel}>NEG</Text>
                                <Text style={[styles.scoreValue, { color: '#D4757C' }]}>{item.negativeScore}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const trendData = history.slice(0, 10).reverse(); // Oldest to newest for trend

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
                <Image source={require('../../Logo.png')} style={styles.headerLogo} />
            </View>

            {!isLoading && history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyContent}>
                        <Ionicons name="folder-open-outline" size={60} color="#BDC3C7" style={{ marginBottom: 20 }} />
                        <Text style={styles.emptyText}>No test records yet.</Text>
                        <Text style={styles.emptySubtext}>Your past test results and mood trends will appear here.</Text>
                    </View>
                    <Button
                        title="Take a Test"
                        onPress={() => navigation.navigate('Test')}
                        style={styles.emptyButton}
                    />
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        history.length > 1 ? (
                            <View style={styles.trendContainer}>
                                <Text style={styles.trendTitle}>Recent Mood Trend</Text>
                                <LineChart data={trendData} />
                                <View style={styles.trendLegend}>
                                    <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#4A8B62' }]} /><Text style={styles.legendText}>Positive</Text></View>
                                    <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#D4757C' }]} /><Text style={styles.legendText}>Negative</Text></View>
                                </View>
                            </View>
                        ) : null
                    }
                    ListFooterComponent={
                        history.length > 0 ? (
                            <Button
                                title="Clear History"
                                variant="outline"
                                onPress={clearHistory}
                                style={styles.clearButton}
                                textStyle={{ color: '#E74C3C' }}
                            />
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFB',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F4',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    },
    listContent: {
        padding: 24,
        paddingBottom: 40,
    },
    trendContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    trendTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 20,
    },
    chartContainer: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#F0F4F4',
    },
    chartDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    trendLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: '#7F8C8D',
        fontWeight: '500',
    },
    timelineRow: {
        flexDirection: 'row',
    },
    timelineColumn: {
        width: 24,
        alignItems: 'center',
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#A6B1B1',
        marginTop: 4,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E8ECEC',
        marginVertical: 4,
    },
    contentColumn: {
        flex: 1,
        paddingLeft: 12,
        paddingBottom: 24,
    },
    timestamp: {
        fontSize: 13,
        color: '#95A5A6',
        fontWeight: '600',
        marginBottom: 8,
    },
    historyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F0F4F4',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconWrap: {
        marginRight: 10,
    },
    interpretationText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    scoreRow: {
        flexDirection: 'row',
    },
    scoreSet: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#95A5A6',
        marginRight: 6,
    },
    scoreValue: {
        fontSize: 16,
        fontWeight: '800',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        flex: 1,
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    emptyText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 12,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#7F8C8D',
        textAlign: 'center',
        lineHeight: 24,
    },
    emptyButton: {
        width: '100%',
        marginBottom: 20,
    },
    clearButton: {
        marginTop: 10,
        borderColor: '#FFEBEE',
        backgroundColor: '#FFFFFF'
    }
});
