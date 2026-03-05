import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChurchItem from './ChurchItem';
import { useNavigation } from '@react-navigation/native';

export default function AbsoluteContainer({ church }) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.absoluteContainer,
                { paddingBottom: Math.max(insets.bottom, 32) },
            ]}
        >
            {/* <Button
                title="Pokaż listę"
                onPress={() => navigation.navigate('ChurchList')}
            /> */}
            <ChurchItem
                id={church._id}
                name={church.name}
                image={church.image}
                masses={church.masses}
                profilesDataDuration={church.profilesData.drivingCar.duration}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    absoluteContainer: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        padding: 8,
    },
});
