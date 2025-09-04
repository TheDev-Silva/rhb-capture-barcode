import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Modelos() {

    return (
        <View style={styles.container}>
            <Text>Modelos</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
})