import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../constants/colors';

import SectionContainer from '../components/Church/SectionContainer';
import IconButton from '../components/UI/IconButton';
import { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from '../util/apiClient';

const DUMMY_MASSES = [
    {
        _id: '694c903d22fb9dd842f41a25',
        time: '15:00',
        day: 'sunday',
        description: '',
        church: '694c903d22fb9dd842f41a21',
    },
    {
        _id: '694c903d22fb9dd842f41a26',
        time: '17:00',
        day: 'weekday',
        description: '',
        church: '694c903d22fb9dd842f41a21',
    },
    {
        _id: '694c903d22fb9dd842f41a1e',
        time: '11:00',
        day: 'sunday',
        description: '',
        church: '694c903d22fb9dd842f41a1b',
    },
    {
        _id: '694c903d22fb9dd842f41a1f',
        time: '17:00',
        day: 'weekday',
        description: '',
        church: '694c903d22fb9dd842f41a1b',
    },
    {
        _id: '694c903d22fb9dd842f41a1d',
        time: '08:30',
        day: 'sunday',
        description: '',
        church: '694c903d22fb9dd842f41a1b',
    },
];

const DUMMY_CONFESSIONS = [
    {
        _id: '69a345efe1f65dbbc4e89447',
        dayOfWeek: 0,
        startTime: '11:00',
        endTime: '12:00',
        church: '694c903d22fb9dd842f41ae3',
        __v: 0,
    },
    {
        _id: '69a3462ce1f65dbbc4e8944c',
        dayOfWeek: 1,
        startTime: '10:00',
        endTime: '12:00',
        church: '694c903d22fb9dd842f41ae3',
        __v: 0,
    },
];

export default function ChurchScreen({ route, navigation }) {
    const [church, setChurch] = useState();
    const { id } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: ({ tintColor }) => (
                <IconButton
                    icon={'pencil'}
                    color={tintColor}
                    onPress={() => navigation.navigate('addChurch', { id })}
                />
            ),
        });
    }, [navigation, id]);

    useEffect(() => {
        async function fetchChurchData() {
            try {
                const response = await apiClient.get(`/churches/${id}`);

                return response.data;
            } catch (error) {
                console.error('Error');
                throw error;
            }
        }

        fetchChurchData();
    });

    return (
        <ScrollView style={styles.rootContainer}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    // TODO: Change to uri
                    source={{ uri: church.image }}
                    // source={require('../assets/dummy-img/224_rzeszow_judy-1024x683-350x350.jpg')}
                />
            </View>
            <View style={styles.dataContainer}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.text, styles.title]}>
                        Judasz tadeusz
                    </Text>
                    <Text style={[styles.text]}>ul. Jakaś Tam 123</Text>
                </View>
                <SectionContainer sectionName={'MSZE'} data={DUMMY_MASSES} />
                <SectionContainer
                    sectionName={'SPOWIEDŹ'}
                    data={DUMMY_CONFESSIONS}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: Colors.primary500,
        paddingHorizontal: 8,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
        height: 360,
    },
    image: {
        borderRadius: 4,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    dataContainer: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        // TODO: CHECK
        flex: 10,
        justifyContent: 'space-between',
    },
    titleContainer: {
        paddingVertical: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    massesContainer: {
        paddingVertical: 18,
    },
    daysContainer: {
        padding: 4,
    },
    dayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        gap: 32,
    },
    massTimesContainer: {
        flexDirection: 'row',
        gap: 10,
    },
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
    massTimeText: {
        color: Colors.primary700,
        fontWeight: 'bold',
    },
    section: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});
