import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../constants/colors';
import List from '../components/ChurchList/List';

const DUMMY_LIST = [
    {
        _id: '694c903d22fb9dd842f41fa5',
        name: 'św. Judy Tadeusza',
        city: 'Rzeszów',
        address: 'ul. Wita Stwosza 31',
        location: {
            type: 'Point',
            coordinates: [21.979363015884946, 50.03441912513484],
        },
        isCathedral: false,
        image: '224_rzeszow_judy-1024x683-350x350.jpg',
        dedicatedTo: 'św. Judy Tadeusza',
        distance: 634.0337718925038,
        masses: [
            {
                _id: '694c903d22fb9dd842f41fa9',
                time: '09:30',
                day: 'sunday',
                description: '',
            },
            {
                _id: '694c903d22fb9dd842f41faa',
                time: '11:00',
                day: 'sunday',
                description: '',
            },
            {
                _id: '694c903d22fb9dd842f41fab',
                time: '12:30',
                day: 'sunday',
                description: '',
            },
            {
                _id: '694c903d22fb9dd842f41fac',
                time: '18:00',
                day: 'sunday',
                description: '',
            },
        ],
        profilesData: {
            drivingCar: {
                distanceFromUser: 1448.9,
                duration: 231.1,
            },
        },
    },
    {
        _id: '694c903d22fb9dd842f41f3a',
        name: 'Narodzenia NMP',
        city: 'Rzeszów',
        address: 'ul. Staroniwska 78',
        location: {
            type: 'Point',
            coordinates: [21.961185606236825, 50.0292878026146],
        },
        isCathedral: false,
        image: '22_rzeszow_staroniwa-380x260-350x260.jpg',
        dedicatedTo: 'Narodzenia NMP',
        distance: 911.6338786141762,
        masses: [
            {
                _id: '694c903d22fb9dd842f41f3d',
                time: '10:30',
                day: 'sunday',
                description: '',
            },
            {
                _id: '694c903d22fb9dd842f41f3e',
                time: '12:00',
                day: 'sunday',
                description: '',
            },
        ],
        profilesData: {
            drivingCar: {
                distanceFromUser: 1372.2,
                duration: 219.3,
            },
        },
    },
    {
        _id: '694c903d22fb9dd842f41fde',
        name: 'Świętej Rodziny',
        city: 'Rzeszów',
        address: 'ul. Solarza 14',
        location: {
            type: 'Point',
            coordinates: [21.972669415885104, 50.04354142448128],
        },
        isCathedral: false,
        image: '226-rzeszow-oew-rodziny3-350x350.jpg',
        dedicatedTo: 'Świętej Rodziny',
        distance: 978.0959674841654,
        masses: [
            {
                _id: '694c903d22fb9dd842f41fe1',
                time: '09:00',
                day: 'sunday',
                description: '',
            },
            {
                _id: '694c903d22fb9dd842f41fe2',
                time: '10:30',
                day: 'sunday',
                description: '',
            },
        ],
        profilesData: {
            drivingCar: {
                distanceFromUser: 1715.5,
                duration: 265.3,
            },
        },
    },
    {
        _id: '694c903d2fb3d842f41fde',
        name: 'Świętej Rodziny',
        city: 'Rzeszów',
        address: 'ul. Solarza 14',
        location: {
            type: 'Point',
            coordinates: [21.972669415885104, 50.04354142448128],
        },
        isCathedral: false,
        image: '226-rzeszow-oew-rodziny3-350x350.jpg',
        dedicatedTo: 'Świętej Rodziny',
        distance: 978.0959674841654,
        masses: [
            {
                _id: '694c903d22fb9dd842f41fe1',
                time: '09:00',
                day: 'sunday',
                description: '',
            },
            {
                _id: '694c903d22fb9dd842f41fe2',
                time: '10:30',
                day: 'sunday',
                description: '',
            },
        ],
        profilesData: {
            drivingCar: {
                distanceFromUser: 1715.5,
                duration: 265.3,
            },
        },
    },
    {
        _id: '694c903d9dd842f41fde',
        name: 'Świętej Rodziny',
        city: 'Rzeszów',
        address: 'ul. Solarza 14',
        location: {
            type: 'Point',
            coordinates: [21.972669415885104, 50.04354142448128],
        },
        isCathedral: false,
        image: '226-rzeszow-oew-rodziny3-350x350.jpg',
        dedicatedTo: 'Świętej Rodziny',
        distance: 978.0959674841654,
        masses: [
            {
                _id: '694c903d22fb9dd842f41fe1',
                time: '09:00',
                day: 'sunday',
                description: '',
            },
            {
                _id: '694c903d22fb9dd842f41fe2',
                time: '10:30',
                day: 'sunday',
                description: '',
            },
        ],
        profilesData: {
            drivingCar: {
                distanceFromUser: 1715.5,
                duration: 265.3,
            },
        },
    },
];

export default function ChurchListScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();

    const { churches } = route.params;

    return (
        <View
            style={[
                styles.rootContainer,
                { paddingBottom: Math.max(insets.bottom, 24) },
            ]}
        >
            <List churches={churches} />
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: Colors.primary500,
        paddingVertical: 8,
    },
});
