import { Stack } from "expo-router";
import { AppProvider } from "../src/context/AppContext";

export default function Layout() {
  return (


    <AppProvider >
     
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "RHB Capture Barcode" }} />
          <Stack.Screen name="capture" options={{ title: "Capturar Código" }} />
          <Stack.Screen name="search" options={{ title: "Buscar Pedido" }} />
          <Stack.Screen name="history" options={{ title: "Histórico" }} />
          <Stack.Screen name="details/[id]" options={{ title: "Detalhes do Pedido" }} />
        </Stack>
    
    </AppProvider>

  );
}
