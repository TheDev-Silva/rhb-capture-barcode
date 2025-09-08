import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

interface ImageModalProps {
    imageUri: number | null; // O tipo 'number' para referências de imagens locais (require())
    isVisible: boolean;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUri, isVisible, onClose }) => {
    // A biblioteca ImageViewer espera um array de objetos de imagem.
    // Criamos um array com a nossa única imagem, se ela existir.
    const images = imageUri ? [{ url: '', props: { source: imageUri } }] : [];

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            onRequestClose={onClose}
        >
            <ImageViewer
                imageUrls={images}
                enableSwipeDown={true}       // Permite fechar o modal arrastando para baixo

                onSwipeDown={onClose}        // Função para ser chamada ao arrastar para baixo
                onCancel={onClose}           // Função para ser chamada ao cancelar
                renderIndicator={() => <></>} // Oculta o indicador de página (não é necessário para uma única imagem)
                saveToLocalByLongPress={true} // Desabilita a opção de salvar imagem ao segurar
                style={styles.viewer}        // Estilo opcional para o visualizador
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    viewer: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fundo semi-transparente para o visualizador
    },
});

export default ImageModal;