import { View, Text, StyleSheet, Pressable } from 'react-native';
import ChurchIcon from '../UI/ChurchIcon';
import ChurchIconSmall from '../UI/ChurchIconSmall';
import Ionicons from '@react-native-vector-icons/ionicons';

export default function ButtonBox({
    title,
    onPress,
    isIcon,
    textStyles,
    icon,
    containerStyles,
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                containerStyles,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.box}>
                {(icon || isIcon) && (
                    <View
                        style={[styles.iconContainer, icon && styles.ionicIcon]}
                    >
                        {isIcon && <ChurchIcon />}
                        {icon?.icon === 'church' && <ChurchIconSmall />}
                        {icon && icon?.icon !== 'church' && (
                            <Ionicons
                                name={icon.icon}
                                size={icon.size}
                                color={icon.color}
                            />
                        )}
                    </View>
                )}
                <Text style={[styles.text, textStyles]}>{title}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.7,
    },
    box: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        // backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
        margin: 8,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    text: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        // color: Colors.primary700,
        color: 'white',
    },
    ionicIcon: {
        paddingVertical: 6,
    },
});
