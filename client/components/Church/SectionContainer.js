import { StyleSheet, View, Text } from 'react-native';

import DayHours from './DayHours';

const WEEK_DAYS = [
    { day: 'dni powszednie', dayOfWeek: 'weekday' },
    { day: 'niedziela i święta', dayOfWeek: 'sunday' },
];

export default function SectionContainer({ sectionName, data }) {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, styles.section]}>{sectionName}</Text>
            <View>
                {WEEK_DAYS.map(day => (
                    <View key={day.day} style={styles.dayContainer}>
                        <Text style={[styles.text, styles.dayText]}>
                            {day.day}:
                        </Text>
                        <View style={styles.timesContainer}>
                            <DayHours data={data} dayOfWeek={day.dayOfWeek} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 18,
    },
    dayContainer: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    dayText: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    timesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    section: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});
