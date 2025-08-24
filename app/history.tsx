import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../src/context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
   const { pedidos } = useAppContext();
   const router = useRouter();

   return (
      <SafeAreaView style={styles.safeArea}>

         <View style={styles.container}>
            <Text style={{ fontSize: 30, paddingBottom: 15, textTransform: "uppercase", fontWeight: 'bold', color: '#0036a0' }}>Histórico</Text>
            {pedidos.length === 0 ? (
               <Text>Nenhum pedido salvo.</Text>
            ) : (
               <FlatList
                  data={pedidos}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push(`/details/${item.id}`)}
                     >
                        <Text style={[styles.title, { paddingVertical: 5 }]}>{item.nome}</Text>
                        <Text style={{ color: '#fff', fontSize: 16, paddingVertical: 8, borderBottomColor: '#c5c5c5', borderBottomWidth: 1 }}>Pedido: {item.numero}</Text>
                        <Text style={{ color: '#fff', fontSize: 16, paddingVertical: 8, borderBottomColor: '#c5c5c5', borderBottomWidth: 1 }}>{item.codigos.length}
                           códigos coletados</Text>
                        <Text style={{ color: '#fff', fontSize: 16, paddingVertical: 8 }}>códig(os): {item.codigos}</Text>
                     </TouchableOpacity>
                  )}
               />
            )}
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16, backgroundColor: "#fff", width: '100%' },
   safeArea: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
   },
   card: { padding: 16, borderRadius: 8, backgroundColor: "#008bf6", marginBottom: 12 },
   title: { fontWeight: "bold", fontSize: 20, marginBottom: 4, color: '#fff' },
});
