import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../src/context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from "react";

export default function HistoryScreen() {
   const { pedidos, removerPedido } = useAppContext();
   const router = useRouter();

   const renderItem = ({ item }: any) => {
      return (
         <View>
            <TouchableOpacity
               style={styles.card}
               onPress={() => router.push(`/details/${item.id}`)}
            >
               <View style={styles.cardHeader}>
                  <View>
                     <Text style={styles.title}>{item.nome}</Text>
                     <Text style={styles.info}>Pedido: {item.numero}</Text>
                  </View>
                  <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
               </View>

               <Text style={styles.showAllText}>
                  Exibir todos os detalhes
               </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => removerPedido(item.id)} style={styles.deleteButton}>
               <MaterialCommunityIcons name="delete" size={40} color={'#f009'} />
            </TouchableOpacity>
         </View>
      );
   };

   return (
      <SafeAreaView style={styles.safeArea}>
         <View style={styles.container}>
            <Text style={styles.header}>Histórico</Text>
            {pedidos.length === 0 ? (
               <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum pedido salvo.</Text>
            ) : (
               <FlatList
                  data={pedidos}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
               />
            )}
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   safeArea: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
   container: { flex: 1, padding: 16, width: "100%" },
   header: {
      fontSize: 30,
      paddingBottom: 15,
      textTransform: "uppercase",
      fontWeight: "bold",
      color: "#0036a0",
   },
   card: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: "#008bf6",
      marginBottom: 12,
      justifyContent: 'center',
   },
   cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   title: { fontWeight: "bold", fontSize: 20, color: "#fff" },
   info: { color: "#fff", fontSize: 16, marginTop: 4 },
   showAllText: {
      color: '#fff',
      fontSize: 14,
      marginTop: 10,
      opacity: 0.8,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
   },
   deleteButton: {
      padding: 15,
      position: 'absolute',
      right: 10
   },
});