import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { Api } from '../../libs/useApi';
import styles from '../../styles/Orders.module.css';
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
import { ButtonWithIcon } from '../../components/ButtonWithIcon';
import { Order } from '../../types/Order';
import { Icon } from '../../components/icons';
import { motion } from 'framer-motion';

const Orders = (data: Props) => {
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

    const handleToOrder = () => {
        router.push(`/${data.tenent.slug}/order/${data.order.id}`)
    }

    useEffect(() => {
        if (order.status !== 'delivered') {
            setTimeout(() => {
                router.reload();
            }, 60000) //60 seconds
        }
    }, []);

    const orderStatusList = {
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

    let shippAddress = data.order.shippingAddress;
    let order = data.order;

    return (
        <div className={styles.container}>
            <Head>
                <title>Meus Pedidos</title>
            </Head>

            <Header
                backHref={`/${data.tenent.slug}`}
                title={`Meus Pedidos`}
                color={data.tenent.mainColor}
            />

            <div className={styles.containerPedidos}>

                <div className={styles.pedido}>
                    <div className={styles.conteudo}>
                        <div className={styles.left}>
                            <div className={styles.id}>
                                Pedido #{data.order.id}
                            </div>
                            <div className={styles.date}>
                                {formatter.formatDate(data.order.orderDate)}
                            </div>
                            <div className={styles.textTotal}>Total</div>
                            <div className={styles.total} style={{ color: data.tenent.mainColor }}>
                                {formatter.fomatePrice(data.order.total)}
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.statusIcons}>
                                {order.status != 'delivered' &&
                                    <motion.div
                                        className={styles.icon} style={{ color: data.tenent.mainColor }}
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 3,
                                            ease: "linear",
                                        }}

                                    >
                                        <Icon icon={'ellipse'} color={''} largura={0} altura={0} />
                                    </motion.div>
                                }
                                <div
                                    className={styles.orderInfoStatus}
                                    style={{
                                        backgroundColor: orderStatusList[order.status].backgroundColor,
                                        color: orderStatusList[order.status].fontColor
                                    }}
                                >
                                    {orderStatusList[order.status].label}
                                </div>
                            </div>

                            <div className={styles.button}
                                style={{
                                    color: data.tenent.mainColor,
                                    border: `1px solid ${data.tenent.mainColor}`
                                }}
                                onClick={handleToOrder}
                            >
                                <Icon icon={'arrowRight'} color={''} largura={24} altura={24} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


export default Orders;

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



