import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../../contexts/app';
import { useAuthContext } from '../../../contexts/auth';
import { Api } from '../../../libs/useApi';
import styles from '../../../styles/Order-id.module.css';
import { Tenent } from '../../../types/Tenent';
import { User } from '../../../types/User';
import Head from 'next/head';
import { Header } from '../../../components/Header';
import { InputFild } from '../../../components/InputFild';
import { Button } from '../../../components/Button';
import { useFormater } from '../../../libs/useFormater';
import { CartItem } from '../../../types/CartItem';
import { useRouter } from 'next/router';
import { CartProductItem } from '../../../components/CartProductItem';
import { ButtonWithIcon } from '../../../components/ButtonWithIcon';
import { Order } from '../../../types/Order';

interface PaymentType {
    id: number;
    name: string;
}

const OrderId = (data: Props) => {
    const { setToken, setUser } = useAuthContext();
    const { tenent, setTenent } = useAppContext();

    useEffect(() => {
        setTenent(data.tenent);
        setToken(data.token);
        if (data.user) setUser(data.user);
    }, []);

    const formatter = useFormater();
    const router = useRouter();
    const api = Api(data.tenent.slug)

    const [paymentMethods, setPaymentMethods] = useState<PaymentType[]>([]);

    // Carregar formas de pagamento
    useEffect(() => {
        const loadPaymentMethods = async () => {
            try {
                const methods = await api.getPaymentMethods();
                if (methods.data) {
                    const formattedMethods = methods.data.map((method: any) => ({
                        id: method.id,
                        name: method.nome
                    }));
                    setPaymentMethods(formattedMethods);
                }
            } catch (error) {
                console.error('Erro ao carregar formas de pagamento:', error);
            }
        };
        loadPaymentMethods();
    }, []);

    useEffect(() => {
        if (order.status !== 'delivered') {
            setTimeout(() => {
                router.reload();
            }, 60000) //60 seconds
        }
    }, []);

    const orderStatusList = {
        received: {
            label: 'Recebido',
            longLabel: 'Já recebemos seu pedido :)',
            backgroundColor: '#d6d6d6',
            fontColor: '#000000',
            pct: 10
        },
        preparing: {
            label: 'Preparando',
            longLabel: 'Estamos preparando seu pedido',
            backgroundColor: '#FEFAE6',
            fontColor: '#D4BC34',
            pct: 25
        },
        sent: {
            label: 'Preparando',
            longLabel: 'Seu pedido saiu para entrega',
            backgroundColor: '#F1F3F8',
            fontColor: '#758CBD',
            pct: 75
        },
        delivered: {
            label: 'Entregue',
            longLabel: 'Seu pedido foi entregue',
            backgroundColor: '#F1F8F6',
            fontColor: '#6AB70A',
            pct: 100
        },

    }

    let shippAddress = data.order.address;
    let order = data.order;
    console.log(data.order)
    return (
        <div className={styles.container}>
            <Head>
                <title>Pedido #{data.order.id}| {data.tenent.nome}</title>
            </Head>

            <Header
                backHref={`/${data.tenent.slug}/orders`}
                title={`Pedido #${data.order.id}`}
                color={data.tenent.main_color}
            />

            <div
                className={styles.statusArea}
                style={{ backgroundColor: orderStatusList[order.status].backgroundColor }}
            >
                <div
                    className={styles.statusLongLabel}
                    style={{ color: orderStatusList[order.status].fontColor }}
                >{orderStatusList[order.status].longLabel}</div>
                <div className={styles.statusPct}>
                    <div
                        className={styles.statusPctBar}
                        style={{
                            width: `${orderStatusList[order.status].pct}%`,
                            backgroundColor: orderStatusList[order.status].fontColor
                        }}
                    ></div>
                </div>
                <div className={styles.statusMsg}>Aguardando mudança de status!</div>

            </div>

            <div className={styles.orderInfoArea}>
                <div
                    className={styles.orderInfoStatus}
                    style={{
                        backgroundColor: orderStatusList[order.status].backgroundColor,
                        color: orderStatusList[order.status].fontColor
                    }}
                >
                    {orderStatusList[order.status].label}
                </div>
                <div className={styles.orderInfoQt}>{order.products.length} {order.products.length === 1 ? 'item' : 'itens'}</div>
                <div className={styles.orderInfoDate}>{formatter.formatDate(order.data_order)}</div>
            </div>

            <div className={styles.prodList}>
                {order.products.map((cartitem, index) => (
                    <CartProductItem
                        key={index}
                        color={data.tenent.main_color}
                        quantidade={data.order.products.length}
                        product={cartitem.product}
                        onChange={() => { }}
                        noEdit
                    />
                ))}
            </div>

            <div className={styles.infoGroup}>

                <div className={styles.infoArea}>
                    <div className={styles.infoTitle}>Endereço</div>
                    <div className={styles.infoBody}>
                        <ButtonWithIcon
                            color={data.tenent.main_color}
                            leftIcon={"location"}
                            rightIcon={"rightarrow"}
                            value={`${shippAddress.rua}, ${shippAddress.numero} - ${shippAddress.bairro}`}
                            onClick={() => { }}
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
                                        onClick={() => { }}
                                        fill={order.formaPagamentoId === payment.id}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                {order.formaPagamentoId === 1 &&
                    <div className={styles.infoArea}>
                        <div className={styles.infoTitle}>Troco</div>
                        <div className={styles.infoBody}>
                            <InputFild
                                color={data.tenent.main_color}
                                placeholder="Quanto você tem em dinheiro?"
                                value={order.troco?.toString() ?? ''}
                                onChange={() => { }}
                            />
                        </div>

                    </div>
                }

                {data.order.cupom &&
                    <div className={styles.infoArea}>
                        <div className={styles.infoTitle}>Cupom de desconto</div>
                        <div className={styles.infoBody}>
                            <ButtonWithIcon
                                color={data.tenent.main_color}
                                leftIcon={"cupom"}
                                rightIcon={"checked"}
                                value={data.order.cupom?.codigo}
                            />

                        </div>

                    </div>

                }


            </div>

            <div className={styles.resumeArea}>

                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Subtotal</div>
                    <div className={styles.resumeRight}>{formatter.fomatePrice(order.subtotal)}</div>
                </div>
                {order.cupom &&
                    <div className={styles.resumeItem}>
                        <div className={styles.resumeLeft}>Desconto</div>
                        <div className={styles.resumeRight}>-{formatter.fomatePrice(order.cupom.desconto)}</div>
                    </div>
                }

                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Frete</div>
                    <div className={styles.resumeRight}>{order.shippingPrice > 0 ? formatter.fomatePrice(order.shippingPrice) : '--'}</div>
                </div>

                <div className={styles.resumeLine}></div>

                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Total</div>
                    <div className={styles.resumeRightBig}
                        style={{ color: data.tenent.main_color }}
                    >{formatter.fomatePrice(order.preco)}</div>
                </div>

            </div>
        </div>
    );
}


export default OrderId;

type Props = {
    tenent: Tenent,
    token: string,
    user: User | null;
    order: Order;

}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { tenent: tenantSlug, orderid } = context.query
    const api = Api(tenantSlug as string);


    //Get Tenant
    const tenent = await api.getTenant();

    if (!tenent) {
        return { redirect: { destination: '/', permanent: false } }
    }

    //get Logged User 

    const token = getCookie('token', context);
    const user = await api.authorizeToken(token as string);

    //Get Order
    const order = await api.getOrder(parseInt(orderid as string));


    return {
        props: {
            tenent,
            user,
            token,
            order
        }
    }


}



