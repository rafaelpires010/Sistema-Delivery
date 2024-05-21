import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { Api } from '../../libs/useApi';
import styles from '../../styles/Checkout.module.css';
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
import { ButtonWithIcon } from '../../components/ButtonWithIcon';
import { Address } from '../../types/Address';

const Checkout = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenent, setTenent, shippingAddress, shippingPrice } = useAppContext();

  useEffect(() => {
    setTenent(data.tenent);
    setToken(data.token);
    if (data.user) setUser(data.user);
  }, []);

  const formatter = useFormater();
  const router = useRouter();
  const api = Api(data.tenent.slug)

  //Product control

  const [cart, setCart] = useState<CartItem[]>(data.cart);

  //Shipping
  const handleChangeAddress = () => {
    router.push(`/${data.tenent.slug}/myaddresses`);
  }

  // Payments
  const [paymentType, setPaymenttype] = useState<'money' | 'card'>('money');
  const [paymentchange, setPaymentchange] = useState(0);

  //cupom
  const [cupom, setCupom] = useState('');
  const [cupomDiscount, setCupomDiscount] = useState(0);
  const [cupomInput, setCupomInput] = useState('');
  const handleSetCupom = () => {
    if (cupomInput) {
      setCupom(cupomInput);
      setCupomDiscount(15.20)
    }
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

  const handleFinish = async () => {
    if (shippingAddress) {
      const order = await api.setOrder(
        shippingAddress,
        paymentType,
        paymentchange,
        cupom,
        data.cart
      );
      if (order) {
        router.push(`/${data.tenent.slug}/order/${order.id}`)
      } else {
        alert('Ocorreu um erro! Tente mais tarde!')
      }
    }
  }

  return (

    <div className={styles.container}>
      <Head>
        <title>Checkout | {data.tenent.name}</title>
      </Head>

      <Header
        backHref={`/${data.tenent.slug}`}
        title='Checkout'
        color={data.tenent.mainColor}
      />

      <div className={styles.infoGroup}>

        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Endereço</div>
          <div className={styles.infoBody}>
            <ButtonWithIcon
              color={data.tenent.mainColor}
              leftIcon={"location"}
              rightIcon={"rightarrow"}
              value={shippingAddress ? `${shippingAddress.rua}, ${shippingAddress.numero} - ${shippingAddress.bairro}` : 'Escolha um endereço'}
              onClick={handleChangeAddress}
            />
          </div>

        </div>
        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Tipo de pagamento</div>
          <div className={styles.infoBody}>
            <div className={styles.paymentTypes}>
              <div className={styles.paymentBtn}>
                <ButtonWithIcon
                  color={data.tenent.mainColor}
                  leftIcon={"money"}
                  value={"Dinheiro"}
                  onClick={() => setPaymenttype('money')}
                  fill={paymentType === 'money'}
                />
              </div>
              <div className={styles.paymentBtn}>
                <ButtonWithIcon
                  color={data.tenent.mainColor}
                  leftIcon={"money"}
                  value={"Cartão"}
                  onClick={() => setPaymenttype('card')}
                  fill={paymentType === 'card'}

                />
              </div>
            </div>
          </div>

        </div>
        {paymentType === 'money' &&
          <div className={styles.infoArea}>
            <div className={styles.infoTitle}>Troco</div>
            <div className={styles.infoBody}>
              <InputFild
                color={data.tenent.mainColor}
                placeholder="Quanto você tem em dinheiro?"
                value={paymentchange ? paymentchange.toString() : ''}
                onChange={newValue => setPaymentchange(parseInt(newValue))}
              />
            </div>

          </div>
        }
        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Cupom de desconto</div>
          <div className={styles.infoBody}>
            {cupom &&
              <ButtonWithIcon
                color={data.tenent.mainColor}
                leftIcon={"cupom"}
                rightIcon={"checked"}
                value={cupom.toUpperCase()}
              />
            }
            {!cupom &&
              <div className={styles.cupomInput}>
                <InputFild
                  color={data.tenent.mainColor}
                  placeholder="Tem um cupom?"
                  value={cupomInput}
                  onChange={newValue => setCupomInput(newValue)}
                />
                <Button
                  color={data.tenent.mainColor}
                  label="OK"
                  onClick={handleSetCupom}
                />
              </div>
            }
          </div>

        </div>

      </div>








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
            onChange={() => { }}
            noEdit
          />
        ))}
      </div>

      <div className={styles.resumeArea}>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Subtotal</div>
          <div className={styles.resumeRight}>{formatter.fomatePrice(subtotal)}</div>
        </div>
        {cupomDiscount > 0 &&
          <div className={styles.resumeItem}>
            <div className={styles.resumeLeft}>Desconto</div>
            <div className={styles.resumeRight}>-{formatter.fomatePrice(cupomDiscount)}</div>
          </div>
        }

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Frete</div>
          <div className={styles.resumeRight}>{shippingPrice > 0 ? formatter.fomatePrice(shippingPrice) : '--'}</div>
        </div>

        <div className={styles.resumeLine}></div>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Total</div>
          <div className={styles.resumeRightBig}
            style={{ color: data.tenent.mainColor }}
          >{formatter.fomatePrice(subtotal - cupomDiscount + shippingPrice)}</div>
        </div>

        <div className={styles.resumeButton}>
          <Button
            color={data.tenent.mainColor}
            label='Finalizar Pedido'
            onClick={handleFinish}
            fill
            disable={!shippingAddress}
          />
        </div>


      </div>



    </div>



  );


}


export default Checkout;

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



