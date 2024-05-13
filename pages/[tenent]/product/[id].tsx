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
import { Product as Produto} from '../../../types/Product';

const Product = (data: Props) => {

  const { tenent, setTenent } = useAppContext();

  useEffect(() => {
    setTenent(data.tenent);
  }, [])

  const router = useRouter();

  const [qtCount, setQtCount] = useState(1);
  const [qtCountAd, setQtCountAd] = useState(0);
  const [complements, setComplements] = useState<Complements[]>(data.complements);

  const handleAddToCart = () => {

    let cart: CartCokie[] = [];

    // create or get existing cart

    if (hasCookie('cart')) {
      const cartCookie = getCookie('cart');
      const cartJson: CartCokie[] = JSON.parse(cartCookie as string);
      for (let i in cartJson) {
        if (cartJson[i].qt && cartJson[i].id) {
          cart.push(cartJson[i]);
        }
      }

    }


    // search product in cart

    const cartIndex = cart.findIndex(item => item.id === data.product.id);


    if (cartIndex > -1) {
      cart[cartIndex].qt += qtCount;
      
    } else {
      
        cart.push({
          id: data.product.id, qt: qtCount,
        });
      
    }

   

   
    

    //setting cookie
    setCookie('cart', JSON.stringify(cart));

    // going to cart
    router.push(`/${data.tenent.slug}/cart`);


  }

  const handleUpdateQt = (newCount: number) => {
    setQtCount(newCount)
    
  }


  useEffect(() => {
    
  }, [qtCountAd]);

  const handleUpdateQtAd = () => {
    
    for(let i in complements){
      
    }
    
  }

    
  
   

    

  const formatter = useFormater();

  return (

    <div className={styles.container}>
      <Head>
        <title>{data.product.nome} | {data.tenent.name}</title>
      </Head>

      <div className={styles.headerArea}>
        <Header
          color={data.tenent.mainColor}
          backHref={`/${data.tenent.slug}`}
          title="Produto"
        />
      </div>

      <div className={styles.line}></div>

      <div className={styles.headerBG}>



      </div>

      <div className={styles.productImage}>
        <img src={data.product.image} alt="" />
      </div>

      <div className={styles.category}>{data.product.categoria}</div>
      <div className={styles.title} style={{ borderBottomColor: data.tenent.mainColor }}>{data.product.nome}</div>
      <div className={styles.line}></div>

      <div className={styles.descripition}>{data.product.description}</div>
      <div className={styles.qtText}>Quantidade</div>
      <div className={styles.area}>
        <div className={styles.areaLeft}>
          <Quantity

            color={data.tenent.mainColor}
            count={qtCount}
            onUpdateCount={handleUpdateQt}
            min={1}


          />
        </div>

        <div className={styles.areaRight}
          style={{ color: data.tenent.mainColor }}
        >{formatter.fomatePrice(data.product.preco)}</div>
      </div>

      <div className={styles.adicionais}>Complementos</div>
      <div className={styles.AreaAd}>
        <AreaTitleCA
          title='Escolha um molho'
          subtitle='até 1 unidade de cada'
        />
      </div>

      <div className={styles.AreaAdAd}>

      {complements.map((item, index) => (
         
         <AdComponent

          color={data.tenent.mainColor}
          onChange={handleUpdateQtAd}
          data={item}
          key={index}
          
        />

        
      ))}
        

      </div>



      <div className={styles.buttonArea}>

        
        <Button color={data.tenent.mainColor}
          label={`Adicionar ${formatter.fomatePrice(

            qtCount * data.product.preco
             + 
             qtCountAd * data.complements[1].preco)}`}

          onClick={handleAddToCart}
          fill
        />
      </div>

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



