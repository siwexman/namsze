import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function HomeScreen() {
    return (
        <View style={styles.rootContainer}>
            <View style={styles.gridContainer}>
                <View style={styles.box}>
                    <Text style={styles.text}>Znajdź najbliższą Mszę</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.text}>Znajdź najbliższą Spowiedź</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary500,
    },
    gridContainer: {
        // flexDirection: 'row',
        paddingHorizontal: 8,
    },
    box: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        // backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
        margin: 8,
    },
    text: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        // color: Colors.primary700,
        color: 'white',
    },
});
