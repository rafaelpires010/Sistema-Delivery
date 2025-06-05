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
import { Footer } from '../../components/Footer';
import { Cupom } from '../../types/Cupom';

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
  const api = Api(data.tenent.slug);

  // Error state
  const [error, setError] = useState('');

  // Product control
  const [cart, setCart] = useState<CartItem[]>(data.cart);

  // Shipping
  const handleChangeAddress = () => {
    router.push(`/${data.tenent.slug}/myaddresses`);
  }

  // Payments
  interface PaymentType {
    id: number;
    name: string;
    icon: string;
  }

  const [paymentType, setPaymentType] = useState<PaymentType>();
  const [paymentMethods, setPaymentMethods] = useState<PaymentType[]>([]);
  const [paymentchange, setPaymentchange] = useState(0);

  console.log(paymentType?.id)

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await api.getPaymentMethods();
        console.log('Métodos de pagamento recebidos:', methods);

        if (!methods.data || methods.data.length === 0) {
          setError('Nenhuma forma de pagamento disponível');
          return;
        }

        const formattedMethods = methods.data.map((method: any) => ({
          id: method.id,
          name: method.nome,
        }));

        setPaymentMethods(formattedMethods);
      } catch (error) {
        console.error('Erro ao carregar formas de pagamento:', error);
        setError('Erro ao carregar formas de pagamento');
      }
    };

    loadPaymentMethods();
  }, []);

  // Cupom
  const [cupom, setCupom] = useState<Cupom | null>(null);
  const [cupomDiscount, setCupomDiscount] = useState(0);
  const [cupomInput, setCupomInput] = useState('');

  const handleSetCupom = async () => {
    if (!cupomInput) return;

    try {
      const response = await api.validateCupom(cupomInput.toLocaleUpperCase());
      const cupom: Cupom = response.cupom;

      if (subtotal < cupom.valorMinimo) {
        throw new Error("Valor inferior ao valor mínimo do cupom.");
      }

      setCupom(cupom);
      setCupomDiscount(
        cupom.tipoDesconto === 'PERCENTUAL'
          ? subtotal * (cupom.desconto / 100)
          : cupom.desconto
      );
    } catch (error: any) {
      setError(error.message || "Erro ao validar o cupom.");
    }
  };

  // Resume
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    let sub = 0;
    for (let i in cart) {
      sub += cart[i].product.preco * cart[i].qt;
    }
    setSubtotal(sub);
  }, [cart]);
  const handleFinish = async () => {
    if (!paymentType) {
      setError('Selecione uma forma de pagamento');
      return;
    }

    if (shippingAddress) {
      const order = await api.setOrder(
        shippingAddress,
        paymentType.id,
        paymentchange,
        cupom,
        data.cart,
        shippingPrice,
        data.user?.id
      );
      const valor = subtotal - cupomDiscount + shippingPrice;

      const venda = await api.setVenda(
        order.id,
        valor,
        paymentType.id
      );

      if (order && venda) {
        router.push(`/${data.tenent.slug}/order/${order.id}`);
      } else {
        setError('Ocorreu um erro! Tente mais tarde!');
      }
    }

    setCookie('cart', JSON.stringify(''))
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout | {data.tenent.nome}</title>
      </Head>

      <div className={styles.headerArea}>
        <div className={styles.headerContent}>
          <Header
            backHref={`/${data.tenent.slug}`}
            title='Checkout'
            color={data.tenent.main_color}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftSide}>
          <div className={styles.infoGroup}>
            <div className={styles.infoArea}>
              <div className={styles.infoTitle}>Endereço</div>
              <div className={styles.infoBody}>
                <ButtonWithIcon
                  color={data.tenent.main_color}
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
                  {paymentMethods.map((payment) => (
                    <div key={payment.id} className={styles.paymentBtn}>
                      <ButtonWithIcon
                        color={data.tenent.main_color}
                        leftIcon={payment.name === 'CARTÃO' ? 'card' : payment.name === 'DINHEIRO' ? 'money' : 'pix'}
                        value={payment.name}
                        onClick={() => setPaymentType(payment)}
                        fill={paymentType?.id === payment.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {paymentType?.name === 'DINHEIRO' &&
              <div className={styles.infoArea}>
                <div className={styles.infoTitle}>Troco</div>
                <div className={styles.infoBody}>
                  <InputFild
                    color={data.tenent.main_color}
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
                    color={data.tenent.main_color}
                    leftIcon={"cupom"}
                    rightIcon={"checked"}
                    value={cupom.codigo.toUpperCase()}
                  />
                }
                {!cupom &&
                  <div className={styles.cupomInput}>
                    <InputFild
                      color={data.tenent.main_color}
                      placeholder="Tem um cupom?"
                      value={cupomInput}
                      onChange={newValue => setCupomInput(newValue)}
                    />
                    <Button
                      color={data.tenent.main_color}
                      label="OK"
                      onClick={handleSetCupom}
                    />
                  </div>
                }
              </div>
              <div className={styles.infoError}>
                {error && <div className={styles.error}>{error}</div>}
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
                color={data.tenent.main_color}
                quantidade={cartitem.qt}
                product={cartitem.product}
                onChange={() => { }}
                noEdit
              />
            ))}
          </div>
        </div>

        <div className={styles.rightSide}>
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
                style={{ color: data.tenent.main_color }}
              >{formatter.fomatePrice(subtotal - cupomDiscount + shippingPrice)}</div>
            </div>

            <div className={styles.resumeButton}>
              <Button
                color={data.tenent.main_color}
                label='Finalizar Pedido'
                onClick={handleFinish}
                fill
                disable={!shippingAddress}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
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

  return {
    props: {
      tenent,
      user,
      token,
      cart
    }
  }
}



