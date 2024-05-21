import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { Api } from '../../libs/useApi';
import styles from '../../styles/Cart.module.css';
import { Tenent } from '../../types/Tenent';
import { User } from '../../types/User';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { InputFild } from '../../components/InputFild';
import { Button } from '../../components/Button';
import { useFormater } from '../../libs/useFormater';
import { CartItem } from '../../types/CartItem';
import { useRouter } from 'next/router';
import { CartProductItem } from '../../components/CartProductItem';
import { CartCokie } from '../../types/CartCookie';

const Cart = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenent, setTenent } = useAppContext();

  useEffect(() => {
    setTenent(data.tenent);
    setToken(data.token);
    if (data.user) setUser(data.user);
  }, []);

  const formatter = useFormater();
  const router = useRouter();

  //Product control

  const [cart, setCart] = useState<CartItem[]>(data.cart);

  const handleCartchange = (newCount: number, id: number) => {

    const tempcart: CartItem[] = [...cart];

    const cartindex = tempcart.findIndex(item => item.product.id === id);
    if (newCount > 0) {
      tempcart[cartindex].qt = newCount;
    } else {
      delete tempcart[cartindex];
    }

    let newcart: CartItem[] = tempcart.filter(item => item);

    setCart(newcart);

    //update cookie

    let cartCookie: CartCokie[] = [];
    for (let i in newcart) {
      cartCookie.push({
        id: newcart[i].product.id,
        qt: newcart[i].qt,
      });
    }

    setCookie('cart', JSON.stringify(cartCookie))

  }

  //Shipping

  const [shippingInput, setShippingInput] = useState('');
  const [shippingAdress, setShippingAdress] = useState('');
  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingTime, setShippingTime] = useState(0);

  const handleShippingCalc = () => {
    setShippingPrice(2.0);
    setShippingTime(20);
    setShippingAdress('rua grão de Ouro, n95, Piratininga');
  }

  //Resume

  const [subtotal, setSubtotal] = useState(0);
  useEffect(() => {
    let sub = 0;
    for (let i in cart) {
      sub += cart[i].product.preco * cart[i].qt;
    }

    setSubtotal(sub);
  }, [cart]);

  const handleFinish = () => {
    router.push(`/${data.tenent.slug}/checkout`);
  }

  return (

    <div className={styles.container}>
      <Head>
        <title>Sacola | {data.tenent.name}</title>
      </Head>

      <Header
        backHref={`/${data.tenent.slug}`}
        title='Sacola'
        color={data.tenent.mainColor}
      />

      <div className={styles.prodQuant}>
        {cart.length} {cart.length === 1 ? 'item' : 'itens'}
      </div>

      <div className={styles.prodList}>
        {cart.map((cartitem, index) => (
          <CartProductItem
            key={index}
            color={data.tenent.mainColor}
            quantidade={cartitem.qt}
            product={cartitem.product}
            onChange={handleCartchange}
          />
        ))}
      </div>

      <div className={styles.shippingArea}>
        <div className={styles.shippingTitle}>Calcular frete e prazo</div>
        <div className={styles.shippingForm}>
          <InputFild
            color={data.tenent.mainColor}
            placeholder='Digite seu cep'
            value={shippingInput}
            onChange={newValue => setShippingInput(newValue)}
          />

          <Button
            color={data.tenent.mainColor}
            label='OK'
            onClick={handleShippingCalc}
          />

        </div>

        {shippingTime > 0 &&
          <div className={styles.shippingInfo}>
            <div className={styles.shippingAdress}>{shippingAdress}</div>
            <div className={styles.shippingTime}>
              <div className={styles.shippingTimeText}>Receba em até {shippingTime} min</div>
              <div
                className={styles.shippingprice}
                style={{ color: data.tenent.mainColor }}
              >
                {formatter.fomatePrice(shippingPrice)}
              </div>
            </div>
          </div>

        }
      </div>

      <div className={styles.resumeArea}>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Subtotal</div>
          <div className={styles.resumeRight}>{formatter.fomatePrice(subtotal)}</div>
        </div>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Frete</div>
          <div className={styles.resumeRight}>{shippingPrice > 0 ? formatter.fomatePrice(shippingPrice) : '--'}</div>
        </div>

        <div className={styles.resumeLine}></div>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Total</div>
          <div className={styles.resumeRightBig}
            style={{ color: data.tenent.mainColor }}
          >{formatter.fomatePrice(shippingPrice + subtotal)}</div>
        </div>

        <div className={styles.resumeButton}>
          <Button
            color={data.tenent.mainColor}
            label='Continuar'
            onClick={handleFinish}
            fill
          />
        </div>


      </div>



    </div>



  );


}


export default Cart;

type Props = {
  tenent: Tenent,
  token: string,
  user: User | null;
  cart: CartItem[];

}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const { tenent: tenantSlug } = context.query
  const api = Api(tenantSlug as string);


  //Get Tenant
  const tenent = await api.getTenant();

  if (!tenent) {
    return { redirect: { destination: '/', permanent: false } }
  }

  //get Logged User 

  const token = getCookie('token', context);
  const user = await api.authorizeToken(token as string);

  //get Cart Products
  const cartCookie = getCookie('cart', context);

  const cart = await api.getCartProduct(cartCookie as string);
  console.log(cart)



  return {
    props: {
      tenent,
      user,
      token,
      cart
    }
  }


}



