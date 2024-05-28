import { Address } from "../types/Address";
import { CartItem } from "../types/CartItem";
import { Complements } from "../types/Complements";
import { Order } from "../types/Order";
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
    selectedComplements: []
}

const TempOneComplement: Complements = {
    id: 1,
    nome: 'Borda Catupiry',
    preco: 5.76,
    qt: 0
}

const TEMPORARYorder: Order = {
    id: 123,
    status: "sent",
    orderDate: "2022-12-04",
    userid: "123",
    shippingAddress: {
        id: 2,
        cep: "31573373",
        rua: "Rua das Flores",
        numero: "200",
        bairro: "Cu preto",
        cidade: "Jabirosca",
        estado: "AC",
    },
    shippingPrice: 9.14,
    paymentType: "card",
    cupom: 'ABC',
    cupomDiscount: 14.3,
    products: [
        {product: {...TempOneProduct, id: 1}, qt:1},
        {product: {...TempOneProduct, id: 2}, qt:2},
        {product: {...TempOneProduct, id: 3}, qt:1},
    ],
    subtotal: 204,
    total: 198.84
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
    
        if (!cartCookie) return cart;
    
        const cartJson = JSON.parse(cartCookie);
        for (let i in cartJson) {
            if (cartJson[i].id && cartJson[i].qt) {
                // Crie uma cópia do produto baseado no TempOneProduct
                let product = { ...TempOneProduct, id: cartJson[i].id };
    
                // Verifique se há complementos no cookie e adicione-os ao produto
                if (cartJson[i].complements) {
                    product.selectedComplements = cartJson[i].complements;
                }
    
                cart.push({
                    qt: cartJson[i].qt,
                    product
                });
            }
        }
    
        return cart;
    },

    getUserAddresses: async (email: string) => {
        const addresses: Address[] = [];

        for(let i=0; i < 4; i++){
            addresses.push({
                id: i + 1,
                cep: '31 573373',
                rua: 'Grão de Ouro',
                numero: `${i+1}00`,
                bairro: 'Piratinínga',
                cidade: 'Belo Horizonte',
                estado: 'Minas Gerais'
            })
        }

        return addresses;
    },

    getUserAddress: async (addressid: number) => {
        let address: Address = {
            id: addressid,
                cep: '31 573373',
                rua: 'Grão de Ouro',
                numero: `${addressid}00`,
                bairro: 'Piratinínga',
                cidade: 'Belo Horizonte',
                estado: 'Minas Gerais'
        }
        return address;
    },

    addUserAddress: async (address: Address) => {
        return { ...address, id: 9 };

    },

    editUserAddress: async (newAddressData: Address) => {
        return true;
    },

    deleteUserAddress: async (addressid: number) => {
        return true;
    },

    getShippingPrice: async (address: Address) => {
        return 9.16;
    },

    setOrder: async (
        address: Address,
        paymentType: 'money' | 'card',
        paymentChange: number,
        cupom: string,
        cart: CartItem[]
    ) => {
        return TEMPORARYorder;
    },

    getOrder: async (orderid: number) => {
        return TEMPORARYorder;
    }
    
});