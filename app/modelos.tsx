import React, { useMemo, useState } from "react";
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageModal from '../src/models/imageModal'; // Importe o componente que criamos
import { Pedido } from "../src/types";
import { useAppContext } from "../src/context/AppContext";


// Dados de exemplo para simular modelos (substitua com seus próprios dados)
const MODELOS_MOCK = [
    {
        id: '1',
        name: 'Impressora Multifuncional Mono Pantum Bm5100fdw Laser 127v',
        imageUri: require('../assets/modelos/Captura de tela 2025-09-04 224636.png'),
        codeInit: ['CK3B00 - CR8NV0']
    },
    {
        id: '2',
        name: 'Impressora Laser Pantum P3305dw Usb Lan Wireless Auto Duplex',
        imageUri: require('../assets/modelos/Captura de tela 2025-09-04 234808.png'),
        codeInit: ['CP2N00']
    },
    {
        id: '3',
        name: 'Impressora Função Única Mono Pantum P3010dw Branco 127v',
        imageUri: require('../assets/modelos/Captura de tela 2025-09-04 235017.png'),
        codeInit: ['CS5W00']
    },
    {
        id: '4',
        name: 'Impressora A Laser Ethernet Pantum Bp5100dw', // Novo item para demonstrar a funcionalidade
        imageUri: require('../assets/modelos/Captura de tela 2025-09-04 235258.png'),
        codeInit: ['CWB800']
    },
    {
        id: '5',
        name: 'Multifuncional Laser Pantum M6559nw 110v Com Wifi', // Novo item para demonstrar a funcionalidade
        imageUri: require('../assets/modelos/Captura de tela 2025-09-04 235627.png'),
        codeInit: ['CJ5V00']
    },
    {
        id: '6',
        name: 'Impressora A Laser Ethernet Pantum Bp5100dw', // Novo item para demonstrar a funcionalidade
        imageUri: require('../assets/modelos/Captura de tela 2025-09-04 235258.png'),
        codeInit: ['CBVV00']
    }
];

// 🔹 Função para extrair todos os códigos de todos os pedidos
function getAllCodesFromPedidos(pedidos: Pedido[]): string[] {
    return pedidos.flatMap((pedido) =>
        pedido.codeBlocks.flatMap((block) => block.codes)
    );
}

// 🔹 Função para pegar os códigos que pertencem a um modelo
function getCodigosDoModelo(modelo: { codeInit: string[] }, allCodes: string[]) {
    return allCodes.filter((codigo) =>
        modelo.codeInit.some((prefix) => codigo.startsWith(prefix))
    );
}




export default function Modelos() {
    const { pedidos } = useAppContext()
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState<number | null>(null);

    const allCodes = useMemo(() => getAllCodesFromPedidos(pedidos), [pedidos])

    const openModal = (imageUri: number) => {
        setSelectedImageUri(imageUri);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImageUri(null);
    };

    const filteredModels = MODELOS_MOCK.filter(modelo => {
        const termo = searchTerm.toLowerCase();
    
        // busca pelo nome
        const matchName = modelo.name.toLowerCase().includes(termo);
    
        // busca pelos prefixos de código (array de strings)
        const matchCode = modelo.codeInit?.some(prefix =>
            prefix.toLowerCase().startsWith(termo)
        );
    
        return matchName || matchCode;
    });

    const renderItem = ({ item }: any) => {
        const codigosDoModelo = getCodigosDoModelo(item, allCodes);

        return (
            <View style={styles.modelCard}>
                <View style={{ flex: 1, gap: 8 }}>
                    <Text style={styles.modelName}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                        Prefixos: {item.codeInit.join(", ")}
                    </Text>

                    {codigosDoModelo.length > 0 ? (
                        <View style={{ marginTop: 5 }}>
                            <Text style={{ fontWeight: "600" }}>Números de série:</Text>
                            {codigosDoModelo.map((codigo) => (
                                <Text key={codigo} style={{ fontSize: 13 }}>
                                    {codigo}
                                </Text>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ fontSize: 12, color: "#999" }}>
                            Nenhum número escaneado ainda
                        </Text>
                    )}
                </View>

                <TouchableOpacity onPress={() => openModal(item.imageUri)}>
                    <Image
                        source={item.imageUri}
                        style={styles.modelImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>Modelos</Text>
                <TextInput
                    placeholder="Busque por nome ou código..."
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />

                <FlatList
                    data={filteredModels}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>

            <ImageModal
                isVisible={modalVisible}
                imageUri={selectedImageUri}
                onClose={closeModal}
            />
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
        backgroundColor: '#f9f9f9',
    },
    modelCard: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginBottom: 15,
    },
    modelName: { fontSize: 16, fontWeight: '600', flexShrink: 1, marginRight: 10 },
    modelImage: { width: 100, height: 100, borderRadius: 5, },
    placeholderImage: {
        width: 100,
        height: 100,
        backgroundColor: '#cccccc', // Cor cinza para o placeholder
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 12,
        color: '#444',
        textAlign: 'center',
    },
});