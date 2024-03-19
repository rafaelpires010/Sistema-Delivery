import { CartItem } from "../types/CartItem";
import { Complements } from "../types/Complements";
import { Product } from "../types/Product";
import { Tenent } from "../types/Tenent";
import { User } from "../types/User";

const TempOneProduct: Product = {
    id: 1,
    image: '/temp/calabresa.png',
    categoria: 'Tradicional',
    nome: 'Calabresa',
    preco: 55.76,
    description: '2 Blends de carne de 150g, Queijo Cheddar Bacon Caramelizado, Salada, Molho da casa, Pão brioche artesanal,',

}

const TempOneComplement: Complements = {
    id: 1,
    nome: 'Borda Catupiry',
    preco: 5.76,
    qt: 0
}


export type getTenantResponse = {
    name: string;
    mainColor: string;
    secondColor: string;
}

export const Api = (tenentSlug: string) => ({

    getTenant: async () => {
        
        switch(tenentSlug) {
            case 'pizza':
                return {
                    slug: 'pizza',
                    name: 'pizza',
                    mainColor: '#CE2B37',
                    secondColor: '#009246',
                    img: '/temp/logo.png',
                    background: 'black'
                }
                

            break;

            case 'hamburguer':
                return {

                    slug: 'hamburguer',
                    name: 'hamburguer',
                    mainColor: '#ECEEE3',
                    secondColor: '#060709',
                    img: '/temp/logohamburguer.jpg',
                    background: '#060709'
                }
            
            break;
            default: return false;
        }

        
    },

    getAllProducts: async () => {
        let products = [];
        for (let q =0; q < 10; q++){
            products.push({
                ...TempOneProduct,
                id: q + 1
            });
        }
        return products;
    },

    getProduct: async (id: number) => {
        return {...TempOneProduct, id};
    },

    getAllComplements: async () => {
        let complements = [];
        for (let q =0; q < 3; q++){
            complements.push({
                ...TempOneComplement,
                id: q + 1
            });
        }
        return complements;
    },

    getComplement: async (id: number) => {
        return {...TempOneComplement, id};
    },

    authorizeToken: async (token: string): Promise<User | false> => {
        if(!token) return false;
        return {
            name: 'Rafael Pires',
            email: 'rafapires2210@gmail.com'
        }
    },

    getCartProduct: async (cartCookie: string) => {
        let cart: CartItem[] = [];

        if(!cartCookie) return cart;

        const cartJson = JSON.parse(cartCookie);
        for(let i in cartJson) {
            if(cartJson[i].id && cartJson[i].qt) {
                const product = {
                    ...TempOneProduct,
                    id: cartJson[i].id
                }

                if(cartJson[i].id && cartJson[i].qt) {
                    const product = {
                        ...TempOneProduct,
                        id: cartJson[i].id
                    }}

                cart.push({
                    qt: cartJson[i].qt,
                    product
                })
            }
        }

        return cart;
    }
    
});