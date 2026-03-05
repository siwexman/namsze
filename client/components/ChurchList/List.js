import { FlatList, StyleSheet } from 'react-native';
import ChurchItem from '../Map/ChurchItem';

export default function List({ churches }) {
    return (
        <FlatList
            style={styles.list}
            contentContainerStyle={{ gap: 8 }}
            data={churches}
            // scrollEnabled={false}
            renderItem={({ item }) => (
                <ChurchItem
                    id={item._id}
                    name={item.name}
                    image={item.image}
                    masses={item.masses}
                    profilesDataDuration={item.profilesData.drivingCar.duration}
                />
            )}
            keyExtractor={item => item._id}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        paddingHorizontal: 8,
    },
});
