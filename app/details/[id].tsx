import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useAppContext } from "../../src/context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";


export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const { buscarPedido } = useAppContext();

  const pedido = buscarPedido(id as string);

  

  console.log(id);

  if (!pedido) {
    return (
      <SafeAreaView style={styles.SafeArea}>
        <View style={styles.container}>
          <Text>Pedido não encontrado. {pedido}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{pedido.nome}</Text>
        <Text>Pedido Nº: {pedido.numero}</Text>
        <Text>Data: {new Date(pedido.criadoEm).toLocaleString()}</Text>

        <Text style={styles.subtitle}>Códigos:</Text>
        <FlatList
          data={Array.isArray(pedido.codeBlocks) ? pedido.codeBlocks : []}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.block}>
              <Text style={styles.timestamp}>
                {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Sem data'}
              </Text>
              {item.codes.map((code, i) => (
                <Text key={i} style={styles.code}>
                  {code}
                </Text>
              ))}
            </View>
          )}
        />

        {/* Mostrar imagem se existir */}
        {pedido.image && (
          <Image
            source={{ uri: pedido.image }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* Mostrar foto se existir (caso use os dois campos) */}
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 0,
  },
  SafeArea: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  block: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  timestamp: {
    fontSize: 12,
    color: "#555",
    marginBottom: 6,
  },
  code: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 16,
    borderRadius: 10,
  },
});
