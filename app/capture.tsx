import { useState, useEffect } from "react";
import {
   View,
   Text,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   Alert,
   Image,
   ScrollView,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
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
   const [image, setImage] = useState<string>("");
   const [scanning, setScanning] = useState(false);

   const { adicionarPedido } = useAppContext();
   const router = useRouter();

   useEffect(() => {
      (async () => {
         const { status } = await Camera.requestCameraPermissionsAsync();
         setHasPermission(status === "granted");
      })();
   }, []);

   // 📸 Selecionar ou tirar foto do pedido
   const pickImage = async () => {
      const result = await ImagePicker.launchCameraAsync({
         allowsEditing: true,
         quality: 0.7,
      });

      if (!result.canceled) {
         setImage(result.assets[0].uri);
      }
   };

   // 📡 Escanear código de barras
   const handleBarCodeScanned = ({ data }: { data: string }) => {
      if (scannedCodes.includes(data)) {
         Alert.alert("Atenção", `O código ${data} já foi escaneado.`);
         return;
      }
      setScannedCodes((prev) => [...prev, data]);
   };

   // 💾 Salvar Pedido
   const salvarPedido = () => {
      if (!nome || !numeroPedido || scannedCodes.length === 0) {
         Alert.alert("Preencha todos os campos antes de salvar.");
         return;
      }

      const novoPedido = {
         id: uuidv4(),
         numero: numeroPedido,
         image,
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
         <ScrollView contentContainerStyle={styles.container}>
            {/* Foto do pedido */}
            <View style={styles.imageBox}>
               {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
               ) : (
                  <Text style={{ color: "#999" }}>Nenhuma foto selecionada</Text>
               )}
            </View>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
               <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>

            {/* Scanner */}
            {scanning && (
               <View style={styles.scannerBox}>
                  <CameraView
                     style={StyleSheet.absoluteFillObject}
                     facing="back"
                     barcodeScannerSettings={{
                        barcodeTypes: ["qr", "ean13", "ean8", "code128"],
                     }}
                     onBarcodeScanned={handleBarCodeScanned}
                  />
               </View>
            )}

            <TouchableOpacity
               style={styles.scanButton}
               onPress={() => setScanning((prev) => !prev)}
            >
               <Text style={styles.buttonText}>
                  {scanning ? "Parar Scanner" : "Coletar Código de Barra"}
               </Text>
            </TouchableOpacity>

            {/* Inputs */}
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

            {/* Lista de códigos */}
            <BarcodeList
               image={image}
               codigos={scannedCodes}
               removerCodigo={(codigo) =>
                  setScannedCodes((prev) => prev.filter((c) => c !== codigo))
               }
            />

            {/* Botões de ação */}
            <View style={styles.buttonsRow}>
               <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#d9534f" }]}
                  onPress={() => router.back()}
               >
                  <Text style={styles.buttonText}>Cancelar</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.actionBtn} onPress={salvarPedido}>
                  <Text style={styles.buttonText}>Finalizar e Salvar</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: "#f5f5f5",
   },
   container: {
      padding: 16,
      alignItems: "center",
   },
   imageBox: {
      width: "100%",
      height: 150,
      borderWidth: 1,
      borderColor: "#ccc",
      marginBottom: 12,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: "#eee",
   },
   image: { width: "100%", height: "100%", resizeMode: "cover" },
   uploadBtn: {
      backgroundColor: "#0057D9",
      padding: 10,
      borderRadius: 20,
      marginBottom: 16,
   },
   uploadText: { color: "#fff", fontWeight: "bold" },
   scannerBox: {
      width: "100%",
      height: 200,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: "#0057D9",
      borderRadius: 8,
      overflow: "hidden",
   },
   scanButton: {
      backgroundColor: "#0057D9",
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 12,
      width: "100%",
   },
   input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      width: "100%",
      backgroundColor: "#fff",
   },
   buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      width: "100%",
   },
   actionBtn: {
      flex: 1,
      backgroundColor: "#0057D9",
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 4,
   },
   buttonText: { color: "#fff", fontWeight: "600" },
});
