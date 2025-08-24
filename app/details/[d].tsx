import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useAppContext } from "../../src/context/AppContext";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const { buscarPedido } = useAppContext();

  const pedido = buscarPedido(id as string);

  if (!pedido) {
    return <Text>Pedido não encontrado.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pedido.nome}</Text>
      <Text>Pedido Nº: {pedido.numero}</Text>
      <Text>Data: {new Date(pedido.criadoEm).toLocaleString()}</Text>

      <Text style={styles.subtitle}>Códigos:</Text>
      <FlatList
        data={pedido.codigos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.code}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  code: { fontSize: 14, marginBottom: 4, color: "#333" },
});
