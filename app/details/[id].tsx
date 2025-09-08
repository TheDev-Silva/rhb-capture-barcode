import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity, Share } from "react-native";
import { useAppContext } from "../../src/context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CodeBlock } from "../../src/types";


export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const { pedidos, removerPedido } = useAppContext();
  const router = useRouter();

  // Use o .find() para buscar o pedido, é mais eficiente
  const pedido = pedidos.find(p => p.id === id);

  const handleRemove = () => {
    // Confirma com o usuário antes de excluir
    removerPedido(id as string);
    router.back();
  };

  const handleShare = async () => {

    if (!pedido) return;

    const allCodes = pedido.codeBlocks.flatMap((cb) => cb.codes);

    const message = `
    Detalhes do Pedido
    Autor: ${pedido.nome}
    Número: ${pedido.numero}
    Criado em: ${new Date(pedido.criadoEm).toLocaleString()}
    
    🔑 Códigos:
    ${allCodes.map(c => "•" + c).join("\n")}
        `;

    try {
      await Share.share({
        message,
        url: pedido.image ?? undefined, // se tiver imagem, alguns apps usam
        title: `Pedido ${pedido.numero}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }

  }


  if (!pedido) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={''}>
          <Text style={styles.notFoundText}>Pedido não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left-thick" size={30} color="#0057D9" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Detalhes do Pedido</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.infoTitle}>Nome:</Text>
          <Text style={styles.infoText}>{pedido.nome}</Text>

          <Text style={styles.infoTitle}>Número do Pedido:</Text>
          <Text style={styles.infoText}>{pedido.numero}</Text>

          <Text style={styles.infoTitle}>Criado em:</Text>
          <Text style={styles.infoText}>{new Date(pedido.criadoEm).toLocaleString()}</Text>

          {pedido.image && (
            <View style={styles.imageContainer}>
              <Text style={styles.infoTitle}>Imagem Anexada:</Text>
              <Image
                source={{ uri: pedido.image }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}

          <Text style={styles.infoTitle}>Códigos Coletados:</Text>
          {pedido.codeBlocks.map((block: CodeBlock, index: number) => (
            <View key={index} style={styles.codeBlock}>
              <Text style={styles.blockTitle}>{new Date(block.timestamp).toLocaleString()}</Text>
              {block.codes.map((code: string) => (
                <Text key={code} style={styles.codeText}>• {code}</Text>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Compartilhar Pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRemove} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Excluir Pedido</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContainer: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginLeft: 10, color: '#0036a0' },
  notFoundText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: 'gray' },
  card: { padding: 16, borderRadius: 10, backgroundColor: "#fff", marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#555' },
  infoText: { fontSize: 18, marginBottom: 5, color: '#333' },
  imageContainer: { marginTop: 10 },
  image: { width: '100%', minHeight: 250, borderRadius: 8, marginTop: 5 },
  codeBlock: { marginTop: 10, padding: 10, backgroundColor: '#eef', borderRadius: 8 },
  blockTitle: { fontWeight: 'bold', color: '#0057D9', marginBottom: 5 },
  codeText: { fontSize: 16, color: '#333' },
  shareButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});