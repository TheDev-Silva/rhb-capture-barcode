export interface CodeBlock {
  timestamp: string;
  codes: string[];
}

export interface Pedido {
  id: string;
  numero: string;
  nome: string;
  image?: string;           // URI da foto
  photoTimestamp?: string;  // timestamp da foto
  codeBlocks: CodeBlock[];  // blocos de códigos escaneados
  criadoEm: string;
  allCodes: string[]
}
export interface Modelo {
  id: string;
  name: string;
  imageUri: number;
  codeInit: string[];
}
