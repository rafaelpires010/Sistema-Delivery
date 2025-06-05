import { Category } from "./Category";
import { Complements } from "./Complements";

export type Product = {
    id: number;
    img: string;
    category: Category;
    nome: string;
    preco: number;
    descricao?: string;
    selectedComplements?: Complements[]; // Adicionando campo para complementos selecionados
};
