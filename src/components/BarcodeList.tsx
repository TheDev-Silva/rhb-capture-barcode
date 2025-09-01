import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CodeBlock } from "../types";


interface BarcodeListProps {
  image?: string;
  photoTimestamp?: string;
  codeBlocks: CodeBlock[];
  removerCodigo: (timestamp: string, codigo: string) => void;
}

export const BarcodeList: React.FC<BarcodeListProps> = ({
  image,
  photoTimestamp,
  codeBlocks,
  removerCodigo,
}) => {
  const data = [
    ...(image ? [{ type: "image", uri: image, id: "img" }] : []),
    ...codeBlocks.map((block, index) => ({
      type: "block",
      timestamp: block.timestamp,
      codes: block.codes,
      id: `block-${index}`,
    })),
  ];

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "image") {
      return (
        <View style={[styles.message, styles.imageMessage]}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <View style={styles.imageFooter}>
            <Text style={styles.timestamp}>
              {photoTimestamp
                ? new Date(photoTimestamp).toLocaleString()
                : "Foto confirmada"}
            </Text>
            <Ionicons name="checkmark" size={22} color="#2ecc71" />
          </View>
        </View>
      );
    }

    if (item.type === "block") {
      return (
        <View style={styles.blockContainer}>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
          {item.codes.map((c: string) => (
            <View key={c} style={[styles.message, styles.codeMessage]}>
              <Text style={styles.codeText}>{c}</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removerCodigo(item.timestamp, c)}
              >
                <Ionicons name="trash-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: { paddingVertical: 8, gap: 10 },
  message: {
    alignSelf: "flex-end",
    maxWidth: "80%",
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 0,
  },
  imageMessage: { backgroundColor: "#e5f1ff99", padding: 2 },
  image: { width: 200, height: 120, borderRadius: 12 },
  blockContainer: { marginBottom: 10 },
  imageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timestamp: { fontSize: 12, color: "#555", marginBottom: 4 },
  codeMessage: { backgroundColor: "#0057D9", flexDirection: "row", alignItems: "center", marginBottom: 4 },
  codeText: { color: "#fff", fontSize: 16, flex: 1 },
  deleteBtn: { marginLeft: 8, backgroundColor: "#d9534f", padding: 6, borderRadius: 8 },
});
