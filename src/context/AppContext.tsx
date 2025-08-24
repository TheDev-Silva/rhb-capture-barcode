import React, { createContext, useContext, useState, ReactNode } from "react";
import { Pedido } from "../types";

interface AppContextProps {
  pedidos: Pedido[];
  adicionarPedido: (pedido: Pedido) => void;
  removerPedido: (id: string) => void;
  buscarPedido: (id: string) => Pedido | undefined;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const adicionarPedido = (pedido: Pedido) => {
    setPedidos((prev) => {
      const exists = prev.some((p) => p.id === pedido.id);
      if (!exists) {
        return [...prev, pedido];
      }
      return prev;
    });
  };

  const removerPedido = (id: string) => {
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  };
  

  const buscarPedido = (id: string) => {
    return pedidos.find((p) => p.id === id);
  };

  return (
    <AppContext.Provider value={{ pedidos, adicionarPedido, buscarPedido, removerPedido }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext deve ser usado dentro do AppProvider");
  return context;
};
