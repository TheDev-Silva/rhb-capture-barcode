import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Pedido } from "../types";

interface HistoryItemProps {
  pedido: Pedido;
  onPress: () => void;
}

export function HistoryItem({ pedido, onPress }: HistoryItemProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{pedido.nome}</Text>
        <Text style={styles.date}>{new Date(pedido.criadoEm).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.text}>Pedido Nº: {pedido.numero}</Text>
      <Text style={styles.text}>{pedido.codigos.length} códigos coletados</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 10, backgroundColor: "#f2f2f2", marginBottom: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  title: { fontWeight: "bold", fontSize: 16, color: "#0057D9" },
  date: { fontSize: 12, color: "#666" },
  text: { fontSize: 14, color: "#333" },
});
