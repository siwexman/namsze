import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../constants/colors';

import Map from './Map';
import HomeScreen from './HomeScreen';
import ChurchListScreen from './ChurchListScreen';
import ChurchScreen from './ChurchScreen';
import AddChurchScreen from './AddChurchScreen';
import FiltersScreen from './FiltersScreen';
import IconButton from '../components/UI/IconButton';

const Stack = createNativeStackNavigator();

export default function StackScreens() {
    const navigation = useNavigation();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary500 },
                headerTintColor: 'white',
                title: '',
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerRight: ({ tintColor }) => (
                        <IconButton
                            icon={'add'}
                            color={tintColor}
                            text={'Dodaj kościół'}
                            onPress={() => navigation.navigate('addChurch')}
                        />
                    ),
                }}
            />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen
                name="ChurchList"
                component={ChurchListScreen}
                options={{
                    title: 'Lista znalezionych kościołów',
                }}
            />

            <Stack.Screen name="Church" component={ChurchScreen} />
            <Stack.Screen name="addChurch" component={AddChurchScreen} />
            <Stack.Screen name="Filters" component={FiltersScreen} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
