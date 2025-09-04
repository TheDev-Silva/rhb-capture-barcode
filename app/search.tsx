import { useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";
import { useAppContext } from "../src/context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const { pedidos } = useAppContext();
  const router = useRouter();

  const resultados = pedidos.filter(
    (p) =>
      p.numero.includes(query) ||
      p.nome.toLowerCase().includes(query.toLowerCase()) ||
      p.codeBlocks.some((c) => c.codes.includes(query))
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por código, nome ou número"
          value={query}
          onChangeText={setQuery}
        />

        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/details/${item.id}`)}>
              <Text style={styles.title}>{item.nome}</Text>
              <Text>Pedido: {item.numero}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 12 },
  card: { padding: 16, borderRadius: 8, backgroundColor: "#f2f2f2", marginBottom: 12 },
  title: { fontWeight: "bold", fontSize: 16 },
});
