import { useState } from "react";
import {
   View,
   TextInput,
   FlatList,
   Text,
   StyleSheet,
   TouchableOpacity,
   Modal,
   Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../src/context/AppContext";
import { Pedido } from "../src/types";

interface SearchItem {
   id: string;
   code: string;
   nome: string;
   numero: string;
   criadoEm: string
}

export default function SearchScreen() {
   const [query, setQuery] = useState("");
   const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null); // item clicado
   const { pedidos } = useAppContext();

   // 🔹 Cria uma lista achatada com todos os códigos
   const allCodes = pedidos.flatMap((p) =>
      p.codeBlocks.flatMap((c) =>
         c.codes.map((code) => ({
            id: `${p.id}-${code}`, // id único
            code,
            nome: p.nome,
            numero: p.numero,
            criadoEm: p.criadoEm
         }))
      )
   );

   // 🔹 Filtro baseado na query
   const resultados = allCodes.filter(
      (item) =>
         item.code.startsWith(query) ||
         item.nome.toLowerCase().includes(query.toLowerCase()) ||
         item.numero.startsWith(query)
   );

   return (
      <SafeAreaView style={styles.safeArea}>
         <View style={styles.container}>
            <View>
               <Text style={styles.header}>códigos</Text>
               <Text style={{ fontSize: 18, marginBottom: 15 }}>
                  veja e pesquise aqui todos os códigos!
               </Text>

               <TextInput
                  placeholder="Digite um serial number..."
                  placeholderTextColor="#888"
                  style={styles.searchInput}
                  onChangeText={setQuery}
                  value={query}
               />
            </View>

            {/* Lista de Resultados */}
            <FlatList
               data={resultados}
               keyExtractor={(item) => item.id}
               ListEmptyComponent={
                  <Text style={styles.noResultsText}>Nenhum código encontrado</Text>
               }
               renderItem={({ item }) => (
                  <TouchableOpacity
                     style={styles.card}
                     onPress={() => setSelectedItem(item)} // abre modal
                  >
                     <Text style={styles.title}>Código: {item.code}</Text>
                     <Text>Pedido: {item.numero}</Text>
                  </TouchableOpacity>
               )}
            />

            {/* 🔹 Modal com autor do pedido */}
            <Modal
               visible={!!selectedItem}
               transparent
               animationType="slide"
               onRequestClose={() => setSelectedItem(null)}
            >
               <View style={styles.modalBackground}>
                  <View style={styles.modalContent}>
                  <View style={styles.autor}>

                     {selectedItem && <Text style={styles.modalTitle}>Coletado por</Text>}
                     {selectedItem && <Text style={[styles.modalTitle, {textTransform: 'uppercase'}]}>{selectedItem.nome}</Text>}
                  </View>
                     {selectedItem && (

                        <View>
                           <View style={[styles.autor, { borderBottomWidth: 1, borderColor: '#e5e5e5', paddingVertical: 10 }]}>
                              <Text style={{ fontSize: 18, fontWeight: '500' }}>Em</Text>
                              <Text style={{ fontSize: 18, fontWeight: '500', color: '#8c8c8c' }}>{new Date(selectedItem.criadoEm).toLocaleString()}</Text>
                           </View>
                           <View style={[styles.autor, { borderBottomWidth: 1, borderColor: '#e5e5e5', paddingVertical: 10, }]}>
                              <Text style={{ fontSize: 18, fontWeight: '500' }}>Código</Text>
                              <Text style={{ fontSize: 18, fontWeight: '500', color: '#8c8c8c' }}>{selectedItem.code}</Text>
                           </View>

                           <View style={[styles.autor, { borderBottomWidth: 1, borderColor: '#e5e5e5', paddingVertical: 10 }]}>
                              <Text style={{ fontSize: 18, fontWeight: '500' }}>Pedido</Text>
                              <Text style={{ fontSize: 18, fontWeight: '500', color: '#8c8c8c' }}>{selectedItem.numero}</Text>
                           </View>




                        </View>


                     )}

                     <Pressable
                        style={styles.closeButton}
                        onPress={() => setSelectedItem(null)}
                     >
                        <Text style={{ color: "#fff", textAlign: 'center', fontSize: 18 }}>Fechar</Text>
                     </Pressable>
                  </View>
               </View>
            </Modal>
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: "#f5f5f5",
   },
   header: {
      fontSize: 30,
      textTransform: "uppercase",
      fontWeight: "bold",
      color: "#0036a0",
   },
   container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
   },
   searchInput: {
      width: "100%",
      padding: 15,
      borderColor: "#c5c5c5",
      borderWidth: 1,
      marginBottom: 20,
      borderRadius: 10,
      backgroundColor: "#f9f9f9",
   },
   noResultsText: {
      textAlign: "center",
      marginTop: 20,
      color: "#888",
   },
   card: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: "#f2f2f2",
      marginBottom: 12,
   },
   title: {
      fontWeight: "bold",
      fontSize: 16,
   },
   modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
   },
   modalContent: {
      backgroundColor: "#fff",

      padding: 20,
      borderRadius: 10,
      width: "90%",
      minHeight: 250,
      alignItems: "center",
   },
   modalTitle: {
     
      fontSize: 20,
      fontWeight: "bold",
      textAlign: 'center',
      paddingBottom: 10,
      
   },
   autor: {
      marginBottom: 10,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: '#000'
   },
   closeButton: {
      width: '100%',
      marginTop: 20,
      padding: 15,
      backgroundColor: "#0036a0",
      borderRadius: 8,
   },
});
