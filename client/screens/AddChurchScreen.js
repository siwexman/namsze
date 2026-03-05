import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { Styles } from '../constants/styles';
import Form from '../components/Form/Form';
import Input from '../components/Form/Input';
import Ionicons from '@react-native-vector-icons/ionicons';
import IconButton from '../components/UI/IconButton';
import { Colors } from '../constants/colors';

export default function AddChurchScreen({ route, navigation }) {
    const { id } = route.params || {};

    return (
        <View style={styles.rootContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    {!!id ? 'Edytuj' : 'Dodaj'} Kościół
                </Text>
            </View>
            <Form>
                <ScrollView>
                    <Input label={'Wezwanie'} />
                    <Input label={'Nazwa'} />
                    <View style={styles.crucialContainer}>
                        <Text style={styles.crucialHeader}>Dodaj:</Text>
                        <View style={styles.crucialOptions}>
                            <Pressable
                                style={({ pressed }) =>
                                    pressed && styles.pressed
                                }
                                onPress={() => {}}
                            >
                                <View style={styles.crucialBox}>
                                    <Ionicons
                                        name="map"
                                        size={24}
                                        color={'white'}
                                    />
                                    <Text style={styles.crucialBoxText}>
                                        Lokalizacja
                                    </Text>
                                </View>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) =>
                                    pressed && styles.pressed
                                }
                            >
                                <View style={styles.crucialBox}>
                                    <Ionicons
                                        name="camera"
                                        size={24}
                                        color={'white'}
                                    />
                                    <Text style={styles.crucialBoxText}>
                                        Zdjęcie
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                    <Input label={'Adres'} />
                    <Input label={'Miasto'} />
                    <View style={[styles.crucialContainer, styles.submitBtn]}>
                        <IconButton
                            text={'Zapisz'}
                            icon={'checkmark'}
                            size={32}
                            textStyles={styles.submitText}
                            containerStyles={styles.submitContainer}
                            color={Colors.primary500}
                        />
                    </View>
                </ScrollView>
            </Form>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: { ...Styles.rootContainer },
    headerContainer: {
        width: '80%',
        paddingVertical: 8,
        marginBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'white',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    crucialContainer: {
        paddingVertical: 8,
        width: '100%',
        alignItems: 'center',
    },
    crucialHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    crucialOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        padding: 8,
    },
    pressed: {
        opacity: 0.7,
    },
    crucialText: {
        color: 'white',
    },
    crucialBox: {
        borderWidth: 2,
        borderRadius: 16,
        marginHorizontal: 8,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    crucialBoxText: {
        color: 'white',
        padding: 4,
    },
    submitBtn: {
        paddingTop: 16,
    },
    submitContainer: {
        backgroundColor: 'white',
    },
    submitText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
