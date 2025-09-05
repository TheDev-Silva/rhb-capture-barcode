import React from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface ImageModalProps {
    imageUri: number | null;
    isVisible: boolean;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const ImageModal: React.FC<ImageModalProps> = ({ imageUri, isVisible, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onClose}>
                {imageUri && (
                    <Image
                        source={imageUri}
                        style={styles.image}
                        resizeMode="contain"
                    />
                )}
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fundo semi-transparente
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.9,
        height: height * 0.9,
    },
});

export default ImageModal;