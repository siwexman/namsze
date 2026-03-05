import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../constants/colors';

import ButtonBox from '../components/Home/ButtonBox';
import TopContainer from '../components/Home/TopContainer';

export default function HomeScreen() {
    const navigation = useNavigation();

    function navigateToMap() {
        navigation.navigate('Map');
    }

    function navigateToFilters() {
        navigation.navigate('Filters');
    }

    return (
        <View style={styles.rootContainer}>
            {/* <TopContainer /> */}
            <View style={styles.midContainer}>
                <View style={styles.gridContainer}>
                    <ButtonBox
                        isIcon
                        onPress={navigateToMap}
                        title={'Znajdź najbliższą mszę'}
                    />
                </View>
                <View style={[styles.gridContainer, styles.row]}>
                    <ButtonBox
                        containerStyles={{ flex: 1 }}
                        icon={{ icon: 'time', size: 32, color: 'white' }}
                        textStyles={styles.buttonText}
                        onPress={navigateToFilters}
                        title={'Znajdź msze'}
                    />
                    <ButtonBox
                        containerStyles={{ flex: 1 }}
                        icon={{ icon: 'church', size: 32, color: 'white' }}
                        textStyles={styles.buttonText}
                        onPress={navigateToFilters}
                        title={'Znajdź kościół'}
                    />
                </View>
            </View>
            {/* <ButtonBox
                onPress={navigateToFilters}
                title={'Wyszukiwanie zaawansowane'}
            /> */}
            {/* <View style={[styles.gridContainer, styles.bottomContainer]}></View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary500,
        paddingHorizontal: 8,
    },
    gridContainer: {
        // flexDirection: 'row',
        paddingHorizontal: 8,
    },
    midContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 16,
    },
    bottomContainer: {
        justifyContent: 'flex-end',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
    },
});
