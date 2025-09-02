import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../src/context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from "react";



export default function HistoryScreen() {
   const { pedidos, removerPedido } = useAppContext();
   const router = useRouter();
   const [toggle, setToggle] = useState(false)

   const handleToggle = () => {

     
         setToggle(!toggle)
   

   }


   const renderItem = ({ item }: any) => {
      const blocks = item.codeBlocks || []; // garante que não seja undefined
      const totalCodes = blocks.reduce((acc: number, block: any) => acc + (block.codes?.length || 0), 0);
      const allCodes = blocks
         .map((block: any) => (block.codes || []).join(", "))
         .join("; ");

      return (
         <View>
            <TouchableOpacity
               style={styles.card}
               onPress={() => router.push(`/details/${item.id}`)}
            >
               <Text style={styles.title}>{item.nome}</Text>
               <Text style={styles.info}>Pedido: {item.numero}</Text>
               <Text style={styles.info}>{totalCodes} código(s) coletado(s)</Text>

               <Text style={styles.info}>Códigos</Text>
               <Text style={[styles.info, { fontSize: 18, color: '#000' }]}>[ {allCodes} ]</Text>
               <TouchableOpacity onPress={handleToggle} style={styles.imageToggleButton}>
                    <Text style={styles.imageToggleText}>
                        {toggle ? "Ocultar Imagem" : "Mostrar Imagem"}
                    </Text>
                </TouchableOpacity>
                {toggle && item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : null}
                {!toggle && !item.image && (
                    <Text style={styles.noImageText}>Sem imagem a exibir</Text>
                )}

            </TouchableOpacity>
            <TouchableOpacity onPress={() => removerPedido(item.id)} style={{ padding: 15, position: 'absolute', right: 10 }}>
               <Text style={{ textAlign: 'center', fontSize: 16, color: '#fff' }}>
                  <MaterialCommunityIcons name="delete" size={40} color={'#f009'} />
               </Text>
            </TouchableOpacity>
         </View>
      );
   };

   console.log('dados de:', pedidos);
   return (
      <SafeAreaView style={styles.safeArea}>
         <View style={styles.container}>
            <Text style={styles.header}>Histórico</Text>
            {pedidos.length === 0 ? (
               <Text>Nenhum pedido salvo.</Text>
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
   image: {
      width: '100%',
      minHeight: 200,
      marginTop: 16,
      borderRadius: 10,
   },
   header: {
      fontSize: 30,
      paddingBottom: 15,
      textTransform: "uppercase",
      fontWeight: "bold",
      color: "#0036a0",
   },
   card: { padding: 16, borderRadius: 8, backgroundColor: "#008bf6", marginBottom: 12 },
   title: { fontWeight: "bold", fontSize: 20, marginBottom: 4, color: "#fff" },
   info: { color: "#fff", fontSize: 16, paddingVertical: 4 },
   imageToggleText: {
      fontSize: 16,
      color: '#0057D9',
      fontWeight: 'bold',
  },
  noImageText: {
      textAlign: 'center',
      marginTop: 10,
      color: '#fff',
  },
  imageToggleButton: {
   backgroundColor: '#fff',
   padding: 10,
   borderRadius: 5,
   alignSelf: 'flex-start',
   marginTop: 10,
},
});
