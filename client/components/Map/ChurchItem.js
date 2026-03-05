import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants/colors';
import IconButton from '../UI/IconButton';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ChurchItem({
    id,
    name,
    image,
    masses,
    profilesDataDuration,
}) {
    const navigation = useNavigation();
    const drivingDuration = Math.ceil(profilesDataDuration / 60);

    const goToChurch = useCallback(() => {
        navigation.navigate('Church', { id });
    }, [navigation, id]);

    const images = require.context(
        '../../assets/dummy-img',
        false,
        /\.(png|jpe?g|svg)$/,
    );

    const getImage = name => {
        try {
            // Metro expects the key to look like './filename.jpg'
            return images(`./${name}`);
        } catch (e) {
            console.warn(`Image ${name} not found`);
            return require('../../assets/icon.png');
        }
    };

    return (
        <View style={styles.churchContainer}>
            <View style={styles.churchTitleContainer}>
                <Text style={styles.churchTitle}>{name}</Text>
                <IconButton
                    icon={'ellipsis-vertical-outline'}
                    color={'black'}
                    size={28}
                    onPress={goToChurch}
                />
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={getImage(image)}
                        // source={{uri:''}}
                    />
                </View>
                <View style={styles.dataContainer}>
                    <View>
                        <ScrollView
                            style={styles.rowContainer}
                            contentContainerStyle={{ gap: 4 }}
                            horizontal
                            alwaysBounceHorizontal={false}
                        >
                            {masses?.map(mass => (
                                <View
                                    key={mass._id}
                                    style={styles.contentContainer}
                                >
                                    <Text style={styles.contentText}>
                                        {mass.time}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={[styles.rowContainer, styles.justifyCenter]}>
                        <View style={styles.contentContainer}>
                            <Text style={styles.contentText}>
                                Trwa spowiedź
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Ionicons name="car" color={'black'} size={20} />
                        <Text style={styles.text}>
                            ~{drivingDuration || 0} min
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    churchContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    churchTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        paddingVertical: 8,
    },
    churchTitle: {
        fontSize: 24,
    },
    infoContainer: {
        flexDirection: 'row',
        paddingBottom: 4,
        height: 120,
        gap: 8,
    },
    imageContainer: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },
    dataContainer: {
        flex: 1,
        paddingVertical: 4,
        justifyContent: 'space-between',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    justifySpaceBetween: {
        justifyContent: 'space-between',
    },
    contentContainer: {
        padding: 4,
        borderRadius: 4,
        backgroundColor: Colors.green,
    },
    contentText: {
        color: 'white',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
    },
});
