import axios from "axios"; // Certifique-se de importar axios corretamente
import { Address } from "../types/Address";
import { CartItem } from "../types/CartItem";
import { Complements } from "../types/Complements";
import { Order } from "../types/Order";
import { Product } from "../types/Product";
import { Tenent } from "../types/Tenent";
import { User } from "../types/User";
import { json } from "stream/consumers";
import { Cupom } from "../types/Cupom";

const TempOneComplement: Complements = {
  id: 1,
  nome: "Borda Catupiry",
  preco: 5.76,
  qt: 0,
};

const API_BASE_URL = process.env.API_BASE_URL;
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;

export const Api = (tenantSlug: string) => ({
  getTenant: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${tenantSlug}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar tenant:", error);
      throw new Error("Erro ao buscar tenant");
    }
  },

  getAllProducts: async () => {
    try {
      console.log(`Fetching products for tenant: ${tenantSlug}`); // Log para depuração
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/products`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },

  getAllCategorys: async () => {
    try {
      console.log(`Fetching categories for tenant: ${tenantSlug}`); // Log para depuração
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/categories`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },

  getProduct: async (id: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  getAllComplements: async () => {
    let complements = [];
    for (let q = 0; q < 3; q++) {
      complements.push({
        ...TempOneComplement,
        id: q + 1,
      });
    }
    return complements;
  },

  getComplement: async (id: number) => {
    return { ...TempOneComplement, id };
  },

  authorizeToken: async (token: string): Promise<User | false> => {
    if (!token) return false;

    try {
      // Faz uma requisição ao backend para validar o token e buscar o usuário
      const response = await axios.post(
        `${API_BASE_URL}/authorize`,
        {}, // Corpo da requisição vazio se não for necessário
        {
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
          },
        }
      );

      // Se o token for válido e os dados do usuário estiverem presentes na resposta
      if (response.status === 200 && response.data.user) {
        const user: User = response.data.user;
        return user; // Retorna o usuário
      } else {
        return false; // Retorna falso se o token for inválido
      }
    } catch (error) {
      console.error("Erro ao autorizar token:", error);
      return false;
    }
  },

  signin: async (email: string, senha: string) => {
    try {
      // Faz uma requisição para o backend enviando o email e a senha
      const response = await axios.post(`${API_BASE_URL}/signin`, {
        email,
        senha,
      });

      // Verifica se a resposta do backend foi bem-sucedida e se contém o token e o usuário
      if (
        response.status === 200 &&
        response.data.token &&
        response.data.user
      ) {
        return response.data; // Retorna o token e os dados do usuário
      } else {
        return false; // Retorna falso caso a autenticação falhe
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false; // Retorna falso em caso de erro
    }
  },

  signup: async (
    email: string,
    nome: string,
    senha: string,
    telefone: string
  ) => {
    try {
      // Loga os dados que estão sendo enviados
      console.log("Dados enviados para o signup:", {
        email,
        nome,
        senha,
        telefone,
      });

      const response = await axios.post(`${API_BASE_URL}/signup`, {
        email,
        nome,
        senha,
        telefone,
      });

      return response.data; // Retorna os dados de sucesso
    } catch (error) {
      // Verifica se há uma resposta com erro da API
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro no cadastro");
      }
      throw new Error("Erro ao se comunicar com o servidor");
    }
  },

  forget: async (email: string, tenantSlug: string) => {
    try {
      // Faz uma requisição para o backend enviando o email e a senha
      const response = await axios.post(
        `${API_BASE_URL}/auth/request-password-reset`,
        {
          email,
          tenantSlug,
        }
      );

      // Verifica se a resposta do backend foi bem-sucedida e se contém o token e o usuário
      if (response.status === 200) {
        return response.data; // Retorna o token e os dados do usuário
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      return false; // Retorna falso em caso de erro
    }
  },

  resetPassword: async (token: string, senha: string, newPassword: string) => {
    try {
      // Faz uma requisição para o backend enviando o email e a senha
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        senha,
        newPassword,
        token,
      });

      // Verifica se a resposta do backend foi bem-sucedida e se contém o token e o usuário
      if (response.status === 200) {
        return response.data; // Retorna o token e os dados do usuário
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      return false; // Retorna falso em caso de erro
    }
  },

  getCartProduct: async (cartCookie: string) => {
    let cart: CartItem[] = [];

    if (!cartCookie) return cart;

    const cartJson = JSON.parse(cartCookie);
    for (let i in cartJson) {
      if (cartJson[i].id && cartJson[i].qt) {
        try {
          // Chama a função getProduct para obter o produto real
          const product = await Api(tenantSlug).getProduct(cartJson[i].id);

          if (product) {
            // Verifique se há complementos no cookie e adicione-os ao produto
            if (cartJson[i].complements) {
              product.selectedComplements = cartJson[i].complements;
            }

            cart.push({
              qt: cartJson[i].qt,
              product,
            });
          } else {
            console.warn(
              `Produto com ID ${cartJson[i].id} não foi encontrado.`
            );
          }
        } catch (error) {
          console.error(
            `Erro ao buscar o produto com ID ${cartJson[i].id}:`,
            error
          );
        }
      }
    }

    return cart;
  },

  getUserAddresses: async (user_id: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/addresses?user_id=${user_id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getUserAddress: async (addressid: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/address/${addressid}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getCepInfo: async (cep: string) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar informações do cep:", error);
      return null;
    }
  },

  addUserAddress: async (address: Address) => {
    try {
      // Faz uma requisição POST para o endpoint de criação de endereço
      const response = await axios.post(
        `${API_BASE_URL}/${tenantSlug}/newaddress`,
        address
      );
      // Verifica se o endereço foi criado com sucesso
      if (response.status === 201) {
        console.log("Endereço criado com sucesso:", response.data);
        return response.data; // Retorna os dados do novo endereço
      } else {
        console.error("Falha ao criar o endereço:", response.data);
        return null;
      }
    } catch (error) {
      console.error("Erro ao tentar criar o endereço:", error);
      return null;
    }
  },

  editUserAddress: async (newAddressData: Address) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${tenantSlug}/address/${newAddressData.id}`,
        newAddressData
      );

      // Verifica se a resposta foi bem-sucedida
      if (response.status === 200) {
        console.log("Endereço editado com sucesso:", response.data);
        return response.data; // Retorna os dados do endereço editado
      }
    } catch (error) {
      console.error("Erro ao editar o endereço:", error);
      throw error; // Repassa o erro para tratamento no local de chamada
    }
  },

  deleteUserAddress: async (addressid: number) => {
    try {
      // Faça a requisição DELETE para a API
      const response = await axios.delete(
        `${API_BASE_URL}/${tenantSlug}/address/${addressid}`
      );

      // Verifique o status da resposta
      if (response.status === 200) {
        console.log(`Endereço com ID ${addressid} deletado com sucesso.`);
        return true;
      } else {
        console.error(
          `Erro ao deletar Endereço com ID ${addressid}: Status ${response.status}`
        );
        return false;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao deletar produto:",
          error.response?.data || error.message
        );
      } else {
        console.error("Erro inesperado:", error);
      }
      return false;
    }
  },

  getShippingPrice: async (tenantId: number, cep: string) => {
    let latitude: number | null = null;
    let longitude: number | null = null;

    try {
      // 1. Verifica se temos um CEP no objeto address ou diretamente

      if (!cep) {
        throw new Error("É necessário fornecer um CEP.");
      }

      // 2. Consulta a API do Google Maps para obter as coordenadas a partir do CEP
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${GOOGLE_MAPS_KEY}`;

      const mapsResponse = await axios.get(googleMapsUrl);
      const mapsData = mapsResponse.data;

      if (mapsData.status === "OK" && mapsData.results.length > 0) {
        const location = mapsData.results[0].geometry.location;
        latitude = location.lat;
        longitude = location.lng;
      } else {
        throw new Error(
          "Não foi possível obter as coordenadas para o CEP fornecido."
        );
      }

      // 3. Faz a requisição à API de cálculo de frete com as coordenadas obtidas
      const response = await axios.post(`${API_BASE_URL}/calculate-shipping`, {
        tenantId: tenantId, // Ajuste o `tenantId` conforme necessário para sua lógica
        userLatitude: latitude,
        userLongitude: longitude,
      });

      return response.data.shippingCost;
    } catch (error) {
      console.error("Erro ao calcular o frete:", error);
      throw new Error("Erro ao calcular o frete.");
    }
  },

  setOrder: async (
    address: Address,
    paymentTypeId: number,
    paymentChange: number,
    cupom: Cupom | null,
    cart: CartItem[],
    shippingPrice: number,
    userId?: number
  ) => {
    try {
      // Enviando os dados para o back-end
      const response = await axios.post(`${API_BASE_URL}/${tenantSlug}/order`, {
        id_user: userId,
        id_address: address.id,
        formaPagamentoId: paymentTypeId,
        troco: paymentChange,
        preco:
          cart.reduce(
            (total, item) => total + item.product.preco * item.qt,
            0
          ) +
          shippingPrice -
          (cupom ? cupom.desconto : 0), // Calcula o preço total
        subtotal: cart.reduce(
          (total, item) => total + item.product.preco * item.qt,
          0
        ), // Usa o mesmo valor do total, mas você pode diferenciar
        data_order: new Date().toISOString(),
        status: "received", // Status inicial do pedido
        shippingPrice: shippingPrice,
        origem: "DELIVERY",
        products: cart.map((item) => ({
          id_produto: item.product.id,
          preco_produto: item.product.preco,
          nome_produto: item.product.nome,
          quantidade: item.qt,
        })),
        statuses: [
          { status: "received", created_at: new Date().toISOString() },
        ],
        cupomId: cupom ? cupom.id : null,
      });

      // Verifica a resposta do back-end
      if (response.status === 201) {
        console.log("Pedido criado com sucesso:", response.data);
        return response.data;
      } else {
        console.error("Erro ao criar pedido:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return null;
    }
  },
  setVenda: async (
    orderId: number,
    valor: number,
    formaPagamentoId: number
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${tenantSlug}/vendas`,
        {
          orderId,
          valor,
          formaPagamentoId,
        }
      );
      if (response.status === 201) {
        return response.data;
      } else {
        console.error("Erro ao criar venda:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Erro ao criar venda:", error);
      return null;
    }
  },

  getOrder: async (orderid: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/order/${orderid}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  getOrders: async (token: string) => {
    try {
      console.log(`Fetching products for tenant: ${tenantSlug}`); // Log para depuração
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/user/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },

  getOpenClose: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/toggleOpenClose`
      );
      // Verifica a resposta completa
      console.log("Response data:", response.data.isOpen);

      // Retorna o status de abertura da loja (true ou false) conforme a resposta da API
      return response.data.isOpen;
    } catch (error) {
      console.error("Erro ao buscar o status da loja:", error);
      return null; // Retorna null em caso de erro
    }
  },
  getBanners: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${tenantSlug}/banners`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Banners:", error);
      throw new Error("Erro ao buscar Banners");
    }
  },

  validateCupom: async (cupom: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/cupomValidate/${cupom}`
      );
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Lança o erro original vindo do backend
        throw new Error(error.response.data.message);
      }

      // Erro genérico (como erro de conexão)
      console.error("Erro ao buscar cupom:", error);
      throw new Error("Erro ao buscar cupom");
    }
  },
  getPaymentMethods: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${tenantSlug}/formas-pagamento`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar métodos de pagamento:", error);
      return [];
    }
  },
});
