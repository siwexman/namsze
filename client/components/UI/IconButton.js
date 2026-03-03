import Ionicons from '@react-native-vector-icons/ionicons';
import { Pressable, View, Text, StyleSheet } from 'react-native';

export default function IconButton({
    color,
    icon,
    onPress,
    text,
    textStyles,
    containerStyles,
    iconContainer,
    size = 24,
}) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                text && [styles.box, containerStyles],
                pressed && styles.pressed,
            ]}
            onPress={onPress}
        >
            {text && (
                <View style={styles.textContainer}>
                    <Text style={[styles.text, { color: color }, textStyles]}>
                        {text}
                    </Text>
                </View>
            )}
            <View style={iconContainer}>
                <Ionicons name={icon} color={color} size={size} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
    },
    pressed: {
        opacity: 0.7,
    },
    box: {
        padding: 4,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: 'white',
    },
    textContainer: {
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    text: {
        fontSize: 16,
    },
});
