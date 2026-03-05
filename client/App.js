import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import StackScreens from './screens/StackScreens';

export default function App() {
    return (
        <>
            <StatusBar style="auto" />
            <NavigationContainer>
                <StackScreens />
            </NavigationContainer>
        </>
    );
}
