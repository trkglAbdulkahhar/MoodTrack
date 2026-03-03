import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function ProgressBar({ current, total }) {
    const percentage = (current / total) * 100;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Question {current} / {total}</Text>
            <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${percentage}%` }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        width: '100%',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        color: '#8c8c8c',
        marginBottom: 10,
        fontWeight: '500',
    },
    barBackground: {
        width: '100%',
        height: 8,
        backgroundColor: '#E8E8E8',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#8BBDAE', // Pastel green
        borderRadius: 4,
    }
});
