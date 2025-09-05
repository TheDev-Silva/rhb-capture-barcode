import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../src/context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from "react";

export default function HistoryScreen() {
   const { pedidos, removerPedido } = useAppContext();
   const router = useRouter();
   // 1. Estado para armazenar o termo de busca
   const [searchTerm, setSearchTerm] = useState('');

   // 2. Lógica de filtragem
   const filteredPedidos = pedidos.filter(pedido => {
      // Converte o termo de busca e as strings de dados para minúsculas
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      // Verifica se o termo de busca está no nome ou número do pedido
      const matchesNameOrNumber = pedido.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
         pedido.numero.toLowerCase().includes(lowerCaseSearchTerm);

      // Concatena todos os códigos de todos os blocos em uma única string
      const allCodes = pedido.codeBlocks.flatMap(block => block.codes).join(' ').toLowerCase();

      // Verifica se o termo de busca está nos códigos
      const matchesCode = allCodes.includes(lowerCaseSearchTerm);

      return matchesNameOrNumber || matchesCode;
   });


   const renderItem = ({ item }: any) => {
      return (
         <View>
            <TouchableOpacity
               style={styles.card}
               onPress={() => router.push(`/details/${item.id}`)}
            >
               <View style={styles.cardHeader}>
                  <View>
                     <Text style={styles.title}>NOME: {item.nome}</Text>
                     <Text style={styles.info}>PEDIDO: {item.numero}</Text>
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
            <TextInput
               placeholder="Busque por nome, número ou código..."
               placeholderTextColor="#888"
               style={styles.searchInput}
               // 3. Conecta o TextInput ao estado de busca
               onChangeText={setSearchTerm}
               value={searchTerm}
            />

            {filteredPedidos.length === 0 ? (
               <Text style={styles.noResultsText}>Nenhum pedido encontrado.</Text>
            ) : (
               // 4. Usa a lista filtrada
               <FlatList
                  data={filteredPedidos}
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
   searchInput: {
      width: '100%',
      padding: 15,
      borderColor: '#c5c5c5',
      borderWidth: 1,
      marginBottom: 20,
      borderRadius: 10,
      backgroundColor: '#f9f9f9'
   },
   noResultsText: {
      textAlign: 'center',
      marginTop: 20,
      color: '#888'
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