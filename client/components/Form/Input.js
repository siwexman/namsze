import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function Input({ label, placeholder }) {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput style={styles.input} placeholder={placeholder} />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        paddingHorizontal: 4,
    },
    label: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        color: 'white',
        borderWidth: 1,
        borderRadius: 16,
        borderColor: 'white',
        paddingHorizontal: 8,
        marginVertical: 4,
    },
});
