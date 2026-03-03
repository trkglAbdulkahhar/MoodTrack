import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, style, textStyle, variant = 'primary', disabled = false }) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                disabled && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <Text style={[
                styles.text,
                variant === 'outline' && styles.textOutline,
                textStyle
            ]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    primary: {
        backgroundColor: '#8BBDAE', // Soft pastel green
    },
    secondary: {
        backgroundColor: '#F3E5D8', // Soft pastel peach/beige
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#8BBDAE',
    },
    text: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    textOutline: {
        color: '#8BBDAE',
    },
    disabled: {
        opacity: 0.5,
    }
});
