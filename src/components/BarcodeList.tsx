import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BarcodeListProps {
  image?: string;
  codigos: string[];
  removerCodigo: (codigo: string) => void;
}

export const BarcodeList: React.FC<BarcodeListProps> = ({
  image,
  codigos,
  removerCodigo,
}) => {
  // Monta a lista como "chat": primeiro imagem, depois códigos
  const data = [
    ...(image ? [{ type: "image", uri: image, id: "img" }] : []),
    ...codigos.map((codigo, index) => ({
      type: "code",
      value: codigo,
      id: index.toString(),
    })),
  ];

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "image") {
      return (
        <View style={[styles.message, styles.imageMessage]}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </View>
      );
    }

    if (item.type === "code") {
      return (
        <View style={[styles.message, styles.codeMessage]}>
          <Text style={styles.codeText}>{item.value}</Text>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removerCodigo(item.value)}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </TouchableOpacity>
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
      ListHeaderComponent={image ? <Text>Foto e informações acima</Text> : null}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
    gap: 10,
  },
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
    elevation: 3,
  },
  imageMessage: {
    backgroundColor: "#e5f1ff",
    padding: 0,
  },
  image: {
    width: 200,
    height: 120,
    borderRadius: 12,
  },
  codeMessage: {
    backgroundColor: "#0057D9",
    flexDirection: "row",
    alignItems: "center",
  },
  codeText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  deleteBtn: {
    marginLeft: 8,
    backgroundColor: "#d9534f",
    padding: 6,
    borderRadius: 8,
  },
});
