import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '../../constants/colors';

export default function TimeBox({ text, bgColor }) {
    return (
        <View style={styles.massTimeContainer}>
            <Text style={[styles.text, styles.massTimeText]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    massTimeContainer: {
        padding: 4,
        backgroundColor: 'white',
        borderRadius: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
    massTimeText: {
        color: Colors.primary700,
        fontWeight: 'bold',
    },
});
