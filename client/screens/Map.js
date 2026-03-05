import axios from 'axios';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants/colors';

import IconButton from '../components/UI/IconButton';
import AbsoluteContainer from '../components/Map/AbsoluteContainer';

export default function Map({ route, navigation }) {
    const [churches, setChurches] = useState();

    function goBackHandler() {
        navigation.goBack();
    }

    const goListHandler = useCallback(() => {
        navigation.navigate('ChurchList', { churches });
    }, [navigation]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTintColor: Colors.primary700,
            headerStyle: { backgroundColor: 'transparent' },
            headerLeft: ({ tintColor }) => (
                <IconButton
                    icon={'arrow-back'}
                    color={tintColor}
                    size={32}
                    iconContainer={styles.iconButton}
                    onPress={goBackHandler}
                />
            ),
            headerRight: ({ tintColor }) => (
                <IconButton
                    icon={'list'}
                    color={tintColor}
                    size={32}
                    iconContainer={styles.iconButton}
                    onPress={goListHandler}
                />
            ),
        });
    }, [navigation]);

    const [lat, lng] = [50.04330572449823, 21.96186661588509];
    const time = 8;

    const fetchNearbyChurches = async (lat, lng, time) => {
        try {
            const response = await axios.get(
                `http://172.19.112.227:3000/api/v1/churches/near-me/${lat},${lng}`,
                {
                    params: {
                        'time[gt]': time,
                    },
                },
            );

            return response.data;
        } catch (error) {
            console.error('Error fetching churches', error);
            throw error;
        }
    };

    useEffect(() => {
        async function fetchChurches() {
            const churches = await fetchNearbyChurches(lat, lng, time);

            setChurches(churches.data.data);
        }

        fetchChurches();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialCamera={{
                    center: {
                        latitude: 50.04330572449823,
                        longitude: 21.96186661588509,
                    },
                    pitch: 0,
                    heading: 0,
                    altitude: 1000,
                    zoom: 15,
                }}
            />
            {churches && <AbsoluteContainer church={churches[0]} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    iconButton: {
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 999,
    },
});
