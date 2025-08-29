import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedido } from "../types";

interface AppContextProps {
  pedidos: Pedido[];
  adicionarPedido: (pedido: Pedido) => void;
  removerPedido: (id: string) => void;
  buscarPedido: (id: string) => Pedido | undefined;
}

const STORAGE_KEY = "@rhb_pedidos";

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // Carrega pedidos do armazenamento local ao iniciar
  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const dados: Pedido[] = JSON.parse(json);
          setPedidos(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      }
    };

    carregarPedidos();
  }, []);

  // Salva os pedidos no AsyncStorage sempre que houver mudança
  const salvarPedidosNoStorage = async (pedidosAtualizados: Pedido[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pedidosAtualizados));
    } catch (error) {
      console.error("Erro ao salvar pedidos:", error);
    }
  };

  const adicionarPedido = (pedido: Pedido) => {
    setPedidos((prev) => {
      const exists = prev.some((p) => p.id === pedido.id);
      if (!exists) {
        const atualizados = [...prev, pedido];
        salvarPedidosNoStorage(atualizados); // salva após adicionar
        return atualizados;
      }
      return prev;
    });
  };

  const removerPedido = (id: string) => {
    setPedidos((prev) => {
      const atualizados = prev.filter((p) => p.id !== id);
      salvarPedidosNoStorage(atualizados); // salva após remover
      return atualizados;
    });
  };

  const buscarPedido = (id: string): Pedido | undefined => {
    return pedidos.find((p) => p.id === id);
  };

  return (
    <AppContext.Provider
      value={{ pedidos, adicionarPedido, removerPedido, buscarPedido }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext deve ser usado dentro do AppProvider");
  return context;
};
