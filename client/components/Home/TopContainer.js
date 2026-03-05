import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

export default function TopContainer() {
    const [text, setText] = useState('');

    function changeTextHandler(enteredText) {
        setText(enteredText);
    }

    return (
        <View style={styles.topContainer}>
            <View style={styles.cityContainer}>
                <TextInput
                    style={styles.cityInput}
                    placeholder="Wpisz miasto"
                    value={text}
                    onChange={changeTextHandler}
                />
                <View style={styles.dropdownList}></View>
            </View>
            <View>
                <Text>Godzina</Text>
                <Text>Dzień</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 8,
        paddingHorizontal: '5%',
    },
    cityContainer: {},
    cityInput: {
        backgroundColor: 'white',
        borderRadius: 6,
        width: 100,
        paddingHorizontal: 4,
    },
    dropdownList: {
        position: 'absolute',
        top: '90%',
        backgroundColor: 'white',
        width: 100,
        height: 100,
        padding: 4,
    },
});
