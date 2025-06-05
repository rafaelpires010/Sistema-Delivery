import { Address } from "./Address";
import { CartItem } from "./CartItem";
import { Cupom } from "./Cupom";

export type Order = {
  id_user?: number;
  id: number;
  status: "preparing" | "sent" | "delivered";
  data_order: string; //9999-99-99
  address: Address;
  shippingPrice: number;
  formaPagamentoId: number;
  troco?: number;
  cupom: Cupom | null;
  origem: string;
  products: CartItem[];
  subtotal: number;
  preco: number;
};
