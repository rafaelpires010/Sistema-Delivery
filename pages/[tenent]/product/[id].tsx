import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AdComponent } from '../../../components/AdComponent';
import { AreaTitleCA } from '../../../components/AreaTitleCA';
import { Button } from '../../../components/Button';
import { Header } from '../../../components/Header';
import { Quantity } from '../../../components/Quantity';
import { useAppContext } from '../../../contexts/app';
import { Api } from '../../../libs/useApi';
import { useFormater } from '../../../libs/useFormater';
import styles from '../../../styles/Product-id.module.css';
import { Tenent } from '../../../types/Tenent';
import { CartCokie } from '../../../types/CartCookie';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { Complements } from '../../../types/Complements';
import { Product as Produto } from '../../../types/Product';
import { Footer } from '../../../components/Footer';

const Product = (data: Props) => {

  const { tenent, setTenent } = useAppContext();

  useEffect(() => {
    setTenent(data.tenent);
  }, [])

  const router = useRouter();

  const [qtCount, setQtCount] = useState(1);
  const [qtCountAd, setQtCountAd] = useState(0);
  const [complements, setComplements] = useState<Complements[]>(data.complements);

  //definindo a quantidade de acompanhamentos

  const handleUpdateQtAd = (newCount: number, complementId: number) => {
    const updatedComplements = complements.map(complement => {
      if (complement.id === complementId) {
        return { ...complement, qt: newCount };
      }
      return complement;
    });
    setComplements(updatedComplements);
  };


  // Função para adicionar complementos ao produto
  const addComplementsToProduct = (product: Produto, selectedComplements: Complements[]): Produto => {
    // Verifica se a quantidade de complementos é maior que zero
    if (selectedComplements.length > 0) {
      // Se sim, adiciona os complementos ao objeto do produto
      return {
        ...product,
        selectedComplements: selectedComplements
      };
    } else {
      // Se não, retorna o produto original sem alterações
      return product;
    }
  };


  const handleAddToCart = () => {
    // Adiciona os complementos selecionados ao produto
    const productWithComplements = addComplementsToProduct(data.product, complements);

    let cart: CartCokie[] = [];

    // Código para criar ou obter o carrinho existente
    if (hasCookie('cart')) {
      const cartCookie = getCookie('cart');
      const cartJson: CartCokie[] = JSON.parse(cartCookie as string);
      for (let i in cartJson) {
        if (cartJson[i].qt && cartJson[i].id) {
          cart.push(cartJson[i]);
        }
      }
    }

    // Procura o produto no carrinho
    const cartIndex = cart.findIndex(item => item.id === productWithComplements.id);

    if (cartIndex > -1) {
      cart[cartIndex].qt += qtCount;
    } else {
      cart.push({
        id: productWithComplements.id,
        qt: qtCount,
      });
    }

    // Configura o cookie
    setCookie('cart', JSON.stringify(cart));

    // Redireciona para o carrinho
    router.push(`/${data.tenent.slug}`);
    console.log(productWithComplements)
  };

  const handleUpdateQt = (newCount: number) => {
    setQtCount(newCount)

  }


  useEffect(() => {

  }, [qtCountAd]);

  const formatter = useFormater();

  return (
    <div className={styles.container}>
      <Head>
        <title>{data.product.nome} | {data.tenent.nome}</title>
      </Head>

      <div className={styles.headerArea}>
        <Header
          color={data.tenent.main_color}
          backHref={`/${data.tenent.slug}`}
          title="Produto"
        />
      </div>

      <div className={styles.headerBG} />

      <div className={styles.content}>
        <div className={styles.productImage}>
          <img src={data.product.img} alt={data.product.nome} />
        </div>

        <div className={styles.category}>{data.product.category.nome}</div>
        <div className={styles.title} style={{ borderBottomColor: data.tenent.main_color }}>
          {data.product.nome}
        </div>
        <div className={styles.line} />

        <div className={styles.descripition}>{data.product.descricao}</div>
        <div className={styles.qtText}>Quantidade</div>
        <div className={styles.area}>
          <div className={styles.areaLeft}>
            <Quantity
              color={data.tenent.main_color}
              count={qtCount}
              onUpdateCount={handleUpdateQt}
              min={1}
            />
          </div>
          <div className={styles.areaRight} style={{ color: data.tenent.main_color }}>
            {formatter.fomatePrice(data.product.preco)}
          </div>
        </div>

        {complements.length > 0 && (
          <>
            <div className={styles.AreaAd}>
              <AreaTitleCA
                title='Escolha um molho'
                subtitle='até 1 unidade de cada'
              />
            </div>

            <div className={styles.AreaAdAd}>
              {complements.map((item, index) => (
                <AdComponent
                  onChange={handleUpdateQtAd}
                  data={item}
                  key={index}
                  color={data.tenent.main_color}
                />
              ))}
            </div>
          </>
        )}

        <div className={styles.buttonArea}>
          <Button
            color={data.tenent.main_color}
            label={`Adicionar ${formatter.fomatePrice(qtCount * data.product.preco)}`}
            onClick={handleAddToCart}
            fill
            disable={!data.tenent.OnClose}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}


export default Product;

type Props = {
  tenent: Tenent,
  product: Produto,
  complements: Complements[],
  complement: Complements

}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const { tenent: tenantSlug, id } = context.query
  const api = Api(tenantSlug as string);


  //Get Tenant
  const tenent = await api.getTenant();

  if (!tenent) {
    return { redirect: { destination: '/', permanent: false } }
  }

  //Get Products 

  const product = await api.getProduct(parseInt(id as string));
  const complement = await api.getComplement(parseInt(id as string));
  const complements = await api.getAllComplements()

  return {
    props: {
      tenent,
      product,
      complements,
      complement
    }
  }


}



