import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface BarcodeListProps {
  codigos: string[];
}

export function BarcodeList({ codigos }: BarcodeListProps) {
  if (codigos.length === 0) {
    return <Text style={styles.empty}>Nenhum código coletado.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={codigos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.code}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  empty: { fontSize: 14, color: "#666", textAlign: "center", marginVertical: 10 },
  code: { fontSize: 14, marginBottom: 6, color: "#333" },
});
