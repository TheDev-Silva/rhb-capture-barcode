import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const translateY = useRef(new Animated.Value(height)).current; // começa fora da tela
  console.log(translateY);

  const opacidyValue = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: height * 0.33, // sobe até 30% da tela (ou seja, ocupa 70%)
      duration: 1000,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacidyValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start()
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>


      <Animated.Image
        source={require('../assets/oficial.png')}
        style={{ objectFit: 'contain', width: 200, marginTop: 120, opacity: opacidyValue }}
        
      />
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {/* <Text style={styles.title}>Capture Barcode</Text> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/capture")}
        >
          <Text style={styles.buttonText}>Coletar código</Text>
          <Text style={[styles.buttonText, { fontSize: 14, fontWeight: '500', textTransform: 'none' }]}>(Serial Number)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.buttonText}>Buscar por...</Text>
          <Text style={styles.buttonText}>barcode / nome / pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/history")}
        >
          <Text style={styles.buttonText}>Histórico</Text>
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 50,
    marginTop: 20,
    color: '#fff'
  },
  animatedContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: "#0036a0",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    alignItems: "center",

  },
  button: {
    backgroundColor: "#fff",
    height: 70,
    borderRadius: 50,
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: 'center',

  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
    color: "#000",
    textTransform: 'uppercase',
    fontSize: 19,
    fontWeight: "600",
  },
});
