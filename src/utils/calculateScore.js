export function calculateScore(answers, questions) {
    let positiveScore = 0;
    let negativeScore = 0;

    questions.forEach((q) => {
        // answers is an object mapping question id to 1-5 score
        const score = answers[q.id] || 0;
        if (q.type === 'positive') {
            positiveScore += score;
        } else {
            negativeScore += score;
        }
    });

    let interpretation = '';
    // Basic interpretation logic based on general PANAS score differences
    if (positiveScore > negativeScore + 10) {
        interpretation = 'High Positive Affect';
    } else if (negativeScore > positiveScore + 10) {
        interpretation = 'High Negative Affect';
    } else {
        interpretation = 'Balanced Affect';
    }

    return { positiveScore, negativeScore, interpretation };
}
