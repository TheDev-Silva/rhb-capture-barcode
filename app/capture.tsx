import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import "react-native-get-random-values";
import { useRouter } from "expo-router";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "../src/context/AppContext";
import { BarcodeList } from "../src/components/BarcodeList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CaptureScreen() {
   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
   const [scannedCodes, setScannedCodes] = useState<string[]>([]);
   const [nome, setNome] = useState("");
   const [numeroPedido, setNumeroPedido] = useState("");
   const [scanned, setScanned] = useState(false);

   const { adicionarPedido } = useAppContext();
   const router = useRouter();

   useEffect(() => {
      (async () => {
         const { status } = await Camera.requestCameraPermissionsAsync();
         setHasPermission(status === "granted");
      })();
   }, []);

   const handleBarCodeScanned = ({ data }: { data: string }) => {
      if (!scannedCodes.includes(data)) {
         setScannedCodes((prev) => [...prev, data]);
      }
      setScanned(true);
   };

   const salvarPedido = () => {
      if (!nome || !numeroPedido || scannedCodes.length === 0) {
         Alert.alert("Preencha todos os campos antes de salvar.");
         return;
      }

      const novoPedido = {
         id: uuidv4(),
         numero: numeroPedido,
         nome,
         codigos: scannedCodes,
         criadoEm: new Date().toISOString(),
      };

      adicionarPedido(novoPedido);
      Alert.alert("Sucesso", "Pedido salvo com sucesso!");
      router.push("/history");
   };

   if (hasPermission === null) {
      return <Text>Solicitando permissão da câmera...</Text>;
   }
   if (hasPermission === false) {
      return <Text>Permissão negada para usar a câmera.</Text>;
   }

   return (
      <SafeAreaView style={styles.safeArea}>
         <View style={styles.container}>
            <View style={styles.scannerBox}>
               <CameraView
                  style={StyleSheet.absoluteFillObject}
                  facing="back"
                  barcodeScannerSettings={{
                     barcodeTypes: ["qr", "ean13", "ean8", "code128"], // pode adicionar mais se precisar
                  }}
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
               />
            </View>

            <TouchableOpacity
               style={styles.rescanButton}
               onPress={() => setScanned(false)}
            >
               <Text style={styles.rescanText}>Escanear Novamente</Text>
            </TouchableOpacity>

            <TextInput
               style={styles.input}
               placeholder="Nome de quem fez"
               value={nome}
               onChangeText={setNome}
            />
            <TextInput
               style={styles.input}
               placeholder="Número do pedido"
               value={numeroPedido}
               onChangeText={setNumeroPedido}
            />

            {/* Exibir lista de códigos */}
            <BarcodeList codigos={scannedCodes} />

            <TouchableOpacity style={styles.button} onPress={salvarPedido}>
               <Text style={styles.buttonText}>Salvar Pedido</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16, backgroundColor: "#fff", width: '100%', },
   safeArea: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
   },
   scannerBox: {
      height: 200,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: "#0057D9"
   },
   rescanButton: {
      marginBottom: 12,
      alignItems: "center"
   },
   rescanText: {
      color: "#0057D9",
      fontWeight: "600"
   },
   input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 12,
      borderRadius: 8,
      marginBottom: 12
   },
   button: {
      backgroundColor: "#0057D9",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 12
   },
   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600"
   },
});
