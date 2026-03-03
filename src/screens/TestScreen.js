import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { panasQuestionPool } from '../data/panasQuestionPool';
import { calculateScore } from '../utils/calculateScore';
import { getCurrentUser } from '../auth/authStorage';

export default function TestScreen({ navigation }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        // Record start time 
        setStartTime(Date.now());

        // Generate exactly 10 pos / 10 neg
        const pos = panasQuestionPool.filter(q => q.type === 'positive').sort(() => 0.5 - Math.random()).slice(0, 10);
        const neg = panasQuestionPool.filter(q => q.type === 'negative').sort(() => 0.5 - Math.random()).slice(0, 10);
        const dynamicSet = [...pos, ...neg].sort(() => 0.5 - Math.random());

        setQuestions(dynamicSet);
    }, []);

    if (questions.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8BBDAE" />
                <Text style={styles.loadingText}>Generating Test...</Text>
            </View>
        );
    }

    const totalQuestions = questions.length;
    const currentQuestion = questions[currentIndex];

    const handleSelect = (score) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: score }));
        if (error) setError('');

        // Auto-advance logic (optional, but good UX)
        setTimeout(() => {
            if (currentIndex < totalQuestions - 1) {
                setCurrentIndex(prev => prev + 1);
            }
        }, 400);
    };

    const navigatePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setError('');
        }
    };

    const navigateNext = () => {
        if (!answers[currentQuestion.id]) {
            setError('Please select a rating before continuing.');
            return;
        }

        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
            setError('');
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        // Final sanity check
        if (Object.keys(answers).length < totalQuestions) {
            setError('Please answer all questions before submitting.');
            return;
        }

        setIsSubmitting(true);
        const durationSecs = Math.round((Date.now() - startTime) / 1000);

        setTimeout(async () => {
            const currentUser = await getCurrentUser();

            // Pass the generated questions array so type can be parsed
            const resultObj = calculateScore(answers, questions);
            resultObj.date = new Date().toISOString();
            resultObj.id = Date.now().toString();
            resultObj.testDuration = durationSecs;
            resultObj.userId = currentUser ? currentUser.id : 'anonymous';

            try {
                const existingData = await AsyncStorage.getItem('@panas_history');
                let history = existingData ? JSON.parse(existingData) : [];
                history.unshift(resultObj);
                await AsyncStorage.setItem('@panas_history', JSON.stringify(history));
            } catch (e) {
                console.error('Failed to save result', e);
            }

            setIsSubmitting(false);
            navigation.replace('Result', { result: resultObj });
        }, 1200);
    };

    const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

    if (isSubmitting) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8BBDAE" />
                <Text style={styles.loadingText}>Analyzing Results...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header & Progress */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <Ionicons name="close" size={28} color="#7F8C8D" />
                </TouchableOpacity>

                <View style={styles.progressWrap}>
                    <Text style={styles.progressText}>Question {currentIndex + 1} of {totalQuestions}</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                    </View>
                </View>
                <Image source={require('../../Logo.png')} style={{ width: 32, height: 32, resizeMode: 'contain' }} />
            </View>

            <View style={styles.content}>
                <View style={styles.questionSection}>
                    <Text style={styles.instruction}>To what extent do you feel this way right now?</Text>
                    <Text style={styles.questionWord}>{currentQuestion.emotion}</Text>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.scaleGrid}>
                    {[
                        { val: 1, label: 'Not at all' },
                        { val: 2, label: 'A little' },
                        { val: 3, label: 'Moderately' },
                        { val: 4, label: 'Quite a bit' },
                        { val: 5, label: 'Extremely' }
                    ].map((item) => {
                        const isSelected = answers[currentQuestion.id] === item.val;
                        return (
                            <TouchableOpacity
                                key={item.val}
                                style={[styles.scaleOption, isSelected && styles.scaleOptionSelected]}
                                onPress={() => handleSelect(item.val)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.scaleCircle, isSelected && styles.scaleCircleSelected]}>
                                    <Text style={[styles.scaleNum, isSelected && styles.scaleNumSelected]}>{item.val}</Text>
                                </View>
                                <Text style={[styles.scaleLabel, isSelected && styles.scaleLabelSelected]}>{item.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
                    onPress={navigatePrev}
                    disabled={currentIndex === 0}
                >
                    <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? "#BDC3C7" : "#2C3E50"} />
                    <Text style={[styles.navBtnText, currentIndex === 0 && { color: '#BDC3C7' }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.nextBtn, !answers[currentQuestion.id] && styles.nextBtnDisabled]}
                    onPress={navigateNext}
                    disabled={!answers[currentQuestion.id] && currentIndex !== totalQuestions - 1} // allow clicking next to show error
                >
                    <Text style={styles.nextBtnText}>
                        {currentIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
                    </Text>
                    {currentIndex !== totalQuestions - 1 && (
                        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FBFB',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#2C3E50',
        fontWeight: '700',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 30,
    },
    closeBtn: {
        padding: 4,
    },
    progressWrap: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7F8C8D',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: '#E8ECEC',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#8BBDAE',
        borderRadius: 3,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    questionSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    instruction: {
        fontSize: 16,
        color: '#95A5A6',
        marginBottom: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    questionWord: {
        fontSize: 42,
        fontWeight: '800',
        color: '#2C3E50',
        textAlign: 'center',
    },
    errorText: {
        color: '#E74C3C',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '600',
    },
    scaleGrid: {
        width: '100%',
        gap: 12,
    },
    scaleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#F0F4F4',
    },
    scaleOptionSelected: {
        borderColor: '#8BBDAE',
        backgroundColor: '#F2F8F6',
    },
    scaleCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F4F6F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    scaleCircleSelected: {
        backgroundColor: '#8BBDAE',
    },
    scaleNum: {
        fontSize: 18,
        fontWeight: '700',
        color: '#7F8C8D',
    },
    scaleNumSelected: {
        color: '#FFFFFF',
    },
    scaleLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
    },
    scaleLabelSelected: {
        color: '#4A8B62',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F4F4',
        backgroundColor: '#FFFFFF',
    },
    navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    navBtnDisabled: {
        opacity: 0.5,
    },
    navBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginLeft: 4,
    },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8BBDAE',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 24,
    },
    nextBtnDisabled: {
        opacity: 0.5,
    },
    nextBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    }
});
