import { Complements } from "./Complements"

export type Product = {

    id: number
    image: string
    categoria: string
    nome: string
    preco: number;
    description?: string;
    complements?: Complements;
}