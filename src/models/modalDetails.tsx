import { View } from "lucide-react";
import React, { useEffect } from "react";

interface DetaislProps {
    item: string;
    isVisible: Boolean;
    onClose: () => void;
}


export default function ModalDetails({ isVisible, onClose, item }: DetaislProps) {

    if(isVisible || item) {
        return
    }

    return (

        <View>
            
        </View>
        

    )
}
