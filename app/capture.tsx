import { useState, useEffect, useRef } from "react";
import * as FileSystem from "expo-file-system";
import {
   View,
   Text,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   Alert,
   Animated,
   Dimensions,
   ScrollView,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAppContext } from "../src/context/AppContext";
import { BarcodeList } from "../src/components/BarcodeList";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { CodeBlock } from "../src/types";


const { height } = Dimensions.get("window");

const generateId = () => Math.random().toString(36).substring(2, 10);

export default function CaptureScreen() {
   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
   const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
   const [scannedCodes, setScannedCodes] = useState<string[]>([]);
   const [nome, setNome] = useState("");
   const [numeroPedido, setNumeroPedido] = useState("");
   const [image, setImage] = useState<string>("");
   const [photoTimestamp, setPhotoTimestamp] = useState<string>("");
   const [scanning, setScanning] = useState(false);
   const { adicionarPedido } = useAppContext();
   const router = useRouter();

   const translateY = useRef(new Animated.Value(height)).current;

   useEffect(() => {
      (async () => {
         const { status } = await ImagePicker.requestCameraPermissionsAsync();
         setHasPermission(status === "granted");
      })();
   }, []);

   useEffect(() => {
      if (image) {
         Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
         }).start();
      }
   }, [image]);

   const playScanSound = async () => {
      try {
         const { sound } = await Audio.Sound.createAsync(require("../assets/beep-07a.mp3"));
         await sound.playAsync();
         sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
         });
      } catch (error) {
         console.log("Erro ao tocar som", error);
      }
   };

   const pickImage = async () => {
      const result = await ImagePicker.launchCameraAsync({
         mediaTypes: 'images',
         allowsEditing: true,
         aspect: [4, 3],
         quality: 0.7,
      });

      if (!result.canceled) {
         const tempUri = result.assets[0].uri;
         const fileName = tempUri.split('/').pop(); // Extrai o nome do arquivo

         // Define o caminho permanente dentro do diretório de documentos do app
         const permanentUri = `${FileSystem.documentDirectory}${fileName}`;

         try {
            // Move o arquivo do cache para o local permanente
            await FileSystem.moveAsync({
               from: tempUri,
               to: permanentUri,
            });

            // Atualiza o estado com a nova URI permanente
            setImage(permanentUri);
            setPhotoTimestamp(new Date().toISOString());

         } catch (error) {
            console.error("Erro ao salvar a imagem:", error);
            Alert.alert("Erro", "Não foi possível salvar a imagem. Tente novamente.");
         }
      }
   };


   const handleBarCodeScanned = ({ data }: { data: string }) => {
      if (!scannedCodes.includes(data)) {
         setScannedCodes((prev) => [...prev, data]);
         playScanSound();
      }
   };

   const finalizarBloco = () => {
      if (scannedCodes.length > 0) {
         const timestamp = new Date().toISOString();
         setCodeBlocks((prev) => [...prev, { timestamp, codes: scannedCodes }]);
         setScannedCodes([]);
      }
   };

   const removerCodigo = (timestamp: string, codigo: string) => {
      setCodeBlocks((prev) =>
         prev.map((block) =>
            block.timestamp === timestamp
               ? { ...block, codes: block.codes.filter((c) => c !== codigo) }
               : block
         )
      );
   };


   const salvarPedido = () => {
      if (scannedCodes.length > 0) {
         // cria o último bloco localmente
         const timestamp = new Date().toISOString();
         const ultimoBloco = { timestamp, codes: scannedCodes };
         const todosBlocos = [...codeBlocks, ultimoBloco];

         if (!nome || !numeroPedido || todosBlocos.length === 0) {
            Alert.alert("Preencha todos os campos antes de salvar.");
            return;
         }

         const novoPedido = {
            id: generateId(),
            numero: numeroPedido,
            image: image,
            nome: nome,
            codeBlocks: todosBlocos,
            criadoEm: new Date().toISOString(),
         };

         adicionarPedido(novoPedido as any);
         Alert.alert("Sucesso", "Pedido salvo com sucesso!");
         router.push("/history");

         // limpa estados
         setScannedCodes([]);
         setCodeBlocks([]);
         setImage("");
         setPhotoTimestamp("");
      } else {
         if (!nome || !numeroPedido || !image || codeBlocks.length === 0) {
            Alert.alert("Preencha todos os campos antes de salvar.");
            return;
         }
         // se não houver códigos novos, salvar normalmente
         const novoPedido = {
            id: generateId(),
            numero: numeroPedido,
            image: image,
            nome: nome,
            codeBlocks,
            criadoEm: new Date().toISOString(),
         };
         adicionarPedido(novoPedido as any);
         Alert.alert("Sucesso", "Pedido salvo com sucesso!");
         router.push("/history");

         // limpa estados
         setScannedCodes([]);
         setCodeBlocks([]);
         setImage("");
         setPhotoTimestamp("");
      }
   };


   if (hasPermission === null) return <Text>Solicitando permissão da câmera...</Text>;
   if (hasPermission === false) return <Text>Permissão negada para usar a câmera.</Text>;

   return (
      <SafeAreaView style={styles.safeArea}>

         {!scanning ? (
            <View style={styles.formArea}>
               <View style={{ paddingVertical: 20, flexDirection: 'column' }}>

                  <Text style={{ textAlign: 'center', fontSize: 30, fontWeight: '800' }}>Bem-vindo!</Text>
                  <Text style={{ textAlign: 'center', fontSize: 20 }}>Colete as informações, salve e compartilhada!</Text>
               </View>
               <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                  <Text style={styles.uploadText}>{image ? "Refazer Foto" : "Tirar Foto"}</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  style={[styles.uploadBtn, { opacity: !image ? 0.5 : 1 }]}
                  onPress={() => {
                     finalizarBloco(); // salva qualquer bloco antes de abrir scanner
                     setScanning(true);
                  }}
                  disabled={!image}
               >
                  <Text style={styles.uploadText}>Coletar Código de Barra</Text>
               </TouchableOpacity>

               <TextInput style={styles.input} placeholder="Nome de quem fez" value={nome} onChangeText={setNome} />
               <TextInput style={styles.input} placeholder="Número do pedido" value={numeroPedido} onChangeText={setNumeroPedido} />

               <Animated.View style={[styles.chatArea, { transform: [{ translateY }] }]}>
                  <BarcodeList
                     image={image}
                     photoTimestamp={photoTimestamp}
                     codeBlocks={codeBlocks}
                     removerCodigo={removerCodigo}
                  />

                  <View style={styles.buttonsRow}>
                     <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#d9534f" }]} onPress={() => router.back()}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.actionBtn} onPress={salvarPedido}>
                        <Text style={styles.buttonText}>Finalizar e Salvar</Text>
                     </TouchableOpacity>
                  </View>
               </Animated.View>
            </View>
         ) : (
            <View style={styles.fullScreenCamera}>
               <CameraView
                  style={StyleSheet.absoluteFillObject}
                  barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "code128"] }}
                  onBarcodeScanned={handleBarCodeScanned}
               />

               <ScrollView style={styles.overlayCodes}>
                  {codeBlocks.map((block) => (
                     <View key={block.timestamp} style={{ marginBottom: 6 }}>
                        <Text style={styles.timestamp}>{new Date(block.timestamp).toLocaleTimeString()}</Text>
                        {block.codes.map((c) => (
                           <Text key={c} style={styles.codeText}>{c}</Text>
                        ))}
                     </View>
                  ))}
                  {scannedCodes.map((c) => (
                     <Text key={c} style={styles.codeText}>{c}</Text>
                  ))}
               </ScrollView>

               <View style={{ width: "100%", alignItems: "center" }}>
                  <TouchableOpacity
                     style={styles.stopScannerBtn}
                     onPress={() => {
                        finalizarBloco();
                        setScanning(false);
                     }}
                  >
                     <Text style={styles.buttonText}>Parar Scanner</Text>
                  </TouchableOpacity>
               </View>
            </View>
         )}
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: "#f5f5f5"
   },
   formArea: {
      flex: 1,
      padding: 16
   },
   uploadBtn: {
      width: "100%",
      backgroundColor: "#0057D9",
      padding: 16,
      borderRadius: 50,
      marginBottom: 16,
      alignItems: "center"
   },
   uploadText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16
   },
   input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 18,
      borderRadius: 8,
      marginBottom: 12,
      backgroundColor: "#fff"
   },
   chatArea: {
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      height: "53%",
      backgroundColor: "#008bf699",
      padding: 12,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4
   },
   buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      width: "100%"
   },
   actionBtn: { flex: 1, backgroundColor: "#0057D9", padding: 14, borderRadius: 8, alignItems: "center", marginHorizontal: 4 },
   buttonText: { color: "#fff", fontWeight: "800" },
   fullScreenCamera: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", alignItems: "center" },
   overlayCodes: { position: "absolute", top: 50, left: 16, right: 16, maxHeight: 200, backgroundColor: "#00000088", padding: 8, borderRadius: 12 },
   codeText: { color: "#fff", fontSize: 16 },
   timestamp: { fontSize: 12, color: "#fff", marginBottom: 2 },
   stopScannerBtn: { backgroundColor: "#d9534f", padding: 16, borderRadius: 50, marginBottom: 40, width: "80%", alignItems: "center" },
});
